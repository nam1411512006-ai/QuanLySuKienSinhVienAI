-- =====================================================
-- DATABASE
-- =====================================================

CREATE DATABASE IF NOT EXISTS QuanLySuKienSinhVien
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;


USE QuanLySuKienSinhVien;



-- =====================================================
-- 1. BẢNG VAI TRÒ
-- =====================================================

CREATE TABLE VaiTro
(
    MaVaiTro INT AUTO_INCREMENT PRIMARY KEY,
    TenVaiTro VARCHAR(50) NOT NULL,
    MoTa VARCHAR(255)
);



-- =====================================================
-- 2. BẢNG TRUNG TÂM
-- =====================================================

CREATE TABLE TrungTam
(
    MaTrungTam INT AUTO_INCREMENT PRIMARY KEY,

    TenTrungTam VARCHAR(200) NOT NULL,

    MoTa TEXT,

    TrangThai TINYINT DEFAULT 1
);



-- =====================================================
-- 3. BẢNG TÀI KHOẢN
-- =====================================================

CREATE TABLE TaiKhoan
(
    MaTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,

    MaVaiTro INT NOT NULL,

    MaTrungTam INT NULL,

    HoTen VARCHAR(150) NOT NULL,

    Email VARCHAR(150) UNIQUE,

    MatKhau VARCHAR(255) NOT NULL,

    SoDienThoai VARCHAR(20),

    NgaySinh DATE,

    GioiTinh VARCHAR(10),

    MSSV VARCHAR(20) UNIQUE,

    AnhDaiDien VARCHAR(255),

    TrangThai TINYINT DEFAULT 1,

    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(MaVaiTro)
    REFERENCES VaiTro(MaVaiTro),


    FOREIGN KEY(MaTrungTam)
    REFERENCES TrungTam(MaTrungTam)

);



-- =====================================================
-- 4. BẢNG LOẠI SỰ KIỆN
-- =====================================================

CREATE TABLE LoaiSuKien
(
    MaLoaiSuKien INT AUTO_INCREMENT PRIMARY KEY,

    TenLoaiSuKien VARCHAR(100) NOT NULL,

    MoTa TEXT

);



-- =====================================================
-- 5. BẢNG SỰ KIỆN
-- =====================================================

CREATE TABLE SuKien
(
    MaSuKien INT AUTO_INCREMENT PRIMARY KEY,

    MaLoaiSuKien INT NOT NULL,

    MaTrungTam INT NOT NULL,

    MaNguoiTao INT NOT NULL,


    TenSuKien VARCHAR(255) NOT NULL,


    MoTa TEXT,


    DiaDiem VARCHAR(255),


    ThoiGianBatDau DATETIME NOT NULL,


    ThoiGianKetThuc DATETIME NOT NULL,


    SoLuongToiDa INT,


    DiemCong INT DEFAULT 0,


    TrangThai VARCHAR(30) DEFAULT 'DangMo',


    AnhBia VARCHAR(255),


    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,



    FOREIGN KEY(MaLoaiSuKien)
    REFERENCES LoaiSuKien(MaLoaiSuKien),


    FOREIGN KEY(MaTrungTam)
    REFERENCES TrungTam(MaTrungTam),


    FOREIGN KEY(MaNguoiTao)
    REFERENCES TaiKhoan(MaTaiKhoan)

);



-- =====================================================
-- 6. BẢNG ĐĂNG KÝ SỰ KIỆN
-- =====================================================

CREATE TABLE DangKySuKien
(
    MaDangKy INT AUTO_INCREMENT PRIMARY KEY,


    MaSuKien INT NOT NULL,


    MaTaiKhoan INT NOT NULL,


    ThoiGianDangKy DATETIME DEFAULT CURRENT_TIMESTAMP,


    TrangThai VARCHAR(30) DEFAULT 'DaDangKy',



    FOREIGN KEY(MaSuKien)
    REFERENCES SuKien(MaSuKien),


    FOREIGN KEY(MaTaiKhoan)
    REFERENCES TaiKhoan(MaTaiKhoan),


    UNIQUE(MaSuKien,MaTaiKhoan)

);



