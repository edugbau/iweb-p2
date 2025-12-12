from core.database import db
from models.interaction import InteractionModel

class InteractionRepository:
    def __init__(self):
        self.collection = db.get_db().interactions

    async def get_by_location(self, location_id: str) -> list[InteractionModel]:
        """Obtiene todas las interacciones de una ubicación específica."""
        interactions = []
        cursor = self.collection.find({"location_id": location_id}).sort("created_at", -1)
        async for document in cursor:
            interactions.append(InteractionModel(**document))
        return interactions

    async def create(self, interaction: InteractionModel) -> InteractionModel:
        """Crea una nueva interacción."""
        interaction_dict = interaction.model_dump(by_alias=True, exclude={"id"})
        result = await self.collection.insert_one(interaction_dict)
        interaction.id = str(result.inserted_id)
        return interaction
