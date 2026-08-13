from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_taikhoan_schema import (
    TaiKhoanAdminResponse,
    TaiKhoanAdminCreateRequest,
    TaiKhoanAdminUpdateRequest,
    ThongKeTaiKhoanResponse,
    MessageResponse,
)
from app.services import admin_taikhoan_service

router = APIRouter(
    prefix="/admin/tai-khoan",
    tags=["Admin - Tai khoan"],
)


@router.get("", response_model=List[TaiKhoanAdminResponse])
def danh_sach_tai_khoan(
    tu_khoa: str | None = None,
    ma_vai_tro: int | None = None,
    trang_thai: int | None = None,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_taikhoan_service.lay_danh_sach_tai_khoan(
        db=db,
        tu_khoa=tu_khoa,
        ma_vai_tro=ma_vai_tro,
        trang_thai=trang_thai,
    )


@router.get("/thong-ke", response_model=ThongKeTaiKhoanResponse)
def thong_ke_tai_khoan(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_taikhoan_service.lay_thong_ke_tai_khoan(db=db)


@router.post("", response_model=TaiKhoanAdminResponse)
def tao_tai_khoan(
    data: TaiKhoanAdminCreateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_taikhoan_service.tao_tai_khoan(db=db, data=data)


@router.put("/{ma_tai_khoan}", response_model=TaiKhoanAdminResponse)
def cap_nhat_tai_khoan(
    ma_tai_khoan: int,
    data: TaiKhoanAdminUpdateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_taikhoan_service.cap_nhat_tai_khoan(
        db=db,
        ma_tai_khoan=ma_tai_khoan,
        data=data,
    )


@router.patch("/{ma_tai_khoan}/trang-thai", response_model=MessageResponse)
def doi_trang_thai_tai_khoan(
    ma_tai_khoan: int,
    db: Session = Depends(get_db),
    admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_taikhoan_service.doi_trang_thai_tai_khoan(
        db=db,
        ma_tai_khoan=ma_tai_khoan,
        admin_dang_dang_nhap=admin,
    )


@router.delete("/{ma_tai_khoan}", response_model=MessageResponse)
def xoa_tai_khoan(
    ma_tai_khoan: int,
    db: Session = Depends(get_db),
    admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_taikhoan_service.xoa_tai_khoan(
        db=db,
        ma_tai_khoan=ma_tai_khoan,
        admin_dang_dang_nhap=admin,
    )
