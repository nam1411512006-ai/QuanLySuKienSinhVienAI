from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database.session import Base


class SuKien(Base):
    __tablename__ = "sukien"

    MaSuKien = Column(Integer, primary_key=True, index=True)
    MaLoaiSuKien = Column(Integer, ForeignKey("loaisukien.MaLoaiSuKien"), nullable=False)
    MaTrungTam = Column(Integer, ForeignKey("trungtam.MaTrungTam"), nullable=False)
    MaNguoiTao = Column(Integer, ForeignKey("taikhoan.MaTaiKhoan"), nullable=False)

    TenSuKien = Column(String(255), nullable=False)
    MoTa = Column(Text, nullable=True)
    DiaDiem = Column(String(255), nullable=True)

    # Thời gian đăng ký
    ThoiGianBatDauDangKy = Column(DateTime, nullable=True)
    ThoiGianKetThucDangKy = Column(DateTime, nullable=True)

    # Thời gian diễn ra
    ThoiGianBatDau = Column(DateTime, nullable=False)
    ThoiGianKetThuc = Column(DateTime, nullable=False)
    SoLuongToiDa = Column(Integer, nullable=True)
    DiemCong = Column(Integer, default=0)
    TrangThai = Column(String(30), default="DangMo")
    AnhBia = Column(String(255), nullable=True)
    NgayTao = Column(DateTime, nullable=True)

    loai_su_kien = relationship("LoaiSuKien")
    nguoi_tao = relationship("TaiKhoan")