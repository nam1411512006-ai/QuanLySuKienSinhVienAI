import { useEffect, useState } from "react";
import {
    Search,
    PlusLg,
    Trash,
    Eye,
    ArrowClockwise,
    Download,
} from "react-bootstrap-icons";
import adminThongBaoService from "../../services/adminThongBaoService";
import adminSuKienService from "../../services/adminSuKienService";

const FORM_RONG = {
    tieu_de: "",
    noi_dung: "",
    loai_thong_bao: "HeThong",
    doi_tuong_nhan: "TatCa",
    ma_su_kien: "",
};

const LOAI_OPTIONS = [
    { value: "HeThong", label: "Hệ thống" },
    { value: "SuKien", label: "Sự kiện" },
    { value: "DaoTao", label: "Đào tạo" },
    { value: "KhanCap", label: "Khẩn cấp" },
];

const DOI_TUONG_OPTIONS = [
    { value: "TatCa", label: "Tất cả (Sinh viên + Ban tổ chức)" },
    { value: "SinhVien", label: "Toàn bộ sinh viên" },
    { value: "BanToChuc", label: "Toàn bộ ban tổ chức" },
    { value: "SuKien", label: "Người đăng ký một sự kiện" },
];

const lopLoai = (loai) => {
    const value = (loai || "").toLowerCase();
    if (value.includes("khancap") || value.includes("khẩn")) return "type-danger";
    if (value.includes("sukien") || value.includes("sự kiện") || value.includes("dangky")) return "type-event";
    if (value.includes("daotao") || value.includes("đào tạo") || value.includes("renluyen")) return "type-training";
    return "type-system";
};

const nhanLoai = (loai) => {
    const found = LOAI_OPTIONS.find((o) => o.value === loai);
    return found ? found.label : loai;
};

const dinhDangNgay = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("vi-VN");
};

