from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Annotated
from pydantic import field_validator

class Settings(BaseSettings):
    # API Configuration
    API_NAME: str = "MiMapa API"
    
    MONGO_URI: str
    DATABASE_NAME: str = "mimapa_db"
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    # JWT Secret Key
    SECRET_KEY: str = "exam_secret_key_12345"  # Por defecto para desarrollo, cambiar en producción
    
    # CORS Configuration
    # Lista de orígenes permitidos separados por comas
    # Ejemplo: "http://localhost:5173,https://mi-app.vercel.app"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    @property
    def allowed_origins_list(self) -> list[str]:
        """Convierte la string de ALLOWED_ORIGINS en una lista."""
        if not self.ALLOWED_ORIGINS:
            return []
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

