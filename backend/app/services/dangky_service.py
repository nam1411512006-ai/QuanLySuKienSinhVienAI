from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.email import da_cau_hinh_smtp, gui_email, mau_email_dang_ky_su_kien
from app.models.dangky import DangKySuKien
from app.models.sukien import SuKien
from app.models.taikhoan import TaiKhoan
from app.models.thongbao import ThongBao, NguoiNhanThongBao
from app.schemas.dangky_schema import (
    DangKyMessage,
    SuKienDaDangKy,
)


def _gui_email_xac_nhan_dang_ky(db: Session, ma_tai_khoan: int, su_kien: SuKien) -> None:
    """Gui email xac nhan dang ky (best-effort, khong lam vo luong dang ky neu that bai)."""

    if not da_cau_hinh_smtp():
        return

    sinh_vien = db.query(TaiKhoan).filter(TaiKhoan.MaTaiKhoan == ma_tai_khoan).first()

    if not sinh_vien or not sinh_vien.Email:
        return

    gui_email(
        email_nhan=sinh_vien.Email,
        tieu_de=f"Xác nhận đăng ký sự kiện: {su_kien.TenSuKien}",
        noi_dung_html=mau_email_dang_ky_su_kien(
            ho_ten=sinh_vien.HoTen,
            ten_su_kien=su_kien.TenSuKien,
            dia_diem=su_kien.DiaDiem,
            thoi_gian_bat_dau=su_kien.ThoiGianBatDau.strftime("%H:%M %d/%m/%Y") if su_kien.ThoiGianBatDau else "",
        ),
    )


# =====================================================
# ĐĂNG KÝ SỰ KIỆN
# =====================================================

def dang_ky_su_kien(
    db: Session,
    ma_su_kien: int,
    ma_tai_khoan: int,
) -> DangKyMessage:

    su_kien = (
        db.query(SuKien)
        .filter(SuKien.MaSuKien == ma_su_kien)
        .first()
    )

    if not su_kien:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay su kien",
        )

    if su_kien.TrangThai == "DaKhoa":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Su kien nay da bi quan tri vien khoa, khong the dang ky",
        )

    now = datetime.now()

    # Không cho đăng ký sau khi sự kiện kết thúc
    if now > su_kien.ThoiGianKetThuc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Su kien da ket thuc",
        )

    # =====================================================
    # Kiểm tra đã đăng ký chưa
    # =====================================================

    da_dang_ky = (
        db.query(DangKySuKien)
        .filter(
            DangKySuKien.MaSuKien == ma_su_kien,
            DangKySuKien.MaTaiKhoan == ma_tai_khoan,
        )
        .first()
    )

    # Nếu đã hủy thì cho phép đăng ký lại
    if da_dang_ky:

        if da_dang_ky.TrangThai == "DaHuy":

            da_dang_ky.TrangThai = "DaDangKy"
            da_dang_ky.ThoiGianDangKy = now
            da_dang_ky.ThoiGianHuy = None
            da_dang_ky.LyDoHuy = None

            db.commit()
            db.refresh(da_dang_ky)

            thong_bao = ThongBao(
                TieuDe="Đăng ký lại sự kiện",
                NoiDung=f"Bạn đã đăng ký lại sự kiện '{su_kien.TenSuKien}'.",
                LoaiThongBao="sukien",
                ThoiGianGui=now,
            )

            db.add(thong_bao)
            db.commit()
            db.refresh(thong_bao)

            db.add(
                NguoiNhanThongBao(
                    MaThongBao=thong_bao.MaThongBao,
                    MaTaiKhoan=ma_tai_khoan,
                    DaDoc=False,
                )
            )

            db.commit()

            _gui_email_xac_nhan_dang_ky(db, ma_tai_khoan, su_kien)

            return DangKyMessage(
                message="Dang ky lai thanh cong",
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ban da dang ky su kien nay",
        )

    # =====================================================
    # Kiểm tra số lượng tối đa
    # =====================================================

    if su_kien.SoLuongToiDa:

        so_luong = (
            db.query(DangKySuKien)
            .filter(
                DangKySuKien.MaSuKien == ma_su_kien,
                DangKySuKien.TrangThai != "DaHuy",
            )
            .count()
        )

        if so_luong >= su_kien.SoLuongToiDa:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Su kien da du so luong",
            )

    # =====================================================
    # Lưu đăng ký
    # =====================================================

    dang_ky = DangKySuKien(
        MaSuKien=ma_su_kien,
        MaTaiKhoan=ma_tai_khoan,
        ThoiGianDangKy=now,
        TrangThai="DaDangKy",
    )

    db.add(dang_ky)
    db.commit()
    db.refresh(dang_ky)

    # =====================================================
    # Tạo thông báo
    # =====================================================

    thong_bao = ThongBao(
        TieuDe="Đăng ký sự kiện thành công",
        NoiDung=f"Bạn đã đăng ký thành công sự kiện '{su_kien.TenSuKien}'.",
        LoaiThongBao="sukien",
        ThoiGianGui=now,
    )

    db.add(thong_bao)
    db.commit()
    db.refresh(thong_bao)

    db.add(
        NguoiNhanThongBao(
            MaThongBao=thong_bao.MaThongBao,
            MaTaiKhoan=ma_tai_khoan,
            DaDoc=False,
        )
    )

    db.commit()

    _gui_email_xac_nhan_dang_ky(db, ma_tai_khoan, su_kien)

    return DangKyMessage(
        message="Dang ky thanh cong",
    )
