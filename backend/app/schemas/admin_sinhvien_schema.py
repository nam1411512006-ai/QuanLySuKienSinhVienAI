from datetime import date, datetime

from pydantic import BaseModel, EmailStr


class SinhVienResponse(BaseModel):
    ma_tai_khoan: int
    ho_ten: str
    email: EmailStr | None = None
    mssv: str | None = None
    so_dien_thoai: str | None = None
    ngay_sinh: date | None = None
    gioi_tinh: str | None = None
    anh_dai_dien: str | None = None
    diem_ren_luyen_hien_tai: int | None = None
    so_su_kien_da_tham_gia: int = 0
    trang_thai: int
    ngay_tao: datetime | None = None

    class Config:
        from_attributes = True


class SinhVienCreateRequest(BaseModel):
    ho_ten: str
    email: EmailStr
    mat_khau: str
    mssv: str
    so_dien_thoai: str | None = None
    ngay_sinh: date | None = None
    gioi_tinh: str | None = None


class SinhVienUpdateRequest(BaseModel):
    ho_ten: str | None = None
    email: EmailStr | None = None
    mssv: str | None = None
    so_dien_thoai: str | None = None
    ngay_sinh: date | None = None
    gioi_tinh: str | None = None


class ThongKeSinhVienResponse(BaseModel):
    tong_sinh_vien: int
    dang_hoat_dong: int
    da_khoa: int
    diem_ren_luyen_trung_binh: int


class DiemRenLuyenHocKyResponse(BaseModel):
    ma_diem_ren_luyen: int
    hoc_ky: int
    nam_hoc: str
    diem_truong: int
    diem_hoat_dong: int
    tong_diem: int
    ngay_cap_nhat: datetime | None = None

    class Config:
        from_attributes = True


class SuKienThamGiaResponse(BaseModel):
    ma_su_kien: int
    ten_su_kien: str
    trang_thai_dang_ky: str
    thoi_gian_dang_ky: datetime | None = None

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    message: str
