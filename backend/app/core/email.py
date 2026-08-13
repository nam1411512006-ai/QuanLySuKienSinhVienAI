import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import get_settings

logger = logging.getLogger("email")


def da_cau_hinh_smtp() -> bool:
    return get_settings().smtp_da_cau_hinh


def gui_email(email_nhan: str, tieu_de: str, noi_dung_html: str) -> bool:
    """
    Gui 1 email qua SMTP.
    Tra ve True neu gui thanh cong, False neu that bai (khong raise exception
    de tranh lam hong luong nghiep vu chinh, vi du dang ky su kien, khi email loi).
    """

    settings = get_settings()

    if not settings.smtp_da_cau_hinh:
        logger.warning("SMTP chua duoc cau hinh (thieu SMTP_HOST/SMTP_USER/SMTP_PASSWORD trong .env)")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = tieu_de
        msg["From"] = f"{settings.smtp_from_name} <{settings.smtp_user}>"
        msg["To"] = email_nhan

        msg.attach(MIMEText(noi_dung_html, "html", "utf-8"))

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            if settings.smtp_use_tls:
                server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_user, [email_nhan], msg.as_string())

        return True

    except Exception as loi:  # noqa: BLE001 - co y bat moi loi de khong lam vo luong chinh
        logger.error("Gui email that bai: %s", loi)
        return False


def mau_email_dang_ky_su_kien(ho_ten: str, ten_su_kien: str, dia_diem: str, thoi_gian_bat_dau: str) -> str:
    return f"""
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color:#4f46e5;">Đăng ký sự kiện thành công</h2>
        <p>Xin chào <strong>{ho_ten}</strong>,</p>
        <p>Bạn đã đăng ký thành công sự kiện:</p>
        <div style="background:#f5f5f7; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:4px 0;"><strong>Sự kiện:</strong> {ten_su_kien}</p>
            <p style="margin:4px 0;"><strong>Địa điểm:</strong> {dia_diem or "—"}</p>
            <p style="margin:4px 0;"><strong>Thời gian bắt đầu:</strong> {thoi_gian_bat_dau}</p>
        </div>
        <p>Vui lòng có mặt đúng giờ và mang theo mã QR để điểm danh.</p>
        <p style="color:#888; font-size:13px;">Đây là email tự động, vui lòng không trả lời.</p>
    </div>
    """
