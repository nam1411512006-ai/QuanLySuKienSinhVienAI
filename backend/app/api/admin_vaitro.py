from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_vaitro_schema import (
    VaiTroResponse,
    VaiTroCreateRequest,
    VaiTroUpdateRequest,
    MessageResponse,
)
from app.services import admin_vaitro_service

router = APIRouter(
    prefix="/admin/vai-tro",
    tags=["Admin - Vai tro"],
)


@router.get("", response_model=List[VaiTroResponse])
def danh_sach_vai_tro(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_vaitro_service.lay_danh_sach_vai_tro(db=db)


@router.post("", response_model=VaiTroResponse)
def tao_vai_tro(
    data: VaiTroCreateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_vaitro_service.tao_vai_tro(db=db, data=data)


@router.put("/{ma_vai_tro}", response_model=VaiTroResponse)
def cap_nhat_vai_tro(
    ma_vai_tro: int,
    data: VaiTroUpdateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_vaitro_service.cap_nhat_vai_tro(db=db, ma_vai_tro=ma_vai_tro, data=data)


@router.delete("/{ma_vai_tro}", response_model=MessageResponse)
def xoa_vai_tro(
    ma_vai_tro: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_vaitro_service.xoa_vai_tro(db=db, ma_vai_tro=ma_vai_tro)