# =====================================================
# SỰ KIỆN CỦA TÔI
# =====================================================

def lay_danh_sach_dang_ky(
    db: Session,
    ma_tai_khoan: int,
):

    ket_qua = (
        db.query(DangKySuKien, SuKien)
        .join(
            SuKien,
            DangKySuKien.MaSuKien == SuKien.MaSuKien,
        )
        .filter(
            DangKySuKien.MaTaiKhoan == ma_tai_khoan
        )
        .order_by(
            SuKien.ThoiGianBatDau.desc()
        )
        .all()
    )

    danh_sach = []

    for dang_ky, su_kien in ket_qua:

        danh_sach.append(
            SuKienDaDangKy(
                ma_dang_ky=dang_ky.MaDangKy,
                ma_su_kien=su_kien.MaSuKien,
                ten_su_kien=su_kien.TenSuKien,
                dia_diem=su_kien.DiaDiem,
                thoi_gian_bat_dau=su_kien.ThoiGianBatDau,
                thoi_gian_ket_thuc=su_kien.ThoiGianKetThuc,
                diem_cong=su_kien.DiemCong,
                anh_bia=su_kien.AnhBia,

                # ==========================
                # Thông tin đăng ký
                # ==========================
                trang_thai=dang_ky.TrangThai,
                thoi_gian_dang_ky=dang_ky.ThoiGianDangKy,

                # ==========================
                # Thông tin hủy
                # ==========================
                thoi_gian_huy=dang_ky.ThoiGianHuy,
                ly_do_huy=dang_ky.LyDoHuy,
            )
        )

    return danh_sach
# =====================================================
# HỦY ĐĂNG KÝ SỰ KIỆN
# =====================================================

def huy_dang_ky_su_kien(
    db: Session,
    ma_dang_ky: int,
    ma_tai_khoan: int,
) -> DangKyMessage:

    dang_ky = (
        db.query(DangKySuKien)
        .filter(
            DangKySuKien.MaDangKy == ma_dang_ky,
            DangKySuKien.MaTaiKhoan == ma_tai_khoan,
        )
        .first()
    )

    if not dang_ky:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay dang ky",
        )

    # Không cho hủy nếu đã hủy
    if dang_ky.TrangThai == "DaHuy":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dang ky da duoc huy",
        )

    # Không cho hủy nếu đã điểm danh hoặc hoàn thành
    if dang_ky.TrangThai in ["DaDiemDanh", "HoanThanh"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the huy dang ky",
        )

    su_kien = (
        db.query(SuKien)
        .filter(
            SuKien.MaSuKien == dang_ky.MaSuKien
        )
        .first()
    )

    # ==========================
    # Cập nhật trạng thái
    # ==========================

    dang_ky.TrangThai = "DaHuy"
    dang_ky.ThoiGianHuy = datetime.now()

    # Lưu lý do mặc định
    dang_ky.LyDoHuy = "Sinh viên tự hủy đăng ký"

    db.commit()
    db.refresh(dang_ky)

    # ==========================
    # Gửi thông báo
    # ==========================

    thong_bao = ThongBao(
        TieuDe="Hủy đăng ký sự kiện",
        NoiDung=f"Bạn đã hủy đăng ký sự kiện '{su_kien.TenSuKien}'.",
        LoaiThongBao="sukien",
        ThoiGianGui=datetime.now(),
    )

    db.add(thong_bao)
    db.commit()
    db.refresh(thong_bao)

    nguoi_nhan = NguoiNhanThongBao(
        MaThongBao=thong_bao.MaThongBao,
        MaTaiKhoan=ma_tai_khoan,
        DaDoc=False,
    )

    db.add(nguoi_nhan)
    db.commit()

    return DangKyMessage(
        message="Huy dang ky thanh cong",
    )