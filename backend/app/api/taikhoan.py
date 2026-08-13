from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.taikhoan_schema import (
    TaiKhoanProfileResponse,
    CapNhatTaiKhoanRequest,
    DoiMatKhauRequest,
    MessageResponse,
)
from app.services import taikhoan_service

router = APIRouter(
    prefix="/tai-khoan",
    tags=["Tài khoản"],
)


@router.get(
    "/profile",
    response_model=TaiKhoanProfileResponse,
)
def lay_profile(
    current_user: TaiKhoan = Depends(get_current_user),
):
    return taikhoan_service.lay_profile(current_user)


@router.put(
    "/profile",
    response_model=MessageResponse,
)
def cap_nhat_profile(
    data: CapNhatTaiKhoanRequest,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return taikhoan_service.cap_nhat_profile(
        db=db,
        user=current_user,
        data=data,
    )


@router.put(
    "/change-password",
    response_model=MessageResponse,
)
def doi_mat_khau(
    data: DoiMatKhauRequest,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return taikhoan_service.doi_mat_khau(
        db=db,
        user=current_user,
        data=data,
    )


@router.post(
    "/avatar",
    response_model=TaiKhoanProfileResponse,
)
async def doi_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    return await taikhoan_service.cap_nhat_avatar(
        db=db,
        user=current_user,
        file=file,
    )