-- =====================================================
-- 7. BẢNG PHIÊN QR CODE
-- =====================================================

CREATE TABLE PhienQRCode
(
    MaPhienQR INT AUTO_INCREMENT PRIMARY KEY,


    MaSuKien INT NOT NULL,


    MaQR VARCHAR(255) NOT NULL UNIQUE,


    BatDau DATETIME,


    KetThuc DATETIME,


    TrangThai TINYINT DEFAULT 1,



    FOREIGN KEY(MaSuKien)
    REFERENCES SuKien(MaSuKien)

);



-- =====================================================
-- 8. BẢNG ĐIỂM DANH
-- =====================================================

CREATE TABLE DiemDanh
(
    MaDiemDanh INT AUTO_INCREMENT PRIMARY KEY,


    MaDangKy INT NOT NULL,


    MaPhienQR INT NOT NULL,


    ThoiGianQuet DATETIME DEFAULT CURRENT_TIMESTAMP,


    TrangThai VARCHAR(30) DEFAULT 'ThanhCong',



    FOREIGN KEY(MaDangKy)
    REFERENCES DangKySuKien(MaDangKy),


    FOREIGN KEY(MaPhienQR)
    REFERENCES PhienQRCode(MaPhienQR)

);



-- =====================================================
-- 9. BẢNG ĐIỂM RÈN LUYỆN
-- =====================================================

CREATE TABLE DiemRenLuyen
(
    MaDiemRenLuyen INT AUTO_INCREMENT PRIMARY KEY,


    MaTaiKhoan INT NOT NULL,


    HocKy TINYINT NOT NULL,


    NamHoc VARCHAR(20) NOT NULL,


    DiemTruong INT DEFAULT 45,


    DiemHoatDong INT DEFAULT 0,


    TongDiem INT DEFAULT 0,


    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP,



    FOREIGN KEY(MaTaiKhoan)
    REFERENCES TaiKhoan(MaTaiKhoan),


    UNIQUE(MaTaiKhoan,HocKy,NamHoc)

);



-- =====================================================
-- 10. BẢNG LỊCH SỬ ĐIỂM RÈN LUYỆN
-- =====================================================

CREATE TABLE LichSuDiemRenLuyen
(
    MaLichSu INT AUTO_INCREMENT PRIMARY KEY,


    MaDiemRenLuyen INT NOT NULL,


    MaSuKien INT NOT NULL,


    SoDiem INT NOT NULL,


    LyDo VARCHAR(255),


    ThoiGian DATETIME DEFAULT CURRENT_TIMESTAMP,



    FOREIGN KEY(MaDiemRenLuyen)
    REFERENCES DiemRenLuyen(MaDiemRenLuyen),


    FOREIGN KEY(MaSuKien)
    REFERENCES SuKien(MaSuKien)

);



-- =====================================================
-- 11. BẢNG ĐÁNH GIÁ
-- =====================================================

CREATE TABLE DanhGia
(
    MaDanhGia INT AUTO_INCREMENT PRIMARY KEY,


    MaTaiKhoan INT NOT NULL,


    MaSuKien INT NOT NULL,


    SoSao TINYINT NOT NULL,


    NoiDung TEXT,


    ThoiGian DATETIME DEFAULT CURRENT_TIMESTAMP,



    FOREIGN KEY(MaTaiKhoan)
    REFERENCES TaiKhoan(MaTaiKhoan),


    FOREIGN KEY(MaSuKien)
    REFERENCES SuKien(MaSuKien),


    UNIQUE(MaTaiKhoan,MaSuKien)

);



-- =====================================================
-- 12. BẢNG LỊCH SỬ AI
-- =====================================================

CREATE TABLE LichSuTroChuyenAI
(
    MaLichSuAI INT AUTO_INCREMENT PRIMARY KEY,


    MaTaiKhoan INT NOT NULL,


    CauHoi TEXT,


    CauTraLoi TEXT,


    ThoiGian DATETIME DEFAULT CURRENT_TIMESTAMP,



    FOREIGN KEY(MaTaiKhoan)
    REFERENCES TaiKhoan(MaTaiKhoan)

);



