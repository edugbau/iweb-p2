from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from app.core.database import engine
from app.models.location import Location
from app.schemas.location import LocationResponse
from app.services.cloudinary_service import upload_image
from app.services.geocoding import get_coordinates
from app.core.security import jwt

router = APIRouter()

@router.get("/", response_model=list[LocationResponse])
async def get_locations():
    """
    Get all locations.
    """
    return await engine.find(Location)

@router.post("/", response_model=LocationResponse)
async def create_location(
    name: str = Form(...),
    address: str = Form(...),
    file: UploadFile = File(...),
    # In a real app, user would be injected via dependency
    # For this template, we simulated it or pass it via header
    owner_email: str = Form(...) 
):
    """
    Create a new location with image.
    Automagically geocodes the address and uploads the image.
    """
    # 1. Geocoding
    coords = await get_coordinates(address)
    if not coords:
        raise HTTPException(status_code=400, detail="Address not found")
    lat, lng = coords

    # 2. Upload Image
    secure_url = await upload_image(file)

    # 3. Create Model
    location = Location(
        name=name,
        address=address,
        latitude=lat,
        longitude=lng,
        image_url=secure_url,
        owner_email=owner_email
    )
    
    await engine.save(location)
    return location
