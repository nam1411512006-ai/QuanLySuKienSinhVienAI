from pydantic import BaseModel


class LoaiSuKienAdminResponse(BaseModel):
    ma_loai_su_kien: int
    ten_loai_su_kien: str
    mo_ta: str | None = None
    trang_thai: int
    so_su_kien: int = 0

    class Config:
        from_attributes = True


class LoaiSuKienCreateRequest(BaseModel):
    ten_loai_su_kien: str
    mo_ta: str | None = None


class LoaiSuKienUpdateRequest(BaseModel):
    ten_loai_su_kien: str | None = None
    mo_ta: str | None = None


class ThongKeDanhMucResponse(BaseModel):
    tong_danh_muc: int
    dang_su_dung: int
    da_khoa: int
    tong_su_kien: int


class MessageResponse(BaseModel):
    message: str
