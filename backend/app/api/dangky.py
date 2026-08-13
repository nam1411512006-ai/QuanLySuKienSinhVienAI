from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.dangky_schema import (
    DangKyMessage,
    SuKienDaDangKy,
)
from app.services.dangky_service import (
    dang_ky_su_kien,
    lay_danh_sach_dang_ky,
    huy_dang_ky_su_kien,
)

router = APIRouter(
    prefix="/dang-ky",
    tags=["Dang ky su kien"],
)


# =====================================================
# Đăng ký sự kiện
# =====================================================

@router.post(
    "/{ma_su_kien}",
    response_model=DangKyMessage,
)
def dang_ky(
    ma_su_kien: int,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return dang_ky_su_kien(
        db=db,
        ma_su_kien=ma_su_kien,
        ma_tai_khoan=current_user.MaTaiKhoan,
    )


# =====================================================
# Hủy đăng ký sự kiện
# =====================================================

@router.put(
    "/huy/{ma_dang_ky}",
    response_model=DangKyMessage,
)
def huy_dang_ky(
    ma_dang_ky: int,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return huy_dang_ky_su_kien(
        db=db,
        ma_dang_ky=ma_dang_ky,
        ma_tai_khoan=current_user.MaTaiKhoan,
    )


# =====================================================
# Sự kiện của tôi
# =====================================================

@router.get(
    "",
    response_model=List[SuKienDaDangKy],
)
def danh_sach_su_kien_da_dang_ky(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return lay_danh_sach_dang_ky(
        db=db,
        ma_tai_khoan=current_user.MaTaiKhoan,
    )