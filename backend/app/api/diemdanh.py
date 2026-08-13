from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.diemdanh_schema import (
    QuetQRRequest,
    DiemDanhResponse,
)
from app.services.diemdanh_service import xac_nhan_diem_danh

router = APIRouter(
    prefix="/diem-danh",
    tags=["Diem danh"],
)


# =====================================================
# QUÉT QR ĐIỂM DANH
# =====================================================

@router.post(
    "",
    response_model=DiemDanhResponse,
)
def quet_qr(
    data: QuetQRRequest,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return xac_nhan_diem_danh(
        db,
        data.ma_qr,
        current_user.MaTaiKhoan,
    )