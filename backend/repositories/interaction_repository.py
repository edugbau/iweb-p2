"""
Repositorio para operaciones de Interacción en MongoDB.
"""

from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.interaction import Interaction


class InteractionRepository:
    """
    Repositorio para gestionar interacciones en la base de datos.
    """
    
    def __init__(self, db: AsyncIOMotorDatabase):
        """
        Inicializa el repositorio con la conexión a la base de datos.
        :param db: Instancia de la base de datos MongoDB.
        """
        self.collection = db["interactions"]
    
    async def find_by_location(self, location_id: str) -> list[Interaction]:
        """
        Obtiene todas las interacciones de una ubicación.
        :param location_id: ID de la ubicación.
        :return: Lista de interacciones.
        """
        cursor = self.collection.find({"location_id": location_id}).sort("created_at", -1)
        interactions = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            interactions.append(Interaction(**doc))
        return interactions
    
    async def find_by_user(self, user_email: str) -> list[Interaction]:
        """
        Obtiene todas las interacciones de un usuario.
        :param user_email: Email del usuario.
        :return: Lista de interacciones.
        """
        cursor = self.collection.find({"user_email": user_email}).sort("created_at", -1)
        interactions = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            interactions.append(Interaction(**doc))
        return interactions
    
    async def create(self, interaction: Interaction) -> Interaction:
        """
        Crea una nueva interacción.
        :param interaction: Datos de la interacción a crear.
        :return: Interacción creada con su ID.
        """
        interaction_dict = interaction.model_dump(exclude={"id"})
        interaction_dict["created_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(interaction_dict)
        interaction_dict["_id"] = str(result.inserted_id)
        return Interaction(**interaction_dict)
    
    async def delete(self, interaction_id: str) -> bool:
        """
        Elimina una interacción.
        :param interaction_id: ID de la interacción a eliminar.
        :return: True si se eliminó, False si no existía.
        """
        try:
            result = await self.collection.delete_one({"_id": ObjectId(interaction_id)})
            return result.deleted_count > 0
        except Exception:
            return False
