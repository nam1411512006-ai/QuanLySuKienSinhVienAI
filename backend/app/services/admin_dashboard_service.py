from datetime import datetime, timedelta

from sqlalchemy import func, extract
from sqlalchemy.orm import Session

from app.models.taikhoan import TaiKhoan, TrungTam
from app.models.sukien import SuKien
from app.models.dangky import DangKySuKien
from app.models.diemdanh import DiemDanh
from app.models.thongbao import ThongBao
from app.services.sukien_service import tinh_trang_thai_su_kien
from app.schemas.admin_dashboard_schema import (
    TheThongKeItem,
    SuKienTheoThangItem,
    PhanBoTrangThaiSuKien,
    SuKienGanDayItem,
    ThongBaoGanDayItem,
    HoatDongGanDayItem,
    DashboardResponse,
)

MA_VAI_TRO_BAN_TO_CHUC = 2
MA_VAI_TRO_SINH_VIEN = 3
TRANG_THAI_DANG_KY_HOP_LE = ("DaDangKy", "DaDiemDanh", "HoanThanh")


def _the_thong_ke(db: Session) -> TheThongKeItem:

    now = datetime.now()
    dau_thang_nay = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    dau_thang_truoc = (dau_thang_nay - timedelta(days=1)).replace(day=1)

    tong_su_kien = db.query(SuKien).count()

    su_kien_thang_nay = db.query(SuKien).filter(SuKien.NgayTao >= dau_thang_nay).count()
    su_kien_thang_truoc = (
        db.query(SuKien)
        .filter(SuKien.NgayTao >= dau_thang_truoc, SuKien.NgayTao < dau_thang_nay)
        .count()
    )

    tong_sinh_vien = db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_SINH_VIEN).count()
    sinh_vien_moi_thang_nay = (
        db.query(TaiKhoan)
        .filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_SINH_VIEN, TaiKhoan.NgayTao >= dau_thang_nay)
        .count()
    )

    tong_ban_to_chuc = db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_BAN_TO_CHUC).count()
    ban_to_chuc_hoat_dong = (
        db.query(TaiKhoan)
        .filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_BAN_TO_CHUC, TaiKhoan.TrangThai == 1)
        .count()
    )

    dau_ngay = now.replace(hour=0, minute=0, second=0, microsecond=0)
    cuoi_ngay = dau_ngay + timedelta(days=1)

    diem_danh_hom_nay = (
        db.query(DiemDanh)
        .filter(DiemDanh.ThoiGianQuet >= dau_ngay, DiemDanh.ThoiGianQuet < cuoi_ngay)
        .count()
    )

    dang_ky_su_kien_dien_ra_hom_nay = (
        db.query(DangKySuKien)
        .join(SuKien, DangKySuKien.MaSuKien == SuKien.MaSuKien)
        .filter(
            SuKien.ThoiGianBatDau < cuoi_ngay,
            SuKien.ThoiGianKetThuc >= dau_ngay,
            DangKySuKien.TrangThai.in_(TRANG_THAI_DANG_KY_HOP_LE),
        )
        .count()
    )

    ty_le_diem_danh = (
        round(diem_danh_hom_nay / dang_ky_su_kien_dien_ra_hom_nay * 100, 1)
        if dang_ky_su_kien_dien_ra_hom_nay
        else 0.0
    )

    return TheThongKeItem(
        tong_su_kien=tong_su_kien,
        thay_doi_su_kien_thang_nay=su_kien_thang_nay - su_kien_thang_truoc,
        tong_sinh_vien=tong_sinh_vien,
        sinh_vien_moi_thang_nay=sinh_vien_moi_thang_nay,
        tong_ban_to_chuc=tong_ban_to_chuc,
        ban_to_chuc_dang_hoat_dong=ban_to_chuc_hoat_dong,
        diem_danh_hom_nay=diem_danh_hom_nay,
        ty_le_diem_danh_hom_nay=ty_le_diem_danh,
    )


def _su_kien_theo_thang(db: Session) -> list[SuKienTheoThangItem]:

    nam = datetime.now().year

    ds = (
        db.query(
            extract("month", SuKien.ThoiGianBatDau).label("thang"),
            func.count(SuKien.MaSuKien).label("so_luong"),
        )
        .filter(extract("year", SuKien.ThoiGianBatDau) == nam)
        .group_by("thang")
        .all()
    )
    dict_thang = {int(r.thang): r.so_luong for r in ds}

    return [SuKienTheoThangItem(thang=t, so_luong=dict_thang.get(t, 0)) for t in range(1, 13)]


def _phan_bo_trang_thai(db: Session) -> PhanBoTrangThaiSuKien:

    ds = db.query(SuKien).all()
    tong = len(ds)

    if tong == 0:
        return PhanBoTrangThaiSuKien(hoan_thanh=0, dang_dien_ra=0, sap_dien_ra=0)

    hoan_thanh = 0
    dang_dien_ra = 0
    sap_dien_ra = 0

    for item in ds:
        trang_thai_thuc_te = tinh_trang_thai_su_kien(item)
        if trang_thai_thuc_te == "KetThuc":
            hoan_thanh += 1
        elif trang_thai_thuc_te == "DangDienRa":
            dang_dien_ra += 1
        else:
            # SapMo, DangMo, DongDangKy, DaKhoa -> gộp chung "sắp diễn ra"
            sap_dien_ra += 1

    return PhanBoTrangThaiSuKien(
        hoan_thanh=round(hoan_thanh / tong * 100, 1),
        dang_dien_ra=round(dang_dien_ra / tong * 100, 1),
        sap_dien_ra=round(sap_dien_ra / tong * 100, 1),
    )


