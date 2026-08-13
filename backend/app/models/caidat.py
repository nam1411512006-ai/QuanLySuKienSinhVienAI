from sqlalchemy import Column, Integer, String, Text
from app.database.session import Base


class CaiDatHeThong(Base):
    """
    Bang luu cai dat he thong dang key-value.
    Bang nay CHUA co trong file SQL goc cua du an - can chay migration/
    tao bang truoc khi su dung (xem huong dan trong README_MODULE_CAIDAT.md).
    """

    __tablename__ = "caidathethong"

    MaCaiDat = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Khoa = Column(String(100), nullable=False, unique=True)
    GiaTri = Column(Text, nullable=True)
    MoTa = Column(String(255), nullable=True)
