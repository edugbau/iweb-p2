"""
Conexión a la base de datos MongoDB.
Utiliza Motor para operaciones asíncronas.
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from core.config import settings
import certifi


class Database:
    """
    Clase para gestionar la conexión a MongoDB.
    Implementa el patrón Singleton para reutilizar la conexión.
    """
    
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None
    
    @classmethod
    async def connect(cls) -> None:
        """
        Establece la conexión con MongoDB Atlas.
        Se llama al iniciar la aplicación.
        """
        # Usar certifi para certificados SSL válidos en Docker
        cls.client = AsyncIOMotorClient(
            settings.mongo_uri,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=10000
        )
        cls.db = cls.client[settings.database_name]
        print(f"✅ Conectado a MongoDB: {settings.database_name}")
    
    @classmethod
    async def disconnect(cls) -> None:
        """
        Cierra la conexión con MongoDB.
        Se llama al detener la aplicación.
        """
        if cls.client:
            cls.client.close()
            print("❌ Desconectado de MongoDB")
    
    @classmethod
    def get_db(cls) -> AsyncIOMotorDatabase:
        """
        Obtiene la instancia de la base de datos.
        :return: Instancia de la base de datos MongoDB.
        :raises RuntimeError: Si no hay conexión activa.
        """
        if cls.db is None:
            raise RuntimeError("Base de datos no inicializada")
        return cls.db


# Función helper para obtener la base de datos
def get_database() -> AsyncIOMotorDatabase:
    """
    Función de conveniencia para obtener la base de datos.
    :return: Instancia de AsyncIOMotorDatabase.
    """
    return Database.get_db()
