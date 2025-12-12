from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class ReviewModel(BaseModel):
    """
    Modelo de documento MongoDB para reseñas de establecimientos.
    Representa una reseña completa con toda su información.
    """
    id: str | None = Field(None, alias="_id")
    establishment_name: str = Field(..., description="Nombre del establecimiento reseñado")
    address: str = Field(..., description="Dirección postal del establecimiento")
    latitude: float | None = Field(None, description="Latitud obtenida por geocoding")
    longitude: float | None = Field(None, description="Longitud obtenida por geocoding")
    rating: int = Field(..., ge=0, le=5, description="Valoración de 0 a 5 puntos")
    image_urls: list[str] = Field(default_factory=list, description="URLs de imágenes en Cloudinary")
    author_email: str = Field(..., description="Email del autor de la reseña")
    author_name: str = Field(..., description="Nombre del autor de la reseña")
    auth_token: str = Field(..., description="Token OAuth usado al crear la reseña")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Fecha de creación")
    expires_at: datetime = Field(..., description="Fecha de caducidad del token")

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "establishment_name": "Casa Lola",
                "address": "Calle Granada 46, Málaga",
                "latitude": 36.7220033,
                "longitude": -4.4189788,
                "rating": 4,
                "image_urls": [
                    "https://res.cloudinary.com/demo/image/upload/v1/reviews/img1.jpg",
                    "https://res.cloudinary.com/demo/image/upload/v1/reviews/img2.jpg"
                ],
                "author_email": "usuario@example.com",
                "author_name": "Juan Pérez",
                "auth_token": "ya29.a0AfH6SMBx...",
                "created_at": "2025-12-08T10:30:00Z",
                "expires_at": "2025-12-08T11:30:00Z"
            }
        }
    )
