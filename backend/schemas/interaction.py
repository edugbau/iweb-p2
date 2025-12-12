"""
Schemas de validación para Interacción (API).
"""

from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from models.interaction import InteractionType


class InteractionCreate(BaseModel):
    """
    Schema para crear una nueva interacción.
    Puede ser un comentario o una visita.
    """
    
    location_id: str = Field(..., description="ID de la ubicación")
    interaction_type: InteractionType = Field(..., description="Tipo de interacción")
    content: str | None = Field(None, max_length=500, description="Contenido del comentario")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "location_id": "507f1f77bcf86cd799439011",
                "interaction_type": "comment",
                "content": "¡Qué lugar tan bonito! Lo recomiendo mucho."
            }
        }
    )


class InteractionResponse(BaseModel):
    """
    Schema de respuesta para una interacción.
    """
    
    id: str = Field(..., description="ID único de la interacción")
    location_id: str = Field(..., description="ID de la ubicación relacionada")
    user_email: str = Field(..., description="Email del usuario")
    interaction_type: InteractionType = Field(..., description="Tipo de interacción")
    content: str | None = Field(None, description="Contenido del comentario")
    created_at: datetime = Field(..., description="Fecha de creación")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439012",
                "location_id": "507f1f77bcf86cd799439011",
                "user_email": "visitante@gmail.com",
                "interaction_type": "comment",
                "content": "¡Qué lugar tan bonito!",
                "created_at": "2024-01-15T12:00:00Z"
            }
        }
    )


class InteractionListResponse(BaseModel):
    """
    Schema de respuesta para lista de interacciones.
    """
    
    interactions: list[InteractionResponse] = Field(..., description="Lista de interacciones")
    total: int = Field(..., description="Total de interacciones")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "interactions": [
                    {
                        "id": "507f1f77bcf86cd799439012",
                        "location_id": "507f1f77bcf86cd799439011",
                        "user_email": "visitante@gmail.com",
                        "interaction_type": "comment",
                        "content": "¡Qué lugar tan bonito!",
                        "created_at": "2024-01-15T12:00:00Z"
                    }
                ],
                "total": 1
            }
        }
    )
