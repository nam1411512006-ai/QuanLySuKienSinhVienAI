from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.models.taikhoan import TaiKhoan
from app.schemas.auth_schema import LoginRequest, LoginResponse, UserResponse


def login(db: Session, data: LoginRequest) -> LoginResponse:
    user = db.query(TaiKhoan).filter(TaiKhoan.Email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng."
        )

    if user.TrangThai != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị khóa."
        )

    if not verify_password(data.password, user.MatKhau):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng."
        )

    token = create_access_token(
        subject=user.MaTaiKhoan,
        role=user.MaVaiTro,
    )

    return LoginResponse(
        access_token=token,
        user=UserResponse(
        ma_tai_khoan=user.MaTaiKhoan,
        ho_ten=user.HoTen,
        email=user.Email,
        ma_vai_tro=user.MaVaiTro,
        ten_vai_tro=user.vai_tro.TenVaiTro,
        mssv=user.MSSV,
        anh_dai_dien=user.AnhDaiDien,
        ),
    )