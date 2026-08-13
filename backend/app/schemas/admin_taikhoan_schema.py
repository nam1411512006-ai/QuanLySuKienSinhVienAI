from datetime import date, datetime

from pydantic import BaseModel, EmailStr


class TaiKhoanAdminResponse(BaseModel):
    ma_tai_khoan: int
    ho_ten: str
    email: EmailStr | None = None
    so_dien_thoai: str | None = None
    ngay_sinh: date | None = None
    gioi_tinh: str | None = None
    mssv: str | None = None
    anh_dai_dien: str | None = None
    ma_vai_tro: int
    ten_vai_tro: str
    ma_trung_tam: int | None = None
    ten_trung_tam: str | None = None
    trang_thai: int
    ngay_tao: datetime | None = None

    class Config:
        from_attributes = True


class TaiKhoanAdminCreateRequest(BaseModel):
    ho_ten: str
    email: EmailStr
    mat_khau: str
    ma_vai_tro: int
    so_dien_thoai: str | None = None
    ngay_sinh: date | None = None
    gioi_tinh: str | None = None
    mssv: str | None = None
    ma_trung_tam: int | None = None


class TaiKhoanAdminUpdateRequest(BaseModel):
    ho_ten: str | None = None
    email: EmailStr | None = None
    ma_vai_tro: int | None = None
    so_dien_thoai: str | None = None
    ngay_sinh: date | None = None
    gioi_tinh: str | None = None
    mssv: str | None = None
    ma_trung_tam: int | None = None


class ThongKeTaiKhoanResponse(BaseModel):
    tong_tai_khoan: int
    tong_admin: int
    tong_ban_to_chuc: int
    tong_sinh_vien: int


class MessageResponse(BaseModel):
    message: str
