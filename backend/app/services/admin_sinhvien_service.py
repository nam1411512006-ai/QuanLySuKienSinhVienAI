from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.security import hash_password
from app.models.taikhoan import TaiKhoan
from app.models.dangky import DangKySuKien
from app.models.sukien import SuKien
from app.models.diemrenluyen import DiemRenLuyen
from app.schemas.admin_sinhvien_schema import (
    SinhVienCreateRequest,
    SinhVienUpdateRequest,
    SinhVienResponse,
    ThongKeSinhVienResponse,
    DiemRenLuyenHocKyResponse,
    SuKienThamGiaResponse,
    MessageResponse,
)

MA_VAI_TRO_SINH_VIEN = 3


def _diem_ren_luyen_hien_tai(db: Session, ma_tai_khoan: int) -> int | None:
    ban_ghi = (
        db.query(DiemRenLuyen)
        .filter(DiemRenLuyen.MaTaiKhoan == ma_tai_khoan)
        .order_by(DiemRenLuyen.MaDiemRenLuyen.desc())
        .first()
    )
    return ban_ghi.TongDiem if ban_ghi else None


def _dem_su_kien_da_tham_gia(db: Session, ma_tai_khoan: int) -> int:
    return (
        db.query(DangKySuKien)
        .filter(
            DangKySuKien.MaTaiKhoan == ma_tai_khoan,
            DangKySuKien.TrangThai.in_(["DaDiemDanh", "HoanThanh"]),
        )
        .count()
    )


def _to_response(db: Session, user: TaiKhoan) -> SinhVienResponse:
    return SinhVienResponse(
        ma_tai_khoan=user.MaTaiKhoan,
        ho_ten=user.HoTen,
        email=user.Email,
        mssv=user.MSSV,
        so_dien_thoai=user.SoDienThoai,
        ngay_sinh=user.NgaySinh,
        gioi_tinh=user.GioiTinh,
        anh_dai_dien=user.AnhDaiDien,
        diem_ren_luyen_hien_tai=_diem_ren_luyen_hien_tai(db, user.MaTaiKhoan),
        so_su_kien_da_tham_gia=_dem_su_kien_da_tham_gia(db, user.MaTaiKhoan),
        trang_thai=user.TrangThai if user.TrangThai is not None else 1,
        ngay_tao=user.NgayTao,
    )


def lay_danh_sach_sinh_vien(
    db: Session,
    tu_khoa: str | None = None,
    trang_thai: int | None = None,
) -> list[SinhVienResponse]:

    query = db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_SINH_VIEN)

    if tu_khoa:
        pattern = f"%{tu_khoa}%"
        query = query.filter(
            or_(
                TaiKhoan.HoTen.like(pattern),
                TaiKhoan.Email.like(pattern),
                TaiKhoan.MSSV.like(pattern),
            )
        )

    if trang_thai is not None:
        query = query.filter(TaiKhoan.TrangThai == trang_thai)

    ds = query.order_by(TaiKhoan.MaTaiKhoan.desc()).all()

    return [_to_response(db, item) for item in ds]


def lay_thong_ke_sinh_vien(db: Session) -> ThongKeSinhVienResponse:

    base = db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_SINH_VIEN)

    tong = base.count()
    dang_hoat_dong = base.filter(TaiKhoan.TrangThai == 1).count()
    da_khoa = base.filter(TaiKhoan.TrangThai == 0).count()

    diem_tb = (
        db.query(func.avg(DiemRenLuyen.TongDiem))
        .join(TaiKhoan, DiemRenLuyen.MaTaiKhoan == TaiKhoan.MaTaiKhoan)
        .filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_SINH_VIEN)
        .scalar()
    )

    return ThongKeSinhVienResponse(
        tong_sinh_vien=tong,
        dang_hoat_dong=dang_hoat_dong,
        da_khoa=da_khoa,
        diem_ren_luyen_trung_binh=round(diem_tb) if diem_tb is not None else 0,
    )


