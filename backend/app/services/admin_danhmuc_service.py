from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.danhmuc import LoaiSuKien
from app.models.sukien import SuKien
from app.schemas.admin_danhmuc_schema import (
    LoaiSuKienCreateRequest,
    LoaiSuKienUpdateRequest,
    LoaiSuKienAdminResponse,
    ThongKeDanhMucResponse,
    MessageResponse,
)


def _dem_su_kien_theo_danh_muc(db: Session) -> dict[int, int]:

    ket_qua = (
        db.query(SuKien.MaLoaiSuKien, func.count(SuKien.MaSuKien))
        .group_by(SuKien.MaLoaiSuKien)
        .all()
    )

    return {ma: so_luong for ma, so_luong in ket_qua}


def lay_danh_sach_danh_muc(
    db: Session,
    tu_khoa: str | None = None,
    trang_thai: int | None = None,
) -> list[LoaiSuKienAdminResponse]:

    query = db.query(LoaiSuKien)

    if tu_khoa:
        query = query.filter(LoaiSuKien.TenLoaiSuKien.like(f"%{tu_khoa}%"))

    if trang_thai is not None:
        query = query.filter(LoaiSuKien.TrangThai == trang_thai)

    ds = query.order_by(LoaiSuKien.MaLoaiSuKien.desc()).all()

    dem_su_kien = _dem_su_kien_theo_danh_muc(db)

    return [
        LoaiSuKienAdminResponse(
            ma_loai_su_kien=item.MaLoaiSuKien,
            ten_loai_su_kien=item.TenLoaiSuKien,
            mo_ta=item.MoTa,
            trang_thai=item.TrangThai,
            so_su_kien=dem_su_kien.get(item.MaLoaiSuKien, 0),
        )
        for item in ds
    ]


def lay_thong_ke_danh_muc(db: Session) -> ThongKeDanhMucResponse:

    tong = db.query(LoaiSuKien).count()
    dang_dung = db.query(LoaiSuKien).filter(LoaiSuKien.TrangThai == 1).count()
    da_khoa = db.query(LoaiSuKien).filter(LoaiSuKien.TrangThai == 0).count()
    tong_su_kien = db.query(SuKien).count()

    return ThongKeDanhMucResponse(
        tong_danh_muc=tong,
        dang_su_dung=dang_dung,
        da_khoa=da_khoa,
        tong_su_kien=tong_su_kien,
    )


def _lay_hoac_404(db: Session, ma_loai_su_kien: int) -> LoaiSuKien:

    item = (
        db.query(LoaiSuKien)
        .filter(LoaiSuKien.MaLoaiSuKien == ma_loai_su_kien)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay danh muc",
        )

    return item


def tao_danh_muc(
    db: Session,
    data: LoaiSuKienCreateRequest,
) -> LoaiSuKienAdminResponse:

    if (
        db.query(LoaiSuKien)
        .filter(LoaiSuKien.TenLoaiSuKien == data.ten_loai_su_kien)
        .first()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ten danh muc nay da ton tai",
        )

    item = LoaiSuKien(
        TenLoaiSuKien=data.ten_loai_su_kien,
        MoTa=data.mo_ta,
        TrangThai=1,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return LoaiSuKienAdminResponse(
        ma_loai_su_kien=item.MaLoaiSuKien,
        ten_loai_su_kien=item.TenLoaiSuKien,
        mo_ta=item.MoTa,
        trang_thai=item.TrangThai,
        so_su_kien=0,
    )


def cap_nhat_danh_muc(
    db: Session,
    ma_loai_su_kien: int,
    data: LoaiSuKienUpdateRequest,
) -> LoaiSuKienAdminResponse:

    item = _lay_hoac_404(db, ma_loai_su_kien)

    if data.ten_loai_su_kien is not None:
        item.TenLoaiSuKien = data.ten_loai_su_kien

    if data.mo_ta is not None:
        item.MoTa = data.mo_ta

    db.commit()
    db.refresh(item)

    dem_su_kien = _dem_su_kien_theo_danh_muc(db)

    return LoaiSuKienAdminResponse(
        ma_loai_su_kien=item.MaLoaiSuKien,
        ten_loai_su_kien=item.TenLoaiSuKien,
        mo_ta=item.MoTa,
        trang_thai=item.TrangThai,
        so_su_kien=dem_su_kien.get(item.MaLoaiSuKien, 0),
    )


def doi_trang_thai_danh_muc(
    db: Session,
    ma_loai_su_kien: int,
) -> MessageResponse:

    item = _lay_hoac_404(db, ma_loai_su_kien)

    item.TrangThai = 0 if item.TrangThai == 1 else 1

    db.commit()

    return MessageResponse(
        message="Da khoa danh muc" if item.TrangThai == 0 else "Da mo khoa danh muc",
    )


def xoa_danh_muc(
    db: Session,
    ma_loai_su_kien: int,
) -> MessageResponse:

    item = _lay_hoac_404(db, ma_loai_su_kien)

    so_su_kien = (
        db.query(SuKien)
        .filter(SuKien.MaLoaiSuKien == ma_loai_su_kien)
        .count()
    )

    if so_su_kien > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Khong the xoa vi con {so_su_kien} su kien thuoc danh muc nay. Hay khoa danh muc thay vi xoa.",
        )

    try:
        db.delete(item)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the xoa danh muc nay",
        )

    return MessageResponse(message="Da xoa danh muc")
