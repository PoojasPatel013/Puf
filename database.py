from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect_db(cls):
        cls.client = AsyncIOMotorClient(settings.mongodb_url)
        cls.db = cls.client[settings.database_name]
        print(f"Connected to MongoDB at {settings.mongodb_url}")

    @classmethod
    async def close_db(cls):
        if cls.client:
            await cls.client.close()
            print("Closed MongoDB connection")

    @classmethod
    async def get_models_collection(cls):
        return cls.db[settings.models_collection]
        
    @classmethod
    async def get_users_collection(cls):
        return cls.db[settings.users_collection]