-- =====================================================
-- 13. BẢNG THÔNG BÁO
-- =====================================================

CREATE TABLE ThongBao
(
    MaThongBao INT AUTO_INCREMENT PRIMARY KEY,


    TieuDe VARCHAR(255),


    NoiDung TEXT,


    LoaiThongBao VARCHAR(50),


    ThoiGianGui DATETIME DEFAULT CURRENT_TIMESTAMP

);



-- =====================================================
-- 14. BẢNG NGƯỜI NHẬN THÔNG BÁO
-- =====================================================

CREATE TABLE NguoiNhanThongBao
(
    MaNhan INT AUTO_INCREMENT PRIMARY KEY,


    MaThongBao INT NOT NULL,


    MaTaiKhoan INT NOT NULL,


    DaDoc BOOLEAN DEFAULT FALSE,


    ThoiGianDoc DATETIME NULL,



    FOREIGN KEY(MaThongBao)
    REFERENCES ThongBao(MaThongBao),


    FOREIGN KEY(MaTaiKhoan)
    REFERENCES TaiKhoan(MaTaiKhoan)

);



-- =====================================================
-- 15. BẢNG NHẬT KÝ HỆ THỐNG
-- =====================================================

CREATE TABLE NhatKyHeThong
(
    MaNhatKy INT AUTO_INCREMENT PRIMARY KEY,


    MaTaiKhoan INT NOT NULL,


    HanhDong VARCHAR(255),


    BangTacDong VARCHAR(100),


    DiaChiIP VARCHAR(50),


    ThoiGian DATETIME DEFAULT CURRENT_TIMESTAMP,



    FOREIGN KEY(MaTaiKhoan)
    REFERENCES TaiKhoan(MaTaiKhoan)

);
USE QuanLySuKienSinhVien;



-- =====================================================
-- DỮ LIỆU VAI TRÒ
-- =====================================================

INSERT INTO VaiTro
(
TenVaiTro,
MoTa
)
VALUES

('Admin','Quan tri toan bo he thong'),

('BanToChuc','Quan ly va tao su kien'),

('SinhVien','Dang ky tham gia su kien');




-- =====================================================
-- DỮ LIỆU TRUNG TÂM
-- =====================================================

INSERT INTO TrungTam
(
TenTrungTam,
MoTa
)
VALUES

(
'Trung tam Truyen thong va Tu van Huong nghiep',
'Don vi phu trach quan ly tat ca su kien sinh vien'
);




-- =====================================================
-- TÀI KHOẢN ADMIN
-- =====================================================

INSERT INTO TaiKhoan
(
MaVaiTro,
HoTen,
Email,
MatKhau,
MSSV
)
VALUES

(
1,
'Quan Tri Vien He Thong',
'admin@truong.edu.vn',
'admin123',
'ADMIN001'
);




-- =====================================================
-- TÀI KHOẢN BAN TỔ CHỨC
-- =====================================================

INSERT INTO TaiKhoan
(
MaVaiTro,
MaTrungTam,
HoTen,
Email,
MatKhau,
MSSV
)
VALUES

(
2,
1,
'Nguyen Minh Quan',
'quan.truyenthong@truong.edu.vn',
'20001',
'BTC001'
);





-- =====================================================
-- 30 TÀI KHOẢN SINH VIÊN
-- Quy ước:
-- Tai khoan: ten.nganhxxxxx
-- Mat khau: 5 so cuoi
-- =====================================================


INSERT INTO TaiKhoan
(
MaVaiTro,
HoTen,
Email,
MatKhau,
MSSV
)
VALUES


(3,'Nguyen Van Long','long.cn10001@sv.edu.vn','10001','CN10001'),

(3,'Tran Gia Bao','bao.cn10002@sv.edu.vn','10002','CN10002'),

(3,'Le Minh Khang','khang.cn10003@sv.edu.vn','10003','CN10003'),

(3,'Pham Duc Anh','anh.cn10004@sv.edu.vn','10004','CN10004'),

(3,'Vo Thanh Dat','dat.cn10005@sv.edu.vn','10005','CN10005'),


