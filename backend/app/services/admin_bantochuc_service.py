from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.security import hash_password
from app.models.taikhoan import TaiKhoan, TrungTam
from app.models.sukien import SuKien
from app.models.dangky import DangKySuKien
from app.schemas.admin_bantochuc_schema import (
    BanToChucCreateRequest,
    BanToChucUpdateRequest,
    BanToChucResponse,
    ThongKeBanToChucResponse,
    SuKienCuaBanToChucResponse,
    TrungTamCreateRequest,
    TrungTamUpdateRequest,
    TrungTamResponse,
    MessageResponse,
)

MA_VAI_TRO_BAN_TO_CHUC = 2


def _dem_su_kien(db: Session, ma_tai_khoan: int) -> int:
    return (
        db.query(SuKien)
        .filter(SuKien.MaNguoiTao == ma_tai_khoan)
        .count()
    )


def _to_response(db: Session, user: TaiKhoan) -> BanToChucResponse:
    return BanToChucResponse(
        ma_tai_khoan=user.MaTaiKhoan,
        ho_ten=user.HoTen,
        email=user.Email,
        so_dien_thoai=user.SoDienThoai,
        anh_dai_dien=user.AnhDaiDien,
        ma_trung_tam=user.MaTrungTam,
        ten_trung_tam=user.trung_tam.TenTrungTam if getattr(user, "trung_tam", None) else None,
        so_su_kien=_dem_su_kien(db, user.MaTaiKhoan),
        trang_thai=user.TrangThai if user.TrangThai is not None else 1,
        ngay_tao=user.NgayTao,
    )


def lay_danh_sach_ban_to_chuc(
    db: Session,
    tu_khoa: str | None = None,
    ma_trung_tam: int | None = None,
    trang_thai: int | None = None,
) -> list[BanToChucResponse]:

    query = db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_BAN_TO_CHUC)

    if tu_khoa:
        pattern = f"%{tu_khoa}%"
        query = query.filter(
            or_(
                TaiKhoan.HoTen.like(pattern),
                TaiKhoan.Email.like(pattern),
            )
        )

    if ma_trung_tam:
        query = query.filter(TaiKhoan.MaTrungTam == ma_trung_tam)

    if trang_thai is not None:
        query = query.filter(TaiKhoan.TrangThai == trang_thai)

    ds = query.order_by(TaiKhoan.MaTaiKhoan.desc()).all()

    return [_to_response(db, item) for item in ds]


def lay_thong_ke_ban_to_chuc(db: Session) -> ThongKeBanToChucResponse:

    base = db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_BAN_TO_CHUC)

    tong = base.count()
    dang_hoat_dong = base.filter(TaiKhoan.TrangThai == 1).count()
    da_khoa = base.filter(TaiKhoan.TrangThai == 0).count()

    tong_su_kien = (
        db.query(func.count(SuKien.MaSuKien))
        .join(TaiKhoan, SuKien.MaNguoiTao == TaiKhoan.MaTaiKhoan)
        .filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_BAN_TO_CHUC)
        .scalar()
    ) or 0

    return ThongKeBanToChucResponse(
        tong_ban_to_chuc=tong,
        dang_hoat_dong=dang_hoat_dong,
        da_khoa=da_khoa,
        tong_su_kien=tong_su_kien,
    )


def _lay_ban_to_chuc_hoac_404(db: Session, ma_tai_khoan: int) -> TaiKhoan:

    user = (
        db.query(TaiKhoan)
        .filter(
            TaiKhoan.MaTaiKhoan == ma_tai_khoan,
            TaiKhoan.MaVaiTro == MA_VAI_TRO_BAN_TO_CHUC,
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay tai khoan Ban to chuc",
        )

    return user


def tao_ban_to_chuc(db: Session, data: BanToChucCreateRequest) -> BanToChucResponse:

    if db.query(TaiKhoan).filter(TaiKhoan.Email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email nay da duoc su dung",
        )

    if data.ma_trung_tam and not db.query(TrungTam).filter(
        TrungTam.MaTrungTam == data.ma_trung_tam
    ).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trung tam khong hop le",
        )

    user = TaiKhoan(
        HoTen=data.ho_ten,
        Email=data.email,
        MatKhau=hash_password(data.mat_khau),
        MaVaiTro=MA_VAI_TRO_BAN_TO_CHUC,
        SoDienThoai=data.so_dien_thoai,
        MaTrungTam=data.ma_trung_tam,
        TrangThai=1,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return _to_response(db, user)


def cap_nhat_ban_to_chuc(
    db: Session,
    ma_tai_khoan: int,
    data: BanToChucUpdateRequest,
) -> BanToChucResponse:

    user = _lay_ban_to_chuc_hoac_404(db, ma_tai_khoan)

    if data.email and data.email != user.Email:
        if db.query(TaiKhoan).filter(TaiKhoan.Email == data.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email nay da duoc su dung",
            )
        user.Email = data.email

    if data.ho_ten is not None:
        user.HoTen = data.ho_ten

    if data.so_dien_thoai is not None:
        user.SoDienThoai = data.so_dien_thoai

    if data.ma_trung_tam is not None:
        if data.ma_trung_tam and not db.query(TrungTam).filter(
            TrungTam.MaTrungTam == data.ma_trung_tam
        ).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Trung tam khong hop le",
            )
        user.MaTrungTam = data.ma_trung_tam

    db.commit()
    db.refresh(user)

    return _to_response(db, user)


