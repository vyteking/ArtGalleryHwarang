from motor.motor_asyncio import AsyncIOMotorClient
from django.conf import settings

_client: AsyncIOMotorClient | None = None

def get_motor_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.MONGO_URI)
    return _client

def get_mongo_db():
    return get_motor_client().get_default_database()
