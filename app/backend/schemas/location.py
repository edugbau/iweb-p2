"""Schemas para operaciones con ubicaciones en el mapa"""
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, EmailStr


class LocationCreate(BaseModel):
    """Schema para crear una nueva ubicación"""
    
    title: str = Field(..., description="Título de la ubicación", min_length=1, max_length=200)
    address: str = Field(..., description="Dirección física para geocodificación", min_length=1)
    description: str | None = Field(None, description="Descripción opcional de la ubicación")
    owner_email: EmailStr = Field(..., description="Email del propietario de la ubicación")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Torre Eiffel",
                "address": "Champ de Mars, 5 Av. Anatole France, 75007 Paris, Francia",
                "description": "Icónica torre de hierro símbolo de París",
                "owner_email": "juan.perez@example.com"
            }
        }
    )


class LocationUpdate(BaseModel):
    """Schema para actualizar una ubicación existente"""
    
    title: str | None = Field(None, description="Nuevo título de la ubicación")
    description: str | None = Field(None, description="Nueva descripción")
    address: str | None = Field(None, description="Nueva dirección (recalculará coordenadas)")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Torre Eiffel - Actualizada",
                "description": "Icónica torre de hierro construida para la Exposición Universal de 1889"
            }
        }
    )


class LocationResponse(BaseModel):
    """Respuesta completa de una ubicación"""
    
    id: str = Field(..., description="ID único de la ubicación en MongoDB")
    title: str = Field(..., description="Título de la ubicación")
    description: str | None = Field(None, description="Descripción de la ubicación")
    address: str = Field(..., description="Dirección física")
    latitude: float = Field(..., description="Latitud en grados decimales", ge=-90, le=90)
    longitude: float = Field(..., description="Longitud en grados decimales", ge=-180, le=180)
    image_url: str = Field(..., description="URL de la imagen en Cloudinary")
    owner_email: EmailStr = Field(..., description="Email del propietario")
    created_at: datetime = Field(..., description="Fecha de creación")
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "title": "Torre Eiffel",
                "description": "Icónica torre de hierro símbolo de París",
                "address": "Champ de Mars, 5 Av. Anatole France, 75007 Paris, Francia",
                "latitude": 48.8584,
                "longitude": 2.2945,
                "image_url": "https://res.cloudinary.com/demo/image/upload/v1234567890/locations/torre_eiffel.jpg",
                "owner_email": "juan.perez@example.com",
                "created_at": "2025-12-08T10:30:00Z"
            }
        }
    )


class LocationSummary(BaseModel):
    """Resumen de ubicación para listados"""
    
    id: str = Field(..., description="ID único de la ubicación")
    title: str = Field(..., description="Título de la ubicación")
    latitude: float = Field(..., description="Latitud")
    longitude: float = Field(..., description="Longitud")
    image_url: str = Field(..., description="URL de la imagen")
    owner_email: EmailStr = Field(..., description="Email del propietario")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "title": "Torre Eiffel",
                "latitude": 48.8584,
                "longitude": 2.2945,
                "image_url": "https://res.cloudinary.com/demo/image/upload/v1234567890/locations/torre_eiffel.jpg",
                "owner_email": "juan.perez@example.com"
            }
        }
    )

