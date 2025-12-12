from fastapi import APIRouter, HTTPException, status, Body, Depends
from schemas.interaction import InteractionCreate, InteractionResponse, InteractionSummary
from schemas.common import ErrorResponse
from datetime import datetime
from repositories.interaction_repository import InteractionRepository
from repositories.location_repository import LocationRepository
from models.interaction import InteractionModel
from api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=InteractionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nueva interacción",
    description="Crea una nueva interacción (comentario, visita o like) asociada a una ubicación. Requiere autenticación.",
    responses={
        201: {
            "description": "Interacción creada exitosamente",
            "model": InteractionResponse
        },
        400: {
            "description": "Datos inválidos (ej: comment sin contenido)",
            "model": ErrorResponse
        },
        404: {
            "description": "Ubicación no encontrada",
            "model": ErrorResponse
        }
    }
)
async def create_interaction(
    interaction: InteractionCreate = Body(...),
    user_email: str = Depends(get_current_user),  # Email extraído del token JWT
    interaction_repository: InteractionRepository = Depends(),
    location_repository: LocationRepository = Depends()
):
    """
    Crea una nueva interacción (comentario, visita o like) en una ubicación.
    
    :param interaction: Datos de la interacción a crear
    :param user_email: Email del usuario autenticado (extraído del token JWT)
    :return: Interacción creada con ID y timestamp
    :raises HTTPException: Si la ubicación no existe o los datos son inválidos
    """
    # Validar que comments tengan contenido
    if interaction.interaction_type == "comment" and not interaction.content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Los comentarios deben incluir contenido en el campo 'content'"
        )
    
    # Verificar que la ubicación existe
    location = await location_repository.get_by_id(interaction.location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    # Crear modelo usando el email del token (más seguro que confiar en el body)
    interaction_data = InteractionModel(
        location_id=interaction.location_id,
        user_email=user_email,  # Usar email del token, no del body
        type=interaction.interaction_type,
        content=interaction.content,
        created_at=datetime.utcnow()
    )

    # Guardar en la base de datos
    created_interaction = await interaction_repository.create(interaction_data)
    
    return InteractionResponse(
        id=str(created_interaction.id),
        location_id=created_interaction.location_id,
        user_email=created_interaction.user_email,
        interaction_type=created_interaction.type,
        content=created_interaction.content,
        created_at=created_interaction.created_at
    )


@router.get(
    "/location/{location_id}",
    response_model=list[InteractionResponse],
    status_code=status.HTTP_200_OK,
    summary="Obtener interacciones de una ubicación",
    description="Obtiene todas las interacciones (comentarios, visitas y likes) asociadas a una ubicación específica.",
    responses={
        200: {
            "description": "Lista de interacciones obtenida exitosamente",
            "model": list[InteractionResponse]
        },
        404: {
            "description": "Ubicación no encontrada",
            "model": ErrorResponse
        }
    }
)
async def get_location_interactions(
    location_id: str,
    interaction_repository: InteractionRepository = Depends()
):
    """
    Obtiene todas las interacciones de una ubicación.
    
    :param location_id: ID de la ubicación en MongoDB
    :return: Lista de interacciones ordenadas por fecha
    :raises HTTPException: Si la ubicación no existe
    """
    interactions = await interaction_repository.get_by_location(location_id)
    
    response_list = []
    for i in interactions:
        response_list.append(InteractionResponse(
            id=str(i.id),
            location_id=i.location_id,
            user_email=i.user_email,
            interaction_type=i.type,
            content=i.content,
            created_at=i.created_at
        ))
        
    return response_list


@router.get(
    "/location/{location_id}/summary",
    response_model=InteractionSummary,
    status_code=status.HTTP_200_OK,
    summary="Obtener resumen de interacciones",
    description="Obtiene un resumen con contadores de interacciones por tipo para una ubicación.",
    responses={
        200: {
            "description": "Resumen obtenido exitosamente",
            "model": InteractionSummary
        }
    }
)
async def get_interactions_summary(
    location_id: str,
    interaction_repository: InteractionRepository = Depends()
):
    """
    Obtiene un resumen estadístico de las interacciones de una ubicación.
    
    :param location_id: ID de la ubicación
    :return: Contadores por tipo de interacción
    """
    interactions = await interaction_repository.get_by_location(location_id)
    
    summary = InteractionSummary(
        location_id=location_id,
        total_interactions=len(interactions),
        comments_count=sum(1 for i in interactions if i.type == "comment"),
        visits_count=sum(1 for i in interactions if i.type == "visit"),
        likes_count=sum(1 for i in interactions if i.type == "like")
    )
    
    return summary
