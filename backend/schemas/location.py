"""
Schemas de validación para Ubicación (API).
"""

from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class LocationCreate(BaseModel):
    """
    Schema para crear una nueva ubicación.
    El geocoding se realiza automáticamente en el backend.
    """
    
    title: str = Field(..., min_length=1, max_length=100, description="Título del marcador")
    description: str | None = Field(None, max_length=500, description="Descripción opcional")
    address: str = Field(..., min_length=1, max_length=200, description="Dirección para geocodificar")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Mi cafetería favorita",
                "description": "El mejor café de la ciudad, ambiente acogedor",
                "address": "Calle Gran Vía 42, Madrid"
            }
        }
    )


class LocationUpdate(BaseModel):
    """
    Schema para actualizar una ubicación existente.
    Todos los campos son opcionales.
    """
    
    title: str | None = Field(None, min_length=1, max_length=100, description="Nuevo título")
    description: str | None = Field(None, max_length=500, description="Nueva descripción")
    address: str | None = Field(None, min_length=1, max_length=200, description="Nueva dirección")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Mi nuevo lugar favorito",
                "description": "Actualizado: ahora sirven desayunos"
            }
        }
    )


class LocationResponse(BaseModel):
    """
    Schema de respuesta para una ubicación.
    Incluye coordenadas obtenidas via geocoding.
    """
    
    id: str = Field(..., description="ID único de la ubicación")
    owner_email: str = Field(..., description="Email del propietario")
    title: str = Field(..., description="Título del marcador")
    description: str | None = Field(None, description="Descripción del lugar")
    address: str = Field(..., description="Dirección textual")
    latitude: float = Field(..., description="Latitud geográfica")
    longitude: float = Field(..., description="Longitud geográfica")
    image_url: str | None = Field(None, description="URL de la imagen")
    created_at: datetime = Field(..., description="Fecha de creación")
    updated_at: datetime = Field(..., description="Última actualización")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "owner_email": "usuario@gmail.com",
                "title": "Mi cafetería favorita",
                "description": "El mejor café de la ciudad",
                "address": "Calle Gran Vía 42, Madrid",
                "latitude": 40.4168,
                "longitude": -3.7038,
                "image_url": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-15T10:30:00Z"
            }
        }
    )


class LocationListResponse(BaseModel):
    """
    Schema de respuesta para lista de ubicaciones.
    """
    
    locations: list[LocationResponse] = Field(..., description="Lista de ubicaciones")
    total: int = Field(..., description="Total de ubicaciones")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "locations": [
                    {
                        "id": "507f1f77bcf86cd799439011",
                        "owner_email": "usuario@gmail.com",
                        "title": "Mi cafetería favorita",
                        "description": "El mejor café",
                        "address": "Gran Vía 42, Madrid",
                        "latitude": 40.4168,
                        "longitude": -3.7038,
                        "image_url": None,
                        "created_at": "2024-01-15T10:30:00Z",
                        "updated_at": "2024-01-15T10:30:00Z"
                    }
                ],
                "total": 1
            }
        }
    )
