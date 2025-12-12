from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends
from services.map_service import GeocodingService
from services.image_service import ImageService
from schemas.location import LocationResponse, LocationSummary
from schemas.common import ErrorResponse
from models.location import LocationModel
from datetime import datetime
from repositories.location_repository import LocationRepository
from api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get(
    "/",
    response_model=list[LocationResponse],
    status_code=status.HTTP_200_OK,
    summary="Listar todas las ubicaciones",
    description="Obtiene una lista de todas las ubicaciones registradas en el mapa.",
    responses={
        200: {
            "description": "Lista de ubicaciones obtenida exitosamente",
            "model": list[LocationResponse]
        }
    }
)
async def get_locations(
    location_repository: LocationRepository = Depends()
):
    """
    Obtiene todas las ubicaciones del mapa.
    
    :return: Lista de ubicaciones con toda su información
    """
    return await location_repository.get_all()


@router.get(
    "/{location_id}",
    response_model=LocationResponse,
    status_code=status.HTTP_200_OK,
    summary="Obtener una ubicación por ID",
    description="Obtiene los detalles completos de una ubicación específica.",
    responses={
        200: {
            "description": "Ubicación encontrada",
            "model": LocationResponse
        },
        404: {
            "description": "Ubicación no encontrada",
            "model": ErrorResponse
        }
    }
)
async def get_location(
    location_id: str,
    location_repository: LocationRepository = Depends()
):
    """
    Obtiene una ubicación específica por su ID.
    
    :param location_id: ID de la ubicación en MongoDB
    :return: Información completa de la ubicación
    :raises HTTPException: Si la ubicación no existe
    """
    location = await location_repository.get_by_id(location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    return location


@router.post(
    "/",
    response_model=LocationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nueva ubicación",
    description="Crea una nueva ubicación con geocodificación automática y subida de imagen a Cloudinary. Requiere autenticación.",
    responses={
        201: {
            "description": "Ubicación creada exitosamente",
            "model": LocationResponse
        },
        400: {
            "description": "Dirección no encontrada o datos inválidos",
            "model": ErrorResponse
        },
        500: {
            "description": "Error al subir imagen a Cloudinary",
            "model": ErrorResponse
        }
    }
)
async def create_location(
    title: str = Form(..., description="Título de la ubicación", min_length=1, max_length=200),
    address: str = Form(..., description="Dirección física para geocodificación", min_length=1),
    description: str | None = Form(None, description="Descripción opcional de la ubicación"),
    image: UploadFile = File(..., description="Imagen de la ubicación (JPEG, PNG, WebP)"),
    owner_email: str = Depends(get_current_user),  # Email extraído del token JWT
    location_repository: LocationRepository = Depends(),
    geocoding_service: GeocodingService = Depends(),
    image_service: ImageService = Depends()
):
    """
    Crea una nueva ubicación con geocodificación automática y subida de imagen.
    
    :param title: Título de la ubicación
    :param address: Dirección para geocodificar
    :param owner_email: Email del propietario
    :param description: Descripción opcional
    :param image: Archivo de imagen
    :param geocoding_service: Servicio de geocodificación inyectado
    :param image_service: Servicio de imágenes inyectado
    :return: Ubicación creada con coordenadas e imagen
    :raises HTTPException: Si falla la subida de imagen o geocodificación
    """
    # 1. Upload Image to Cloudinary
    file_content = await image.read()
    image_url = image_service.upload_image(file_content)
    if not image_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Error al subir imagen a Cloudinary"
        )

    # 2. Geocoding with OpenStreetMap
    coordinates = await geocoding_service.get_coordinates(address)
    lat, lng = coordinates if coordinates else (None, None)
    
    if not lat:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Dirección no encontrada. Verifica que sea una dirección válida."
        )

    # 3. Create Location Model
    location_data = LocationModel(
        title=title,
        address=address,
        description=description,
        latitude=lat,
        longitude=lng,
        image_url=image_url,
        owner_email=owner_email,
        created_at=datetime.utcnow()
    )

    # 4. Save to Database
    created_location = await location_repository.create(location_data)
    
    return LocationResponse(
        id=str(created_location.id),
        **created_location.model_dump()
    )
