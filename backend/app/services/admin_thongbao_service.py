from datetime import datetime, time

from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.taikhoan import TaiKhoan
from app.models.thongbao import NguoiNhanThongBao, ThongBao
from app.models.dangky import DangKySuKien
from app.models.sukien import SuKien
from app.schemas.admin_thongbao_schema import (
    AdminThongBaoChiTietResponse,
    AdminThongBaoCreateRequest,
    AdminThongBaoResponse,
    DoiTuongNhan,
    MessageResponse,
    NguoiNhanChiTietResponse,
    ThongKeThongBaoResponse,
)

MA_VAI_TRO_SINH_VIEN = 3
MA_VAI_TRO_BAN_TO_CHUC = 2


def _dem_theo_thong_bao(db: Session) -> dict[int, tuple[int, int]]:
    """Trả về {ma_thong_bao: (so_nguoi_nhan, so_da_doc)}."""

    ket_qua: dict[int, tuple[int, int]] = {}

    tong_theo_tb = (
        db.query(
            NguoiNhanThongBao.MaThongBao,
            func.count(NguoiNhanThongBao.MaNhan),
        )
        .group_by(NguoiNhanThongBao.MaThongBao)
        .all()
    )

    da_doc_theo_tb = (
        db.query(
            NguoiNhanThongBao.MaThongBao,
            func.count(NguoiNhanThongBao.MaNhan),
        )
        .filter(NguoiNhanThongBao.DaDoc == True)  # noqa: E712
        .group_by(NguoiNhanThongBao.MaThongBao)
        .all()
    )

    da_doc_map = {ma_tb: so_luong for ma_tb, so_luong in da_doc_theo_tb}

    for ma_tb, tong in tong_theo_tb:
        ket_qua[ma_tb] = (tong, da_doc_map.get(ma_tb, 0))

    return ket_qua


def _to_response(tb: ThongBao, dem: dict[int, tuple[int, int]]) -> AdminThongBaoResponse:
    so_nguoi_nhan, so_da_doc = dem.get(tb.MaThongBao, (0, 0))

    return AdminThongBaoResponse(
        ma_thong_bao=tb.MaThongBao,
        tieu_de=tb.TieuDe,
        noi_dung=tb.NoiDung,
        loai_thong_bao=tb.LoaiThongBao,
        thoi_gian_gui=tb.ThoiGianGui,
        so_nguoi_nhan=so_nguoi_nhan,
        so_da_doc=so_da_doc,
    )


def lay_danh_sach_thong_bao(
    db: Session,
    tu_khoa: str | None = None,
    loai_thong_bao: str | None = None,
) -> list[AdminThongBaoResponse]:

    query = db.query(ThongBao)

    if tu_khoa:
        pattern = f"%{tu_khoa}%"
        query = query.filter(
            or_(
                ThongBao.TieuDe.like(pattern),
                ThongBao.NoiDung.like(pattern),
            )
        )

    if loai_thong_bao:
        query = query.filter(ThongBao.LoaiThongBao == loai_thong_bao)

    ds = query.order_by(ThongBao.ThoiGianGui.desc()).all()

    dem = _dem_theo_thong_bao(db)

    return [_to_response(tb, dem) for tb in ds]


def lay_thong_ke(db: Session) -> ThongKeThongBaoResponse:

    tong_thong_bao = db.query(ThongBao).count()

    hom_nay = datetime.now().date()
    bat_dau_ngay = datetime.combine(hom_nay, time.min)
    ket_thuc_ngay = datetime.combine(hom_nay, time.max)

    gui_hom_nay = (
        db.query(ThongBao)
        .filter(ThongBao.ThoiGianGui >= bat_dau_ngay, ThongBao.ThoiGianGui <= ket_thuc_ngay)
        .count()
    )

    tong_luot_nhan = db.query(NguoiNhanThongBao).count()
    tong_da_doc = (
        db.query(NguoiNhanThongBao)
        .filter(NguoiNhanThongBao.DaDoc == True)  # noqa: E712
        .count()
    )

    ty_le_da_doc = round((tong_da_doc / tong_luot_nhan) * 100) if tong_luot_nhan else 0

    return ThongKeThongBaoResponse(
        tong_thong_bao=tong_thong_bao,
        gui_hom_nay=gui_hom_nay,
        tong_luot_nhan=tong_luot_nhan,
        ty_le_da_doc=ty_le_da_doc,
    )


