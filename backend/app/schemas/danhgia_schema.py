from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DanhGiaResponse(BaseModel):
    ma_danh_gia: int
    ho_ten: str
    so_sao: int
    noi_dung: str | None = None
    thoi_gian: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================
# Sinh viên gửi đánh giá
# ==========================

class DanhGiaCreate(BaseModel):
    so_sao: int
    noi_dung: str | None = None


class DanhGiaMessage(BaseModel):
    message: str


# ==========================
# Sự kiện sinh viên có thể đánh giá
# (đã điểm danh / hoàn thành và chưa đánh giá)
# ==========================

class SuKienChoDanhGia(BaseModel):
    ma_su_kien: int
    ten_su_kien: str
    dia_diem: str | None = None
    thoi_gian_bat_dau: datetime
    anh_bia: str | None = None

    model_config = ConfigDict(from_attributes=True)