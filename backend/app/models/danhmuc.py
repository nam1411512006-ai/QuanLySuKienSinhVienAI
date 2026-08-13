from sqlalchemy import Column, Integer, String, Text
from app.database.session import Base


class LoaiSuKien(Base):
    __tablename__ = "loaisukien"

    MaLoaiSuKien = Column(Integer, primary_key=True, index=True, autoincrement=True)
    TenLoaiSuKien = Column(String(100), nullable=False)
    MoTa = Column(Text, nullable=True)
    TrangThai = Column(Integer, nullable=False, default=1)