from pydantic import BaseModel


class TongQuanBaoCaoResponse(BaseModel):
    tong_su_kien: int
    tong_sinh_vien: int
    tong_luot_dang_ky: int
    tong_diem_ren_luyen_da_cong: int


class SuKienTheoThangItem(BaseModel):
    thang: int
    so_luong: int


class DangKyTheoThangItem(BaseModel):
    thang: int
    so_luong: int


class PhanLoaiSuKienItem(BaseModel):
    ten_loai_su_kien: str
    so_luong: int


class TopSuKienItem(BaseModel):
    ma_su_kien: int
    ten_su_kien: str
    ten_loai_su_kien: str | None = None
    so_luong_dang_ky: int
    so_luong_toi_da: int | None = None
    diem_cong: int
    trang_thai: str


class TopSinhVienItem(BaseModel):
    ma_tai_khoan: int
    mssv: str | None = None
    ho_ten: str
    so_su_kien_tham_gia: int
    tong_diem_ren_luyen: int


class DanhGiaHeThongResponse(BaseModel):
    ty_le_tham_gia: float
    su_kien_trung_binh_thang: float
    trung_binh_sv_moi_su_kien: float


class BaoCaoTongHopResponse(BaseModel):
    tong_quan: TongQuanBaoCaoResponse
    su_kien_theo_thang: list[SuKienTheoThangItem]
    dang_ky_theo_thang: list[DangKyTheoThangItem]
    phan_loai_su_kien: list[PhanLoaiSuKienItem]
    top_su_kien: list[TopSuKienItem]
    top_sinh_vien: list[TopSinhVienItem]
    danh_gia: DanhGiaHeThongResponse
