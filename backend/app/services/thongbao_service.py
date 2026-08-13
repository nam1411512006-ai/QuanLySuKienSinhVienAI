from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.taikhoan import TaiKhoan
from app.models.thongbao import (
    ThongBao,
    NguoiNhanThongBao,
)
from app.schemas.thongbao_schema import (
    ThongBaoResponse,
    SoThongBaoChuaDoc,
    ThongBaoMessage,
)


# =====================================================
# LẤY DANH SÁCH THÔNG BÁO
# =====================================================

def lay_danh_sach_thong_bao(
    db: Session,
    ma_tai_khoan: int,
):

    ket_qua = (
        db.query(
            NguoiNhanThongBao,
            ThongBao,
        )
        .join(
            ThongBao,
            NguoiNhanThongBao.MaThongBao == ThongBao.MaThongBao,
        )
        .filter(
            NguoiNhanThongBao.MaTaiKhoan == ma_tai_khoan,
        )
        .order_by(
            ThongBao.ThoiGianGui.desc(),
        )
        .all()
    )

    danh_sach = []

    for nguoi_nhan, thong_bao in ket_qua:

        danh_sach.append(

            ThongBaoResponse(
                ma_nhan=nguoi_nhan.MaNhan,
                ma_thong_bao=thong_bao.MaThongBao,
                tieu_de=thong_bao.TieuDe,
                noi_dung=thong_bao.NoiDung,
                loai_thong_bao=thong_bao.LoaiThongBao,
                thoi_gian_gui=thong_bao.ThoiGianGui,
                da_doc=nguoi_nhan.DaDoc,
            )

        )

    return danh_sach


# =====================================================
# ĐẾM THÔNG BÁO CHƯA ĐỌC
# =====================================================

def dem_thong_bao_chua_doc(
    db: Session,
    ma_tai_khoan: int,
):

    so_luong = (
        db.query(NguoiNhanThongBao)
        .filter(
            NguoiNhanThongBao.MaTaiKhoan == ma_tai_khoan,
            NguoiNhanThongBao.DaDoc == False,
        )
        .count()
    )

    return SoThongBaoChuaDoc(
        so_luong=so_luong,
    )


# =====================================================
# ĐÁNH DẤU ĐÃ ĐỌC
# =====================================================

def danh_dau_da_doc(
    db: Session,
    ma_nhan: int,
    ma_tai_khoan: int,
):

    thong_bao = (
        db.query(NguoiNhanThongBao)
        .filter(
            NguoiNhanThongBao.MaNhan == ma_nhan,
            NguoiNhanThongBao.MaTaiKhoan == ma_tai_khoan,
        )
        .first()
    )

    if not thong_bao:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay thong bao",
        )

    thong_bao.DaDoc = True
    thong_bao.ThoiGianDoc = datetime.now()

    db.commit()

    return ThongBaoMessage(
        message="Da danh dau da doc",
    )


# =====================================================
# ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC
# =====================================================

def danh_dau_tat_ca(
    db: Session,
    ma_tai_khoan: int,
):

    danh_sach = (
        db.query(NguoiNhanThongBao)
        .filter(
            NguoiNhanThongBao.MaTaiKhoan == ma_tai_khoan,
            NguoiNhanThongBao.DaDoc == False,
        )
        .all()
    )

    for item in danh_sach:

        item.DaDoc = True
        item.ThoiGianDoc = datetime.now()

    db.commit()

    return ThongBaoMessage(
        message="Da danh dau tat ca",
    )


# =====================================================
# TẠO THÔNG BÁO
# =====================================================

def tao_thong_bao(
    db: Session,
    ma_tai_khoan: int,
    tieu_de: str,
    noi_dung: str,
    loai: str,
):

    tai_khoan = (
        db.query(TaiKhoan)
        .filter(
            TaiKhoan.MaTaiKhoan == ma_tai_khoan,
        )
        .first()
    )

    if not tai_khoan:
        return

    thong_bao = ThongBao(

        TieuDe=tieu_de,

        NoiDung=noi_dung,

        LoaiThongBao=loai,

    )

    db.add(thong_bao)

    db.flush()

    nguoi_nhan = NguoiNhanThongBao(

        MaThongBao=thong_bao.MaThongBao,

        MaTaiKhoan=ma_tai_khoan,

        DaDoc=False,

    )

    db.add(nguoi_nhan)

    db.commit()





def lay_chi_tiet_thong_bao(
    db: Session,
    ma_nhan: int,
    ma_tai_khoan: int,
):

    ket_qua = (

        db.query(
            NguoiNhanThongBao,
            ThongBao
        )

        .join(
            ThongBao,
            NguoiNhanThongBao.MaThongBao
            ==
            ThongBao.MaThongBao
        )

        .filter(
            NguoiNhanThongBao.MaNhan == ma_nhan,

            NguoiNhanThongBao.MaTaiKhoan
            ==
            ma_tai_khoan
        )

        .first()

    )


    if not ket_qua:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Khong tim thay thong bao"

        )


    nguoi_nhan, thong_bao = ket_qua


    return {

        "ma_nhan": nguoi_nhan.MaNhan,

        "ma_thong_bao": thong_bao.MaThongBao,

        "tieu_de": thong_bao.TieuDe,

        "noi_dung": thong_bao.NoiDung,

        "loai_thong_bao": thong_bao.LoaiThongBao,

        "thoi_gian_gui": thong_bao.ThoiGianGui,

        "da_doc": nguoi_nhan.DaDoc

    }

# =====================================================
# LẤY CHI TIẾT THÔNG BÁO
# =====================================================

def lay_chi_tiet_thong_bao(
    db: Session,
    ma_nhan: int,
    ma_tai_khoan: int,
):

    ket_qua = (

        db.query(
            NguoiNhanThongBao,
            ThongBao
        )

        .join(
            ThongBao,
            NguoiNhanThongBao.MaThongBao
            ==
            ThongBao.MaThongBao
        )

        .filter(

            NguoiNhanThongBao.MaNhan == ma_nhan,

            NguoiNhanThongBao.MaTaiKhoan
            ==
            ma_tai_khoan

        )

        .first()

    )



    if not ket_qua:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Khong tim thay thong bao"

        )



    nguoi_nhan, thong_bao = ket_qua



    return {


        "ma_nhan":
            nguoi_nhan.MaNhan,


        "ma_thong_bao":
            thong_bao.MaThongBao,


        "tieu_de":
            thong_bao.TieuDe,


        "noi_dung":
            thong_bao.NoiDung,


        "loai_thong_bao":
            thong_bao.LoaiThongBao,


        "thoi_gian_gui":
            thong_bao.ThoiGianGui,


        "da_doc":
            nguoi_nhan.DaDoc,


    }