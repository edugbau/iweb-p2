from fastapi import APIRouter
from api.v1.endpoints import auth, locations, interactions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(locations.router, prefix="/locations", tags=["Locations"])
api_router.include_router(interactions.router, prefix="/interactions", tags=["Interactions"])
