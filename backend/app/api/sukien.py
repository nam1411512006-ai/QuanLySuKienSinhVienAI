from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.sukien_schema import SuKienResponse
from app.services.sukien_service import get_all_su_kien, get_su_kien_by_id


router = APIRouter(prefix="/su-kien", tags=["Su kien"])


@router.get("", response_model=list[SuKienResponse], summary="Lay danh sach su kien")
def list_su_kien(db: Session = Depends(get_db)) -> list[SuKienResponse]:
    return get_all_su_kien(db)


@router.get("/{ma_su_kien}", response_model=SuKienResponse, summary="Lay chi tiet su kien")
def detail_su_kien(
    ma_su_kien: int = Path(gt=0),
    db: Session = Depends(get_db),
) -> SuKienResponse:
    return get_su_kien_by_id(db, ma_su_kien)