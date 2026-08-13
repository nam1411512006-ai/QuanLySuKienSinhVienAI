from pydantic import BaseModel, ConfigDict


class LoaiSuKienResponse(BaseModel):
    ma_loai_su_kien: int
    ten_loai_su_kien: str

    model_config = ConfigDict(from_attributes=True)


class TrungTamResponse(BaseModel):
    ma_trung_tam: int
    ten_trung_tam: str

    model_config = ConfigDict(from_attributes=True)