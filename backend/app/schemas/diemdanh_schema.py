from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================
# Phiên QR (Ban tổ chức tạo ra để hiển thị)
# ==========================

class PhienQRResponse(BaseModel):
    ma_phien_qr: int
    ma_qr: str
    bat_dau: datetime
    ket_thuc: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================
# Kết quả điểm danh (Sinh viên quét xong)
# ==========================

class DiemDanhResponse(BaseModel):
    ma_diem_danh: int
    ten_su_kien: str
    thoi_gian_quet: datetime
    trang_thai: str

    model_config = ConfigDict(from_attributes=True)


# ==========================
# Dữ liệu sinh viên gửi lên khi quét QR
# ==========================

class QuetQRRequest(BaseModel):
    ma_qr: str