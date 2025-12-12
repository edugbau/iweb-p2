"""
Modelo de Usuario para MongoDB.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class User(BaseModel):
    """
    Modelo de usuario almacenado en MongoDB.
    Representa a un usuario autenticado via Google OAuth.
    """
    
    email: str = Field(..., description="Email único del usuario")
    name: str = Field(..., description="Nombre completo del usuario")
    picture: str | None = Field(None, description="URL de la foto de perfil")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Fecha de creación")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Última actualización")
    
    class Config:
        """Configuración del modelo."""
        json_schema_extra = {
            "example": {
                "email": "usuario@gmail.com",
                "name": "Juan García",
                "picture": "https://lh3.googleusercontent.com/a/photo.jpg",
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-15T10:30:00Z"
            }
        }
