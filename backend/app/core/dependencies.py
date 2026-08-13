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

    token = credentials.credentials

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token khong hop le",
        )

    ma_tai_khoan = int(payload["sub"])

    user = (
        db.query(TaiKhoan)
        .filter(TaiKhoan.MaTaiKhoan == ma_tai_khoan)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Khong tim thay nguoi dung",
        )

    return user


def get_current_admin(
    current_user: TaiKhoan = Depends(get_current_user),
) -> TaiKhoan:

    if current_user.MaVaiTro != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chi quan tri vien moi duoc phep truy cap",
        )

    return current_user