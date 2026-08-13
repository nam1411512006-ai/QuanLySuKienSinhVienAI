from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.database.session import Base


class DangKySuKien(Base):
    __tablename__ = "dangkysukien"

    # ==========================
    # Khóa chính
    # ==========================

    MaDangKy = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    # ==========================
    # Khóa ngoại
    # ==========================

    MaSuKien = Column(
        Integer,
        ForeignKey("sukien.MaSuKien"),
        nullable=False,
    )

    MaTaiKhoan = Column(
        Integer,
        ForeignKey("taikhoan.MaTaiKhoan"),
        nullable=False,
    )

    # ==========================
    # Thời gian đăng ký
    # ==========================

    ThoiGianDangKy = Column(
        DateTime,
        nullable=False,
    )

    # ==========================
    # Thời gian hủy
    # ==========================

    ThoiGianHuy = Column(
        DateTime,
        nullable=True,
    )

    # ==========================
    # Lý do hủy
    # ==========================

    LyDoHuy = Column(
        String(255),
        nullable=True,
    )

    # ==========================
    # Trạng thái
    # DaDangKy
    # DaHuy
    # DaDiemDanh
    # HoanThanh
    # ==========================

    TrangThai = Column(
        String(30),
        nullable=False,
        default="DaDangKy",
    )