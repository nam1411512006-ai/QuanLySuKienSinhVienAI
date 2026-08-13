from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import get_settings


def check_database(db: Session) -> str:
    db.execute(text("SELECT 1"))
    return "connected"


def get_health_status(db: Session) -> dict[str, str]:
    settings = get_settings()
    return {
        "status": "ok",
        "app": settings.app_name,
        "database": check_database(db),
    }
