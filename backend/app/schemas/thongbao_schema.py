from datetime import datetime

from pydantic import BaseModel

from pydantic import BaseModel, Field, ConfigDict


# =====================================================
# THÔNG BÁO TRẢ VỀ CHO FRONTEND
# =====================================================

class ThongBaoResponse(BaseModel):
    ma_nhan: int
    ma_thong_bao: int
    tieu_de: str
    noi_dung: str
    loai_thong_bao: str
    thoi_gian_gui: datetime
    da_doc: bool

    class Config:
        from_attributes = True


# =====================================================
# SỐ THÔNG BÁO CHƯA ĐỌC
# =====================================================




class SoThongBaoChuaDoc(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    soLuongChuaDoc: int = Field(
        alias="so_luong"
    )


# =====================================================
# RESPONSE CHUNG
# =====================================================

class ThongBaoMessage(BaseModel):
    message: str

class ThongBaoDetailResponse(BaseModel):

    ma_nhan: int

    ma_thong_bao: int

    tieu_de: str

    noi_dung: str

    loai_thong_bao: str

    thoi_gian_gui: datetime

    da_doc: bool


    class Config:

        from_attributes = True


# =====================================================
# CHI TIẾT THÔNG BÁO
# =====================================================

class ThongBaoDetailResponse(BaseModel):

    ma_nhan: int

    ma_thong_bao: int

    tieu_de: str

    noi_dung: str

    loai_thong_bao: str

    thoi_gian_gui: datetime

    da_doc: bool


    class Config:

        from_attributes = True