from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str = "mongodb+srv://poojaspatel1375:HrG5GuCITWknXzVR@cluster0.h3pwxv6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    database_name: str = "puffer"
    models_collection: str = "models"
    users_collection: str = "users"

    class Config:
        env_file = ".env"

settings = Settings()
