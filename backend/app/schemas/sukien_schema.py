from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SuKienCreate(BaseModel):
    ma_loai_su_kien: int
    ma_trung_tam: int
    ten_su_kien: str
    mo_ta: str | None = None
    dia_diem: str | None = None
    # Thời gian đăng ký
    thoi_gian_bat_dau_dang_ky: datetime | None = None
    thoi_gian_ket_thuc_dang_ky: datetime | None = None

    # Thời gian diễn ra
    thoi_gian_bat_dau: datetime
    thoi_gian_ket_thuc: datetime
    so_luong_toi_da: int | None = None
    diem_cong: int = 0
    trang_thai: str = "DangMo"
    anh_bia: str | None = None


class SuKienUpdate(BaseModel):
    ma_loai_su_kien: int
    ma_trung_tam: int
    ten_su_kien: str
    mo_ta: str | None = None
    dia_diem: str | None = None
    # Thời gian đăng ký
    thoi_gian_bat_dau_dang_ky: datetime | None = None
    thoi_gian_ket_thuc_dang_ky: datetime | None = None

    # Thời gian diễn ra
    thoi_gian_bat_dau: datetime
    thoi_gian_ket_thuc: datetime
    so_luong_toi_da: int | None = None
    diem_cong: int = 0
    trang_thai: str = "DangMo"
    anh_bia: str | None = None


class SuKienResponse(BaseModel):
    ma_su_kien: int
    ten_su_kien: str
    mo_ta: str | None
    dia_diem: str | None

    # Thời gian đăng ký
    thoi_gian_bat_dau_dang_ky: datetime | None
    thoi_gian_ket_thuc_dang_ky: datetime | None

    # Thời gian diễn ra
    thoi_gian_bat_dau: datetime
    thoi_gian_ket_thuc: datetime
    so_luong_toi_da: int | None
    diem_cong: int
    trang_thai: str | None
    anh_bia: str | None

    ten_loai_su_kien: str | None = None
    so_luong_da_dang_ky: int = 0

    model_config = ConfigDict(from_attributes=True)