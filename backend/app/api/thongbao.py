from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.thongbao_schema import (
    ThongBaoMessage,
    ThongBaoResponse,
    SoThongBaoChuaDoc,
    ThongBaoDetailResponse,
)
from app.services.thongbao_service import (
    lay_danh_sach_thong_bao,
    dem_thong_bao_chua_doc,
    danh_dau_da_doc,
    danh_dau_tat_ca,
    lay_chi_tiet_thong_bao,
)

router = APIRouter(
    prefix="/thong-bao",
    tags=["Thong bao"],
)


# =====================================================
# DANH SÁCH THÔNG BÁO
# =====================================================

@router.get(
    "",
    response_model=List[ThongBaoResponse],
)
def danh_sach_thong_bao(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return lay_danh_sach_thong_bao(
        db=db,
        ma_tai_khoan=current_user.MaTaiKhoan,
    )


# =====================================================
# ĐẾM THÔNG BÁO CHƯA ĐỌC
# =====================================================

@router.get(
    "/chua-doc",
    response_model=SoThongBaoChuaDoc,
)
def so_thong_bao_chua_doc(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return dem_thong_bao_chua_doc(
        db=db,
        ma_tai_khoan=current_user.MaTaiKhoan,
    )


# =====================================================
# ĐÁNH DẤU ĐÃ ĐỌC
# =====================================================

@router.put(
    "/{ma_nhan}/da-doc",
    response_model=ThongBaoMessage,
)
def da_doc(
    ma_nhan: int,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return danh_dau_da_doc(
        db=db,
        ma_nhan=ma_nhan,
        ma_tai_khoan=current_user.MaTaiKhoan,
    )


# =====================================================
# ĐÁNH DẤU TẤT CẢ
# =====================================================

@router.put(
    "/da-doc-tat-ca",
    response_model=ThongBaoMessage,
)
def da_doc_tat_ca(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return danh_dau_tat_ca(
        db=db,
        ma_tai_khoan=current_user.MaTaiKhoan,
    )

# =====================================================
# CHI TIẾT THÔNG BÁO
# =====================================================

@router.get(
    "/chi-tiet/{ma_nhan}",
    response_model=ThongBaoDetailResponse,
)
def chi_tiet_thong_bao(
    ma_nhan: int,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):

    return lay_chi_tiet_thong_bao(
        db=db,
        ma_nhan=ma_nhan,
        ma_tai_khoan=current_user.MaTaiKhoan,
    )