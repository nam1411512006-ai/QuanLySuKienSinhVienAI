from datetime import datetime

from pydantic import BaseModel


class TheThongKeItem(BaseModel):
    tong_su_kien: int
    thay_doi_su_kien_thang_nay: int
    tong_sinh_vien: int
    sinh_vien_moi_thang_nay: int
    tong_ban_to_chuc: int
    ban_to_chuc_dang_hoat_dong: int
    diem_danh_hom_nay: int
    ty_le_diem_danh_hom_nay: float


class SuKienTheoThangItem(BaseModel):
    thang: int
    so_luong: int


class PhanBoTrangThaiSuKien(BaseModel):
    hoan_thanh: float
    dang_dien_ra: float
    sap_dien_ra: float


class SuKienGanDayItem(BaseModel):
    ma_su_kien: int
    anh_bia: str | None = None
    ten_su_kien: str
    ten_ban_to_chuc: str | None = None
    thoi_gian_bat_dau: datetime | None = None
    so_luong_dang_ky: int
    trang_thai: str


class ThongBaoGanDayItem(BaseModel):
    ma_thong_bao: int
    tieu_de: str
    noi_dung: str | None = None
    loai_thong_bao: str | None = None
    thoi_gian_gui: datetime | None = None


class HoatDongGanDayItem(BaseModel):
    loai: str  # "dang_ky" | "su_kien_moi" | "diem_danh"
    noi_dung: str
    thoi_gian: datetime


class DashboardResponse(BaseModel):
    the_thong_ke: TheThongKeItem
    su_kien_theo_thang: list[SuKienTheoThangItem]
    phan_bo_trang_thai: PhanBoTrangThaiSuKien
    su_kien_gan_day: list[SuKienGanDayItem]
    thong_bao_gan_day: list[ThongBaoGanDayItem]
    hoat_dong_gan_day: list[HoatDongGanDayItem]