def _lay_sinh_vien_hoac_404(db: Session, ma_tai_khoan: int) -> TaiKhoan:

    user = (
        db.query(TaiKhoan)
        .filter(
            TaiKhoan.MaTaiKhoan == ma_tai_khoan,
            TaiKhoan.MaVaiTro == MA_VAI_TRO_SINH_VIEN,
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay sinh vien",
        )

    return user


def tao_sinh_vien(db: Session, data: SinhVienCreateRequest) -> SinhVienResponse:

    if db.query(TaiKhoan).filter(TaiKhoan.Email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email nay da duoc su dung",
        )

    if db.query(TaiKhoan).filter(TaiKhoan.MSSV == data.mssv).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MSSV nay da duoc su dung",
        )

    user = TaiKhoan(
        HoTen=data.ho_ten,
        Email=data.email,
        MatKhau=hash_password(data.mat_khau),
        MaVaiTro=MA_VAI_TRO_SINH_VIEN,
        MSSV=data.mssv,
        SoDienThoai=data.so_dien_thoai,
        NgaySinh=data.ngay_sinh,
        GioiTinh=data.gioi_tinh,
        TrangThai=1,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return _to_response(db, user)


def cap_nhat_sinh_vien(
    db: Session,
    ma_tai_khoan: int,
    data: SinhVienUpdateRequest,
) -> SinhVienResponse:

    user = _lay_sinh_vien_hoac_404(db, ma_tai_khoan)

    if data.email and data.email != user.Email:
        if db.query(TaiKhoan).filter(TaiKhoan.Email == data.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email nay da duoc su dung",
            )
        user.Email = data.email

    if data.mssv and data.mssv != user.MSSV:
        if db.query(TaiKhoan).filter(TaiKhoan.MSSV == data.mssv).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="MSSV nay da duoc su dung",
            )
        user.MSSV = data.mssv

    if data.ho_ten is not None:
        user.HoTen = data.ho_ten

    if data.so_dien_thoai is not None:
        user.SoDienThoai = data.so_dien_thoai

    if data.ngay_sinh is not None:
        user.NgaySinh = data.ngay_sinh

    if data.gioi_tinh is not None:
        user.GioiTinh = data.gioi_tinh

    db.commit()
    db.refresh(user)

    return _to_response(db, user)


def doi_trang_thai_sinh_vien(db: Session, ma_tai_khoan: int) -> MessageResponse:

    user = _lay_sinh_vien_hoac_404(db, ma_tai_khoan)

    user.TrangThai = 0 if user.TrangThai == 1 else 1

    db.commit()

    return MessageResponse(
        message="Da khoa tai khoan" if user.TrangThai == 0 else "Da mo khoa tai khoan",
    )


def xoa_sinh_vien(db: Session, ma_tai_khoan: int) -> MessageResponse:

    user = _lay_sinh_vien_hoac_404(db, ma_tai_khoan)

    try:
        db.delete(user)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the xoa vi sinh vien nay da co du lieu lien quan (dang ky, diem ren luyen...). Hay khoa tai khoan thay vi xoa.",
        )

    return MessageResponse(message="Da xoa sinh vien")


def lay_diem_ren_luyen_cua_sinh_vien(
    db: Session, ma_tai_khoan: int
) -> list[DiemRenLuyenHocKyResponse]:

    _lay_sinh_vien_hoac_404(db, ma_tai_khoan)

    ds = (
        db.query(DiemRenLuyen)
        .filter(DiemRenLuyen.MaTaiKhoan == ma_tai_khoan)
        .order_by(DiemRenLuyen.NamHoc.desc(), DiemRenLuyen.HocKy.desc())
        .all()
    )

    return [
        DiemRenLuyenHocKyResponse(
            ma_diem_ren_luyen=drl.MaDiemRenLuyen,
            hoc_ky=drl.HocKy,
            nam_hoc=drl.NamHoc,
            diem_truong=drl.DiemTruong,
            diem_hoat_dong=drl.DiemHoatDong,
            tong_diem=drl.TongDiem,
            ngay_cap_nhat=drl.NgayCapNhat,
        )
        for drl in ds
    ]


def lay_su_kien_da_tham_gia(
    db: Session, ma_tai_khoan: int
) -> list[SuKienThamGiaResponse]:

    _lay_sinh_vien_hoac_404(db, ma_tai_khoan)

    ds = (
        db.query(DangKySuKien, SuKien)
        .join(SuKien, DangKySuKien.MaSuKien == SuKien.MaSuKien)
        .filter(DangKySuKien.MaTaiKhoan == ma_tai_khoan)
        .order_by(DangKySuKien.ThoiGianDangKy.desc())
        .all()
    )

    return [
        SuKienThamGiaResponse(
            ma_su_kien=sk.MaSuKien,
            ten_su_kien=sk.TenSuKien,
            trang_thai_dang_ky=dk.TrangThai,
            thoi_gian_dang_ky=dk.ThoiGianDangKy,
        )
        for dk, sk in ds
    ]
