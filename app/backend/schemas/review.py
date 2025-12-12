"""Schemas para operaciones con reseñas de establecimientos"""
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, EmailStr


class ReviewCreate(BaseModel):
    """
    Schema para crear una nueva reseña.
    Los campos latitude, longitude se calculan automáticamente mediante geocoding.
    Las imágenes se suben por separado como FormData multipart.
    """
    
    establishment_name: str = Field(
        ..., 
        description="Nombre del establecimiento reseñado",
        min_length=1,
        max_length=200
    )
    address: str = Field(
        ..., 
        description="Dirección postal del establecimiento para geocodificación",
        min_length=1
    )
    rating: int = Field(
        ..., 
        description="Valoración del establecimiento de 0 a 5 puntos",
        ge=0,
        le=5
    )
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "establishment_name": "Casa Lola",
                "address": "Calle Granada 46, Málaga, España",
                "rating": 4
            }
        }
    )


class ReviewUpdate(BaseModel):
    """Schema para actualizar una reseña existente"""
    
    establishment_name: str | None = Field(
        None, 
        description="Nuevo nombre del establecimiento"
    )
    address: str | None = Field(
        None, 
        description="Nueva dirección (recalculará coordenadas)"
    )
    rating: int | None = Field(
        None,
        description="Nueva valoración de 0 a 5",
        ge=0,
        le=5
    )
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "establishment_name": "Casa Lola - Restaurante Tradicional",
                "rating": 5
            }
        }
    )


class ReviewResponse(BaseModel):
    """Respuesta completa de una reseña con toda su información"""
    
    id: str = Field(..., description="ID único de la reseña en MongoDB")
    establishment_name: str = Field(..., description="Nombre del establecimiento")
    address: str = Field(..., description="Dirección postal del establecimiento")
    latitude: float = Field(
        ..., 
        description="Latitud en grados decimales",
        ge=-90,
        le=90
    )
    longitude: float = Field(
        ..., 
        description="Longitud en grados decimales",
        ge=-180,
        le=180
    )
    rating: int = Field(
        ..., 
        description="Valoración de 0 a 5 puntos",
        ge=0,
        le=5
    )
    image_urls: list[str] = Field(
        ..., 
        description="URLs de las imágenes en Cloudinary"
    )
    author_email: EmailStr = Field(..., description="Email del autor de la reseña")
    author_name: str = Field(..., description="Nombre del autor de la reseña")
    auth_token: str = Field(..., description="Token OAuth usado para crear la reseña")
    created_at: datetime = Field(..., description="Fecha y hora de creación")
    expires_at: datetime = Field(..., description="Fecha y hora de caducidad del token")
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "establishment_name": "Casa Lola",
                "address": "Calle Granada 46, Málaga, España",
                "latitude": 36.7220033,
                "longitude": -4.4189788,
                "rating": 4,
                "image_urls": [
                    "https://res.cloudinary.com/demo/image/upload/v1/reviews/casa_lola_1.jpg",
                    "https://res.cloudinary.com/demo/image/upload/v1/reviews/casa_lola_2.jpg"
                ],
                "author_email": "juan.perez@example.com",
                "author_name": "Juan Pérez",
                "auth_token": "ya29.a0AfH6SMBx...",
                "created_at": "2025-12-08T10:30:00Z",
                "expires_at": "2025-12-08T11:30:00Z"
            }
        }
    )


class ReviewSummary(BaseModel):
    """Resumen de reseña para listados (sin información sensible del token)"""
    
    id: str = Field(..., description="ID único de la reseña")
    establishment_name: str = Field(..., description="Nombre del establecimiento")
    address: str = Field(..., description="Dirección postal")
    latitude: float = Field(..., description="Latitud")
    longitude: float = Field(..., description="Longitud")
    rating: int = Field(..., description="Valoración de 0 a 5")
    image_urls: list[str] = Field(..., description="URLs de las imágenes")
    author_email: EmailStr = Field(..., description="Email del autor")
    author_name: str = Field(..., description="Nombre del autor")
    created_at: datetime = Field(..., description="Fecha de creación")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "establishment_name": "Casa Lola",
                "address": "Calle Granada 46, Málaga",
                "latitude": 36.7220033,
                "longitude": -4.4189788,
                "rating": 4,
                "image_urls": [
                    "https://res.cloudinary.com/demo/image/upload/v1/reviews/casa_lola_1.jpg"
                ],
                "author_email": "juan.perez@example.com",
                "author_name": "Juan Pérez",
                "created_at": "2025-12-08T10:30:00Z"
            }
        }
    )


class GeocodingRequest(BaseModel):
    """Schema para solicitar geocodificación de una dirección"""
    
    address: str = Field(
        ...,
        description="Dirección postal a geocodificar",
        min_length=1
    )
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "address": "Calle Granada 46, Málaga, España"
            }
        }
    )


class GeocodingResponse(BaseModel):
    """Respuesta del servicio de geocodificación"""
    
    latitude: float = Field(..., description="Latitud encontrada")
    longitude: float = Field(..., description="Longitud encontrada")
    display_name: str | None = Field(None, description="Nombre completo de la dirección")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "latitude": 36.7220033,
                "longitude": -4.4189788,
                "display_name": "Calle Granada, 46, Centro Histórico, Málaga, Andalucía, España"
            }
        }
    )
