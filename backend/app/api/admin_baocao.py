from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_baocao_schema import BaoCaoTongHopResponse
from app.services import admin_baocao_service

router = APIRouter(
    prefix="/admin/bao-cao",
    tags=["Admin - Bao cao"],
)


@router.get("", response_model=BaoCaoTongHopResponse)
def bao_cao_tong_hop(
    nam: int | None = None,
    thang: int | None = None,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_baocao_service.lay_bao_cao_tong_hop(db=db, nam=nam, thang=thang)
