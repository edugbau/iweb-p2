"""
Repositorio para operaciones de Ubicación en MongoDB.
"""

from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.location import Location


class LocationRepository:
    """
    Repositorio para gestionar ubicaciones en la base de datos.
    """
    
    def __init__(self, db: AsyncIOMotorDatabase):
        """
        Inicializa el repositorio con la conexión a la base de datos.
        :param db: Instancia de la base de datos MongoDB.
        """
        self.collection = db["locations"]
    
    async def find_all(self, owner_email: str | None = None) -> list[Location]:
        """
        Obtiene todas las ubicaciones, opcionalmente filtradas por propietario.
        :param owner_email: Email del propietario para filtrar (opcional).
        :return: Lista de ubicaciones.
        """
        query = {}
        if owner_email:
            query["owner_email"] = owner_email
        
        cursor = self.collection.find(query).sort("created_at", -1)
        locations = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            locations.append(Location(**doc))
        return locations
    
    async def find_by_id(self, location_id: str) -> Location | None:
        """
        Busca una ubicación por su ID.
        :param location_id: ID de la ubicación a buscar.
        :return: Ubicación encontrada o None.
        """
        try:
            doc = await self.collection.find_one({"_id": ObjectId(location_id)})
            if doc:
                doc["_id"] = str(doc["_id"])
                return Location(**doc)
        except Exception:
            pass
        return None
    
    async def create(self, location: Location) -> Location:
        """
        Crea una nueva ubicación.
        :param location: Datos de la ubicación a crear.
        :return: Ubicación creada con su ID.
        """
        location_dict = location.model_dump(exclude={"id"})
        location_dict["created_at"] = datetime.utcnow()
        location_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(location_dict)
        location_dict["_id"] = str(result.inserted_id)
        return Location(**location_dict)
    
    async def update(self, location_id: str, update_data: dict) -> Location | None:
        """
        Actualiza una ubicación existente.
        :param location_id: ID de la ubicación a actualizar.
        :param update_data: Datos a actualizar.
        :return: Ubicación actualizada o None.
        """
        update_data["updated_at"] = datetime.utcnow()
        
        try:
            await self.collection.update_one(
                {"_id": ObjectId(location_id)},
                {"$set": update_data}
            )
            return await self.find_by_id(location_id)
        except Exception:
            return None
    
    async def delete(self, location_id: str) -> bool:
        """
        Elimina una ubicación.
        :param location_id: ID de la ubicación a eliminar.
        :return: True si se eliminó, False si no existía.
        """
        try:
            result = await self.collection.delete_one({"_id": ObjectId(location_id)})
            return result.deleted_count > 0
        except Exception:
            return False
