from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.sukien import SuKien
from app.models.dangky import DangKySuKien
from app.models.taikhoan import TaiKhoan, TrungTam
from app.models.danhmuc import LoaiSuKien
from app.models.danhgia import DanhGia
from app.models.diemrenluyen import LichSuDiemRenLuyen, DiemRenLuyen
from app.models.diemdanh import DiemDanh

from app.schemas.dangky_schema import NguoiDangKyResponse
from app.schemas.danhmuc_schema import LoaiSuKienResponse, TrungTamResponse
from app.schemas.danhgia_schema import DanhGiaResponse
from app.schemas.diemrenluyen_schema import LichSuDiemResponse

from app.services.sukien_service import map_su_kien_response
from app.services.diemdanh_service import cong_diem_ren_luyen

# =====================================================
# DANH SÁCH SỰ KIỆN CỦA TÔI
# =====================================================

def get_my_events(
    db: Session,
    ma_nguoi_tao: int,
):
    events = (
        db.query(SuKien)
        .filter(
            SuKien.MaNguoiTao == ma_nguoi_tao
        )
        .order_by(SuKien.NgayTao.desc())
        .all()
    )

    return [
        map_su_kien_response(item, db)
        for item in events
    ]


# =====================================================
# CHI TIẾT SỰ KIỆN CỦA TÔI
# =====================================================

def get_my_event_by_id(
    db: Session,
    ma_su_kien: int,
    ma_nguoi_tao: int,
):

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

    return map_su_kien_response(su_kien, db)

# =====================================================
# DANH SÁCH NGƯỜI ĐĂNG KÝ 1 SỰ KIỆN
# =====================================================

def get_registrations_of_event(
    db: Session,
    ma_su_kien: int,
    ma_nguoi_tao: int,
):

    # Kiểm tra sự kiện có tồn tại và đúng là của Ban tổ chức này không
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

    ket_qua = (
        db.query(DangKySuKien, TaiKhoan)
        .join(
            TaiKhoan,
            DangKySuKien.MaTaiKhoan == TaiKhoan.MaTaiKhoan,
        )
        .filter(
            DangKySuKien.MaSuKien == ma_su_kien
        )
        .order_by(
            DangKySuKien.ThoiGianDangKy.desc()
        )
        .all()
    )

    danh_sach = []

    for dang_ky, tai_khoan in ket_qua:

        danh_sach.append(
            NguoiDangKyResponse(
                ma_dang_ky=dang_ky.MaDangKy,
                ma_tai_khoan=tai_khoan.MaTaiKhoan,
                ho_ten=tai_khoan.HoTen,
                mssv=tai_khoan.MSSV,
                email=tai_khoan.Email,
                thoi_gian_dang_ky=dang_ky.ThoiGianDangKy,
                trang_thai=dang_ky.TrangThai,
            )
        )

    return danh_sach

# =====================================================
# DANH MỤC LOẠI SỰ KIỆN
# =====================================================

def get_danh_sach_loai_su_kien(db: Session):
    ds = db.query(LoaiSuKien).all()

    return [
        LoaiSuKienResponse(
            ma_loai_su_kien=item.MaLoaiSuKien,
            ten_loai_su_kien=item.TenLoaiSuKien,
        )
        for item in ds
    ]


# =====================================================
# DANH MỤC TRUNG TÂM
# =====================================================

def get_danh_sach_trung_tam(db: Session):
    ds = db.query(TrungTam).all()

    return [
        TrungTamResponse(
            ma_trung_tam=item.MaTrungTam,
            ten_trung_tam=item.TenTrungTam,
        )
        for item in ds
    ]
    
    # =====================================================
# DANH SÁCH ĐÁNH GIÁ CỦA 1 SỰ KIỆN
# =====================================================

def get_danh_gia_of_event(
    db: Session,
    ma_su_kien: int,
    ma_nguoi_tao: int,
):

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

    ket_qua = (
        db.query(DanhGia, TaiKhoan)
        .join(
            TaiKhoan,
            DanhGia.MaTaiKhoan == TaiKhoan.MaTaiKhoan,
        )
        .filter(
            DanhGia.MaSuKien == ma_su_kien
        )
        .order_by(
            DanhGia.ThoiGian.desc()
        )
        .all()
    )

    danh_sach = []

    for danh_gia, tai_khoan in ket_qua:

        danh_sach.append(
            DanhGiaResponse(
                ma_danh_gia=danh_gia.MaDanhGia,
                ho_ten=tai_khoan.HoTen,
                so_sao=danh_gia.SoSao,
                noi_dung=danh_gia.NoiDung,
                thoi_gian=danh_gia.ThoiGian,
            )
        )

    return danh_sach

# =====================================================
# LỊCH SỬ ĐIỂM RÈN LUYỆN CỦA 1 SỰ KIỆN
# =====================================================

def get_lich_su_diem_of_event(
    db: Session,
    ma_su_kien: int,
    ma_nguoi_tao: int,
):

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

    ket_qua = (
        db.query(LichSuDiemRenLuyen, TaiKhoan)
        .join(
            DiemRenLuyen,
            LichSuDiemRenLuyen.MaDiemRenLuyen == DiemRenLuyen.MaDiemRenLuyen,
        )
        .join(
            TaiKhoan,
            DiemRenLuyen.MaTaiKhoan == TaiKhoan.MaTaiKhoan,
        )
        .filter(
            LichSuDiemRenLuyen.MaSuKien == ma_su_kien
        )
        .order_by(
            LichSuDiemRenLuyen.ThoiGian.desc()
        )
        .all()
    )

    danh_sach = []

    for lich_su, tai_khoan in ket_qua:

        danh_sach.append(
            LichSuDiemResponse(
                ma_lich_su=lich_su.MaLichSu,
                ho_ten=tai_khoan.HoTen,
                mssv=tai_khoan.MSSV,
                so_diem=lich_su.SoDiem,
                ly_do=lich_su.LyDo,
                thoi_gian=lich_su.ThoiGian,
            )
        )

    return danh_sach

# =====================================================
# XỬ LÝ VẮNG MẶT (Trừ điểm rèn luyện sau khi sự kiện kết thúc)
# =====================================================

def xu_ly_vang_mat(
    db: Session,
    ma_su_kien: int,
    ma_nguoi_tao: int,
):

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

    if datetime.now() < su_kien.ThoiGianKetThuc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Su kien chua ket thuc, chua the xu ly vang mat",
        )

    diem_tru = round(su_kien.DiemCong * 0.5)

    danh_sach_dang_ky = (
        db.query(DangKySuKien)
        .filter(
            DangKySuKien.MaSuKien == ma_su_kien,
            DangKySuKien.TrangThai == "DaDangKy",
        )
        .all()
    )

    so_luong_da_xu_ly = 0

    for dang_ky in danh_sach_dang_ky:

        da_diem_danh = (
            db.query(DiemDanh)
            .filter(DiemDanh.MaDangKy == dang_ky.MaDangKy)
            .first()
        )

        if da_diem_danh:
            continue

        if diem_tru > 0:

            cong_diem_ren_luyen(
                db,
                dang_ky.MaTaiKhoan,
                ma_su_kien,
                -diem_tru,
                f"Vang mat: {su_kien.TenSuKien}",
            )

        dang_ky.TrangThai = "VangMat"

        so_luong_da_xu_ly += 1

    db.commit()

    return {
        "so_luong_vang_mat": so_luong_da_xu_ly,
        "diem_tru_moi_nguoi": diem_tru,
    }   