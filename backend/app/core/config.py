from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )
    
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Achievement Web API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API for personal achievement tracking system"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://192.168.101.26:3000",  # Network IP
        "http://127.0.0.1:3000",
    ]
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # Email (SendGrid)
    SENDGRID_API_KEY: str = ""
    FROM_EMAIL: str = "noreply@achievementweb.com"
    SENDGRID_TEMPLATE_ID: str = ""


# Create settings instance
settings = Settings()
