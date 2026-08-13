from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.sukien import SuKien
from app.models.dangky import DangKySuKien
from app.models.diemdanh import DiemDanh
from app.schemas.dashboard_schema import ThongKeSuKienResponse


def get_dashboard(db: Session, ma_nguoi_tao: int):

    tong_su_kien = (
        db.query(func.count(SuKien.MaSuKien))
        .filter(SuKien.MaNguoiTao == ma_nguoi_tao)
        .scalar()
    )

    tong_dang_ky = (
        db.query(func.count(DangKySuKien.MaDangKy))
        .join(
            SuKien,
            DangKySuKien.MaSuKien == SuKien.MaSuKien
        )
        .filter(
            SuKien.MaNguoiTao == ma_nguoi_tao
        )
        .scalar()
    )

    return {
        "tong_su_kien": tong_su_kien,
        "tong_dang_ky": tong_dang_ky,
    }
    
# =====================================================
# THỐNG KÊ CHI TIẾT TỪNG SỰ KIỆN
# =====================================================

def get_thong_ke(db: Session, ma_nguoi_tao: int):

    su_kien_list = (
        db.query(SuKien)
        .filter(SuKien.MaNguoiTao == ma_nguoi_tao)
        .order_by(SuKien.ThoiGianBatDau.desc())
        .all()
    )

    ket_qua = []

    for su_kien in su_kien_list:

        so_luong_dang_ky = (
            db.query(func.count(DangKySuKien.MaDangKy))
            .filter(DangKySuKien.MaSuKien == su_kien.MaSuKien)
            .scalar()
        )

        so_luong_diem_danh = (
            db.query(func.count(DiemDanh.MaDiemDanh))
            .join(
                DangKySuKien,
                DiemDanh.MaDangKy == DangKySuKien.MaDangKy,
            )
            .filter(DangKySuKien.MaSuKien == su_kien.MaSuKien)
            .scalar()
        )

        ty_le = 0.0

        if so_luong_dang_ky > 0:

            ty_le = round(
                (so_luong_diem_danh / so_luong_dang_ky) * 100,
                1,
            )

        ket_qua.append(
            ThongKeSuKienResponse(
                ma_su_kien=su_kien.MaSuKien,
                ten_su_kien=su_kien.TenSuKien,
                so_luong_dang_ky=so_luong_dang_ky,
                so_luong_diem_danh=so_luong_diem_danh,
                ty_le_diem_danh=ty_le,
            )
        )

    return ket_qua
