from fastapi import APIRouter, HTTPException, status, Body, Depends, Header
from services.auth_service import AuthService
from schemas.auth import LoginRequest, LoginResponse, UserInfo
from schemas.common import ErrorResponse
from typing import Annotated

router = APIRouter()


async def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
    auth_service: AuthService = Depends()
) -> str:
    """
    Dependency para obtener el usuario actual desde el token JWT.
    Delega toda la lógica de validación al servicio de autenticación.
    
    :param authorization: Header de autorización con formato "Bearer <token>"
    :param auth_service: Servicio de autenticación inyectado
    :return: Email del usuario autenticado
    :raises HTTPException: Si el token es inválido o no está presente
    """
    return auth_service.get_current_user_email(authorization)


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Autenticación con Google OAuth",
    description="Autentica un usuario mediante Google OAuth 2.0 y devuelve un token JWT de sesión.",
    responses={
        200: {
            "description": "Autenticación exitosa",
            "model": LoginResponse
        },
        401: {
            "description": "Token de Google inválido o expirado",
            "model": ErrorResponse
        }
    }
)
async def login(
    request: LoginRequest = Body(...),
    auth_service: AuthService = Depends()
):
    """
    Autentica un usuario con Google OAuth y devuelve un token JWT de sesión.
    
    :param request: Payload con el token de Google
    :return: Token JWT y información del usuario
    :raises HTTPException: Si el token de Google es inválido
    """
    # 1. Verificar token de Google
    user_info = auth_service.verify_google_token(request.google_token)
    
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token de Google inválido o expirado"
        )

    # 2. Generar JWT de sesión incluyendo el nombre del usuario
    # El 'sub' del token será el email, y 'name' el nombre completo
    access_token = auth_service.create_access_token(
        data={
            "sub": user_info['email'],
            "name": user_info['name']
        }
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserInfo(**user_info)
    )
