from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.security import hash_password
from app.models.taikhoan import TaiKhoan, VaiTro, TrungTam
from app.schemas.admin_taikhoan_schema import (
    TaiKhoanAdminCreateRequest,
    TaiKhoanAdminUpdateRequest,
    TaiKhoanAdminResponse,
    ThongKeTaiKhoanResponse,
    MessageResponse,
)


def _to_response(user: TaiKhoan) -> TaiKhoanAdminResponse:
    return TaiKhoanAdminResponse(
        ma_tai_khoan=user.MaTaiKhoan,
        ho_ten=user.HoTen,
        email=user.Email,
        so_dien_thoai=user.SoDienThoai,
        ngay_sinh=user.NgaySinh,
        gioi_tinh=user.GioiTinh,
        mssv=user.MSSV,
        anh_dai_dien=user.AnhDaiDien,
        ma_vai_tro=user.MaVaiTro,
        ten_vai_tro=user.vai_tro.TenVaiTro if user.vai_tro else "",
        ma_trung_tam=user.MaTrungTam,
        ten_trung_tam=user.trung_tam.TenTrungTam if getattr(user, "trung_tam", None) else None,
        trang_thai=user.TrangThai if user.TrangThai is not None else 1,
        ngay_tao=user.NgayTao,
    )


def lay_danh_sach_tai_khoan(
    db: Session,
    tu_khoa: str | None = None,
    ma_vai_tro: int | None = None,
    trang_thai: int | None = None,
) -> list[TaiKhoanAdminResponse]:

    query = db.query(TaiKhoan)

    if tu_khoa:
        pattern = f"%{tu_khoa}%"
        query = query.filter(
            or_(
                TaiKhoan.HoTen.like(pattern),
                TaiKhoan.Email.like(pattern),
            )
        )

    if ma_vai_tro:
        query = query.filter(TaiKhoan.MaVaiTro == ma_vai_tro)

    if trang_thai is not None:
        query = query.filter(TaiKhoan.TrangThai == trang_thai)

    ds = query.order_by(TaiKhoan.MaTaiKhoan.desc()).all()

    return [_to_response(item) for item in ds]


def lay_thong_ke_tai_khoan(db: Session) -> ThongKeTaiKhoanResponse:

    tong = db.query(TaiKhoan).count()
    admin = db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == 1).count()
    ban_to_chuc = db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == 2).count()
    sinh_vien = db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == 3).count()

    return ThongKeTaiKhoanResponse(
        tong_tai_khoan=tong,
        tong_admin=admin,
        tong_ban_to_chuc=ban_to_chuc,
        tong_sinh_vien=sinh_vien,
    )


def tao_tai_khoan(
    db: Session,
    data: TaiKhoanAdminCreateRequest,
) -> TaiKhoanAdminResponse:

    if db.query(TaiKhoan).filter(TaiKhoan.Email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email nay da duoc su dung",
        )

    if not db.query(VaiTro).filter(VaiTro.MaVaiTro == data.ma_vai_tro).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vai tro khong hop le",
        )

    if data.mssv and db.query(TaiKhoan).filter(TaiKhoan.MSSV == data.mssv).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MSSV nay da duoc su dung",
        )

    user = TaiKhoan(
        HoTen=data.ho_ten,
        Email=data.email,
        MatKhau=hash_password(data.mat_khau),
        MaVaiTro=data.ma_vai_tro,
        SoDienThoai=data.so_dien_thoai,
        NgaySinh=data.ngay_sinh,
        GioiTinh=data.gioi_tinh,
        MSSV=data.mssv,
        MaTrungTam=data.ma_trung_tam,
        TrangThai=1,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return _to_response(user)


def _lay_tai_khoan_hoac_404(db: Session, ma_tai_khoan: int) -> TaiKhoan:

    user = (
        db.query(TaiKhoan)
        .filter(TaiKhoan.MaTaiKhoan == ma_tai_khoan)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay tai khoan",
        )

    return user


def cap_nhat_tai_khoan(
    db: Session,
    ma_tai_khoan: int,
    data: TaiKhoanAdminUpdateRequest,
) -> TaiKhoanAdminResponse:

    user = _lay_tai_khoan_hoac_404(db, ma_tai_khoan)

    if data.email and data.email != user.Email:
        if db.query(TaiKhoan).filter(TaiKhoan.Email == data.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email nay da duoc su dung",
            )
        user.Email = data.email

    if data.ho_ten is not None:
        user.HoTen = data.ho_ten

    if data.ma_vai_tro is not None:
        user.MaVaiTro = data.ma_vai_tro

    if data.so_dien_thoai is not None:
        user.SoDienThoai = data.so_dien_thoai

    if data.ngay_sinh is not None:
        user.NgaySinh = data.ngay_sinh

    if data.gioi_tinh is not None:
        user.GioiTinh = data.gioi_tinh

    if data.mssv is not None:
        user.MSSV = data.mssv

    if data.ma_trung_tam is not None:
        user.MaTrungTam = data.ma_trung_tam

    db.commit()
    db.refresh(user)

    return _to_response(user)


def doi_trang_thai_tai_khoan(
    db: Session,
    ma_tai_khoan: int,
    admin_dang_dang_nhap: TaiKhoan,
) -> MessageResponse:

    user = _lay_tai_khoan_hoac_404(db, ma_tai_khoan)

    if user.MaTaiKhoan == admin_dang_dang_nhap.MaTaiKhoan:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the tu khoa tai khoan cua chinh minh",
        )

    user.TrangThai = 0 if user.TrangThai == 1 else 1

    db.commit()

    return MessageResponse(
        message="Da khoa tai khoan" if user.TrangThai == 0 else "Da mo khoa tai khoan",
    )


def xoa_tai_khoan(
    db: Session,
    ma_tai_khoan: int,
    admin_dang_dang_nhap: TaiKhoan,
) -> MessageResponse:

    user = _lay_tai_khoan_hoac_404(db, ma_tai_khoan)

    if user.MaTaiKhoan == admin_dang_dang_nhap.MaTaiKhoan:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the xoa tai khoan cua chinh minh",
        )

    try:
        db.delete(user)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the xoa vi tai khoan nay da co du lieu lien quan (dang ky, danh gia...). Hay khoa tai khoan thay vi xoa.",
        )

    return MessageResponse(message="Da xoa tai khoan")
