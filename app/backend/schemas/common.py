"""Schemas comunes utilizados en múltiples endpoints"""
from pydantic import BaseModel, ConfigDict, Field


class MessageResponse(BaseModel):
    """Respuesta genérica con mensaje"""
    
    message: str = Field(..., description="Mensaje de respuesta")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "message": "Operación completada exitosamente"
            }
        }
    )


class ErrorResponse(BaseModel):
    """Respuesta de error estándar"""
    
    detail: str = Field(..., description="Descripción del error")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "detail": "Recurso no encontrado"
            }
        }
    )

