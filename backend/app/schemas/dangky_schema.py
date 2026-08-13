from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DangKyResponse(BaseModel):
    ma_dang_ky: int
    ma_su_kien: int
    ma_tai_khoan: int
    thoi_gian_dang_ky: datetime
    trang_thai: str

    model_config = ConfigDict(from_attributes=True)


class DangKyMessage(BaseModel):
    message: str


# ==========================
# Sự kiện của tôi
# ==========================

class SuKienDaDangKy(BaseModel):
    ma_dang_ky: int
    ma_su_kien: int

    ten_su_kien: str

    dia_diem: str | None = None

    thoi_gian_bat_dau: datetime

    thoi_gian_ket_thuc: datetime

    diem_cong: int

    anh_bia: str | None = None

    trang_thai: str

    thoi_gian_dang_ky: datetime

    thoi_gian_huy: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


# ==========================
# Danh sách người đăng ký (dành cho Ban tổ chức)
# ==========================

class NguoiDangKyResponse(BaseModel):
    ma_dang_ky: int
    ma_tai_khoan: int
    ho_ten: str
    mssv: str | None = None
    email: str | None = None
    thoi_gian_dang_ky: datetime
    trang_thai: str

    model_config = ConfigDict(from_attributes=True)