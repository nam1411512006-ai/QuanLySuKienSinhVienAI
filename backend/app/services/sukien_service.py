from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.sukien import SuKien
from app.models.dangky import DangKySuKien
from app.schemas.sukien_schema import (
    SuKienCreate,
    SuKienUpdate,
    SuKienResponse,
)


# =====================================================
# MAP RESPONSE
# =====================================================

def tinh_trang_thai_su_kien(item: SuKien) -> str:

    # Admin đã khóa thủ công -> luôn ưu tiên trạng thái này
    if item.TrangThai == "DaKhoa":
        return "DaKhoa"

    now = datetime.now()

    # Chưa mở đăng ký
    if (
        item.ThoiGianBatDauDangKy
        and now < item.ThoiGianBatDauDangKy
    ):
        return "SapMo"

    # Đang mở đăng ký
    if (
        item.ThoiGianBatDauDangKy
        and item.ThoiGianKetThucDangKy
        and item.ThoiGianBatDauDangKy <= now <= item.ThoiGianKetThucDangKy
    ):
        return "DangMo"

    # Đã đóng đăng ký nhưng chưa diễn ra
    if (
        item.ThoiGianKetThucDangKy
        and now > item.ThoiGianKetThucDangKy
        and now < item.ThoiGianBatDau
    ):
        return "DongDangKy"

    # Đang diễn ra
    if item.ThoiGianBatDau <= now <= item.ThoiGianKetThuc:
        return "DangDienRa"

    # Đã kết thúc
    if now > item.ThoiGianKetThuc:
        return "KetThuc"

    return "SapMo"


def map_su_kien_response(
    item: SuKien,
    db: Session,
) -> SuKienResponse:

    so_luong_da_dang_ky = (
        db.query(DangKySuKien)
        .filter(
            DangKySuKien.MaSuKien == item.MaSuKien,
            DangKySuKien.TrangThai != "DaHuy",
        )
        .count()
    )

    return SuKienResponse(

        ma_su_kien=item.MaSuKien,

        ten_su_kien=item.TenSuKien,

        mo_ta=item.MoTa,

        dia_diem=item.DiaDiem,

        thoi_gian_bat_dau_dang_ky=item.ThoiGianBatDauDangKy,

        thoi_gian_ket_thuc_dang_ky=item.ThoiGianKetThucDangKy,

        thoi_gian_bat_dau=item.ThoiGianBatDau,

        thoi_gian_ket_thuc=item.ThoiGianKetThuc,

        so_luong_toi_da=item.SoLuongToiDa,

        diem_cong=item.DiemCong or 0,

        trang_thai=tinh_trang_thai_su_kien(item),

        anh_bia=item.AnhBia,

        ten_loai_su_kien="Sự kiện",

        so_luong_da_dang_ky=so_luong_da_dang_ky,

    )


# =====================================================
# LẤY DANH SÁCH
# =====================================================

def get_all_su_kien(db: Session) -> list[SuKienResponse]:
    su_kien_list = (
        db.query(SuKien)
        .order_by(SuKien.ThoiGianBatDau.desc())
        .all()
    )

    return [
    map_su_kien_response(item, db)
    for item in su_kien_list
]


# =====================================================
# CHI TIẾT
# =====================================================

def get_su_kien_by_id(
    db: Session,
    ma_su_kien: int,
) -> SuKienResponse:

    su_kien = (
        db.query(SuKien)
        .filter(SuKien.MaSuKien == ma_su_kien)
        .first()
    )

    if not su_kien:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay su kien",
        )

    return map_su_kien_response(
    su_kien,
    db,
)


# =====================================================
# THÊM
# =====================================================

def create_su_kien(
    db: Session,
    data: SuKienCreate,
    ma_nguoi_tao: int,
):

    su_kien = SuKien(
        MaLoaiSuKien=data.ma_loai_su_kien,
        MaTrungTam=data.ma_trung_tam,
        MaNguoiTao=ma_nguoi_tao,
        TenSuKien=data.ten_su_kien,
        MoTa=data.mo_ta,
        DiaDiem=data.dia_diem,
        ThoiGianBatDauDangKy=data.thoi_gian_bat_dau_dang_ky,
        ThoiGianKetThucDangKy=data.thoi_gian_ket_thuc_dang_ky,

        ThoiGianBatDau=data.thoi_gian_bat_dau,
        ThoiGianKetThuc=data.thoi_gian_ket_thuc,
        SoLuongToiDa=data.so_luong_toi_da,
        DiemCong=data.diem_cong,
        TrangThai=data.trang_thai,
        AnhBia=data.anh_bia,
        NgayTao=datetime.now(),
    )

    db.add(su_kien)
    db.commit()
    db.refresh(su_kien)

    return map_su_kien_response(
    su_kien,
    db,
)


# =====================================================
# CẬP NHẬT
# =====================================================

def update_su_kien(
    db: Session,
    ma_su_kien: int,
    data: SuKienUpdate,
    ma_nguoi_tao: int,
):

    su_kien = (
        db.query(SuKien)
        .filter(
            SuKien.MaSuKien == ma_su_kien,
            SuKien.MaNguoiTao == ma_nguoi_tao,
        )
        .first()
    )

    if not su_kien:
        raise HTTPException(
            status_code=404,
            detail="Khong tim thay su kien",
        )

    su_kien.MaLoaiSuKien = data.ma_loai_su_kien
    su_kien.MaTrungTam = data.ma_trung_tam
    su_kien.TenSuKien = data.ten_su_kien
    su_kien.MoTa = data.mo_ta
    su_kien.DiaDiem = data.dia_diem
    su_kien.ThoiGianBatDauDangKy = data.thoi_gian_bat_dau_dang_ky
    su_kien.ThoiGianKetThucDangKy = data.thoi_gian_ket_thuc_dang_ky

    su_kien.ThoiGianBatDau = data.thoi_gian_bat_dau
    su_kien.ThoiGianKetThuc = data.thoi_gian_ket_thuc
    su_kien.SoLuongToiDa = data.so_luong_toi_da
    su_kien.DiemCong = data.diem_cong
    su_kien.TrangThai = data.trang_thai
    su_kien.AnhBia = data.anh_bia

    db.commit()
    db.refresh(su_kien)

    return map_su_kien_response(
    su_kien,
    db,
)


# =====================================================
# XÓA
# =====================================================

def delete_su_kien(
    db: Session,
    ma_su_kien: int,
    ma_nguoi_tao: int,
):

    su_kien = (
        db.query(SuKien)
        .filter(
            SuKien.MaSuKien == ma_su_kien,
            SuKien.MaNguoiTao == ma_nguoi_tao,
        )
        .first()
    )

    if not su_kien:
        raise HTTPException(
            status_code=404,
            detail="Khong tim thay su kien",
        )

    db.delete(su_kien)
    db.commit()

    return {
        "message": "Xoa su kien thanh cong"
    }