from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> TaiKhoan:
    """
    Lấy thông tin người dùng hiện tại từ JWT.
    """

    token = credentials.credentials

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn."
        )

    ma_tai_khoan = payload.get("sub")

    if ma_tai_khoan is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không chứa thông tin người dùng."
        )

    user = (
        db.query(TaiKhoan)
        .filter(TaiKhoan.MaTaiKhoan == int(ma_tai_khoan))
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy tài khoản."
        )

    if hasattr(user, "TrangThai") and user.TrangThai != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị khóa."
        )

    return user

def require_roles(*roles):
    def role_checker(
        current_user: TaiKhoan = Depends(get_current_user),
    ):

        if current_user.MaVaiTro not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền sử dụng chức năng này."
            )

        return current_user

    return role_checker