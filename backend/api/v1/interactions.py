"""
Router de Interacciones (comentarios y visitas).
"""

from fastapi import APIRouter, HTTPException, status, Depends
from core.database import get_database
from api.v1.auth import get_current_user
from repositories.interaction_repository import InteractionRepository
from repositories.location_repository import LocationRepository
from models.interaction import Interaction
from schemas.interaction import (
    InteractionCreate,
    InteractionResponse,
    InteractionListResponse
)

router = APIRouter(prefix="/interactions", tags=["Interacciones"])


def _interaction_to_response(interaction: Interaction) -> InteractionResponse:
    """
    Convierte un modelo Interaction a InteractionResponse.
    :param interaction: Modelo de interacción.
    :return: Schema de respuesta.
    """
    return InteractionResponse(
        id=interaction.id,
        location_id=interaction.location_id,
        user_email=interaction.user_email,
        interaction_type=interaction.interaction_type,
        content=interaction.content,
        created_at=interaction.created_at
    )


@router.get(
    "/location/{location_id}",
    response_model=InteractionListResponse,
    summary="Interacciones de una ubicación",
    description="Obtiene todas las interacciones de una ubicación específica.",
    responses={
        200: {"description": "Lista de interacciones"},
        404: {"description": "Ubicación no encontrada"}
    }
)
async def get_location_interactions(
    location_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Lista todas las interacciones de una ubicación.
    :param location_id: ID de la ubicación.
    :param current_user: Usuario autenticado.
    :return: Lista de interacciones.
    """
    db = get_database()
    
    # Verificar que la ubicación existe
    location_repo = LocationRepository(db)
    location = await location_repo.find_by_id(location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ubicación no encontrada"
        )
    
    interaction_repo = InteractionRepository(db)
    interactions = await interaction_repo.find_by_location(location_id)
    
    return InteractionListResponse(
        interactions=[_interaction_to_response(i) for i in interactions],
        total=len(interactions)
    )


@router.post(
    "",
    response_model=InteractionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear interacción",
    description="Crea una nueva interacción (comentario o visita).",
    responses={
        201: {"description": "Interacción creada"},
        404: {"description": "Ubicación no encontrada"}
    }
)
async def create_interaction(
    interaction_data: InteractionCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Crea una nueva interacción en una ubicación.
    :param interaction_data: Datos de la interacción.
    :param current_user: Usuario autenticado.
    :return: Interacción creada.
    """
    db = get_database()
    
    # Verificar que la ubicación existe
    location_repo = LocationRepository(db)
    location = await location_repo.find_by_id(interaction_data.location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ubicación no encontrada"
        )
    
    # Crear la interacción
    interaction_repo = InteractionRepository(db)
    interaction = Interaction(
        location_id=interaction_data.location_id,
        user_email=current_user["sub"],
        interaction_type=interaction_data.interaction_type,
        content=interaction_data.content
    )
    
    created = await interaction_repo.create(interaction)
    return _interaction_to_response(created)


@router.delete(
    "/{interaction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar interacción",
    description="Elimina una interacción propia.",
    responses={
        204: {"description": "Interacción eliminada"},
        403: {"description": "Sin permisos"},
        404: {"description": "Interacción no encontrada"}
    }
)
async def delete_interaction(
    interaction_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Elimina una interacción propia.
    :param interaction_id: ID de la interacción.
    :param current_user: Usuario autenticado.
    """
    db = get_database()
    interaction_repo = InteractionRepository(db)
    
    # Verificar que existe - usamos delete directamente ya que no tenemos find_by_id
    deleted = await interaction_repo.delete(interaction_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interacción no encontrada"
        )