def doi_trang_thai_ban_to_chuc(db: Session, ma_tai_khoan: int) -> MessageResponse:

    user = _lay_ban_to_chuc_hoac_404(db, ma_tai_khoan)

    user.TrangThai = 0 if user.TrangThai == 1 else 1

    db.commit()

    return MessageResponse(
        message="Da khoa tai khoan" if user.TrangThai == 0 else "Da mo khoa tai khoan",
    )


def xoa_ban_to_chuc(db: Session, ma_tai_khoan: int) -> MessageResponse:

    user = _lay_ban_to_chuc_hoac_404(db, ma_tai_khoan)

    try:
        db.delete(user)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the xoa vi tai khoan nay da tao su kien hoac co du lieu lien quan. Hay khoa tai khoan thay vi xoa.",
        )

    return MessageResponse(message="Da xoa tai khoan Ban to chuc")


def lay_su_kien_cua_ban_to_chuc(
    db: Session, ma_tai_khoan: int
) -> list[SuKienCuaBanToChucResponse]:

    _lay_ban_to_chuc_hoac_404(db, ma_tai_khoan)

    ds = (
        db.query(SuKien)
        .filter(SuKien.MaNguoiTao == ma_tai_khoan)
        .order_by(SuKien.ThoiGianBatDau.desc())
        .all()
    )

    ket_qua = []
    for sk in ds:
        so_luong_dang_ky = (
            db.query(DangKySuKien)
            .filter(DangKySuKien.MaSuKien == sk.MaSuKien)
            .count()
        )
        ket_qua.append(
            SuKienCuaBanToChucResponse(
                ma_su_kien=sk.MaSuKien,
                ten_su_kien=sk.TenSuKien,
                trang_thai=sk.TrangThai,
                thoi_gian_bat_dau=sk.ThoiGianBatDau,
                thoi_gian_ket_thuc=sk.ThoiGianKetThuc,
                so_luong_dang_ky=so_luong_dang_ky,
            )
        )

    return ket_qua


# ==========================================================
# Quan ly Trung tam / Don vi to chuc
# ==========================================================


def _trung_tam_to_response(db: Session, tt: TrungTam) -> TrungTamResponse:
    so_thanh_vien = (
        db.query(TaiKhoan)
        .filter(
            TaiKhoan.MaTrungTam == tt.MaTrungTam,
            TaiKhoan.MaVaiTro == MA_VAI_TRO_BAN_TO_CHUC,
        )
        .count()
    )
    return TrungTamResponse(
        ma_trung_tam=tt.MaTrungTam,
        ten_trung_tam=tt.TenTrungTam,
        mo_ta=tt.MoTa,
        trang_thai=tt.TrangThai if tt.TrangThai is not None else 1,
        so_thanh_vien=so_thanh_vien,
    )


def lay_danh_sach_trung_tam(db: Session) -> list[TrungTamResponse]:
    ds = db.query(TrungTam).order_by(TrungTam.MaTrungTam.desc()).all()
    return [_trung_tam_to_response(db, item) for item in ds]


def tao_trung_tam(db: Session, data: TrungTamCreateRequest) -> TrungTamResponse:

    if db.query(TrungTam).filter(TrungTam.TenTrungTam == data.ten_trung_tam).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ten don vi nay da ton tai",
        )

    tt = TrungTam(
        TenTrungTam=data.ten_trung_tam,
        MoTa=data.mo_ta,
        TrangThai=1,
    )

    db.add(tt)
    db.commit()
    db.refresh(tt)

    return _trung_tam_to_response(db, tt)


def _lay_trung_tam_hoac_404(db: Session, ma_trung_tam: int) -> TrungTam:

    tt = db.query(TrungTam).filter(TrungTam.MaTrungTam == ma_trung_tam).first()

    if not tt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay don vi to chuc",
        )

    return tt


def cap_nhat_trung_tam(
    db: Session, ma_trung_tam: int, data: TrungTamUpdateRequest
) -> TrungTamResponse:

    tt = _lay_trung_tam_hoac_404(db, ma_trung_tam)

    if data.ten_trung_tam is not None:
        trung = (
            db.query(TrungTam)
            .filter(
                TrungTam.TenTrungTam == data.ten_trung_tam,
                TrungTam.MaTrungTam != ma_trung_tam,
            )
            .first()
        )
        if trung:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ten don vi nay da ton tai",
            )
        tt.TenTrungTam = data.ten_trung_tam

    if data.mo_ta is not None:
        tt.MoTa = data.mo_ta

    db.commit()
    db.refresh(tt)

    return _trung_tam_to_response(db, tt)


def xoa_trung_tam(db: Session, ma_trung_tam: int) -> MessageResponse:

    tt = _lay_trung_tam_hoac_404(db, ma_trung_tam)

    try:
        db.delete(tt)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the xoa vi don vi nay dang duoc su dung boi tai khoan hoac su kien.",
        )

    return MessageResponse(message="Da xoa don vi to chuc")
