"""
Router de Autenticación.
Gestiona el flujo de OAuth con Google.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.config import settings
from core.database import get_database
from services.auth_service import auth_service
from repositories.user_repository import UserRepository
from models.user import User
from schemas.user import UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Autenticación"])
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Dependencia para obtener el usuario actual desde el token JWT.
    :param credentials: Credenciales del header Authorization.
    :return: Datos del usuario autenticado.
    """
    token = credentials.credentials
    payload = auth_service.verify_jwt_token(token)
    return payload


@router.get(
    "/login",
    summary="Iniciar sesión con Google",
    description="Redirige al usuario a la página de autenticación de Google OAuth.",
    responses={
        307: {"description": "Redirección a Google OAuth"}
    }
)
async def login_google():
    """
    Inicia el flujo de autenticación OAuth con Google.
    Genera la URL de autorización y redirige al usuario.
    """
    auth_url, _ = auth_service.generate_oauth_url()
    return RedirectResponse(url=auth_url)


@router.get(
    "/callback",
    summary="Callback de Google OAuth",
    description="Endpoint de callback que recibe el código de autorización de Google.",
    responses={
        307: {"description": "Redirección al frontend con token"}
    }
)
async def google_callback(code: str, state: str):
    """
    Procesa el callback de Google OAuth.
    Intercambia el código por tokens y crea/actualiza el usuario.
    :param code: Código de autorización de Google.
    :param state: Estado CSRF para verificación.
    """
    # Verificar estado CSRF
    if not auth_service.verify_state(state):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Estado inválido - posible ataque CSRF"
        )
    
    # Intercambiar código por tokens
    tokens = await auth_service.exchange_code_for_tokens(code)
    
    # Verificar y obtener datos del usuario
    google_id_token = tokens.get("id_token")
    if not google_id_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se recibió id_token de Google"
        )
    
    user_data = auth_service.verify_google_token(google_id_token)
    
    # Crear o actualizar usuario en la base de datos
    db = get_database()
    user_repo = UserRepository(db)
    user = User(
        email=user_data["email"],
        name=user_data["name"],
        picture=user_data.get("picture")
    )
    await user_repo.create_or_update(user)
    
    # Generar JWT propio
    jwt_token = auth_service.create_jwt_token(user_data["email"], user_data["name"])
    
    # Redirigir al frontend con el token
    redirect_url = f"{settings.frontend_url}/auth/callback?token={jwt_token}"
    return RedirectResponse(url=redirect_url)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Obtener usuario actual",
    description="Devuelve la información del usuario autenticado.",
    responses={
        200: {"description": "Datos del usuario"},
        401: {"description": "No autenticado"}
    }
)
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Obtiene la información del usuario actualmente autenticado.
    :param current_user: Usuario extraído del token JWT.
    :return: Datos del usuario.
    """
    db = get_database()
    user_repo = UserRepository(db)
    user = await user_repo.find_by_email(current_user["sub"])
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return UserResponse(
        email=user.email,
        name=user.name,
        picture=user.picture,
        created_at=user.created_at
    )
