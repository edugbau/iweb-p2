from core.database import db
from models.location import LocationModel
from bson import ObjectId

class LocationRepository:
    def __init__(self):
        self.collection = db.get_db().locations

    async def get_all(self) -> list[LocationModel]:
        """Obtiene todas las ubicaciones ordenadas por fecha de creación descendente."""
        locations = []
        cursor = self.collection.find().sort("created_at", -1)
        async for document in cursor:
            locations.append(LocationModel(**document))
        return locations

    async def get_by_id(self, id: str) -> LocationModel | None:
        """Obtiene una ubicación por su ID."""
        try:
            if not ObjectId.is_valid(id):
                return None
            document = await self.collection.find_one({"_id": ObjectId(id)})
            if document:
                return LocationModel(**document)
            return None
        except Exception:
            return None

    async def create(self, location: LocationModel) -> LocationModel:
        """Guarda una nueva ubicación en la base de datos."""
        location_dict = location.model_dump(by_alias=True, exclude={"id"})
        result = await self.collection.insert_one(location_dict)
        location.id = str(result.inserted_id)
        return location
