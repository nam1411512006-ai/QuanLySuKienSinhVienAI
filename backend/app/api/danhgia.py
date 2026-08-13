from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.danhgia_schema import (
    DanhGiaCreate,
    DanhGiaMessage,
    SuKienChoDanhGia,
)
from app.services.danhgia_service import (
    lay_su_kien_cho_danh_gia,
    tao_danh_gia,
)

router = APIRouter(
    prefix="/danh-gia",
    tags=["Danh gia su kien"],
)


# =====================================================
# DANH SÁCH SỰ KIỆN CÓ THỂ ĐÁNH GIÁ
# =====================================================

@router.get(
    "/cho-danh-gia",
    response_model=List[SuKienChoDanhGia],
)
def danh_sach_su_kien_cho_danh_gia(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return lay_su_kien_cho_danh_gia(
        db=db,
        ma_tai_khoan=current_user.MaTaiKhoan,
    )


# =====================================================
# GỬI ĐÁNH GIÁ
# =====================================================

@router.post(
    "/{ma_su_kien}",
    response_model=DanhGiaMessage,
)
def gui_danh_gia(
    ma_su_kien: int,
    data: DanhGiaCreate,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return tao_danh_gia(
        db=db,
        ma_su_kien=ma_su_kien,
        ma_tai_khoan=current_user.MaTaiKhoan,
        data=data,
    )
