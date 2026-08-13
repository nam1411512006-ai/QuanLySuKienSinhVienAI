from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from app.database.session import Base


class DiemRenLuyen(Base):
    __tablename__ = "diemrenluyen"

    MaDiemRenLuyen = Column(Integer, primary_key=True, index=True, autoincrement=True)

    MaTaiKhoan = Column(
        Integer,
        ForeignKey("taikhoan.MaTaiKhoan"),
        nullable=False,
    )

    HocKy = Column(Integer, nullable=False)
    NamHoc = Column(String(20), nullable=False)

    DiemTruong = Column(Integer, default=45)
    DiemHoatDong = Column(Integer, default=0)
    TongDiem = Column(Integer, default=0)

    NgayCapNhat = Column(DateTime, nullable=True)


class LichSuDiemRenLuyen(Base):
    __tablename__ = "lichsudiemrenluyen"

    MaLichSu = Column(Integer, primary_key=True, index=True, autoincrement=True)

    MaDiemRenLuyen = Column(
        Integer,
        ForeignKey("diemrenluyen.MaDiemRenLuyen"),
        nullable=False,
    )

    MaSuKien = Column(
        Integer,
        ForeignKey("sukien.MaSuKien"),
        nullable=False,
    )

    SoDiem = Column(Integer, nullable=False)
    LyDo = Column(String(255), nullable=True)
    ThoiGian = Column(DateTime, nullable=True)