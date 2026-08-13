from datetime import datetime

from sqlalchemy import func, extract
from sqlalchemy.orm import Session

from app.models.taikhoan import TaiKhoan
from app.models.sukien import SuKien
from app.models.danhmuc import LoaiSuKien
from app.models.dangky import DangKySuKien
from app.models.diemrenluyen import DiemRenLuyen, LichSuDiemRenLuyen
from app.schemas.admin_baocao_schema import (
    TongQuanBaoCaoResponse,
    SuKienTheoThangItem,
    DangKyTheoThangItem,
    PhanLoaiSuKienItem,
    TopSuKienItem,
    TopSinhVienItem,
    DanhGiaHeThongResponse,
    BaoCaoTongHopResponse,
)
from app.services.sukien_service import tinh_trang_thai_su_kien

MA_VAI_TRO_SINH_VIEN = 3
CAC_TRANG_THAI_THAM_GIA = ("DaDiemDanh", "HoanThanh")
TRANG_THAI_DANG_KY_HOP_LE = ("DaDangKy", "DaDiemDanh", "HoanThanh")


def _loc_su_kien(db: Session, nam: int, thang: int | None):
    query = db.query(SuKien).filter(extract("year", SuKien.ThoiGianBatDau) == nam)
    if thang:
        query = query.filter(extract("month", SuKien.ThoiGianBatDau) == thang)
    return query


def _loc_dang_ky(db: Session, nam: int, thang: int | None):
    query = db.query(DangKySuKien).filter(extract("year", DangKySuKien.ThoiGianDangKy) == nam)
    if thang:
        query = query.filter(extract("month", DangKySuKien.ThoiGianDangKy) == thang)
    return query


