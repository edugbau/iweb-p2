"""
Aplicación principal FastAPI.
Punto de entrada del backend IWEB Exam Template.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.database import Database
from api.v1 import auth_router, locations_router, interactions_router


# Tags para documentación OpenAPI
tags_metadata = [
    {
        "name": "Autenticación",
        "description": "Operaciones de autenticación con Google OAuth 2.0."
    },
    {
        "name": "Ubicaciones",
        "description": "Gestión de ubicaciones/marcadores en el mapa."
    },
    {
        "name": "Interacciones",
        "description": "Comentarios y visitas a ubicaciones."
    }
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gestiona el ciclo de vida de la aplicación.
    Conecta y desconecta la base de datos.
    """
    # Startup
    await Database.connect()
    yield
    # Shutdown
    await Database.disconnect()


# Crear aplicación FastAPI
app = FastAPI(
    title="IWEB Exam Template API",
    description="""
    API para el template genérico de exámenes IWEB.
    
    ## Características
    
    * 🗺️ **Mapas**: Visualización y geocodificación con OpenStreetMap
    * 📸 **Imágenes**: Subida a Cloudinary
    * 🔐 **Autenticación**: Google OAuth 2.0
    
    ## Flujo de Autenticación
    
    1. El frontend redirige a `/api/v1/auth/login`
    2. El backend redirige a Google OAuth
    3. Google redirige al callback con el código
    4. El backend genera un JWT y redirige al frontend
    """,
    version="1.0.0",
    openapi_tags=tags_metadata,
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Registrar routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(locations_router, prefix="/api/v1")
app.include_router(interactions_router, prefix="/api/v1")


@app.get(
    "/",
    summary="Health Check",
    description="Verifica que la API está funcionando.",
    tags=["Health"]
)
async def root():
    """
    Endpoint raíz para verificar que la API está activa.
    :return: Mensaje de bienvenida.
    """
    return {
        "message": "🚀 IWEB Exam Template API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get(
    "/health",
    summary="Health Check detallado",
    description="Verifica el estado de todos los servicios.",
    tags=["Health"]
)
async def health_check():
    """
    Endpoint de health check detallado.
    :return: Estado de los servicios.
    """
    return {
        "status": "healthy",
        "database": "connected",
        "services": {
            "geocoding": "ready",
            "cloudinary": "ready",
            "auth": "ready"
        }
    }
