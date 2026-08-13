from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.sukien import SuKien
from app.models.danhmuc import LoaiSuKien
from app.models.taikhoan import TaiKhoan
from app.models.dangky import DangKySuKien
from app.services.sukien_service import tinh_trang_thai_su_kien
from app.schemas.admin_sukien_schema import (
    SuKienAdminResponse,
    ThongKeSuKienAdminResponse,
    MessageResponse,
)

NHOM_TRANG_THAI = {
    "SapMo": "coming",
    "DangMo": "coming",
    "DongDangKy": "coming",
    "DangDienRa": "running",
    "KetThuc": "finish",
    "DaKhoa": "locked",
}


def _dem_dang_ky(db: Session, ma_su_kien: int) -> int:
    return (
        db.query(DangKySuKien)
        .filter(
            DangKySuKien.MaSuKien == ma_su_kien,
            DangKySuKien.TrangThai != "DaHuy",
        )
        .count()
    )


def _to_response(item: SuKien, db: Session) -> SuKienAdminResponse:
    return SuKienAdminResponse(
        ma_su_kien=item.MaSuKien,
        ten_su_kien=item.TenSuKien,
        dia_diem=item.DiaDiem,
        ten_loai_su_kien=item.loai_su_kien.TenLoaiSuKien if item.loai_su_kien else "",
        ma_loai_su_kien=item.MaLoaiSuKien,
        ten_nguoi_tao=item.nguoi_tao.HoTen if item.nguoi_tao else "",
        thoi_gian_bat_dau=item.ThoiGianBatDau,
        thoi_gian_ket_thuc=item.ThoiGianKetThuc,
        so_luong_toi_da=item.SoLuongToiDa,
        so_luong_da_dang_ky=_dem_dang_ky(db, item.MaSuKien),
        trang_thai=tinh_trang_thai_su_kien(item),
    )


def lay_danh_sach_su_kien(
    db: Session,
    tu_khoa: str | None = None,
    ma_loai_su_kien: int | None = None,
    nhom_trang_thai: str | None = None,
) -> list[SuKienAdminResponse]:

    query = db.query(SuKien)

    if tu_khoa:
        query = query.filter(SuKien.TenSuKien.like(f"%{tu_khoa}%"))

    if ma_loai_su_kien:
        query = query.filter(SuKien.MaLoaiSuKien == ma_loai_su_kien)

    ds = query.order_by(SuKien.MaSuKien.desc()).all()

    ket_qua = [_to_response(item, db) for item in ds]

    if nhom_trang_thai and nhom_trang_thai != "all":
        ket_qua = [
            item for item in ket_qua
            if NHOM_TRANG_THAI.get(item.trang_thai) == nhom_trang_thai
        ]

    return ket_qua


def lay_thong_ke_su_kien(db: Session) -> ThongKeSuKienAdminResponse:

    ds = db.query(SuKien).all()

    sap_dien_ra = 0
    dang_dien_ra = 0
    da_ket_thuc = 0

    for item in ds:
        nhom = NHOM_TRANG_THAI.get(tinh_trang_thai_su_kien(item))
        if nhom == "coming":
            sap_dien_ra += 1
        elif nhom == "running":
            dang_dien_ra += 1
        elif nhom == "finish":
            da_ket_thuc += 1

    return ThongKeSuKienAdminResponse(
        tong_su_kien=len(ds),
        sap_dien_ra=sap_dien_ra,
        dang_dien_ra=dang_dien_ra,
        da_ket_thuc=da_ket_thuc,
    )


def _lay_hoac_404(db: Session, ma_su_kien: int) -> SuKien:

    item = (
        db.query(SuKien)
        .filter(SuKien.MaSuKien == ma_su_kien)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay su kien",
        )

    return item


def doi_trang_thai_khoa(
    db: Session,
    ma_su_kien: int,
) -> MessageResponse:

    item = _lay_hoac_404(db, ma_su_kien)

    if item.TrangThai == "DaKhoa":
        item.TrangThai = "DangMo"
        thong_diep = "Da mo khoa su kien"
    else:
        item.TrangThai = "DaKhoa"
        thong_diep = "Da khoa su kien"

    db.commit()

    return MessageResponse(message=thong_diep)


def xoa_su_kien(
    db: Session,
    ma_su_kien: int,
) -> MessageResponse:

    item = _lay_hoac_404(db, ma_su_kien)

    so_dang_ky = _dem_dang_ky(db, ma_su_kien)

    if so_dang_ky > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Khong the xoa vi da co {so_dang_ky} sinh vien dang ky. Hay khoa su kien thay vi xoa.",
        )

    try:
        db.delete(item)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the xoa su kien nay vi con du lieu lien quan",
        )

    return MessageResponse(message="Da xoa su kien")
