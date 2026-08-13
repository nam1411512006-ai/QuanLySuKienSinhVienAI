from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from app.database.session import Base


class PhienQRCode(Base):
    __tablename__ = "phienqrcode"

    MaPhienQR = Column(Integer, primary_key=True, index=True, autoincrement=True)

    MaSuKien = Column(
        Integer,
        ForeignKey("sukien.MaSuKien"),
        nullable=False,
    )

    MaQR = Column(String(255), nullable=False, unique=True)

    BatDau = Column(DateTime, nullable=True)
    KetThuc = Column(DateTime, nullable=True)

    TrangThai = Column(Integer, default=1)


class DiemDanh(Base):
    __tablename__ = "diemdanh"

    MaDiemDanh = Column(Integer, primary_key=True, index=True, autoincrement=True)

    MaDangKy = Column(
        Integer,
        ForeignKey("dangkysukien.MaDangKy"),
        nullable=False,
    )

    MaPhienQR = Column(
        Integer,
        ForeignKey("phienqrcode.MaPhienQR"),
        nullable=False,
    )

    ThoiGianQuet = Column(DateTime, nullable=True)

    TrangThai = Column(String(30), default="ThanhCong")