from datetime import datetime

from pydantic import BaseModel, EmailStr


class BanToChucResponse(BaseModel):
    ma_tai_khoan: int
    ho_ten: str
    email: EmailStr | None = None
    so_dien_thoai: str | None = None
    anh_dai_dien: str | None = None
    ma_trung_tam: int | None = None
    ten_trung_tam: str | None = None
    so_su_kien: int = 0
    trang_thai: int
    ngay_tao: datetime | None = None

    class Config:
        from_attributes = True


class BanToChucCreateRequest(BaseModel):
    ho_ten: str
    email: EmailStr
    mat_khau: str
    so_dien_thoai: str | None = None
    ma_trung_tam: int | None = None


class BanToChucUpdateRequest(BaseModel):
    ho_ten: str | None = None
    email: EmailStr | None = None
    so_dien_thoai: str | None = None
    ma_trung_tam: int | None = None


class ThongKeBanToChucResponse(BaseModel):
    tong_ban_to_chuc: int
    dang_hoat_dong: int
    da_khoa: int
    tong_su_kien: int


class SuKienCuaBanToChucResponse(BaseModel):
    ma_su_kien: int
    ten_su_kien: str
    trang_thai: str
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    so_luong_dang_ky: int = 0

    class Config:
        from_attributes = True


class TrungTamResponse(BaseModel):
    ma_trung_tam: int
    ten_trung_tam: str
    mo_ta: str | None = None
    trang_thai: int
    so_thanh_vien: int = 0

    class Config:
        from_attributes = True


class TrungTamCreateRequest(BaseModel):
    ten_trung_tam: str
    mo_ta: str | None = None


class TrungTamUpdateRequest(BaseModel):
    ten_trung_tam: str | None = None
    mo_ta: str | None = None


class MessageResponse(BaseModel):
    message: str
