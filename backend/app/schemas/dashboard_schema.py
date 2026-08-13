from pydantic import BaseModel


class DashboardResponse(BaseModel):
    """Dữ liệu tổng quan hiển thị trên Dashboard của Ban tổ chức."""

    tong_su_kien: int
    tong_dang_ky: int
    
class ThongKeSuKienResponse(BaseModel):
    ma_su_kien: int
    ten_su_kien: str
    so_luong_dang_ky: int
    so_luong_diem_danh: int
    ty_le_diem_danh: float