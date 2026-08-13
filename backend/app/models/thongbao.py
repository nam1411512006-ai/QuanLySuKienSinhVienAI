from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


# =====================================================
# THÔNG BÁO
# =====================================================

class ThongBao(Base):
    __tablename__ = "thongbao"

    MaThongBao: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    TieuDe: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    NoiDung: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    LoaiThongBao: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    ThoiGianGui: Mapped[DateTime] = mapped_column(
        DateTime,
        server_default=func.now(),
    )

    nguoi_nhan = relationship(
        "NguoiNhanThongBao",
        back_populates="thong_bao",
        cascade="all, delete-orphan",
    )


# =====================================================
# NGƯỜI NHẬN THÔNG BÁO
# =====================================================

class NguoiNhanThongBao(Base):
    __tablename__ = "nguoinhanthongbao"

    MaNhan: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    MaThongBao: Mapped[int] = mapped_column(
        ForeignKey("thongbao.MaThongBao"),
        nullable=False,
    )

    MaTaiKhoan: Mapped[int] = mapped_column(
        ForeignKey("taikhoan.MaTaiKhoan"),
        nullable=False,
    )

    DaDoc: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    ThoiGianDoc: Mapped[DateTime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    thong_bao = relationship(
        "ThongBao",
        back_populates="nguoi_nhan",
    )