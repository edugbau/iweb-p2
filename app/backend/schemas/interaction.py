"""Schemas para interacciones (comentarios, visitas, etc.)"""
from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, EmailStr


class InteractionCreate(BaseModel):
    """Schema para crear una nueva interacción"""
    
    location_id: str = Field(..., description="ID de la ubicación asociada")
    user_email: EmailStr = Field(..., description="Email del usuario que realiza la interacción")
    interaction_type: Literal["comment", "visit", "like"] = Field(
        ..., 
        description="Tipo de interacción: comment (comentario), visit (visita), like (me gusta)"
    )
    content: str | None = Field(
        None, 
        description="Contenido de la interacción (obligatorio para comments)",
        min_length=1
    )
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "location_id": "507f1f77bcf86cd799439011",
                "user_email": "maria.garcia@example.com",
                "interaction_type": "comment",
                "content": "¡Increíble vista desde la cima! Totalmente recomendado visitar al atardecer."
            }
        }
    )


class InteractionResponse(BaseModel):
    """Respuesta completa de una interacción"""
    
    id: str = Field(..., description="ID único de la interacción")
    location_id: str = Field(..., description="ID de la ubicación asociada")
    user_email: EmailStr = Field(..., description="Email del usuario")
    interaction_type: Literal["comment", "visit", "like"] = Field(
        ..., 
        description="Tipo de interacción"
    )
    content: str | None = Field(None, description="Contenido de la interacción")
    created_at: datetime = Field(..., description="Fecha de creación")
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439022",
                "location_id": "507f1f77bcf86cd799439011",
                "user_email": "maria.garcia@example.com",
                "interaction_type": "comment",
                "content": "¡Increíble vista desde la cima! Totalmente recomendado visitar al atardecer.",
                "created_at": "2025-12-08T15:45:00Z"
            }
        }
    )


class InteractionSummary(BaseModel):
    """Resumen de interacciones por ubicación"""
    
    location_id: str = Field(..., description="ID de la ubicación")
    total_interactions: int = Field(..., description="Total de interacciones", ge=0)
    comments_count: int = Field(..., description="Número de comentarios", ge=0)
    visits_count: int = Field(..., description="Número de visitas registradas", ge=0)
    likes_count: int = Field(..., description="Número de likes", ge=0)
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "location_id": "507f1f77bcf86cd799439011",
                "total_interactions": 127,
                "comments_count": 45,
                "visits_count": 67,
                "likes_count": 15
            }
        }
    )

