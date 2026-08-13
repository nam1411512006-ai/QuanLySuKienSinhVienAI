from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.email import da_cau_hinh_smtp, gui_email
from app.models.caidat import CaiDatHeThong
from app.models.taikhoan import TaiKhoan
from app.models.sukien import SuKien
from app.models.dangky import DangKySuKien
from app.schemas.admin_caidat_schema import (
    CaiDatHeThongResponse,
    CaiDatHeThongUpdateRequest,
    ThongTinHeThongResponse,
    TrangThaiSmtpResponse,
    MessageResponse,
)

GIA_TRI_MAC_DINH = {
    "ten_truong": "",
    "ten_viet_tat": "",
    "website": "",
    "email_lien_he": "",
    "logo_url": "",
    "banner_url": "",
    "gioi_han_upload_mb": "10",
}


def lay_cai_dat(db: Session) -> CaiDatHeThongResponse:
    ds = db.query(CaiDatHeThong).all()
    dict_gia_tri = dict(GIA_TRI_MAC_DINH)
    for item in ds:
        if item.Khoa in dict_gia_tri:
            dict_gia_tri[item.Khoa] = item.GiaTri or ""

    return CaiDatHeThongResponse(**dict_gia_tri)


def cap_nhat_cai_dat(
    db: Session, data: CaiDatHeThongUpdateRequest
) -> CaiDatHeThongResponse:

    du_lieu_moi = data.model_dump(exclude_unset=True)

    for khoa, gia_tri in du_lieu_moi.items():
        if gia_tri is None:
            continue

        ban_ghi = db.query(CaiDatHeThong).filter(CaiDatHeThong.Khoa == khoa).first()

        if ban_ghi:
            ban_ghi.GiaTri = str(gia_tri)
        else:
            db.add(CaiDatHeThong(Khoa=khoa, GiaTri=str(gia_tri)))

    db.commit()

    return lay_cai_dat(db)


def lay_thong_tin_he_thong(db: Session) -> ThongTinHeThongResponse:

    settings = get_settings()

    return ThongTinHeThongResponse(
        phien_ban_api="1.0.0",
        moi_truong=settings.app_env,
        tong_tai_khoan=db.query(TaiKhoan).count(),
        tong_su_kien=db.query(SuKien).count(),
        tong_dang_ky=db.query(DangKySuKien).count(),
    )


def lay_trang_thai_smtp() -> TrangThaiSmtpResponse:

    settings = get_settings()

    return TrangThaiSmtpResponse(
        da_cau_hinh=settings.smtp_da_cau_hinh,
        smtp_host=settings.smtp_host,
        smtp_user=settings.smtp_user,
    )


def gui_email_thu(email_nhan: str) -> MessageResponse:

    from fastapi import HTTPException, status

    if not da_cau_hinh_smtp():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SMTP chua duoc cau hinh. Vui long dien SMTP_HOST/SMTP_USER/SMTP_PASSWORD trong file backend/.env roi khoi dong lai server.",
        )

    thanh_cong = gui_email(
        email_nhan=email_nhan,
        tieu_de="Email thử nghiệm từ hệ thống Quản lý Sự kiện Sinh viên",
        noi_dung_html="<p>Đây là email thử nghiệm. Nếu bạn nhận được email này, cấu hình SMTP đã hoạt động chính xác.</p>",
    )

    if not thanh_cong:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Gui email that bai. Kiem tra lai SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD va xem log server.",
        )

    return MessageResponse(message="Da gui email thu thanh cong")
