"""Endpoints para gestión de reseñas de establecimientos"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends, Header
from services.map_service import GeocodingService
from services.image_service import ImageService
from schemas.review import ReviewResponse, ReviewSummary, GeocodingResponse
from schemas.common import ErrorResponse
from models.review import ReviewModel
from datetime import datetime, timedelta
from repositories.review_repository import ReviewRepository
from api.v1.endpoints.auth import get_current_user
from services.auth_service import AuthService
from typing import Annotated

router = APIRouter()


@router.get(
    "",
    response_model=list[ReviewSummary],
    status_code=status.HTTP_200_OK,
    summary="Listar todas las reseñas",
    description="Obtiene una lista de todas las reseñas registradas en la aplicación.",
    responses={
        200: {
            "description": "Lista de reseñas obtenida exitosamente",
            "model": list[ReviewSummary]
        }
    }
)
async def get_reviews(
    review_repository: ReviewRepository = Depends()
):
    """
    Obtiene todas las reseñas del sistema.
    
    :return: Lista de reseñas con información resumida.
    """
    reviews = await review_repository.get_all()
    return [
        ReviewSummary(
            id=str(review.id),
            establishment_name=review.establishment_name,
            address=review.address,
            latitude=review.latitude or 0,
            longitude=review.longitude or 0,
            rating=review.rating,
            image_urls=review.image_urls,
            author_email=review.author_email,
            author_name=review.author_name,
            created_at=review.created_at
        )
        for review in reviews
    ]


@router.get(
    "/{review_id}",
    response_model=ReviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Obtener una reseña por ID",
    description="Obtiene los detalles completos de una reseña específica, incluyendo información del token OAuth.",
    responses={
        200: {
            "description": "Reseña encontrada",
            "model": ReviewResponse
        },
        404: {
            "description": "Reseña no encontrada",
            "model": ErrorResponse
        }
    }
)
async def get_review(
    review_id: str,
    review_repository: ReviewRepository = Depends()
):
    """
    Obtiene una reseña específica por su ID con toda su información.
    
    :param review_id: ID de la reseña en MongoDB.
    :return: Información completa de la reseña.
    :raises HTTPException: Si la reseña no existe.
    """
    review = await review_repository.get_by_id(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    
    return ReviewResponse(
        id=str(review.id),
        establishment_name=review.establishment_name,
        address=review.address,
        latitude=review.latitude or 0,
        longitude=review.longitude or 0,
        rating=review.rating,
        image_urls=review.image_urls,
        author_email=review.author_email,
        author_name=review.author_name,
        auth_token=review.auth_token,
        created_at=review.created_at,
        expires_at=review.expires_at
    )


@router.post(
    "",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nueva reseña",
    description="Crea una nueva reseña con geocodificación automática y subida de imágenes a Cloudinary. Requiere autenticación OAuth.",
    responses={
        201: {
            "description": "Reseña creada exitosamente",
            "model": ReviewResponse
        },
        400: {
            "description": "Dirección no encontrada o datos inválidos",
            "model": ErrorResponse
        },
        401: {
            "description": "No autenticado",
            "model": ErrorResponse
        },
        500: {
            "description": "Error al subir imágenes a Cloudinary",
            "model": ErrorResponse
        }
    }
)
async def create_review(
    establishment_name: str = Form(
        ..., 
        description="Nombre del establecimiento reseñado",
        min_length=1,
        max_length=200
    ),
    address: str = Form(
        ..., 
        description="Dirección postal del establecimiento para geocodificación",
        min_length=1
    ),
    rating: int = Form(
        ..., 
        description="Valoración de 0 a 5 puntos",
        ge=0,
        le=5
    ),
    images: list[UploadFile] = File(
        default=[],
        description="Imágenes del establecimiento (JPEG, PNG, WebP). Puede subir múltiples archivos."
    ),
    authorization: Annotated[str | None, Header()] = None,
    review_repository: ReviewRepository = Depends(),
    geocoding_service: GeocodingService = Depends(),
    image_service: ImageService = Depends(),
    auth_service: AuthService = Depends()
):
    """
    Crea una nueva reseña con geocodificación automática y subida de imágenes.
    
    :param establishment_name: Nombre del establecimiento.
    :param address: Dirección para geocodificar.
    :param rating: Valoración de 0 a 5.
    :param images: Lista de archivos de imagen.
    :param authorization: Header de autorización Bearer token.
    :param review_repository: Repositorio de reseñas inyectado.
    :param geocoding_service: Servicio de geocodificación inyectado.
    :param image_service: Servicio de imágenes inyectado.
    :param auth_service: Servicio de autenticación inyectado.
    :return: Reseña creada con coordenadas e imágenes.
    :raises HTTPException: Si falla la autenticación, subida de imagen o geocodificación.
    """
    # 0. Validar autenticación y obtener información del usuario
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autorización requerido"
        )
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Esquema inválido")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Formato de token inválido"
        )
    
    payload = auth_service.verify_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
    
    user_email = payload.get("sub")
    # Obtener el nombre del usuario del token, o usar parte del email como fallback
    user_name = payload.get("name", user_email.split("@")[0] if user_email else "Usuario")
    
    # Obtener timestamps del token
    token_exp = payload.get("exp")
    expires_at = datetime.fromtimestamp(token_exp) if token_exp else datetime.utcnow() + timedelta(hours=24)
    
    # 1. Upload Images to Cloudinary
    image_urls = []
    for image in images:
        if image.filename:  # Solo procesar si hay archivo
            file_content = await image.read()
            image_url = image_service.upload_image(file_content)
            if image_url:
                image_urls.append(image_url)
            else:
                print(f"Error al subir imagen: {image.filename}")
    
    # 2. Geocoding with OpenStreetMap
    coordinates = await geocoding_service.get_coordinates(address)
    lat, lng = coordinates if coordinates else (None, None)
    
    if lat is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dirección no encontrada. Verifica que sea una dirección válida."
        )
    
    # 3. Create Review Model
    review_data = ReviewModel(
        establishment_name=establishment_name,
        address=address,
        latitude=lat,
        longitude=lng,
        rating=rating,
        image_urls=image_urls,
        author_email=user_email,
        author_name=user_name,
        auth_token=token,
        created_at=datetime.utcnow(),
        expires_at=expires_at
    )
    
    # 4. Save to Database
    created_review = await review_repository.create(review_data)
    
    return ReviewResponse(
        id=str(created_review.id),
        establishment_name=created_review.establishment_name,
        address=created_review.address,
        latitude=created_review.latitude or 0,
        longitude=created_review.longitude or 0,
        rating=created_review.rating,
        image_urls=created_review.image_urls,
        author_email=created_review.author_email,
        author_name=created_review.author_name,
        auth_token=created_review.auth_token,
        created_at=created_review.created_at,
        expires_at=created_review.expires_at
    )


@router.delete(
    "/{review_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar una reseña",
    description="Elimina una reseña existente. Solo el autor puede eliminar su propia reseña.",
    responses={
        204: {
            "description": "Reseña eliminada exitosamente"
        },
        403: {
            "description": "No tienes permiso para eliminar esta reseña",
            "model": ErrorResponse
        },
        404: {
            "description": "Reseña no encontrada",
            "model": ErrorResponse
        }
    }
)
async def delete_review(
    review_id: str,
    owner_email: str = Depends(get_current_user),
    review_repository: ReviewRepository = Depends()
):
    """
    Elimina una reseña por su ID.
    
    :param review_id: ID de la reseña a eliminar.
    :param owner_email: Email del usuario autenticado.
    :param review_repository: Repositorio de reseñas inyectado.
    :raises HTTPException: Si la reseña no existe o no tiene permiso.
    """
    review = await review_repository.get_by_id(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    
    if review.author_email != owner_email:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para eliminar esta reseña"
        )
    
    await review_repository.delete(review_id)


@router.post(
    "/geocode",
    response_model=GeocodingResponse,
    status_code=status.HTTP_200_OK,
    summary="Geocodificar dirección",
    description="Obtiene las coordenadas GPS de una dirección postal.",
    responses={
        200: {
            "description": "Coordenadas obtenidas exitosamente",
            "model": GeocodingResponse
        },
        404: {
            "description": "Dirección no encontrada",
            "model": ErrorResponse
        }
    }
)
async def geocode_address(
    address: str = Form(..., description="Dirección a geocodificar"),
    geocoding_service: GeocodingService = Depends()
):
    """
    Geocodifica una dirección postal y devuelve sus coordenadas.
    
    :param address: Dirección a geocodificar.
    :param geocoding_service: Servicio de geocodificación inyectado.
    :return: Coordenadas de la dirección.
    :raises HTTPException: Si la dirección no se encuentra.
    """
    coordinates = await geocoding_service.get_coordinates(address)
    
    if not coordinates:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dirección no encontrada"
        )
    
    lat, lng = coordinates
    return GeocodingResponse(
        latitude=lat,
        longitude=lng,
        display_name=address
    )
