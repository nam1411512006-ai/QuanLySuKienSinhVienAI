from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.danhgia import DanhGia
from app.models.dangky import DangKySuKien
from app.models.sukien import SuKien
from app.schemas.danhgia_schema import (
    DanhGiaCreate,
    DanhGiaMessage,
    SuKienChoDanhGia,
)

# Chỉ cho đánh giá khi đã thực sự tham gia (đã điểm danh / đã hoàn thành)
TRANG_THAI_DUOC_DANH_GIA = ["DaDiemDanh", "HoanThanh"]


# =====================================================
# DANH SÁCH SỰ KIỆN CÓ THỂ ĐÁNH GIÁ
# (đã tham gia và chưa đánh giá)
# =====================================================

def lay_su_kien_cho_danh_gia(
    db: Session,
    ma_tai_khoan: int,
) -> list[SuKienChoDanhGia]:

    da_danh_gia_ids = {
        row.MaSuKien
        for row in (
            db.query(DanhGia.MaSuKien)
            .filter(DanhGia.MaTaiKhoan == ma_tai_khoan)
            .all()
        )
    }

    ket_qua = (
        db.query(SuKien)
        .join(
            DangKySuKien,
            DangKySuKien.MaSuKien == SuKien.MaSuKien,
        )
        .filter(
            DangKySuKien.MaTaiKhoan == ma_tai_khoan,
            DangKySuKien.TrangThai.in_(TRANG_THAI_DUOC_DANH_GIA),
        )
        .order_by(SuKien.ThoiGianBatDau.desc())
        .all()
    )

    return [
        SuKienChoDanhGia(
            ma_su_kien=item.MaSuKien,
            ten_su_kien=item.TenSuKien,
            dia_diem=item.DiaDiem,
            thoi_gian_bat_dau=item.ThoiGianBatDau,
            anh_bia=item.AnhBia,
        )
        for item in ket_qua
        if item.MaSuKien not in da_danh_gia_ids
    ]


# =====================================================
# GỬI ĐÁNH GIÁ
# =====================================================

def tao_danh_gia(
    db: Session,
    ma_su_kien: int,
    ma_tai_khoan: int,
    data: DanhGiaCreate,
) -> DanhGiaMessage:

    if data.so_sao < 1 or data.so_sao > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="So sao phai tu 1 den 5",
        )

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

    # Phải đã tham gia sự kiện mới được đánh giá
    dang_ky = (
        db.query(DangKySuKien)
        .filter(
            DangKySuKien.MaSuKien == ma_su_kien,
            DangKySuKien.MaTaiKhoan == ma_tai_khoan,
            DangKySuKien.TrangThai.in_(TRANG_THAI_DUOC_DANH_GIA),
        )
        .first()
    )

    if not dang_ky:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ban chua tham gia su kien nay nen khong the danh gia",
        )

    # Không cho đánh giá trùng
    da_danh_gia = (
        db.query(DanhGia)
        .filter(
            DanhGia.MaSuKien == ma_su_kien,
            DanhGia.MaTaiKhoan == ma_tai_khoan,
        )
        .first()
    )

    if da_danh_gia:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ban da danh gia su kien nay roi",
        )

    danh_gia = DanhGia(
        MaTaiKhoan=ma_tai_khoan,
        MaSuKien=ma_su_kien,
        SoSao=data.so_sao,
        NoiDung=data.noi_dung,
        ThoiGian=datetime.now(),
    )

    db.add(danh_gia)
    db.commit()

    return DanhGiaMessage(
        message="Gui danh gia thanh cong",
    )
