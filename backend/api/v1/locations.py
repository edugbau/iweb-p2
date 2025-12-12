"""
Router de Ubicaciones/Marcadores.
Gestiona las operaciones CRUD de ubicaciones en el mapa.
"""

from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from typing import Optional
from core.database import get_database
from api.v1.auth import get_current_user
from services.geocoding_service import geocoding_service
from services.cloudinary_service import cloudinary_service
from repositories.location_repository import LocationRepository
from models.location import Location
from schemas.location import (
    LocationCreate,
    LocationUpdate,
    LocationResponse,
    LocationListResponse
)

router = APIRouter(prefix="/locations", tags=["Ubicaciones"])


def _location_to_response(location: Location) -> LocationResponse:
    """
    Convierte un modelo Location a LocationResponse.
    :param location: Modelo de ubicación.
    :return: Schema de respuesta.
    """
    return LocationResponse(
        id=location.id,
        owner_email=location.owner_email,
        title=location.title,
        description=location.description,
        address=location.address,
        latitude=location.latitude,
        longitude=location.longitude,
        image_url=location.image_url,
        created_at=location.created_at,
        updated_at=location.updated_at
    )


@router.get(
    "",
    response_model=LocationListResponse,
    summary="Listar ubicaciones",
    description="Obtiene todas las ubicaciones. Opcionalmente filtra por propietario.",
    responses={
        200: {"description": "Lista de ubicaciones"}
    }
)
async def list_locations(
    owner_email: str | None = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Lista todas las ubicaciones disponibles.
    :param owner_email: Email del propietario para filtrar (opcional).
    :param current_user: Usuario autenticado.
    :return: Lista de ubicaciones.
    """
    db = get_database()
    location_repo = LocationRepository(db)
    locations = await location_repo.find_all(owner_email)
    
    return LocationListResponse(
        locations=[_location_to_response(loc) for loc in locations],
        total=len(locations)
    )


@router.get(
    "/my",
    response_model=LocationListResponse,
    summary="Mis ubicaciones",
    description="Obtiene las ubicaciones del usuario autenticado.",
    responses={
        200: {"description": "Lista de ubicaciones del usuario"}
    }
)
async def my_locations(current_user: dict = Depends(get_current_user)):
    """
    Lista las ubicaciones creadas por el usuario autenticado.
    :param current_user: Usuario autenticado.
    :return: Lista de ubicaciones propias.
    """
    db = get_database()
    location_repo = LocationRepository(db)
    locations = await location_repo.find_all(owner_email=current_user["sub"])
    
    return LocationListResponse(
        locations=[_location_to_response(loc) for loc in locations],
        total=len(locations)
    )


@router.get(
    "/{location_id}",
    response_model=LocationResponse,
    summary="Obtener ubicación",
    description="Obtiene los detalles de una ubicación específica.",
    responses={
        200: {"description": "Detalles de la ubicación"},
        404: {"description": "Ubicación no encontrada"}
    }
)
async def get_location(
    location_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Obtiene los detalles de una ubicación por su ID.
    :param location_id: ID de la ubicación.
    :param current_user: Usuario autenticado.
    :return: Detalles de la ubicación.
    """
    db = get_database()
    location_repo = LocationRepository(db)
    location = await location_repo.find_by_id(location_id)
    
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ubicación no encontrada"
        )
    
    return _location_to_response(location)


@router.post(
    "",
    response_model=LocationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear ubicación",
    description="Crea una nueva ubicación con geocodificación automática.",
    responses={
        201: {"description": "Ubicación creada"},
        400: {"description": "Error en geocodificación"}
    }
)
async def create_location(
    title: str = Form(..., description="Título del marcador"),
    address: str = Form(..., description="Dirección a geocodificar"),
    description: Optional[str] = Form(None, description="Descripción opcional"),
    image: Optional[UploadFile] = File(None, description="Imagen opcional"),
    current_user: dict = Depends(get_current_user)
):
    """
    Crea una nueva ubicación con geocodificación automática.
    :param title: Título del marcador.
    :param address: Dirección textual para geocodificar.
    :param description: Descripción opcional.
    :param image: Archivo de imagen opcional.
    :param current_user: Usuario autenticado (propietario).
    :return: Ubicación creada.
    """
    # Geocodificar la dirección
    geo_result = await geocoding_service.geocode(address)
    
    if not geo_result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo geocodificar la dirección proporcionada"
        )
    
    # Subir imagen si se proporcionó
    image_url = None
    if image and image.filename:
        image_url = await cloudinary_service.upload_image(image)
    
    # Crear la ubicación
    db = get_database()
    location_repo = LocationRepository(db)
    
    location = Location(
        owner_email=current_user["sub"],
        title=title,
        description=description,
        address=address,
        latitude=geo_result.latitude,
        longitude=geo_result.longitude,
        image_url=image_url
    )
    
    created_location = await location_repo.create(location)
    return _location_to_response(created_location)


@router.put(
    "/{location_id}",
    response_model=LocationResponse,
    summary="Actualizar ubicación",
    description="Actualiza una ubicación existente.",
    responses={
        200: {"description": "Ubicación actualizada"},
        403: {"description": "Sin permisos"},
        404: {"description": "Ubicación no encontrada"}
    }
)
async def update_location(
    location_id: str,
    location_update: LocationUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Actualiza una ubicación existente.
    :param location_id: ID de la ubicación a actualizar.
    :param location_update: Datos a actualizar.
    :param current_user: Usuario autenticado.
    :return: Ubicación actualizada.
    """
    db = get_database()
    location_repo = LocationRepository(db)
    
    # Verificar que existe y es del usuario
    existing = await location_repo.find_by_id(location_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ubicación no encontrada"
        )
    
    if existing.owner_email != current_user["sub"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para modificar esta ubicación"
        )
    
    # Preparar datos de actualización
    update_data = location_update.model_dump(exclude_unset=True)
    
    # Si se cambió la dirección, re-geocodificar
    if "address" in update_data:
        geo_result = await geocoding_service.geocode(update_data["address"])
        if geo_result:
            update_data["latitude"] = geo_result.latitude
            update_data["longitude"] = geo_result.longitude
    
    updated = await location_repo.update(location_id, update_data)
    return _location_to_response(updated)


@router.delete(
    "/{location_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar ubicación",
    description="Elimina una ubicación existente.",
    responses={
        204: {"description": "Ubicación eliminada"},
        403: {"description": "Sin permisos"},
        404: {"description": "Ubicación no encontrada"}
    }
)
async def delete_location(
    location_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Elimina una ubicación existente.
    :param location_id: ID de la ubicación a eliminar.
    :param current_user: Usuario autenticado.
    """
    db = get_database()
    location_repo = LocationRepository(db)
    
    # Verificar que existe y es del usuario
    existing = await location_repo.find_by_id(location_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ubicación no encontrada"
        )
    
    if existing.owner_email != current_user["sub"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para eliminar esta ubicación"
        )
    
    await location_repo.delete(location_id)
