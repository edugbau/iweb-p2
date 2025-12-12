"""
Modelo de Ubicación/Marcador para MongoDB.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class Location(BaseModel):
    """
    Modelo de ubicación/marcador almacenado en MongoDB.
    Representa un punto en el mapa con información asociada.
    """
    
    id: str | None = Field(None, alias="_id", description="ID único del documento")
    owner_email: str = Field(..., description="Email del propietario")
    title: str = Field(..., description="Título del marcador")
    description: str | None = Field(None, description="Descripción del lugar")
    address: str = Field(..., description="Dirección textual del lugar")
    latitude: float = Field(..., description="Latitud geográfica")
    longitude: float = Field(..., description="Longitud geográfica")
    image_url: str | None = Field(None, description="URL de la imagen en Cloudinary")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Fecha de creación")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Última actualización")
    
    class Config:
        """Configuración del modelo."""
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
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
