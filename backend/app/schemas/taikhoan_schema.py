from datetime import date

from pydantic import BaseModel, EmailStr


class TaiKhoanProfileResponse(BaseModel):
    ma_tai_khoan: int
    ho_ten: str
    email: EmailStr | None = None
    so_dien_thoai: str | None = None
    ngay_sinh: date | None = None
    gioi_tinh: str | None = None
    mssv: str | None = None
    anh_dai_dien: str | None = None
    ma_vai_tro: int
    ma_trung_tam: int | None = None

    class Config:
        from_attributes = True


class CapNhatTaiKhoanRequest(BaseModel):
    ho_ten: str
    so_dien_thoai: str | None = None
    ngay_sinh: date | None = None
    gioi_tinh: str | None = None
    anh_dai_dien: str | None = None


class DoiMatKhauRequest(BaseModel):
    mat_khau_cu: str
    mat_khau_moi: str


class MessageResponse(BaseModel):
    message: str