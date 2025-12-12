from google.oauth2 import id_token
from google.auth.transport import requests
from core.config import settings
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, status

class AuthService:
    def verify_google_token(self, token: str) -> dict | None:
        """
        Verifica un token de ID de Google.
        :param token: El token JWT recibido del frontend.
        :return: Diccionario con info del usuario (email, name, picture) o None.
        """
        try:
            id_info = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
            
            # Verificación adicional de emisor si es necesario
            # if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            #     raise ValueError('Wrong issuer.')

            return {
                "email": id_info.get("email"),
                "name": id_info.get("name"),
                "picture": id_info.get("picture"),
                "google_id": id_info.get("sub")
            }
        except Exception as e:
            print(f"Google Auth Error: {e}")
            return None

    def create_access_token(self, data: dict, expires_delta: timedelta | None = None) -> str:
        """
        Genera un token JWT de acceso.
        """
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=1440) # 24 horas por defecto
        
        to_encode.update({"exp": expire})
        
        # La SECRET_KEY viene de settings (configurada en .env o con valor por defecto)
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
        return encoded_jwt

    def verify_access_token(self, token: str) -> dict | None:
        """
        Verifica un token JWT propio del backend.
        :param token: Token JWT a verificar.
        :return: Payload del token (con 'sub' = email) o None si es inválido.
        """
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return payload
        except JWTError as e:
            print(f"JWT Verification Error: {e}")
            return None
    
    def get_current_user_email(self, authorization_header: str | None) -> str:
        """
        Extrae y valida el email del usuario desde el header de autorización.
        
        :param authorization_header: Header Authorization con formato "Bearer <token>"
        :return: Email del usuario autenticado
        :raises HTTPException: Si el token es inválido, falta, o tiene formato incorrecto
        """
        # Validar que existe el header
        if not authorization_header:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de autorización requerido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Extraer el token del header "Bearer <token>"
        try:
            scheme, token = authorization_header.split()
            if scheme.lower() != "bearer":
                raise ValueError("Esquema de autenticación inválido")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Formato de token inválido. Use: Bearer <token>",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verificar el token
        payload = self.verify_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido o expirado",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Extraer el email del usuario (almacenado en 'sub')
        user_email = payload.get("sub")
        if not user_email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: no contiene información de usuario",
            )
        
        return user_email
