"""
Repositorio para operaciones de Usuario en MongoDB.
"""

from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.user import User


class UserRepository:
    """
    Repositorio para gestionar usuarios en la base de datos.
    """
    
    def __init__(self, db: AsyncIOMotorDatabase):
        """
        Inicializa el repositorio con la conexión a la base de datos.
        :param db: Instancia de la base de datos MongoDB.
        """
        self.collection = db["users"]
    
    async def find_by_email(self, email: str) -> User | None:
        """
        Busca un usuario por su email.
        :param email: Email del usuario a buscar.
        :return: Usuario encontrado o None.
        """
        doc = await self.collection.find_one({"email": email})
        if doc:
            return User(**doc)
        return None
    
    async def create_or_update(self, user: User) -> User:
        """
        Crea un nuevo usuario o actualiza uno existente.
        :param user: Datos del usuario a crear/actualizar.
        :return: Usuario creado o actualizado.
        """
        user_dict = user.model_dump(exclude={"created_at"})
        user_dict["updated_at"] = datetime.utcnow()
        
        await self.collection.update_one(
            {"email": user.email},
            {
                "$set": user_dict,
                "$setOnInsert": {"created_at": datetime.utcnow()}
            },
            upsert=True
        )
        
        return await self.find_by_email(user.email)
