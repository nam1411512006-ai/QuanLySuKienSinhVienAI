from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from app.database.session import Base


class DanhGia(Base):
    __tablename__ = "danhgia"

    MaDanhGia = Column(Integer, primary_key=True, index=True, autoincrement=True)

    MaTaiKhoan = Column(
        Integer,
        ForeignKey("taikhoan.MaTaiKhoan"),
        nullable=False,
    )

    MaSuKien = Column(
        Integer,
        ForeignKey("sukien.MaSuKien"),
        nullable=False,
    )

    SoSao = Column(Integer, nullable=False)
    NoiDung = Column(Text, nullable=True)
    ThoiGian = Column(DateTime, nullable=True)