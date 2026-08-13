from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from backend/.env."""

    app_name: str = "QuanLySuKienSinhVienAI API"
    app_env: str = "development"
    debug: bool = True

    database_host: str = "localhost"
    database_port: int = 3306
    database_name: str = "QuanLySuKienSinhVien"
    database_user: str = "root"
    database_password: str = ""

    jwt_secret_key: str = Field(default="change-this-secret-key")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 120

    backend_cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # ==================== SMTP (gui email) ====================
    # De trong neu chua muon bat tinh nang gui email.
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from_name: str = "Quan ly Su kien Sinh vien"
    smtp_use_tls: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def database_url(self) -> str:
        return (
            "mysql+pymysql://"
            f"{self.database_user}:{self.database_password}"
            f"@{self.database_host}:{self.database_port}/{self.database_name}"
            "?charset=utf8mb4"
        )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]

    @property
    def smtp_da_cau_hinh(self) -> bool:
        return bool(self.smtp_host and self.smtp_user and self.smtp_password)


@lru_cache
def get_settings() -> Settings:
    return Settings()
