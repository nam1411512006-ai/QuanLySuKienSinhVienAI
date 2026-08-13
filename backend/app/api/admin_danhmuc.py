from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_danhmuc_schema import (
    LoaiSuKienAdminResponse,
    LoaiSuKienCreateRequest,
    LoaiSuKienUpdateRequest,
    ThongKeDanhMucResponse,
    MessageResponse,
)
from app.services import admin_danhmuc_service

router = APIRouter(
    prefix="/admin/danh-muc",
    tags=["Admin - Danh muc su kien"],
)


@router.get("", response_model=List[LoaiSuKienAdminResponse])
def danh_sach_danh_muc(
    tu_khoa: str | None = None,
    trang_thai: int | None = None,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_danhmuc_service.lay_danh_sach_danh_muc(
        db=db,
        tu_khoa=tu_khoa,
        trang_thai=trang_thai,
    )


@router.get("/thong-ke", response_model=ThongKeDanhMucResponse)
def thong_ke_danh_muc(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_danhmuc_service.lay_thong_ke_danh_muc(db=db)


@router.post("", response_model=LoaiSuKienAdminResponse)
def tao_danh_muc(
    data: LoaiSuKienCreateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_danhmuc_service.tao_danh_muc(db=db, data=data)


@router.put("/{ma_loai_su_kien}", response_model=LoaiSuKienAdminResponse)
def cap_nhat_danh_muc(
    ma_loai_su_kien: int,
    data: LoaiSuKienUpdateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_danhmuc_service.cap_nhat_danh_muc(
        db=db,
        ma_loai_su_kien=ma_loai_su_kien,
        data=data,
    )


@router.patch("/{ma_loai_su_kien}/trang-thai", response_model=MessageResponse)
def doi_trang_thai_danh_muc(
    ma_loai_su_kien: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_danhmuc_service.doi_trang_thai_danh_muc(
        db=db,
        ma_loai_su_kien=ma_loai_su_kien,
    )


@router.delete("/{ma_loai_su_kien}", response_model=MessageResponse)
def xoa_danh_muc(
    ma_loai_su_kien: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_danhmuc_service.xoa_danh_muc(
        db=db,
        ma_loai_su_kien=ma_loai_su_kien,
    )
