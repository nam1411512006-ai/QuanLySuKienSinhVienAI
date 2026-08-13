from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


# =====================================================
# ĐỐI TƯỢNG NHẬN THÔNG BÁO
# =====================================================

class DoiTuongNhan(str, Enum):
    TAT_CA = "TatCa"
    SINH_VIEN = "SinhVien"
    BAN_TO_CHUC = "BanToChuc"
    SU_KIEN = "SuKien"


# =====================================================
# DANH SÁCH / CHI TIẾT THÔNG BÁO (ADMIN)
# =====================================================

class AdminThongBaoResponse(BaseModel):
    ma_thong_bao: int
    tieu_de: str
    noi_dung: str
    loai_thong_bao: str
    thoi_gian_gui: datetime
    so_nguoi_nhan: int = 0
    so_da_doc: int = 0

    class Config:
        from_attributes = True


class NguoiNhanChiTietResponse(BaseModel):
    ma_nhan: int
    ma_tai_khoan: int
    ho_ten: str
    email: str | None = None
    da_doc: bool
    thoi_gian_doc: datetime | None = None

    class Config:
        from_attributes = True


class AdminThongBaoChiTietResponse(AdminThongBaoResponse):
    nguoi_nhan: list[NguoiNhanChiTietResponse] = Field(default_factory=list)


# =====================================================
# TẠO THÔNG BÁO
# =====================================================

class AdminThongBaoCreateRequest(BaseModel):
    tieu_de: str
    noi_dung: str
    loai_thong_bao: str
    doi_tuong_nhan: DoiTuongNhan = DoiTuongNhan.TAT_CA
    ma_su_kien: int | None = None


# =====================================================
# THỐNG KÊ
# =====================================================

class ThongKeThongBaoResponse(BaseModel):
    tong_thong_bao: int
    gui_hom_nay: int
    tong_luot_nhan: int
    ty_le_da_doc: int


# =====================================================
# RESPONSE CHUNG
# =====================================================

class MessageResponse(BaseModel):
    message: str
