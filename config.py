from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "model_version_control"
    models_collection: str = "models"
    users_collection: str = "users"

    class Config:
        env_file = ".env"

settings = Settings()
