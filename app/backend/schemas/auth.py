"""Schemas para autenticación y autorización"""
from pydantic import BaseModel, ConfigDict, Field, EmailStr


class LoginRequest(BaseModel):
    """Payload para autenticación con Google OAuth"""
    
    google_token: str = Field(
        ..., 
        description="Token JWT de Google obtenido del frontend",
        min_length=10
    )
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "google_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ.ewogImlzcyI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLAogICJhenAiOiAiMTIzNDU2Nzg5MC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIKfQ.abc123"
            }
        }
    )


class UserInfo(BaseModel):
    """Información del usuario autenticado"""
    
    email: EmailStr = Field(..., description="Correo electrónico del usuario")
    name: str = Field(..., description="Nombre completo del usuario")
    picture: str | None = Field(None, description="URL de la foto de perfil")
    google_id: str = Field(..., description="ID único de Google")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "juan.perez@example.com",
                "name": "Juan Pérez",
                "picture": "https://lh3.googleusercontent.com/a/default-user",
                "google_id": "102345678901234567890"
            }
        }
    )


class LoginResponse(BaseModel):
    """Respuesta exitosa del login"""
    
    access_token: str = Field(..., description="Token JWT para autenticación en requests subsiguientes")
    token_type: str = Field(default="bearer", description="Tipo de token (siempre 'bearer')")
    user: UserInfo = Field(..., description="Información del usuario autenticado")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqdWFuLnBlcmV6QGV4YW1wbGUuY29tIiwiZXhwIjoxNzM1NzM5MjAwfQ.Xy1234567890abcdefgh",
                "token_type": "bearer",
                "user": {
                    "email": "juan.perez@example.com",
                    "name": "Juan Pérez",
                    "picture": "https://lh3.googleusercontent.com/a/default-user",
                    "google_id": "102345678901234567890"
                }
            }
        }
    )