(3,'Nguyen Hoang Nam','nam.cn10006@sv.edu.vn','10006','CN10006'),

(3,'Tran Minh Tri','tri.cn10007@sv.edu.vn','10007','CN10007'),

(3,'Le Quoc Bao','bao.cn10008@sv.edu.vn','10008','CN10008'),

(3,'Pham Gia Huy','huy.cn10009@sv.edu.vn','10009','CN10009'),

(3,'Do Minh Quan','quan.cn10010@sv.edu.vn','10010','CN10010'),


(3,'Nguyen Thanh Tung','tung.cn10011@sv.edu.vn','10011','CN10011'),

(3,'Bui Duc Thien','thien.cn10012@sv.edu.vn','10012','CN10012'),

(3,'Hoang Minh Duc','duc.cn10013@sv.edu.vn','10013','CN10013'),

(3,'Pham Thanh Long','long.cn10014@sv.edu.vn','10014','CN10014'),

(3,'Nguyen Duc Hieu','hieu.cn10015@sv.edu.vn','10015','CN10015'),


(3,'Tran Hoang Phuc','phuc.cn10016@sv.edu.vn','10016','CN10016'),

(3,'Le Anh Khoa','khoa.cn10017@sv.edu.vn','10017','CN10017'),

(3,'Vo Minh Hieu','hieu.cn10018@sv.edu.vn','10018','CN10018'),

(3,'Nguyen Hai Dang','dang.cn10019@sv.edu.vn','10019','CN10019'),

(3,'Pham Nhat Minh','minh.cn10020@sv.edu.vn','10020','CN10020'),


(3,'Tran Duc Thang','thang.cn10021@sv.edu.vn','10021','CN10021'),

(3,'Le Thanh Son','son.cn10022@sv.edu.vn','10022','CN10022'),

(3,'Nguyen Quang Huy','huy.cn10023@sv.edu.vn','10023','CN10023'),

(3,'Bui Minh Khoi','khoi.cn10024@sv.edu.vn','10024','CN10024'),

(3,'Pham Quoc Viet','viet.cn10025@sv.edu.vn','10025','CN10025'),


(3,'Do Thanh Phat','phat.cn10026@sv.edu.vn','10026','CN10026'),

(3,'Nguyen Tuan Kiet','kiet.cn10027@sv.edu.vn','10027','CN10027'),

(3,'Tran Gia Hieu','hieu.cn10028@sv.edu.vn','10028','CN10028'),

(3,'Le Minh Anh','anh.cn10029@sv.edu.vn','10029','CN10029'),

(3,'Hoang Duc Manh','manh.cn10030@sv.edu.vn','10030','CN10030'),
(
    3,
    'Ninh Tieu Long',
    'long.cn10031@sv.edu.vn',
    '10031',
    'CN10031'
),

(
    3,
    'Do Phuong Nam',
    'nam.cn10032@sv.edu.vn',
    '10032',
    'CN10032'
);





-- =====================================================
-- LOẠI SỰ KIỆN
-- =====================================================

INSERT INTO LoaiSuKien
(
TenLoaiSuKien,
MoTa
)
VALUES


(
'HocThuat',
'Hoi thao, workshop, cuoc thi hoc thuat'
),


(
'HuongNghiep',
'Ket noi doanh nghiep va sinh vien'
),


(
'TinhNguyen',
'Hoat dong vi cong dong'
),


(
'VanHoaVanNghe',
'Giao luu van hoa van nghe'
),


(
'TheThao',
'Hoat dong the thao sinh vien'
);
USE QuanLySuKienSinhVien;



-- =====================================================
-- DỮ LIỆU SỰ KIỆN
-- Trung tâm 1 quản lý tất cả
-- Người tạo: Ban tổ chức (MaTaiKhoan = 2)
-- =====================================================


INSERT INTO SuKien
(
MaLoaiSuKien,
MaTrungTam,
MaNguoiTao,
TenSuKien,
MoTa,
DiaDiem,
ThoiGianBatDau,
ThoiGianKetThuc,
SoLuongToiDa,
DiemCong,
TrangThai,
AnhBia
)
VALUES