def _lay_thong_bao_hoac_404(db: Session, ma_thong_bao: int) -> ThongBao:

    tb = db.query(ThongBao).filter(ThongBao.MaThongBao == ma_thong_bao).first()

    if not tb:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay thong bao",
        )

    return tb


def lay_chi_tiet_thong_bao(db: Session, ma_thong_bao: int) -> AdminThongBaoChiTietResponse:

    tb = _lay_thong_bao_hoac_404(db, ma_thong_bao)

    dem = _dem_theo_thong_bao(db)

    nguoi_nhan = (
        db.query(NguoiNhanThongBao, TaiKhoan)
        .join(TaiKhoan, NguoiNhanThongBao.MaTaiKhoan == TaiKhoan.MaTaiKhoan)
        .filter(NguoiNhanThongBao.MaThongBao == ma_thong_bao)
        .order_by(NguoiNhanThongBao.MaNhan.asc())
        .all()
    )

    co_ban = _to_response(tb, dem)

    return AdminThongBaoChiTietResponse(
        **co_ban.model_dump(),
        nguoi_nhan=[
            NguoiNhanChiTietResponse(
                ma_nhan=nn.MaNhan,
                ma_tai_khoan=nn.MaTaiKhoan,
                ho_ten=tk.HoTen,
                email=tk.Email,
                da_doc=nn.DaDoc,
                thoi_gian_doc=nn.ThoiGianDoc,
            )
            for nn, tk in nguoi_nhan
        ],
    )


def _lay_danh_sach_nguoi_nhan(
    db: Session,
    doi_tuong_nhan: DoiTuongNhan,
    ma_su_kien: int | None,
) -> list[int]:

    if doi_tuong_nhan == DoiTuongNhan.TAT_CA:
        ds = (
            db.query(TaiKhoan.MaTaiKhoan)
            .filter(TaiKhoan.MaVaiTro.in_([MA_VAI_TRO_SINH_VIEN, MA_VAI_TRO_BAN_TO_CHUC]))
            .all()
        )
        return [ma for (ma,) in ds]

    if doi_tuong_nhan == DoiTuongNhan.SINH_VIEN:
        ds = (
            db.query(TaiKhoan.MaTaiKhoan)
            .filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_SINH_VIEN)
            .all()
        )
        return [ma for (ma,) in ds]

    if doi_tuong_nhan == DoiTuongNhan.BAN_TO_CHUC:
        ds = (
            db.query(TaiKhoan.MaTaiKhoan)
            .filter(TaiKhoan.MaVaiTro == MA_VAI_TRO_BAN_TO_CHUC)
            .all()
        )
        return [ma for (ma,) in ds]

    if doi_tuong_nhan == DoiTuongNhan.SU_KIEN:
        if not ma_su_kien:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vui long chon su kien de gui thong bao",
            )

        su_kien = db.query(SuKien).filter(SuKien.MaSuKien == ma_su_kien).first()
        if not su_kien:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Khong tim thay su kien",
            )

        ds = (
            db.query(DangKySuKien.MaTaiKhoan)
            .filter(
                DangKySuKien.MaSuKien == ma_su_kien,
                DangKySuKien.TrangThai != "DaHuy",
            )
            .distinct()
            .all()
        )
        return [ma for (ma,) in ds]

    return []


def tao_thong_bao(db: Session, data: AdminThongBaoCreateRequest) -> AdminThongBaoResponse:

    danh_sach_ma_tai_khoan = _lay_danh_sach_nguoi_nhan(db, data.doi_tuong_nhan, data.ma_su_kien)

    if not danh_sach_ma_tai_khoan:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Khong tim thay nguoi nhan phu hop de gui thong bao",
        )

    tb = ThongBao(
        TieuDe=data.tieu_de,
        NoiDung=data.noi_dung,
        LoaiThongBao=data.loai_thong_bao,
    )
    db.add(tb)
    db.flush()

    for ma_tai_khoan in danh_sach_ma_tai_khoan:
        db.add(
            NguoiNhanThongBao(
                MaThongBao=tb.MaThongBao,
                MaTaiKhoan=ma_tai_khoan,
                DaDoc=False,
            )
        )

    db.commit()
    db.refresh(tb)

    dem = {tb.MaThongBao: (len(danh_sach_ma_tai_khoan), 0)}

    return _to_response(tb, dem)


def xoa_thong_bao(db: Session, ma_thong_bao: int) -> MessageResponse:

    tb = _lay_thong_bao_hoac_404(db, ma_thong_bao)

    db.delete(tb)
    db.commit()

    return MessageResponse(message="Da xoa thong bao")
