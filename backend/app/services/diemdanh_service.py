import secrets
from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.sukien import SuKien
from app.models.sukien import SuKien as SuKienModel
from app.models.diemdanh import PhienQRCode, DiemDanh
from app.models.dangky import DangKySuKien
from app.schemas.diemdanh_schema import PhienQRResponse, DiemDanhResponse
from app.models.diemrenluyen import DiemRenLuyen, LichSuDiemRenLuyen


# =====================================================
# TẠO PHIÊN QR MỚI (Ban tổ chức)
# =====================================================

def tao_phien_qr(
    db: Session,
    ma_su_kien: int,
    ma_nguoi_tao: int,
) -> PhienQRResponse:

    # Kiểm tra sự kiện có tồn tại và đúng của Ban tổ chức này không
    su_kien = (
        db.query(SuKien)
        .filter(
            SuKien.MaSuKien == ma_su_kien,
            SuKien.MaNguoiTao == ma_nguoi_tao,
        )
        .first()
    )

    if not su_kien:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay su kien",
        )

    bat_dau = datetime.now()
    ket_thuc = bat_dau + timedelta(seconds=60)

    # Sinh chuỗi mã QR ngẫu nhiên, khó đoán
    ma_qr = secrets.token_urlsafe(24)

    phien_qr = PhienQRCode(
        MaSuKien=ma_su_kien,
        MaQR=ma_qr,
        BatDau=bat_dau,
        KetThuc=ket_thuc,
        TrangThai=1,
    )

    db.add(phien_qr)
    db.commit()
    db.refresh(phien_qr)

    return PhienQRResponse(
        ma_phien_qr=phien_qr.MaPhienQR,
        ma_qr=phien_qr.MaQR,
        bat_dau=phien_qr.BatDau,
        ket_thuc=phien_qr.KetThuc,
    )


# =====================================================
# XÁC NHẬN ĐIỂM DANH (Sinh viên quét QR)
# =====================================================

def xac_nhan_diem_danh(
    db: Session,
    ma_qr: str,
    ma_tai_khoan: int,
) -> DiemDanhResponse:

    now = datetime.now()

    # Tìm phiên QR theo mã vừa quét
    phien_qr = (
        db.query(PhienQRCode)
        .filter(PhienQRCode.MaQR == ma_qr)
        .first()
    )

    if not phien_qr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ma QR khong hop le",
        )

    # Kiểm tra còn hạn không
    if now > phien_qr.KetThuc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ma QR da het han, vui long quet lai",
        )

    # Kiểm tra sinh viên đã đăng ký sự kiện này chưa
    dang_ky = (
        db.query(DangKySuKien)
        .filter(
            DangKySuKien.MaSuKien == phien_qr.MaSuKien,
            DangKySuKien.MaTaiKhoan == ma_tai_khoan,
        )
        .first()
    )

    if not dang_ky:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ban chua dang ky su kien nay",
        )

    # Kiểm tra đã điểm danh trước đó chưa (tránh trùng lặp)
    da_diem_danh = (
        db.query(DiemDanh)
        .filter(DiemDanh.MaDangKy == dang_ky.MaDangKy)
        .first()
    )

    if da_diem_danh:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ban da diem danh su kien nay roi",
        )

    # Lưu điểm danh
    diem_danh = DiemDanh(
        MaDangKy=dang_ky.MaDangKy,
        MaPhienQR=phien_qr.MaPhienQR,
        ThoiGianQuet=now,
        TrangThai="ThanhCong",
    )

    db.add(diem_danh)

    # Cập nhật trạng thái đăng ký -> đã điểm danh
    dang_ky.TrangThai = "DaDiemDanh"

    db.commit()
    db.refresh(diem_danh)

    su_kien = (
        db.query(SuKienModel)
        .filter(SuKienModel.MaSuKien == phien_qr.MaSuKien)
        .first()
    )

    cong_diem_ren_luyen(
        db,
        ma_tai_khoan,
        phien_qr.MaSuKien,
        su_kien.DiemCong,
        su_kien.TenSuKien,
    )

    return DiemDanhResponse(
        ma_diem_danh=diem_danh.MaDiemDanh,
        ten_su_kien=su_kien.TenSuKien,
        thoi_gian_quet=diem_danh.ThoiGianQuet,
        trang_thai=diem_danh.TrangThai,
    )
    # =====================================================
# XÁC ĐỊNH HỌC KỲ / NĂM HỌC HIỆN TẠI
# =====================================================

def xac_dinh_hoc_ky(now: datetime):

    # Quy ước: Thang 8 -> Thang 1 la Hoc ky 1, Thang 2 -> Thang 7 la Hoc ky 2
    if now.month >= 8 or now.month == 1:

        hoc_ky = 1
        nam_bat_dau = now.year if now.month >= 8 else now.year - 1

    else:

        hoc_ky = 2
        nam_bat_dau = now.year - 1

    nam_hoc = f"{nam_bat_dau}-{nam_bat_dau + 1}"

    return hoc_ky, nam_hoc


# =====================================================
# CỘNG ĐIỂM RÈN LUYỆN (Tự động khi điểm danh thành công)
# =====================================================

def cong_diem_ren_luyen(
    db: Session,
    ma_tai_khoan: int,
    ma_su_kien: int,
    so_diem: int,
    ten_su_kien: str,
):

    if so_diem <= 0:
        return

    now = datetime.now()
    hoc_ky, nam_hoc = xac_dinh_hoc_ky(now)

    diem_ren_luyen = (
        db.query(DiemRenLuyen)
        .filter(
            DiemRenLuyen.MaTaiKhoan == ma_tai_khoan,
            DiemRenLuyen.HocKy == hoc_ky,
            DiemRenLuyen.NamHoc == nam_hoc,
        )
        .first()
    )

    if not diem_ren_luyen:

        diem_ren_luyen = DiemRenLuyen(
            MaTaiKhoan=ma_tai_khoan,
            HocKy=hoc_ky,
            NamHoc=nam_hoc,
            DiemTruong=45,
            DiemHoatDong=0,
            TongDiem=45,
            NgayCapNhat=now,
        )

        db.add(diem_ren_luyen)
        db.flush()

    diem_ren_luyen.DiemHoatDong += so_diem
    diem_ren_luyen.TongDiem += so_diem
    diem_ren_luyen.NgayCapNhat = now

    lich_su = LichSuDiemRenLuyen(
        MaDiemRenLuyen=diem_ren_luyen.MaDiemRenLuyen,
        MaSuKien=ma_su_kien,
        SoDiem=so_diem,
        LyDo=f"Diem danh su kien: {ten_su_kien}",
        ThoiGian=now,
    )

    db.add(lich_su)
    db.commit()