-- ==========================
-- HỌC KỲ 1 - NĂM HỌC 2024-2025
-- ==========================


(
2,1,2,
'Ngay Hoi Viec Lam 2024',
'Ket noi sinh vien voi doanh nghiep',
'Hoi truong A',
'2024-10-15 08:00:00',
'2024-10-15 16:00:00',
500,
5,
'KetThuc',
'vieclam2024.jpg'
),


(
1,1,2,
'Workshop Tri Tue Nhan Tao',
'Tim hieu ve AI va xu huong cong nghe',
'Phong CNTT',
'2024-11-25 08:00:00',
'2024-11-25 11:30:00',
200,
3,
'KetThuc',
'ai2024.jpg'
),


(
3,1,2,
'Hien Mau Nhan Dao 2024',
'Hoat dong tinh nguyen vi cong dong',
'Sanh Truong',
'2025-01-10 07:30:00',
'2025-01-10 15:00:00',
300,
5,
'KetThuc',
'hienmau.jpg'
),



-- ==========================
-- HỌC KỲ 2 - NĂM HỌC 2024-2025
-- ==========================


(
1,1,2,
'Cuoc Thi Lap Trinh Sinh Vien',
'Cuoc thi lap trinh danh cho sinh vien CNTT',
'Phong Lab',
'2025-03-15 08:00:00',
'2025-03-15 17:00:00',
300,
5,
'KetThuc',
'laptrinh.jpg'
),


(
3,1,2,
'Xuan Tinh Nguyen 2025',
'Chuong trinh tinh nguyen dau nam',
'Dia diem tinh nguyen',
'2025-04-25 07:00:00',
'2025-04-25 16:00:00',
400,
5,
'KetThuc',
'xuan.jpg'
),


(
2,1,2,
'Ky Nang Mem Sinh Vien',
'Ren luyen ky nang giao tiep va lam viec nhom',
'Hoi truong B',
'2025-06-05 08:00:00',
'2025-06-05 11:30:00',
250,
3,
'KetThuc',
'kynang.jpg'
),



-- ==========================
-- HỌC KỲ 1 - NĂM HỌC 2025-2026
-- ==========================


(
4,1,2,
'Tech Festival 2025',
'Ngay hoi cong nghe sinh vien',
'Sanh CNTT',
'2025-10-20 08:00:00',
'2025-10-20 17:00:00',
600,
5,
'KetThuc',
'techfest.jpg'
),


(
2,1,2,
'Ngay Hoi Doanh Nghiep 2025',
'Giao luu cung doanh nghiep',
'Hoi truong A',
'2025-12-01 08:00:00',
'2025-12-01 16:00:00',
500,
5,
'KetThuc',
'doanhnghiep.jpg'
),


(
1,1,2,
'Workshop Cloud Computing',
'Tim hieu dien toan dam may',
'Phong CNTT',
'2026-01-15 08:00:00',
'2026-01-15 11:30:00',
200,
3,
'KetThuc',
'cloud.jpg'
);






-- =====================================================
-- ĐĂNG KÝ SỰ KIỆN
-- Một số sinh viên tham gia
-- =====================================================


INSERT INTO DangKySuKien
(
MaSuKien,
MaTaiKhoan,
TrangThai
)
VALUES


-- Sự kiện 1

(1,3,'DaDangKy'),
(1,4,'DaDangKy'),
(1,5,'DaDangKy'),
(1,6,'DaDangKy'),
(1,7,'DaDangKy'),


-- Sự kiện 2

(2,3,'DaDangKy'),
(2,4,'DaDangKy'),
(2,8,'DaDangKy'),
(2,9,'DaDangKy'),


-- Sự kiện 3

(3,3,'DaDangKy'),
(3,5,'DaDangKy'),
(3,6,'DaDangKy'),


-- Sự kiện 4

(4,3,'DaDangKy'),
(4,7,'DaDangKy'),
(4,10,'DaDangKy'),


-- Sự kiện 5

(5,3,'DaDangKy'),
(5,4,'DaDangKy'),


-- Sự kiện 6

