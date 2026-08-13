from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.security import verify_password, hash_password
from app.models.taikhoan import TaiKhoan
from app.schemas.taikhoan_schema import (
    CapNhatTaiKhoanRequest,
    DoiMatKhauRequest,
    TaiKhoanProfileResponse,
)
from app.services.admin_upload_service import upload_anh


def lay_profile(user: TaiKhoan) -> TaiKhoanProfileResponse:

    return TaiKhoanProfileResponse(
        ma_tai_khoan=user.MaTaiKhoan,
        ho_ten=user.HoTen,
        email=user.Email,
        so_dien_thoai=user.SoDienThoai,
        ngay_sinh=user.NgaySinh,
        gioi_tinh=user.GioiTinh,
        mssv=user.MSSV,
        anh_dai_dien=user.AnhDaiDien,
        ma_vai_tro=user.MaVaiTro,
        ma_trung_tam=user.MaTrungTam,
    )


def cap_nhat_profile(
    db: Session,
    user: TaiKhoan,
    data: CapNhatTaiKhoanRequest,
):

    user.HoTen = data.ho_ten
    user.SoDienThoai = data.so_dien_thoai
    user.NgaySinh = data.ngay_sinh
    user.GioiTinh = data.gioi_tinh
    user.AnhDaiDien = data.anh_dai_dien

    db.commit()
    db.refresh(user)

    return {
        "message": "Cập nhật thông tin thành công."
    }


def doi_mat_khau(
    db: Session,
    user: TaiKhoan,
    data: DoiMatKhauRequest,
):

    if not verify_password(
        data.mat_khau_cu,
        user.MatKhau,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu cũ không đúng."
        )

    # TODO:
    # Nếu security.py có hash_password() thì thay bằng:
    # user.MatKhau = hash_password(data.mat_khau_moi)

    user.MatKhau = hash_password(data.mat_khau_moi)

    db.commit()
    db.refresh(user)

    return {
        "message": "Đổi mật khẩu thành công."
    }


async def cap_nhat_avatar(
    db: Session,
    user: TaiKhoan,
    file: UploadFile,
) -> TaiKhoanProfileResponse:

    ket_qua = await upload_anh(file)

    user.AnhDaiDien = ket_qua.url

    db.commit()
    db.refresh(user)

    return lay_profile(user)