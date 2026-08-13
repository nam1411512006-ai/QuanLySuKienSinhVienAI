from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.taikhoan import TaiKhoan, VaiTro
from app.schemas.admin_vaitro_schema import (
    VaiTroCreateRequest,
    VaiTroUpdateRequest,
    VaiTroResponse,
    MessageResponse,
)

# 3 vai tro goc duoc code hoa cung ("hardcode") trong toan bo he thong
# (vi du: app/core/dependencies.py kiem tra MaVaiTro == 1 de xac dinh Admin).
# Vi vay khong duoc phep xoa hoac doi ten cac vai tro nay de tranh vo he thong phan quyen.
CAC_MA_VAI_TRO_HE_THONG = {1, 2, 3}


def _dem_nguoi_dung(db: Session, ma_vai_tro: int) -> int:
    return db.query(TaiKhoan).filter(TaiKhoan.MaVaiTro == ma_vai_tro).count()


def _to_response(db: Session, vt: VaiTro) -> VaiTroResponse:
    return VaiTroResponse(
        ma_vai_tro=vt.MaVaiTro,
        ten_vai_tro=vt.TenVaiTro,
        mo_ta=vt.MoTa,
        so_nguoi_dung=_dem_nguoi_dung(db, vt.MaVaiTro),
        la_vai_tro_he_thong=vt.MaVaiTro in CAC_MA_VAI_TRO_HE_THONG,
    )


def lay_danh_sach_vai_tro(db: Session) -> list[VaiTroResponse]:
    ds = db.query(VaiTro).order_by(VaiTro.MaVaiTro.asc()).all()
    return [_to_response(db, vt) for vt in ds]


def _lay_vai_tro_hoac_404(db: Session, ma_vai_tro: int) -> VaiTro:
    vt = db.query(VaiTro).filter(VaiTro.MaVaiTro == ma_vai_tro).first()
    if not vt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay vai tro",
        )
    return vt


def tao_vai_tro(db: Session, data: VaiTroCreateRequest) -> VaiTroResponse:

    if db.query(VaiTro).filter(VaiTro.TenVaiTro == data.ten_vai_tro).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ten vai tro nay da ton tai",
        )

    vt = VaiTro(TenVaiTro=data.ten_vai_tro, MoTa=data.mo_ta)

    db.add(vt)
    db.commit()
    db.refresh(vt)

    return _to_response(db, vt)


def cap_nhat_vai_tro(
    db: Session, ma_vai_tro: int, data: VaiTroUpdateRequest
) -> VaiTroResponse:

    vt = _lay_vai_tro_hoac_404(db, ma_vai_tro)

    if ma_vai_tro in CAC_MA_VAI_TRO_HE_THONG and data.ten_vai_tro and data.ten_vai_tro != vt.TenVaiTro:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the doi ten vai tro he thong (Admin/BanToChuc/SinhVien) vi duoc dung co dinh trong ma nguon phan quyen.",
        )

    if data.ten_vai_tro is not None:
        trung = (
            db.query(VaiTro)
            .filter(VaiTro.TenVaiTro == data.ten_vai_tro, VaiTro.MaVaiTro != ma_vai_tro)
            .first()
        )
        if trung:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ten vai tro nay da ton tai",
            )
        vt.TenVaiTro = data.ten_vai_tro

    if data.mo_ta is not None:
        vt.MoTa = data.mo_ta

    db.commit()
    db.refresh(vt)

    return _to_response(db, vt)


def xoa_vai_tro(db: Session, ma_vai_tro: int) -> MessageResponse:

    vt = _lay_vai_tro_hoac_404(db, ma_vai_tro)

    if ma_vai_tro in CAC_MA_VAI_TRO_HE_THONG:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the xoa vai tro he thong (Admin/BanToChuc/SinhVien).",
        )

    if _dem_nguoi_dung(db, ma_vai_tro) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the xoa vi van con tai khoan dang su dung vai tro nay.",
        )

    try:
        db.delete(vt)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong the xoa vai tro nay vi con du lieu lien quan.",
        )

    return MessageResponse(message="Da xoa vai tro")