def _su_kien_gan_day(db: Session, gioi_han: int = 5) -> list[SuKienGanDayItem]:

    ds = (
        db.query(SuKien, TaiKhoan, TrungTam)
        .outerjoin(TaiKhoan, SuKien.MaNguoiTao == TaiKhoan.MaTaiKhoan)
        .outerjoin(TrungTam, TaiKhoan.MaTrungTam == TrungTam.MaTrungTam)
        .order_by(SuKien.MaSuKien.desc())
        .limit(gioi_han)
        .all()
    )

    ket_qua = []
    for sk, nguoi_tao, trung_tam in ds:
        so_luong_dang_ky = (
            db.query(DangKySuKien)
            .filter(
                DangKySuKien.MaSuKien == sk.MaSuKien,
                DangKySuKien.TrangThai.in_(TRANG_THAI_DANG_KY_HOP_LE),
            )
            .count()
        )
        ten_btc = (trung_tam.TenTrungTam if trung_tam else None) or (nguoi_tao.HoTen if nguoi_tao else None)
        ket_qua.append(
            SuKienGanDayItem(
                ma_su_kien=sk.MaSuKien,
                anh_bia=sk.AnhBia,
                ten_su_kien=sk.TenSuKien,
                ten_ban_to_chuc=ten_btc,
                thoi_gian_bat_dau=sk.ThoiGianBatDau,
                so_luong_dang_ky=so_luong_dang_ky,
                trang_thai=tinh_trang_thai_su_kien(sk),
            )
        )

    return ket_qua


def _thong_bao_gan_day(db: Session, gioi_han: int = 5) -> list[ThongBaoGanDayItem]:

    ds = (
        db.query(ThongBao)
        .order_by(ThongBao.ThoiGianGui.desc())
        .limit(gioi_han)
        .all()
    )

    return [
        ThongBaoGanDayItem(
            ma_thong_bao=tb.MaThongBao,
            tieu_de=tb.TieuDe,
            noi_dung=tb.NoiDung,
            loai_thong_bao=tb.LoaiThongBao,
            thoi_gian_gui=tb.ThoiGianGui,
        )
        for tb in ds
    ]


def _hoat_dong_gan_day(db: Session, gioi_han: int = 8) -> list[HoatDongGanDayItem]:
    """
    He thong hien chua co bang audit-log rieng duoc ghi lai o moi thao tac,
    nen "hoat dong gan day" duoc tong hop tu du lieu that co san (dang ky su
    kien, su kien moi tao, luot diem danh) thay vi bia du lieu gia.
    """

    hoat_dong: list[HoatDongGanDayItem] = []

    dang_ky_gan_day = (
        db.query(DangKySuKien, TaiKhoan, SuKien)
        .join(TaiKhoan, DangKySuKien.MaTaiKhoan == TaiKhoan.MaTaiKhoan)
        .join(SuKien, DangKySuKien.MaSuKien == SuKien.MaSuKien)
        .order_by(DangKySuKien.ThoiGianDangKy.desc())
        .limit(gioi_han)
        .all()
    )
    for dk, sv, sk in dang_ky_gan_day:
        if dk.ThoiGianDangKy:
            hoat_dong.append(
                HoatDongGanDayItem(
                    loai="dang_ky",
                    noi_dung=f"{sv.HoTen} vừa đăng ký sự kiện '{sk.TenSuKien}'",
                    thoi_gian=dk.ThoiGianDangKy,
                )
            )

    su_kien_moi = db.query(SuKien).order_by(SuKien.MaSuKien.desc()).limit(gioi_han).all()
    for sk in su_kien_moi:
        if sk.NgayTao:
            hoat_dong.append(
                HoatDongGanDayItem(
                    loai="su_kien_moi",
                    noi_dung=f"Sự kiện mới được tạo: '{sk.TenSuKien}'",
                    thoi_gian=sk.NgayTao,
                )
            )

    diem_danh_gan_day = (
        db.query(DiemDanh, TaiKhoan, SuKien)
        .join(DangKySuKien, DiemDanh.MaDangKy == DangKySuKien.MaDangKy)
        .join(TaiKhoan, DangKySuKien.MaTaiKhoan == TaiKhoan.MaTaiKhoan)
        .join(SuKien, DangKySuKien.MaSuKien == SuKien.MaSuKien)
        .order_by(DiemDanh.ThoiGianQuet.desc())
        .limit(gioi_han)
        .all()
    )
    for dd, sv, sk in diem_danh_gan_day:
        if dd.ThoiGianQuet:
            hoat_dong.append(
                HoatDongGanDayItem(
                    loai="diem_danh",
                    noi_dung=f"{sv.HoTen} đã điểm danh sự kiện '{sk.TenSuKien}'",
                    thoi_gian=dd.ThoiGianQuet,
                )
            )

    hoat_dong.sort(key=lambda x: x.thoi_gian, reverse=True)

    return hoat_dong[:gioi_han]


def lay_du_lieu_dashboard(db: Session) -> DashboardResponse:
    return DashboardResponse(
        the_thong_ke=_the_thong_ke(db),
        su_kien_theo_thang=_su_kien_theo_thang(db),
        phan_bo_trang_thai=_phan_bo_trang_thai(db),
        su_kien_gan_day=_su_kien_gan_day(db),
        thong_bao_gan_day=_thong_bao_gan_day(db),
        hoat_dong_gan_day=_hoat_dong_gan_day(db),
    )
