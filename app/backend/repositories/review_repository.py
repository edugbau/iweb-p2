"""Repositorio para operaciones CRUD de reseñas en MongoDB"""
from core.database import db
from models.review import ReviewModel
from bson import ObjectId


class ReviewRepository:
    """
    Repositorio para gestionar reseñas en MongoDB.
    Proporciona métodos para CRUD de reseñas.
    """
    
    def __init__(self):
        """Inicializa el repositorio con la colección de reseñas."""
        self.collection = db.get_db().reviews

    async def get_all(self) -> list[ReviewModel]:
        """
        Obtiene todas las reseñas ordenadas por fecha de creación descendente.
        
        :return: Lista de todas las reseñas.
        """
        reviews = []
        cursor = self.collection.find().sort("created_at", -1)
        async for document in cursor:
            document["_id"] = str(document["_id"])
            reviews.append(ReviewModel(**document))
        return reviews

    async def get_by_id(self, review_id: str) -> ReviewModel | None:
        """
        Obtiene una reseña por su ID.
        
        :param review_id: ID de la reseña en MongoDB.
        :return: ReviewModel si existe, None si no.
        """
        try:
            if not ObjectId.is_valid(review_id):
                return None
            document = await self.collection.find_one({"_id": ObjectId(review_id)})
            if document:
                document["_id"] = str(document["_id"])
                return ReviewModel(**document)
            return None
        except Exception:
            return None

    async def get_by_author(self, author_email: str) -> list[ReviewModel]:
        """
        Obtiene todas las reseñas de un autor específico.
        
        :param author_email: Email del autor.
        :return: Lista de reseñas del autor.
        """
        reviews = []
        cursor = self.collection.find({"author_email": author_email}).sort("created_at", -1)
        async for document in cursor:
            document["_id"] = str(document["_id"])
            reviews.append(ReviewModel(**document))
        return reviews

    async def create(self, review: ReviewModel) -> ReviewModel:
        """
        Guarda una nueva reseña en la base de datos.
        
        :param review: Modelo de la reseña a crear.
        :return: Reseña creada con ID asignado.
        """
        review_dict = review.model_dump(by_alias=True, exclude={"id"})
        result = await self.collection.insert_one(review_dict)
        review.id = str(result.inserted_id)
        return review

    async def update(self, review_id: str, update_data: dict) -> ReviewModel | None:
        """
        Actualiza una reseña existente.
        
        :param review_id: ID de la reseña a actualizar.
        :param update_data: Diccionario con los campos a actualizar.
        :return: Reseña actualizada o None si no existe.
        """
        try:
            if not ObjectId.is_valid(review_id):
                return None
            
            # Eliminar campos None del update
            update_data = {k: v for k, v in update_data.items() if v is not None}
            
            if not update_data:
                return await self.get_by_id(review_id)
            
            await self.collection.update_one(
                {"_id": ObjectId(review_id)},
                {"$set": update_data}
            )
            return await self.get_by_id(review_id)
        except Exception:
            return None

    async def delete(self, review_id: str) -> bool:
        """
        Elimina una reseña por su ID.
        
        :param review_id: ID de la reseña a eliminar.
        :return: True si se eliminó, False si no existía.
        """
        try:
            if not ObjectId.is_valid(review_id):
                return False
            result = await self.collection.delete_one({"_id": ObjectId(review_id)})
            return result.deleted_count > 0
        except Exception:
            return False

    async def search_by_name(self, query: str) -> list[ReviewModel]:
        """
        Busca reseñas por nombre del establecimiento.
        
        :param query: Texto a buscar en el nombre.
        :return: Lista de reseñas que coinciden.
        """
        reviews = []
        cursor = self.collection.find({
            "establishment_name": {"$regex": query, "$options": "i"}
        }).sort("created_at", -1)
        async for document in cursor:
            document["_id"] = str(document["_id"])
            reviews.append(ReviewModel(**document))
        return reviews
