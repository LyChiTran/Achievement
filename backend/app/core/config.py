from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator
import json


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
    
    # CORS - Can be overridden by environment variable
    BACKEND_CORS_ORIGINS: str | List[str] = json.dumps([
        "http://localhost:3000",
        "http://localhost:8000",
        "http://192.168.101.26:3000",
        "http://127.0.0.1:3000",
    ])
    
    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from JSON string or return list as-is"""
        if isinstance(v, str):
            try:
                # Try parsing as JSON array
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                # If not JSON, treat as comma-separated string
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # Email (SendGrid)
    SENDGRID_API_KEY: str = ""
    FROM_EMAIL: str = "noreply@achievementweb.com"
    SENDGRID_TEMPLATE_ID: str = ""


# Create settings instance
settings = Settings()
