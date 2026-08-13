import { useEffect, useState } from "react";
import {
    Search,
    Eye,
    Trash,
    ArrowClockwise,
    Download,
    LockFill,
    UnlockFill,
} from "react-bootstrap-icons";
import adminSuKienService from "../../services/adminSuKienService";
import adminDanhMucService from "../../services/adminDanhMucService";

const NHAN_TRANG_THAI = {
    coming: { text: "Sắp diễn ra", cls: "status coming" },
    running: { text: "Đang diễn ra", cls: "status running" },
    finish: { text: "Đã kết thúc", cls: "status finish" },
    locked: { text: "Đã khóa", cls: "status lock" },
};

const NHOM_THEO_TRANG_THAI_CHI_TIET = {
    SapMo: "coming",
    DangMo: "coming",
    DongDangKy: "coming",
    DangDienRa: "running",
    KetThuc: "finish",
    DaKhoa: "locked",
};

const EventManagement = () => {

    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [thongKe, setThongKe] = useState({
        tong_su_kien: 0,
        sap_dien_ra: 0,
        dang_dien_ra: 0,
        da_ket_thuc: 0,
    });
    const [loading, setLoading] = useState(true);

    const [tuKhoa, setTuKhoa] = useState("");
    const [locDanhMuc, setLocDanhMuc] = useState("all");
    const [locTrangThai, setLocTrangThai] = useState("all");

    const [chiTiet, setChiTiet] = useState(null);

    useEffect(() => {
        loadThongKe();
        loadDanhMuc();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDanhSach();
        }, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tuKhoa, locDanhMuc, locTrangThai]);

    const loadThongKe = async () => {
        try {
            const data = await adminSuKienService.getThongKe();
            setThongKe(data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadDanhMuc = async () => {
        try {
            const data = await adminDanhMucService.getDanhSach();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadDanhSach = async () => {
        try {
            setLoading(true);

            const params = {};
            if (tuKhoa.trim()) params.tu_khoa = tuKhoa.trim();
            if (locDanhMuc !== "all") params.ma_loai_su_kien = locDanhMuc;
            if (locTrangThai !== "all") params.nhom_trang_thai = locTrangThai;

            const data = await adminSuKienService.getDanhSach(params);
            setEvents(data);

        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được danh sách sự kiện.");
        } finally {
            setLoading(false);
        }
    };

    const lamMoi = () => {
        setTuKhoa("");
        setLocDanhMuc("all");
        setLocTrangThai("all");
        loadDanhSach();
        loadThongKe();
    };

    const xuatExcel = () => {
        const header = ["Tên sự kiện", "Danh mục", "Địa điểm", "Ngày diễn ra", "Đăng ký", "Trạng thái"];
        const rows = events.map((e) => [
            e.ten_su_kien,
            e.ten_loai_su_kien,
            e.dia_diem || "",
            new Date(e.thoi_gian_bat_dau).toLocaleDateString("vi-VN"),
            `${e.so_luong_da_dang_ky}/${e.so_luong_toi_da ?? "∞"}`,
            NHAN_TRANG_THAI[NHOM_THEO_TRANG_THAI_CHI_TIET[e.trang_thai]]?.text || "",
        ]);
        const csv = [header, ...rows]
            .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "danh_sach_su_kien.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const khoaMoSuKien = async (item) => {
        const dangKhoa = item.trang_thai === "DaKhoa";
        const xacNhan = window.confirm(
            dangKhoa
                ? `Mở khóa sự kiện "${item.ten_su_kien}"?`
                : `Khóa sự kiện "${item.ten_su_kien}"? Sinh viên sẽ không thể đăng ký nữa.`
        );
        if (!xacNhan) return;

        try {
            const res = await adminSuKienService.khoaMoSuKien(item.ma_su_kien);
            alert(res.message);
            loadDanhSach();
            loadThongKe();
        } catch (error) {
            alert(error.message || "Không thể đổi trạng thái.");
        }
    };

    const xoaSuKien = async (item) => {
        const xacNhan = window.confirm(
            `Xóa vĩnh viễn sự kiện "${item.ten_su_kien}"?`
        );
        if (!xacNhan) return;

        try {
            const res = await adminSuKienService.xoaSuKien(item.ma_su_kien);
            alert(res.message);
            loadDanhSach();
            loadThongKe();
        } catch (error) {
            alert(error.message || "Không thể xóa sự kiện.");
        }
    };

    return (

        <div className="admin-page event-page">

            {/* ================= HEADER ================= */}

            <div className="admin-page-header event-header">

                <div>
                    <h1 className="admin-page-title">Quản lý Sự kiện</h1>
                    <p className="admin-page-subtitle">
                        Giám sát toàn bộ sự kiện do Ban tổ chức tạo trong hệ thống
                    </p>
                </div>

                <div className="event-header-action">
                    <button className="btn btn-outline" onClick={lamMoi}>
                        <ArrowClockwise />
                        Làm mới
                    </button>
                    <button className="btn btn-outline" onClick={xuatExcel}>
                        <Download />
                        Xuất Excel
                    </button>
                </div>

            </div>

            {/* ================= STATISTIC ================= */}

            <div className="event-stat-grid">

                <div className="event-stat-card">
                    <span className="stat-title">Tổng sự kiện</span>
                    <h2>{thongKe.tong_su_kien}</h2>
                    <p>Tất cả sự kiện</p>
                </div>

                <div className="event-stat-card success">
                    <span className="stat-title">Sắp diễn ra</span>
                    <h2>{thongKe.sap_dien_ra}</h2>
                    <p>Chưa bắt đầu</p>
                </div>

                <div className="event-stat-card warning">
                    <span className="stat-title">Đang diễn ra</span>
                    <h2>{thongKe.dang_dien_ra}</h2>
                    <p>Đang mở đăng ký / diễn ra</p>
                </div>

                <div className="event-stat-card danger">
                    <span className="stat-title">Đã kết thúc</span>
                    <h2>{thongKe.da_ket_thuc}</h2>
                    <p>Đã hoàn thành</p>
                </div>

            </div>

            {/* ================= TOOLBAR ================= */}

            <div className="card event-toolbar">

                <div className="event-toolbar-left">

                    <div className="event-search">
                        <Search />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên sự kiện..."
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                        />
                    </div>

                    <div className="event-filter">

                        <select
                            value={locDanhMuc}
                            onChange={(e) => setLocDanhMuc(e.target.value)}
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categories.map((c) => (
                                <option key={c.ma_loai_su_kien} value={c.ma_loai_su_kien}>
                                    {c.ten_loai_su_kien}
                                </option>
                            ))}
                        </select>

                        <select
                            value={locTrangThai}
                            onChange={(e) => setLocTrangThai(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="coming">Sắp diễn ra</option>
                            <option value="running">Đang diễn ra</option>
                            <option value="finish">Đã kết thúc</option>
                            <option value="locked">Đã khóa</option>
                        </select>

                    </div>

                </div>

            </div>

            {/* ================= TABLE ================= */}

            <div className="card event-table-card">

                <div className="event-table-header">
                    <div>
                        <h3>Danh sách sự kiện</h3>
                        <p>{loading ? "Đang tải..." : `Hiển thị ${events.length} sự kiện`}</p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table event-table">
                        <thead>
                            <tr>
                                <th width="60">STT</th>
                                <th>Tên sự kiện</th>
                                <th>Danh mục</th>
                                <th>Ban tổ chức</th>
                                <th width="130">Ngày diễn ra</th>
                                <th width="120">Đăng ký</th>
                                <th width="150">Trạng thái</th>
                                <th width="140">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((item, index) => {
                                const nhom = NHOM_THEO_TRANG_THAI_CHI_TIET[item.trang_thai] || "coming";
                                const nhan = NHAN_TRANG_THAI[nhom];
                                return (
                                    <tr key={item.ma_su_kien}>
                                        <td>{index + 1}</td>
                                        <td><strong>{item.ten_su_kien}</strong></td>
                                        <td>{item.ten_loai_su_kien}</td>
                                        <td>{item.ten_nguoi_tao}</td>
                                        <td>
                                            {new Date(item.thoi_gian_bat_dau).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td>
                                            <span className="register-count">
                                                {item.so_luong_da_dang_ky}/{item.so_luong_toi_da ?? "∞"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={nhan.cls}>{nhan.text}</span>
                                        </td>
                                        <td>
                                            <div className="table-action">

                                                <button
                                                    className="table-view"
                                                    title="Xem chi tiết"
                                                    onClick={() => setChiTiet(item)}
                                                >
                                                    <Eye />
                                                </button>

                                                <button
                                                    className="table-edit"
                                                    title={nhom === "locked" ? "Mở khóa" : "Khóa sự kiện"}
                                                    onClick={() => khoaMoSuKien(item)}
                                                >
                                                    {nhom === "locked" ? <UnlockFill /> : <LockFill />}
                                                </button>

                                                <button
                                                    className="table-delete"
                                                    title="Xóa"
                                                    onClick={() => xoaSuKien(item)}
                                                >
                                                    <Trash />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {!loading && events.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "24px" }}>
                                        Không có sự kiện nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* ================= MODAL CHI TIẾT ================= */}

            {chiTiet && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setChiTiet(null)}
                >
                    <div
                        className="card"
                        style={{ width: "480px", maxWidth: "90vw", padding: "24px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: "16px" }}>{chiTiet.ten_su_kien}</h3>

                        <p><strong>Danh mục:</strong> {chiTiet.ten_loai_su_kien}</p>
                        <p><strong>Ban tổ chức:</strong> {chiTiet.ten_nguoi_tao}</p>
                        <p><strong>Địa điểm:</strong> {chiTiet.dia_diem || "—"}</p>
                        <p>
                            <strong>Thời gian:</strong>{" "}
                            {new Date(chiTiet.thoi_gian_bat_dau).toLocaleString("vi-VN")}
                            {" "}—{" "}
                            {new Date(chiTiet.thoi_gian_ket_thuc).toLocaleString("vi-VN")}
                        </p>
                        <p>
                            <strong>Đăng ký:</strong>{" "}
                            {chiTiet.so_luong_da_dang_ky}/{chiTiet.so_luong_toi_da ?? "Không giới hạn"}
                        </p>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                            <button className="btn btn-outline" onClick={() => setChiTiet(null)}>
                                Đóng
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>

    );

};

export default EventManagement;
