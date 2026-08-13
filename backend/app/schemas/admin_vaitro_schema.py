from pydantic import BaseModel


class VaiTroResponse(BaseModel):
    ma_vai_tro: int
    ten_vai_tro: str
    mo_ta: str | None = None
    so_nguoi_dung: int = 0
    la_vai_tro_he_thong: bool = False

    class Config:
        from_attributes = True


class VaiTroCreateRequest(BaseModel):
    ten_vai_tro: str
    mo_ta: str | None = None


class VaiTroUpdateRequest(BaseModel):
    ten_vai_tro: str | None = None
    mo_ta: str | None = None


class MessageResponse(BaseModel):
    message: str
