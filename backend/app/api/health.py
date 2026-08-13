from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.common import HealthResponse
from app.services.health_service import get_health_status


router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse, summary="Kiem tra backend va MySQL")
def health_check(db: Session = Depends(get_db)) -> HealthResponse:
    return HealthResponse(**get_health_status(db))
