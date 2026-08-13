from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_caidat_schema import (
    CaiDatHeThongResponse,
    CaiDatHeThongUpdateRequest,
    ThongTinHeThongResponse,
    TrangThaiSmtpResponse,
    GuiEmailThuRequest,
    MessageResponse,
)
from app.services import admin_caidat_service

router = APIRouter(
    prefix="/admin/cai-dat",
    tags=["Admin - Cai dat"],
)


@router.get("", response_model=CaiDatHeThongResponse)
def lay_cai_dat(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_caidat_service.lay_cai_dat(db=db)


@router.put("", response_model=CaiDatHeThongResponse)
def cap_nhat_cai_dat(
    data: CaiDatHeThongUpdateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_caidat_service.cap_nhat_cai_dat(db=db, data=data)


@router.get("/thong-tin-he-thong", response_model=ThongTinHeThongResponse)
def thong_tin_he_thong(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_caidat_service.lay_thong_tin_he_thong(db=db)


@router.get("/trang-thai-smtp", response_model=TrangThaiSmtpResponse)
def trang_thai_smtp(
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_caidat_service.lay_trang_thai_smtp()


@router.post("/gui-email-thu", response_model=MessageResponse)
def gui_email_thu(
    data: GuiEmailThuRequest,
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_caidat_service.gui_email_thu(data.email_nhan)
