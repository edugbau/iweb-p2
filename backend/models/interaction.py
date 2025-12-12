"""
Modelo de Interacción (comentarios/visitas) para MongoDB.
"""

from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class InteractionType(str, Enum):
    """Tipos de interacción disponibles."""
    COMMENT = "comment"
    VISIT = "visit"


class Interaction(BaseModel):
    """
    Modelo de interacción almacenado en MongoDB.
    Representa comentarios o visitas a ubicaciones.
    """
    
    id: str | None = Field(None, alias="_id", description="ID único del documento")
    location_id: str = Field(..., description="ID de la ubicación relacionada")
    user_email: str = Field(..., description="Email del usuario que interactúa")
    interaction_type: InteractionType = Field(..., description="Tipo de interacción")
    content: str | None = Field(None, description="Contenido del comentario (si aplica)")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Fecha de creación")
    
    class Config:
        """Configuración del modelo."""
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439012",
                "location_id": "507f1f77bcf86cd799439011",
                "user_email": "visitante@gmail.com",
                "interaction_type": "comment",
                "content": "¡Qué lugar tan bonito!",
                "created_at": "2024-01-15T12:00:00Z"
            }
        }