const NotificationManagement = () => {

    const [notifications, setNotifications] = useState([]);
    const [thongKe, setThongKe] = useState({
        tong_thong_bao: 0,
        gui_hom_nay: 0,
        tong_luot_nhan: 0,
        ty_le_da_doc: 0,
    });
    const [loading, setLoading] = useState(true);

    const [tuKhoa, setTuKhoa] = useState("");
    const [locLoai, setLocLoai] = useState("all");

    // Modal thêm
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(FORM_RONG);
    const [submitting, setSubmitting] = useState(false);
    const [danhSachSuKien, setDanhSachSuKien] = useState([]);

    // Modal chi tiết
    const [showChiTiet, setShowChiTiet] = useState(false);
    const [tbXemChiTiet, setTbXemChiTiet] = useState(null);
    const [loadingChiTiet, setLoadingChiTiet] = useState(false);

    useEffect(() => {
        loadThongKe();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDanhSach();
        }, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tuKhoa, locLoai]);

    const loadThongKe = async () => {
        try {
            const data = await adminThongBaoService.getThongKe();
            setThongKe(data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadDanhSach = async () => {
        try {
            setLoading(true);

            const params = {};
            if (tuKhoa.trim()) params.tu_khoa = tuKhoa.trim();
            if (locLoai !== "all") params.loai_thong_bao = locLoai;

            const data = await adminThongBaoService.getDanhSach(params);
            setNotifications(data);

        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được danh sách thông báo.");
        } finally {
            setLoading(false);
        }
    };

    const lamMoi = () => {
        setTuKhoa("");
        setLocLoai("all");
        loadDanhSach();
        loadThongKe();
    };

    const xuatExcel = () => {
        const header = ["Tiêu đề", "Loại", "Thời gian gửi", "Số người nhận", "Số đã đọc"];
        const rows = notifications.map((n) => [
            n.tieu_de,
            nhanLoai(n.loai_thong_bao),
            dinhDangNgay(n.thoi_gian_gui),
            n.so_nguoi_nhan,
            n.so_da_doc,
        ]);
        const csv = [header, ...rows]
            .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "danh_sach_thong_bao.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    // ================= THÊM / GỬI THÔNG BÁO =================

    const moModalThem = async () => {
        setForm(FORM_RONG);
        setShowModal(true);

        try {
            const data = await adminSuKienService.getDanhSach({});
            setDanhSachSuKien(data);
        } catch (error) {
            console.error(error);
        }
    };

    const dongModal = () => {
        setShowModal(false);
        setForm(FORM_RONG);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.tieu_de.trim() || !form.noi_dung.trim()) {
            alert("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
            return;
        }

        if (form.doi_tuong_nhan === "SuKien" && !form.ma_su_kien) {
            alert("Vui lòng chọn sự kiện để gửi thông báo.");
            return;
        }

        try {
            setSubmitting(true);

            await adminThongBaoService.taoThongBao({
                tieu_de: form.tieu_de,
                noi_dung: form.noi_dung,
                loai_thong_bao: form.loai_thong_bao,
                doi_tuong_nhan: form.doi_tuong_nhan,
                ma_su_kien: form.doi_tuong_nhan === "SuKien" ? Number(form.ma_su_kien) : null,
            });

            alert("Gửi thông báo thành công!");

            dongModal();
            loadDanhSach();
            loadThongKe();

        } catch (error) {
            console.error(error);
            alert(error.message || "Có lỗi xảy ra.");
        } finally {
            setSubmitting(false);
        }
    };

    const xoaThongBao = async (item) => {
        const xacNhan = window.confirm(
            `Xóa thông báo "${item.tieu_de}"? Hành động này không thể hoàn tác.`
        );
        if (!xacNhan) return;

        try {
            const res = await adminThongBaoService.xoaThongBao(item.ma_thong_bao);
            alert(res.message);
            loadDanhSach();
            loadThongKe();
        } catch (error) {
            alert(error.message || "Không thể xóa thông báo.");
        }
    };

    // ================= CHI TIẾT =================

    const xemChiTiet = async (item) => {
        setShowChiTiet(true);
        setLoadingChiTiet(true);
        try {
            const data = await adminThongBaoService.getChiTiet(item.ma_thong_bao);
            setTbXemChiTiet(data);
        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được chi tiết thông báo.");
        } finally {
            setLoadingChiTiet(false);
        }
    };

    const dongChiTiet = () => {
        setShowChiTiet(false);
        setTbXemChiTiet(null);
    };

    return (
        <div className="admin-page notification-page">

            {/* ================= HEADER ================= */}

            <div className="admin-page-header notification-header">
                <div>
                    <h1 className="admin-page-title">Quản lý Thông báo</h1>
                    <p className="admin-page-subtitle">
                        Quản lý và gửi thông báo trong hệ thống
                    </p>
                </div>

                <div className="notification-header-action">
                    <button type="button" className="btn btn-outline" onClick={lamMoi}>
                        <ArrowClockwise />
                        <span>Làm mới</span>
                    </button>
                    <button type="button" className="btn btn-outline" onClick={xuatExcel}>
                        <Download />
                        <span>Xuất Excel</span>
                    </button>
                </div>
            </div>

            {/* ================= STATISTIC ================= */}

            <div className="notification-stat-grid">

                <div className="notification-stat-card">
                    <span className="stat-title">Tổng thông báo</span>
                    <h2>{thongKe.tong_thong_bao}</h2>
                    <p>Toàn hệ thống</p>
                </div>

                <div className="notification-stat-card success">
                    <span className="stat-title">Gửi hôm nay</span>
                    <h2>{thongKe.gui_hom_nay}</h2>
                    <p>Trong ngày</p>
                </div>

                <div className="notification-stat-card warning">
                    <span className="stat-title">Tổng lượt nhận</span>
                    <h2>{thongKe.tong_luot_nhan}</h2>
                    <p>Toàn hệ thống</p>
                </div>

                <div className="notification-stat-card danger">
                    <span className="stat-title">Tỷ lệ đã đọc</span>
                    <h2>{thongKe.ty_le_da_doc}%</h2>
                    <p>Trên tổng lượt nhận</p>
                </div>

            </div>

            {/* ================= TOOLBAR ================= */}

            <div className="card notification-toolbar">

                <div className="notification-toolbar-left">

                    <div className="notification-search">
                        <Search />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tiêu đề thông báo..."
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                        />
                    </div>

                    <div className="notification-filter">
                        <select value={locLoai} onChange={(e) => setLocLoai(e.target.value)}>
                            <option value="all">Tất cả loại</option>
                            {LOAI_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="notification-toolbar-right">
                    <button type="button" className="btn btn-primary" onClick={moModalThem}>
                        <PlusLg />
                        <span>Thêm thông báo</span>
                    </button>
                </div>

            </div>

            {/* ================= TABLE ================= */}

            <div className="card notification-table-card">

                <div className="notification-table-header">
                    <div>
                        <h3>Danh sách thông báo</h3>
                        <p>{loading ? "Đang tải..." : `Hiển thị ${notifications.length} thông báo`}</p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table notification-table">
                        <thead>
                            <tr>
                                <th width="60">STT</th>
                                <th>Tiêu đề</th>
                                <th width="130">Loại</th>
                                <th width="160">Thời gian gửi</th>
                                <th width="120">Người nhận</th>
                                <th width="120">Đã đọc</th>
                                <th width="120">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((item, index) => (
                                <tr key={item.ma_thong_bao}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <strong>{item.tieu_de}</strong>
                                    </td>
                                    <td>
                                        <span className={lopLoai(item.loai_thong_bao)}>
                                            {nhanLoai(item.loai_thong_bao)}
                                        </span>
                                    </td>
                                    <td>{dinhDangNgay(item.thoi_gian_gui)}</td>
                                    <td>{item.so_nguoi_nhan}</td>
                                    <td>
                                        <span className="status active">
                                            {item.so_da_doc}/{item.so_nguoi_nhan}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-action">

                                            <button
                                                type="button"
                                                className="table-view"
                                                title="Xem chi tiết"
                                                onClick={() => xemChiTiet(item)}
                                            >
                                                <Eye />
                                            </button>

                                            <button
                                                type="button"
                                                className="table-delete"
                                                title="Xóa"
                                                onClick={() => xoaThongBao(item)}
                                            >
                                                <Trash />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && notifications.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "24px" }}>
                                        Không có thông báo nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* ================= MODAL THÊM ================= */}

            {showModal && (
                <div
                    className="modal-overlay"
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
                    }}
                    onClick={dongModal}
                >
                    <div
                        className="card"
                        style={{ width: "520px", maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", padding: "24px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: "16px" }}>Thêm thông báo mới</h3>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Tiêu đề *</label>
                                <input
                                    type="text" className="form-control" name="tieu_de"
                                    value={form.tieu_de} onChange={handleFormChange} required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Nội dung *</label>
                                <textarea
                                    className="form-control" name="noi_dung" rows={4}
                                    value={form.noi_dung} onChange={handleFormChange} required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Loại thông báo</label>
                                <select
                                    className="form-control" name="loai_thong_bao"
                                    value={form.loai_thong_bao} onChange={handleFormChange}
                                >
                                    {LOAI_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Đối tượng nhận</label>
                                <select
                                    className="form-control" name="doi_tuong_nhan"
                                    value={form.doi_tuong_nhan} onChange={handleFormChange}
                                >
                                    {DOI_TUONG_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>

                            {form.doi_tuong_nhan === "SuKien" && (
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label>Sự kiện *</label>
                                    <select
                                        className="form-control" name="ma_su_kien"
                                        value={form.ma_su_kien} onChange={handleFormChange} required
                                    >
                                        <option value="">-- Chọn sự kiện --</option>
                                        {danhSachSuKien.map((sk) => (
                                            <option key={sk.ma_su_kien} value={sk.ma_su_kien}>
                                                {sk.ten_su_kien}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }}>
                                <button type="button" className="btn btn-outline" onClick={dongModal}>Hủy</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? "Đang gửi..." : "Gửi thông báo"}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* ================= MODAL CHI TIẾT ================= */}

            {showChiTiet && (
                <div
                    className="modal-overlay"
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
                    }}
                    onClick={dongChiTiet}
                >
                    <div
                        className="card"
                        style={{ width: "640px", maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto", padding: "24px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: "4px" }}>{tbXemChiTiet?.tieu_de}</h3>
                        <p style={{ marginBottom: "16px", color: "#888" }}>
                            {nhanLoai(tbXemChiTiet?.loai_thong_bao)} · {dinhDangNgay(tbXemChiTiet?.thoi_gian_gui)}
                        </p>

                        {loadingChiTiet ? (
                            <p>Đang tải...</p>
                        ) : (
                            <>
                                <p style={{ marginBottom: "16px" }}>{tbXemChiTiet?.noi_dung}</p>

                                <h4 style={{ marginBottom: "8px", fontSize: "15px" }}>
                                    Danh sách người nhận ({tbXemChiTiet?.nguoi_nhan?.length || 0})
                                </h4>

                                {(!tbXemChiTiet?.nguoi_nhan || tbXemChiTiet.nguoi_nhan.length === 0) ? (
                                    <p>Chưa có người nhận nào.</p>
                                ) : (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Họ tên</th>
                                                <th>Email</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tbXemChiTiet.nguoi_nhan.map((nn) => (
                                                <tr key={nn.ma_nhan}>
                                                    <td>{nn.ho_ten}</td>
                                                    <td>{nn.email || "—"}</td>
                                                    <td>
                                                        <span className={nn.da_doc ? "status active" : "status lock"}>
                                                            {nn.da_doc ? "Đã đọc" : "Chưa đọc"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                            <button type="button" className="btn btn-outline" onClick={dongChiTiet}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default NotificationManagement;
