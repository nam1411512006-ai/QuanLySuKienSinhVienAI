from pydantic import BaseModel


class CaiDatHeThongResponse(BaseModel):
    ten_truong: str = ""
    ten_viet_tat: str = ""
    website: str = ""
    email_lien_he: str = ""
    logo_url: str = ""
    banner_url: str = ""
    gioi_han_upload_mb: str = "10"


class CaiDatHeThongUpdateRequest(BaseModel):
    ten_truong: str | None = None
    ten_viet_tat: str | None = None
    website: str | None = None
    email_lien_he: str | None = None
    logo_url: str | None = None
    banner_url: str | None = None
    gioi_han_upload_mb: str | None = None


class ThongTinHeThongResponse(BaseModel):
    phien_ban_api: str
    moi_truong: str
    tong_tai_khoan: int
    tong_su_kien: int
    tong_dang_ky: int


class TrangThaiSmtpResponse(BaseModel):
    da_cau_hinh: bool
    smtp_host: str = ""
    smtp_user: str = ""


class GuiEmailThuRequest(BaseModel):
    email_nhan: str


class MessageResponse(BaseModel):
    message: str
