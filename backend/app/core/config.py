from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    mongodb_url: str
    database_name: str

    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    environment: str = "development"

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()

GEMINI_API_KEY = settings.gemini_api_key
GEMINI_MODEL = settings.gemini_model
