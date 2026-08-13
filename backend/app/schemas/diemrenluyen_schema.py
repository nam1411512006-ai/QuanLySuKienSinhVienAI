from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LichSuDiemResponse(BaseModel):
    ma_lich_su: int
    ho_ten: str
    mssv: str | None = None
    so_diem: int
    ly_do: str | None = None
    thoi_gian: datetime

    model_config = ConfigDict(from_attributes=True)