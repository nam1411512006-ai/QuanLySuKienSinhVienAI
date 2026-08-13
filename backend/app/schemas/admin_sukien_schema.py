from datetime import datetime

from pydantic import BaseModel


class SuKienAdminResponse(BaseModel):
    ma_su_kien: int
    ten_su_kien: str
    dia_diem: str | None = None
    ten_loai_su_kien: str
    ma_loai_su_kien: int
    ten_nguoi_tao: str
    thoi_gian_bat_dau: datetime
    thoi_gian_ket_thuc: datetime
    so_luong_toi_da: int | None = None
    so_luong_da_dang_ky: int
    trang_thai: str


class ThongKeSuKienAdminResponse(BaseModel):
    tong_su_kien: int
    sap_dien_ra: int
    dang_dien_ra: int
    da_ket_thuc: int


class MessageResponse(BaseModel):
    message: str
