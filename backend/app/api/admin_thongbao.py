from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_thongbao_schema import (
    AdminThongBaoChiTietResponse,
    AdminThongBaoCreateRequest,
    AdminThongBaoResponse,
    MessageResponse,
    ThongKeThongBaoResponse,
)
from app.services import admin_thongbao_service

router = APIRouter(
    prefix="/admin/thong-bao",
    tags=["Admin - Thong bao"],
)


@router.get("", response_model=List[AdminThongBaoResponse])
def danh_sach_thong_bao(
    tu_khoa: str | None = None,
    loai_thong_bao: str | None = None,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_thongbao_service.lay_danh_sach_thong_bao(
        db=db,
        tu_khoa=tu_khoa,
        loai_thong_bao=loai_thong_bao,
    )


@router.get("/thong-ke", response_model=ThongKeThongBaoResponse)
def thong_ke_thong_bao(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_thongbao_service.lay_thong_ke(db=db)


@router.get("/{ma_thong_bao}", response_model=AdminThongBaoChiTietResponse)
def chi_tiet_thong_bao(
    ma_thong_bao: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_thongbao_service.lay_chi_tiet_thong_bao(db=db, ma_thong_bao=ma_thong_bao)


@router.post("", response_model=AdminThongBaoResponse)
def tao_thong_bao(
    data: AdminThongBaoCreateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_thongbao_service.tao_thong_bao(db=db, data=data)


@router.delete("/{ma_thong_bao}", response_model=MessageResponse)
def xoa_thong_bao(
    ma_thong_bao: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_thongbao_service.xoa_thong_bao(db=db, ma_thong_bao=ma_thong_bao)