def lay_bao_cao_tong_hop(
    db: Session, nam: int | None = None, thang: int | None = None
) -> BaoCaoTongHopResponse:

    nam = nam or datetime.now().year

    # ================= Tổng quan =================

    tong_su_kien = _loc_su_kien(db, nam, thang).count()

    tong_sinh_vien = (
        db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_SINH_VIEN).count()
    )

    tong_luot_dang_ky = (
        _loc_dang_ky(db, nam, thang)
        .filter(DangKySuKien.TrangThai.in_(TRANG_THAI_DANG_KY_HOP_LE))
        .count()
    )

    diem_query = db.query(func.coalesce(func.sum(LichSuDiemRenLuyen.SoDiem), 0)).filter(
        extract("year", LichSuDiemRenLuyen.ThoiGian) == nam
    )
    if thang:
        diem_query = diem_query.filter(extract("month", LichSuDiemRenLuyen.ThoiGian) == thang)
    tong_diem_ren_luyen = diem_query.scalar() or 0

    tong_quan = TongQuanBaoCaoResponse(
        tong_su_kien=tong_su_kien,
        tong_sinh_vien=tong_sinh_vien,
        tong_luot_dang_ky=tong_luot_dang_ky,
        tong_diem_ren_luyen_da_cong=tong_diem_ren_luyen,
    )

    # ================= Sự kiện theo tháng (cả năm) =================

    ds_sk_thang = (
        db.query(
            extract("month", SuKien.ThoiGianBatDau).label("thang"),
            func.count(SuKien.MaSuKien).label("so_luong"),
        )
        .filter(extract("year", SuKien.ThoiGianBatDau) == nam)
        .group_by("thang")
        .all()
    )
    dict_sk_thang = {int(r.thang): r.so_luong for r in ds_sk_thang}
    su_kien_theo_thang = [
        SuKienTheoThangItem(thang=t, so_luong=dict_sk_thang.get(t, 0)) for t in range(1, 13)
    ]

    # ================= Đăng ký theo tháng (cả năm) =================

    ds_dk_thang = (
        db.query(
            extract("month", DangKySuKien.ThoiGianDangKy).label("thang"),
            func.count(DangKySuKien.MaDangKy).label("so_luong"),
        )
        .filter(
            extract("year", DangKySuKien.ThoiGianDangKy) == nam,
            DangKySuKien.TrangThai.in_(TRANG_THAI_DANG_KY_HOP_LE),
        )
        .group_by("thang")
        .all()
    )
    dict_dk_thang = {int(r.thang): r.so_luong for r in ds_dk_thang}
    dang_ky_theo_thang = [
        DangKyTheoThangItem(thang=t, so_luong=dict_dk_thang.get(t, 0)) for t in range(1, 13)
    ]

    # ================= Phân loại sự kiện =================

    ds_phan_loai = (
        db.query(LoaiSuKien.TenLoaiSuKien, func.count(SuKien.MaSuKien))
        .join(SuKien, SuKien.MaLoaiSuKien == LoaiSuKien.MaLoaiSuKien)
        .filter(extract("year", SuKien.ThoiGianBatDau) == nam)
        .group_by(LoaiSuKien.TenLoaiSuKien)
        .all()
    )
    if thang:
        ds_phan_loai = (
            db.query(LoaiSuKien.TenLoaiSuKien, func.count(SuKien.MaSuKien))
            .join(SuKien, SuKien.MaLoaiSuKien == LoaiSuKien.MaLoaiSuKien)
            .filter(
                extract("year", SuKien.ThoiGianBatDau) == nam,
                extract("month", SuKien.ThoiGianBatDau) == thang,
            )
            .group_by(LoaiSuKien.TenLoaiSuKien)
            .all()
        )

    phan_loai_su_kien = [
        PhanLoaiSuKienItem(ten_loai_su_kien=ten, so_luong=sl) for ten, sl in ds_phan_loai
    ]

    # ================= Top sự kiện theo lượt đăng ký =================

    top_sk_raw = (
        db.query(
            SuKien,
            LoaiSuKien.TenLoaiSuKien,
            func.count(DangKySuKien.MaDangKy).label("so_dk"),
        )
        .outerjoin(
            DangKySuKien,
            (DangKySuKien.MaSuKien == SuKien.MaSuKien)
            & (DangKySuKien.TrangThai.in_(TRANG_THAI_DANG_KY_HOP_LE)),
        )
        .join(LoaiSuKien, LoaiSuKien.MaLoaiSuKien == SuKien.MaLoaiSuKien)
        .filter(extract("year", SuKien.ThoiGianBatDau) == nam)
    )
    if thang:
        top_sk_raw = top_sk_raw.filter(extract("month", SuKien.ThoiGianBatDau) == thang)

    top_sk_raw = (
        top_sk_raw.group_by(SuKien.MaSuKien, LoaiSuKien.TenLoaiSuKien)
        .order_by(func.count(DangKySuKien.MaDangKy).desc())
        .limit(10)
        .all()
    )

    top_su_kien = [
        TopSuKienItem(
            ma_su_kien=sk.MaSuKien,
            ten_su_kien=sk.TenSuKien,
            ten_loai_su_kien=ten_loai,
            so_luong_dang_ky=so_dk,
            so_luong_toi_da=sk.SoLuongToiDa,
            diem_cong=sk.DiemCong or 0,
            trang_thai=tinh_trang_thai_su_kien(sk),
        )
        for sk, ten_loai, so_dk in top_sk_raw
    ]

    # ================= Top sinh viên tích cực =================

    top_sv_raw = (
        db.query(
            TaiKhoan,
            func.count(DangKySuKien.MaDangKy).label("so_sk"),
        )
        .join(DangKySuKien, DangKySuKien.MaTaiKhoan == TaiKhoan.MaTaiKhoan)
        .filter(
            TaiKhoan.MaVaiTro == MA_VAI_TRO_SINH_VIEN,
            DangKySuKien.TrangThai.in_(CAC_TRANG_THAI_THAM_GIA),
            extract("year", DangKySuKien.ThoiGianDangKy) == nam,
        )
    )
    if thang:
        top_sv_raw = top_sv_raw.filter(extract("month", DangKySuKien.ThoiGianDangKy) == thang)

    top_sv_raw = (
        top_sv_raw.group_by(TaiKhoan.MaTaiKhoan)
        .order_by(func.count(DangKySuKien.MaDangKy).desc())
        .limit(10)
        .all()
    )

    top_sinh_vien = []
    for sv, so_sk in top_sv_raw:
        diem_gan_nhat = (
            db.query(DiemRenLuyen)
            .filter(DiemRenLuyen.MaTaiKhoan == sv.MaTaiKhoan)
            .order_by(DiemRenLuyen.MaDiemRenLuyen.desc())
            .first()
        )
        top_sinh_vien.append(
            TopSinhVienItem(
                ma_tai_khoan=sv.MaTaiKhoan,
                mssv=sv.MSSV,
                ho_ten=sv.HoTen,
                so_su_kien_tham_gia=so_sk,
                tong_diem_ren_luyen=diem_gan_nhat.TongDiem if diem_gan_nhat else 0,
            )
        )

    # ================= Đánh giá hệ thống =================

    tong_dang_ky_tat_ca = _loc_dang_ky(db, nam, thang).count()
    tong_da_tham_gia = (
        _loc_dang_ky(db, nam, thang)
        .filter(DangKySuKien.TrangThai.in_(CAC_TRANG_THAI_THAM_GIA))
        .count()
    )
    ty_le_tham_gia = (
        round(tong_da_tham_gia / tong_dang_ky_tat_ca * 100, 1) if tong_dang_ky_tat_ca else 0.0
    )

    so_thang_co_du_lieu = sum(1 for item in su_kien_theo_thang if item.so_luong > 0) or 1
    su_kien_trung_binh_thang = round(tong_su_kien / so_thang_co_du_lieu, 1) if not thang else float(tong_su_kien)

    trung_binh_sv_moi_su_kien = (
        round(tong_luot_dang_ky / tong_su_kien, 1) if tong_su_kien else 0.0
    )

    danh_gia = DanhGiaHeThongResponse(
        ty_le_tham_gia=ty_le_tham_gia,
        su_kien_trung_binh_thang=su_kien_trung_binh_thang,
        trung_binh_sv_moi_su_kien=trung_binh_sv_moi_su_kien,
    )

    return BaoCaoTongHopResponse(
        tong_quan=tong_quan,
        su_kien_theo_thang=su_kien_theo_thang,
        dang_ky_theo_thang=dang_ky_theo_thang,
        phan_loai_su_kien=phan_loai_su_kien,
        top_su_kien=top_su_kien,
        top_sinh_vien=top_sinh_vien,
        danh_gia=danh_gia,
    )
