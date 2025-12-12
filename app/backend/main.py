from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.router import api_router
from core.config import settings
from core.database import db

# Configuración de metadatos para OpenAPI
app = FastAPI(
    title=settings.API_NAME,
    description="API REST para gestión de ubicaciones en mapas con autenticación OAuth, geocodificación y almacenamiento de imágenes.",
    version="1.0.0",
    openapi_tags=[
        {
            "name": "Auth",
            "description": "Autenticación y autorización con Google OAuth 2.0"
        },
        {
            "name": "Locations",
            "description": "Gestión de ubicaciones en el mapa"
        },
        {
            "name": "Interactions",
            "description": "Interacciones de usuarios: comentarios, visitas y likes"
        }
    ]
)

# CORS Configuration
# Los orígenes permitidos se configuran desde .env (ALLOWED_ORIGINS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup and Shutdown Events
@app.on_event("startup")
async def startup_event():
    """
    Inicializa conexiones y servicios al arrancar la aplicación.
    """
    db.connect()
    print("✅ Conexión a MongoDB establecida")
    print("🚀 API iniciada correctamente")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Cierra conexiones al detener la aplicación.
    """
    if db.client:
        db.client.close()
        print("❌ Conexión a MongoDB cerrada")


# Include API Router
app.include_router(api_router, prefix="/api/v1")

# Root Endpoint
@app.get(
    "/",
    tags=["System"],
    summary="Root Endpoint",
    description="Endpoint raíz que confirma que el backend está operativo."
)
def root():
    """
    Endpoint raíz del backend.
    
    :return: Mensaje de confirmación de operatividad
    """
    return {
        "message": "Backend functioning correctly",
        "status": "operational",
        "service": settings.API_NAME,
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health Check Endpoint
@app.get(
    "/health",
    tags=["System"],
    summary="Health Check",
    description="Endpoint simple para verificar que la API está en ejecución."
)
def health_check():
    """
    Verifica el estado de la API.
    
    :return: Estado de la aplicación
    """
    return {
        "status": "ok",
        "service": settings.API_NAME,
        "version": "1.0.0"
    }

