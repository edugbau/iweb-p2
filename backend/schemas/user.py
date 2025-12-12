"""
Schemas de validación para Usuario (API).
"""

from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class UserResponse(BaseModel):
    """
    Schema de respuesta para usuario.
    Se usa al devolver información del usuario autenticado.
    """
    
    email: str = Field(..., description="Email del usuario")
    name: str = Field(..., description="Nombre completo")
    picture: str | None = Field(None, description="URL de la foto de perfil")
    created_at: datetime = Field(..., description="Fecha de registro")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "usuario@gmail.com",
                "name": "Juan García",
                "picture": "https://lh3.googleusercontent.com/a/photo.jpg",
                "created_at": "2024-01-15T10:30:00Z"
            }
        }
    )


class TokenResponse(BaseModel):
    """
    Schema de respuesta para token JWT.
    Se devuelve tras autenticación exitosa.
    """
    
    access_token: str = Field(..., description="Token JWT de acceso")
    token_type: str = Field(default="bearer", description="Tipo de token")
    user: UserResponse = Field(..., description="Datos del usuario")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "email": "usuario@gmail.com",
                    "name": "Juan García",
                    "picture": "https://lh3.googleusercontent.com/a/photo.jpg",
                    "created_at": "2024-01-15T10:30:00Z"
                }
            }
        }
    )
