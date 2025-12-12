"""
Módulo de routers API v1.
"""

from api.v1.auth import router as auth_router
from api.v1.locations import router as locations_router
from api.v1.interactions import router as interactions_router

__all__ = ["auth_router", "locations_router", "interactions_router"]