(6,5,'DaDangKy'),
(6,8,'DaDangKy'),


-- Sự kiện 7

(7,3,'DaDangKy'),
(7,9,'DaDangKy'),


-- Sự kiện 8

(8,4,'DaDangKy'),
(8,6,'DaDangKy'),


-- Sự kiện 9

(9,3,'DaDangKy'),
(9,5,'DaDangKy');







-- =====================================================
-- PHIÊN QR CODE
-- =====================================================


INSERT INTO PhienQRCode
(
MaSuKien,
MaQR,
BatDau,
KetThuc,
TrangThai
)
VALUES


(1,'QR_EVENT_001',
'2024-10-15 07:30:00',
'2024-10-15 09:30:00',
0),


(2,'QR_EVENT_002',
'2024-11-25 07:30:00',
'2024-11-25 09:30:00',
0),


(3,'QR_EVENT_003',
'2025-01-10 07:00:00',
'2025-01-10 09:00:00',
0),


(4,'QR_EVENT_004',
'2025-03-15 07:30:00',
'2025-03-15 09:30:00',
0),


(5,'QR_EVENT_005',
'2025-04-25 07:00:00',
'2025-04-25 09:00:00',
0),


(6,'QR_EVENT_006',
'2025-06-05 07:30:00',
'2025-06-05 09:30:00',
0),


(7,'QR_EVENT_007',
'2025-10-20 07:30:00',
'2025-10-20 09:30:00',
0),


(8,'QR_EVENT_008',
'2025-12-01 07:30:00',
'2025-12-01 09:30:00',
0),


(9,'QR_EVENT_009',
'2026-01-15 07:30:00',
'2026-01-15 09:30:00',
0);







-- =====================================================
-- ĐIỂM DANH
-- =====================================================


INSERT INTO DiemDanh
(
MaDangKy,
MaPhienQR,
TrangThai
)
VALUES


(1,1,'ThanhCong'),
(2,1,'ThanhCong'),
(3,1,'ThanhCong'),


(6,2,'ThanhCong'),
(7,2,'ThanhCong'),


(10,3,'ThanhCong'),
(11,3,'ThanhCong'),


(12,4,'ThanhCong'),
(13,4,'ThanhCong'),


(15,5,'ThanhCong'),


(17,6,'ThanhCong'),


(19,7,'ThanhCong'),


(21,8,'ThanhCong'),


(23,9,'ThanhCong');





-- =====================================================
-- ĐIỂM RÈN LUYỆN
-- 45 điểm trường + điểm hoạt động
-- =====================================================


INSERT INTO DiemRenLuyen
(
MaTaiKhoan,
HocKy,
NamHoc,
DiemTruong,
DiemHoatDong,
TongDiem
)
VALUES


-- HỌC KỲ 1 2024-2025

(3,1,'2024-2025',45,13,58),
(4,1,'2024-2025',45,8,53),
(5,1,'2024-2025',45,13,58),
(6,1,'2024-2025',45,5,50),
(7,1,'2024-2025',45,10,55),



-- HỌC KỲ 2 2024-2025

(3,2,'2024-2025',45,13,58),
(4,2,'2024-2025',45,8,53),
(5,2,'2024-2025',45,10,55),



-- HỌC KỲ 1 2025-2026

(3,1,'2025-2026',45,13,58),
(4,1,'2025-2026',45,10,55),
(5,1,'2025-2026',45,8,53);
USE QuanLySuKienSinhVien;



-- =====================================================
-- LỊCH SỬ CỘNG ĐIỂM RÈN LUYỆN
-- =====================================================

INSERT INTO LichSuDiemRenLuyen
(
MaDiemRenLuyen,
MaSuKien,
SoDiem,
LyDo
)
VALUES


-- Sinh viên CN10001 (MaTaiKhoan = 3)
-- Học kỳ 1 2024-2025

(1,1,5,'Tham gia Ngay Hoi Viec Lam 2024'),

(1,2,3,'Tham gia Workshop Tri Tue Nhan Tao'),

(1,3,5,'Tham gia Hien Mau Nhan Dao 2024'),



