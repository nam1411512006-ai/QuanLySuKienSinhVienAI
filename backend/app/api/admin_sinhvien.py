from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_sinhvien_schema import (
    SinhVienResponse,
    SinhVienCreateRequest,
    SinhVienUpdateRequest,
    ThongKeSinhVienResponse,
    DiemRenLuyenHocKyResponse,
    SuKienThamGiaResponse,
    MessageResponse,
)
from app.services import admin_sinhvien_service

router = APIRouter(
    prefix="/admin/sinh-vien",
    tags=["Admin - Sinh vien"],
)


@router.get("", response_model=List[SinhVienResponse])
def danh_sach_sinh_vien(
    tu_khoa: str | None = None,
    trang_thai: int | None = None,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sinhvien_service.lay_danh_sach_sinh_vien(
        db=db,
        tu_khoa=tu_khoa,
        trang_thai=trang_thai,
    )


@router.get("/thong-ke", response_model=ThongKeSinhVienResponse)
def thong_ke_sinh_vien(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sinhvien_service.lay_thong_ke_sinh_vien(db=db)


@router.post("", response_model=SinhVienResponse)
def tao_sinh_vien(
    data: SinhVienCreateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sinhvien_service.tao_sinh_vien(db=db, data=data)


@router.get("/{ma_tai_khoan}/diem-ren-luyen", response_model=List[DiemRenLuyenHocKyResponse])
def diem_ren_luyen_sinh_vien(
    ma_tai_khoan: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sinhvien_service.lay_diem_ren_luyen_cua_sinh_vien(
        db=db, ma_tai_khoan=ma_tai_khoan
    )


@router.get("/{ma_tai_khoan}/su-kien", response_model=List[SuKienThamGiaResponse])
def su_kien_cua_sinh_vien(
    ma_tai_khoan: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sinhvien_service.lay_su_kien_da_tham_gia(
        db=db, ma_tai_khoan=ma_tai_khoan
    )


@router.put("/{ma_tai_khoan}", response_model=SinhVienResponse)
def cap_nhat_sinh_vien(
    ma_tai_khoan: int,
    data: SinhVienUpdateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sinhvien_service.cap_nhat_sinh_vien(
        db=db, ma_tai_khoan=ma_tai_khoan, data=data
    )


@router.patch("/{ma_tai_khoan}/trang-thai", response_model=MessageResponse)
def doi_trang_thai_sinh_vien(
    ma_tai_khoan: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sinhvien_service.doi_trang_thai_sinh_vien(
        db=db, ma_tai_khoan=ma_tai_khoan
    )


@router.delete("/{ma_tai_khoan}", response_model=MessageResponse)
def xoa_sinh_vien(
    ma_tai_khoan: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_sinhvien_service.xoa_sinh_vien(db=db, ma_tai_khoan=ma_tai_khoan)
