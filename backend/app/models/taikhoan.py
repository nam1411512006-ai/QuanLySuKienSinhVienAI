from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class VaiTro(Base):
    __tablename__ = "vaitro"

    MaVaiTro: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    TenVaiTro: Mapped[str] = mapped_column(String(50), nullable=False)
    MoTa: Mapped[str | None] = mapped_column(String(255))

    tai_khoan: Mapped[list["TaiKhoan"]] = relationship(back_populates="vai_tro")


class TrungTam(Base):
    __tablename__ = "trungtam"

    MaTrungTam: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    TenTrungTam: Mapped[str] = mapped_column(String(200), nullable=False)
    MoTa: Mapped[str | None] = mapped_column(Text)
    TrangThai: Mapped[int | None] = mapped_column(Integer, default=1)

    tai_khoan: Mapped[list["TaiKhoan"]] = relationship(back_populates="trung_tam")


class TaiKhoan(Base):
    __tablename__ = "taikhoan"

    MaTaiKhoan: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    MaVaiTro: Mapped[int] = mapped_column(ForeignKey("vaitro.MaVaiTro"), nullable=False)
    MaTrungTam: Mapped[int | None] = mapped_column(ForeignKey("trungtam.MaTrungTam"))
    HoTen: Mapped[str] = mapped_column(String(150), nullable=False)
    Email: Mapped[str | None] = mapped_column(String(150), unique=True)
    MatKhau: Mapped[str] = mapped_column(String(255), nullable=False)
    SoDienThoai: Mapped[str | None] = mapped_column(String(20))
    NgaySinh: Mapped[Date | None] = mapped_column(Date)
    GioiTinh: Mapped[str | None] = mapped_column(String(10))
    MSSV: Mapped[str | None] = mapped_column(String(20), unique=True)
    AnhDaiDien: Mapped[str | None] = mapped_column(String(255))
    TrangThai: Mapped[int | None] = mapped_column(Integer, default=1)
    NgayTao: Mapped[DateTime | None] = mapped_column(DateTime, server_default=func.now())

    vai_tro: Mapped[VaiTro] = relationship(back_populates="tai_khoan")
    trung_tam: Mapped["TrungTam | None"] = relationship(back_populates="tai_khoan")
