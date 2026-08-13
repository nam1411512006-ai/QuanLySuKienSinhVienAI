from fastapi import APIRouter, Depends, Path, UploadFile, File
from sqlalchemy.orm import Session

from app.core.auth import require_roles
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan

from app.schemas.sukien_schema import (
    SuKienCreate,
    SuKienUpdate,
    SuKienResponse,
)
from app.schemas.admin_upload_schema import UploadFileResponse
from app.services import admin_upload_service
from app.schemas.dashboard_schema import DashboardResponse, ThongKeSuKienResponse
from app.schemas.dangky_schema import NguoiDangKyResponse
from app.schemas.diemdanh_schema import PhienQRResponse
from app.schemas.danhmuc_schema import LoaiSuKienResponse, TrungTamResponse
from app.schemas.danhgia_schema import DanhGiaResponse
from app.schemas.diemrenluyen_schema import LichSuDiemResponse

from app.services.sukien_service import (
    get_su_kien_by_id,
    create_su_kien,
    update_su_kien,
    delete_su_kien,
)
from app.services.dashboard_service import get_dashboard, get_thong_ke
from app.services.diemdanh_service import tao_phien_qr
from app.services.organizer_service import (
    get_my_events,
    get_my_event_by_id,
    get_registrations_of_event,
    get_danh_sach_loai_su_kien,
    get_danh_sach_trung_tam,
    get_danh_gia_of_event,
    get_lich_su_diem_of_event,
    xu_ly_vang_mat,
)

router = APIRouter(
    prefix="/organizer",
    tags=["Ban tổ chức"],
)

from app.services.organizer_service import (
    get_my_events,
    get_my_event_by_id,
    get_registrations_of_event,
    get_danh_sach_loai_su_kien,
    get_danh_sach_trung_tam,
    get_danh_gia_of_event,
)
from app.schemas.danhgia_schema import DanhGiaResponse

from app.services.organizer_service import (
    get_my_events,
    get_my_event_by_id,
    get_registrations_of_event,
    get_danh_sach_loai_su_kien,
    get_danh_sach_trung_tam,
    get_danh_gia_of_event,
    get_lich_su_diem_of_event,
)
from app.schemas.diemrenluyen_schema import LichSuDiemResponse


# =====================================================
# DANH SÁCH SỰ KIỆN CỦA TÔI
# =====================================================

@router.get(
    "/events",
    response_model=list[SuKienResponse],
)
def get_events(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return get_my_events(
        db,
        current_user.MaTaiKhoan,
    )


# =====================================================
# CHI TIẾT SỰ KIỆN
# =====================================================

@router.get(
    "/events/{ma_su_kien}",
    response_model=SuKienResponse,
)
def detail_event(
    ma_su_kien: int = Path(gt=0),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return get_my_event_by_id(
        db,
        ma_su_kien,
        current_user.MaTaiKhoan,
    )


# =====================================================
# UPLOAD ẢNH BÌA SỰ KIỆN
# =====================================================

@router.post(
    "/upload/anh",
    response_model=UploadFileResponse,
)
async def upload_anh_su_kien(
    file: UploadFile = File(...),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return await admin_upload_service.upload_anh(file)


# =====================================================
# THÊM SỰ KIỆN
# =====================================================

@router.post(
    "/events",
    response_model=SuKienResponse,
)
def create_event(
    data: SuKienCreate,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return create_su_kien(
        db,
        data,
        current_user.MaTaiKhoan,
    )


# =====================================================
# CẬP NHẬT
# =====================================================

@router.put(
    "/events/{ma_su_kien}",
    response_model=SuKienResponse,
)
def update_event(
    data: SuKienUpdate,
    ma_su_kien: int = Path(gt=0),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return update_su_kien(
        db,
        ma_su_kien,
        data,
        current_user.MaTaiKhoan,
    )


# =====================================================
# XÓA
# =====================================================

@router.delete("/events/{ma_su_kien}")
def delete_event(
    ma_su_kien: int = Path(gt=0),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return delete_su_kien(
        db,
        ma_su_kien,
        current_user.MaTaiKhoan,
    )
    
# =====================================================
# DASHBOARD (TỔNG QUAN)
# =====================================================

@router.get(
    "/dashboard",
    response_model=DashboardResponse,
)
def dashboard(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return get_dashboard(
        db,
        current_user.MaTaiKhoan,
    )
    
# =====================================================
# DANH SÁCH NGƯỜI ĐĂNG KÝ CỦA 1 SỰ KIỆN
# =====================================================

@router.get(
    "/events/{ma_su_kien}/dang-ky",
    response_model=list[NguoiDangKyResponse],
)
def get_registrations(
    ma_su_kien: int = Path(gt=0),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return get_registrations_of_event(
        db,
        ma_su_kien,
        current_user.MaTaiKhoan,
    )
    
# =====================================================
# TẠO PHIÊN QR ĐIỂM DANH (Ban tổ chức)
# =====================================================

@router.post(
    "/events/{ma_su_kien}/qr",
    response_model=PhienQRResponse,
)
def tao_qr_diem_danh(
    ma_su_kien: int = Path(gt=0),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return tao_phien_qr(
        db,
        ma_su_kien,
        current_user.MaTaiKhoan,
    )
    
    # =====================================================
# DANH MỤC (dùng cho form tạo/sửa sự kiện)
# =====================================================

@router.get(
    "/loai-su-kien",
    response_model=list[LoaiSuKienResponse],
)
def loai_su_kien(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return get_danh_sach_loai_su_kien(db)


@router.get(
    "/trung-tam",
    response_model=list[TrungTamResponse],
)
def trung_tam(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return get_danh_sach_trung_tam(db)

# =====================================================
# DANH SÁCH ĐÁNH GIÁ CỦA 1 SỰ KIỆN
# =====================================================

@router.get(
    "/events/{ma_su_kien}/danh-gia",
    response_model=list[DanhGiaResponse],
)
def get_danh_gia(
    ma_su_kien: int = Path(gt=0),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return get_danh_gia_of_event(
        db,
        ma_su_kien,
        current_user.MaTaiKhoan,
    )
    
# =====================================================
# THỐNG KÊ CHI TIẾT
# =====================================================

@router.get(
    "/reports",
    response_model=list[ThongKeSuKienResponse],
)
def reports(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return get_thong_ke(
        db,
        current_user.MaTaiKhoan,
    )
    
    # =====================================================
# LỊCH SỬ ĐIỂM RÈN LUYỆN CỦA 1 SỰ KIỆN
# =====================================================

@router.get(
    "/events/{ma_su_kien}/diem-ren-luyen",
    response_model=list[LichSuDiemResponse],
)
def get_lich_su_diem(
    ma_su_kien: int = Path(gt=0),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return get_lich_su_diem_of_event(
        db,
        ma_su_kien,
        current_user.MaTaiKhoan,
    )
    
    # =====================================================
# XỬ LÝ VẮNG MẶT
# =====================================================

@router.post("/events/{ma_su_kien}/xu-ly-vang-mat")
def xu_ly_vang_mat_api(
    ma_su_kien: int = Path(gt=0),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(require_roles(2)),
):
    return xu_ly_vang_mat(
        db,
        ma_su_kien,
        current_user.MaTaiKhoan,
    )