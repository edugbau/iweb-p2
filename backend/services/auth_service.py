"""
Servicio de Autenticación con Google OAuth 2.0.
Implementación manual del flujo Authorization Code.
"""

import secrets
import httpx
from datetime import datetime, timedelta
from jose import jwt, JWTError
from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import HTTPException, status
from core.config import settings


class AuthService:
    """
    Servicio para gestionar la autenticación con Google OAuth.
    """
    
    GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
    GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
    
    # Almacén temporal de estados para CSRF protection
    _states: dict[str, datetime] = {}
    
    def generate_oauth_url(self) -> tuple[str, str]:
        """
        Genera la URL de autorización de Google OAuth.
        :return: Tupla con (URL de autorización, estado CSRF).
        """
        state = secrets.token_urlsafe(32)
        self._states[state] = datetime.utcnow()
        
        # Limpiar estados antiguos (más de 10 minutos)
        self._cleanup_old_states()
        
        redirect_uri = f"{settings.backend_url}/api/v1/auth/callback"
        
        params = {
            "client_id": settings.google_client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",
            "prompt": "consent"
        }
        
        query_string = "&".join(f"{k}={v}" for k, v in params.items())
        auth_url = f"{self.GOOGLE_AUTH_URL}?{query_string}"
        
        return auth_url, state
    
    def _cleanup_old_states(self) -> None:
        """
        Elimina estados CSRF antiguos.
        """
        now = datetime.utcnow()
        expired = [s for s, t in self._states.items() if now - t > timedelta(minutes=10)]
        for s in expired:
            del self._states[s]
    
    def verify_state(self, state: str) -> bool:
        """
        Verifica que el estado CSRF sea válido.
        :param state: Estado a verificar.
        :return: True si es válido.
        """
        if state in self._states:
            del self._states[state]
            return True
        return False
    
    async def exchange_code_for_tokens(self, code: str) -> dict:
        """
        Intercambia el código de autorización por tokens.
        :param code: Código de autorización de Google.
        :return: Tokens (access_token, id_token, etc.).
        """
        redirect_uri = f"{settings.backend_url}/api/v1/auth/callback"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.GOOGLE_TOKEN_URL,
                data={
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Error al intercambiar el código por tokens"
                )
            
            return response.json()
    
    def verify_google_token(self, token: str) -> dict:
        """
        Verifica y decodifica el ID token de Google.
        :param token: ID token de Google.
        :return: Datos del usuario.
        """
        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.google_client_id,
                clock_skew_in_seconds=60  # Tolerancia de 60 segundos
            )
            
            return {
                "email": idinfo.get("email"),
                "name": idinfo.get("name"),
                "picture": idinfo.get("picture")
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token inválido: {str(e)}"
            )
    
    def create_jwt_token(self, email: str, name: str) -> str:
        """
        Crea un token JWT para el usuario autenticado.
        :param email: Email del usuario.
        :param name: Nombre del usuario.
        :return: Token JWT firmado.
        """
        expire = datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes)
        
        payload = {
            "sub": email,
            "name": name,
            "exp": expire,
            "iat": datetime.utcnow()
        }
        
        return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    
    def verify_jwt_token(self, token: str) -> dict:
        """
        Verifica y decodifica un token JWT.
        :param token: Token JWT a verificar.
        :return: Payload del token.
        :raises HTTPException: Si el token es inválido o ha expirado.
        """
        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm]
            )
            return payload
        except JWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token inválido: {str(e)}"
            )


# Instancia global del servicio
auth_service = AuthService()
