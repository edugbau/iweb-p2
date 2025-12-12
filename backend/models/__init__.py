"""
Módulo de modelos MongoDB.
"""

from models.user import User
from models.location import Location
from models.interaction import Interaction, InteractionType

__all__ = ["User", "Location", "Interaction", "InteractionType"]
