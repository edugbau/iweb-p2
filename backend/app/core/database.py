from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
engine = AIOEngine(client=client, database=settings.DATABASE_NAME)
