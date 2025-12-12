"""
Módulo API principal.
"""

from api.v1 import auth_router, locations_router, interactions_router

__all__ = ["auth_router", "locations_router", "interactions_router"]