-- Học kỳ 2

(6,4,5,'Tham gia Cuoc Thi Lap Trinh Sinh Vien'),

(6,5,5,'Tham gia Xuan Tinh Nguyen 2025'),

(6,6,3,'Tham gia Ky Nang Mem Sinh Vien'),



-- Học kỳ 3

(9,7,5,'Tham gia Tech Festival 2025'),

(9,8,5,'Tham gia Ngay Hoi Doanh Nghiep 2025'),

(9,9,3,'Tham gia Workshop Cloud Computing');






-- =====================================================
-- ĐÁNH GIÁ SỰ KIỆN
-- =====================================================


INSERT INTO DanhGia
(
MaTaiKhoan,
MaSuKien,
SoSao,
NoiDung
)
VALUES


(3,1,5,
'Su kien rat bo ich, giup sinh vien gap go doanh nghiep'),


(4,1,4,
'To chuc tot, noi dung phong phu'),


(5,2,5,
'Workshop AI rat hay va de hieu'),


(3,4,5,
'Cuoc thi lap trinh tao nhieu trai nghiem'),


(4,7,4,
'Ngay hoi cong nghe rat thu vi');






-- =====================================================
-- LỊCH SỬ CHAT AI
-- =====================================================


INSERT INTO LichSuTroChuyenAI
(
MaTaiKhoan,
CauHoi,
CauTraLoi
)
VALUES


(
3,
'Toi co the tham gia su kien nao?',
'Ban co the tham gia cac su kien hoc thuat va huong nghiep sap dien ra.'
),


(
3,
'Hien tai toi co bao nhieu diem ren luyen?',
'Ban dang co 58 diem ren luyen trong hoc ky hien tai.'
),


(
4,
'Tim su kien lien quan den cong nghe',
'He thong goi y Workshop Tri Tue Nhan Tao va Workshop Cloud Computing.'
),


(
5,
'Cach dang ky su kien?',
'Ban vao trang chi tiet su kien va chon Dang ky tham gia.'
);







-- =====================================================
-- THÔNG BÁO
-- =====================================================


INSERT INTO ThongBao
(
TieuDe,
NoiDung,
LoaiThongBao
)
VALUES


(
'Mo dang ky su kien',
'He thong da mo dang ky Ngay Hoi Doanh Nghiep.',
'SuKien'
),


(
'Thong bao diem danh',
'Ban da diem danh thanh cong bang QR Code.',
'DiemDanh'
),


(
'Cap nhat diem ren luyen',
'Diem ren luyen hoc ky da duoc cap nhat.',
'DiemRenLuyen'
),


(
'Su kien sap dien ra',
'Hay tham gia Workshop Cloud Computing.',
'SapDienRa'
);






-- =====================================================
-- NGƯỜI NHẬN THÔNG BÁO
-- =====================================================


INSERT INTO NguoiNhanThongBao
(
MaThongBao,
MaTaiKhoan,
DaDoc,
ThoiGianDoc
)
VALUES


(1,3,FALSE,NULL),

(1,4,FALSE,NULL),

(1,5,TRUE,'2025-11-20 08:00:00'),


(2,3,TRUE,'2024-10-15 10:00:00'),

(2,4,FALSE,NULL),


(3,3,FALSE,NULL),

(3,5,TRUE,'2026-01-20 09:00:00'),


(4,3,FALSE,NULL);







-- =====================================================
-- NHẬT KÝ HỆ THỐNG
-- =====================================================


INSERT INTO NhatKyHeThong
(
MaTaiKhoan,
HanhDong,
BangTacDong,
DiaChiIP
)
VALUES


(
1,
'Dang nhap he thong',
'TaiKhoan',
'127.0.0.1'
),


(
2,
'Tao su kien moi',
'SuKien',
'127.0.0.1'
),


(
3,
'Dang ky tham gia su kien',
'DangKySuKien',
'127.0.0.1'
),


(
3,
'Quet QR diem danh',
'DiemDanh',
'127.0.0.1'
),


(
2,
'Cap nhat diem ren luyen',
'DiemRenLuyen',
'127.0.0.1'
);
