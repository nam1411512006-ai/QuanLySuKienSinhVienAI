from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_bantochuc_schema import (
    BanToChucResponse,
    BanToChucCreateRequest,
    BanToChucUpdateRequest,
    ThongKeBanToChucResponse,
    SuKienCuaBanToChucResponse,
    TrungTamResponse,
    TrungTamCreateRequest,
    TrungTamUpdateRequest,
    MessageResponse,
)
from app.services import admin_bantochuc_service

router = APIRouter(
    prefix="/admin/ban-to-chuc",
    tags=["Admin - Ban to chuc"],
)


@router.get("", response_model=List[BanToChucResponse])
def danh_sach_ban_to_chuc(
    tu_khoa: str | None = None,
    ma_trung_tam: int | None = None,
    trang_thai: int | None = None,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.lay_danh_sach_ban_to_chuc(
        db=db,
        tu_khoa=tu_khoa,
        ma_trung_tam=ma_trung_tam,
        trang_thai=trang_thai,
    )


@router.get("/thong-ke", response_model=ThongKeBanToChucResponse)
def thong_ke_ban_to_chuc(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.lay_thong_ke_ban_to_chuc(db=db)


# ================= Trung tam / Don vi to chuc =================
# Luu y: khai bao truoc "/{ma_tai_khoan}" de tranh xung dot route


@router.get("/trung-tam", response_model=List[TrungTamResponse])
def danh_sach_trung_tam(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.lay_danh_sach_trung_tam(db=db)


@router.post("/trung-tam", response_model=TrungTamResponse)
def tao_trung_tam(
    data: TrungTamCreateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.tao_trung_tam(db=db, data=data)


@router.put("/trung-tam/{ma_trung_tam}", response_model=TrungTamResponse)
def cap_nhat_trung_tam(
    ma_trung_tam: int,
    data: TrungTamUpdateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.cap_nhat_trung_tam(
        db=db, ma_trung_tam=ma_trung_tam, data=data
    )


@router.delete("/trung-tam/{ma_trung_tam}", response_model=MessageResponse)
def xoa_trung_tam(
    ma_trung_tam: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.xoa_trung_tam(db=db, ma_trung_tam=ma_trung_tam)


# ================= Tai khoan Ban to chuc =================


@router.post("", response_model=BanToChucResponse)
def tao_ban_to_chuc(
    data: BanToChucCreateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.tao_ban_to_chuc(db=db, data=data)


@router.get("/{ma_tai_khoan}/su-kien", response_model=List[SuKienCuaBanToChucResponse])
def su_kien_cua_ban_to_chuc(
    ma_tai_khoan: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.lay_su_kien_cua_ban_to_chuc(
        db=db, ma_tai_khoan=ma_tai_khoan
    )


@router.put("/{ma_tai_khoan}", response_model=BanToChucResponse)
def cap_nhat_ban_to_chuc(
    ma_tai_khoan: int,
    data: BanToChucUpdateRequest,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.cap_nhat_ban_to_chuc(
        db=db, ma_tai_khoan=ma_tai_khoan, data=data
    )


@router.patch("/{ma_tai_khoan}/trang-thai", response_model=MessageResponse)
def doi_trang_thai_ban_to_chuc(
    ma_tai_khoan: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.doi_trang_thai_ban_to_chuc(
        db=db, ma_tai_khoan=ma_tai_khoan
    )


@router.delete("/{ma_tai_khoan}", response_model=MessageResponse)
def xoa_ban_to_chuc(
    ma_tai_khoan: int,
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_bantochuc_service.xoa_ban_to_chuc(db=db, ma_tai_khoan=ma_tai_khoan)
