from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_sukien_schema import (
    SuKienAdminResponse,
    ThongKeSuKienAdminResponse,
    MessageResponse,
)
from app.services import admin_sukien_service

router = APIRouter(
    prefix="/admin/su-kien",
    tags=["Admin - Su kien"],
)


@router.get("", response_model=List[SuKienAdminResponse])
def danh_sach_su_kien(
    tu_khoa: str | None = None,
    ma_loai_su_kien: int | None = None,
    nhom_trang_thai: str | None = None,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sukien_service.lay_danh_sach_su_kien(
        db=db,
        tu_khoa=tu_khoa,
        ma_loai_su_kien=ma_loai_su_kien,
        nhom_trang_thai=nhom_trang_thai,
    )


@router.get("/thong-ke", response_model=ThongKeSuKienAdminResponse)
def thong_ke_su_kien(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sukien_service.lay_thong_ke_su_kien(db=db)


@router.patch("/{ma_su_kien}/khoa", response_model=MessageResponse)
def khoa_mo_su_kien(
    ma_su_kien: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sukien_service.doi_trang_thai_khoa(db=db, ma_su_kien=ma_su_kien)


@router.delete("/{ma_su_kien}", response_model=MessageResponse)
def xoa_su_kien(
    ma_su_kien: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sukien_service.xoa_su_kien(db=db, ma_su_kien=ma_su_kien)
