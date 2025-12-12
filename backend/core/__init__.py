"""
Módulo core de la aplicación.
Contiene configuración y conexión a base de datos.
"""

from core.config import settings
from core.database import Database, get_database

__all__ = ["settings", "Database", "get_database"]
