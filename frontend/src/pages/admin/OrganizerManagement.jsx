import { useEffect, useState } from "react";
import {
    Search,
    PlusLg,
    PencilSquare,
    Trash,
    Eye,
    ArrowClockwise,
    Download,
    LockFill,
    UnlockFill,
    Building,
} from "react-bootstrap-icons";
import adminBanToChucService from "../../services/adminBanToChucService";

const FORM_RONG = {
    ho_ten: "",
    email: "",
    mat_khau: "",
    so_dien_thoai: "",
    ma_trung_tam: "",
};

const TRUNG_TAM_FORM_RONG = {
    ten_trung_tam: "",
    mo_ta: "",
};

const OrganizerManagement = () => {

    const [organizers, setOrganizers] = useState([]);
    const [trungTamList, setTrungTamList] = useState([]);
    const [thongKe, setThongKe] = useState({
        tong_ban_to_chuc: 0,
        dang_hoat_dong: 0,
        da_khoa: 0,
        tong_su_kien: 0,
    });
    const [loading, setLoading] = useState(true);

    const [tuKhoa, setTuKhoa] = useState("");
    const [locTrungTam, setLocTrungTam] = useState("all");
    const [locTrangThai, setLocTrangThai] = useState("all");

    // Modal thêm/sửa BTC
    const [showModal, setShowModal] = useState(false);
    const [dangSua, setDangSua] = useState(null);
    const [form, setForm] = useState(FORM_RONG);
    const [submitting, setSubmitting] = useState(false);

    // Modal chi tiết sự kiện
    const [showChiTiet, setShowChiTiet] = useState(false);
    const [btcXemChiTiet, setBtcXemChiTiet] = useState(null);
    const [suKienList, setSuKienList] = useState([]);
    const [loadingSuKien, setLoadingSuKien] = useState(false);

    // Modal quản lý đơn vị/trung tâm
    const [showTrungTamModal, setShowTrungTamModal] = useState(false);
    const [dangSuaTrungTam, setDangSuaTrungTam] = useState(null);
    const [trungTamForm, setTrungTamForm] = useState(TRUNG_TAM_FORM_RONG);
    const [submittingTrungTam, setSubmittingTrungTam] = useState(false);

    useEffect(() => {
        loadThongKe();
        loadTrungTam();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDanhSach();
        }, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tuKhoa, locTrungTam, locTrangThai]);

    const loadThongKe = async () => {
        try {
            const data = await adminBanToChucService.getThongKe();
            setThongKe(data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadTrungTam = async () => {
        try {
            const data = await adminBanToChucService.getDanhSachTrungTam();
            setTrungTamList(data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadDanhSach = async () => {
        try {
            setLoading(true);

            const params = {};
            if (tuKhoa.trim()) params.tu_khoa = tuKhoa.trim();
            if (locTrungTam !== "all") params.ma_trung_tam = locTrungTam;
            if (locTrangThai !== "all") params.trang_thai = locTrangThai;

            const data = await adminBanToChucService.getDanhSach(params);
            setOrganizers(data);

        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được danh sách Ban tổ chức.");
        } finally {
            setLoading(false);
        }
    };

    const lamMoi = () => {
        setTuKhoa("");
        setLocTrungTam("all");
        setLocTrangThai("all");
        loadDanhSach();
        loadThongKe();
    };

    const xuatExcel = () => {
        const header = ["Họ tên", "Email", "Đơn vị", "Điện thoại", "Số sự kiện", "Trạng thái"];
        const rows = organizers.map((o) => [
            o.ho_ten,
            o.email || "",
            o.ten_trung_tam || "",
            o.so_dien_thoai || "",
            o.so_su_kien,
            o.trang_thai === 1 ? "Hoạt động" : "Đã khóa",
        ]);
        const csv = [header, ...rows]
            .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "danh_sach_ban_to_chuc.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    // ================= CRUD BTC =================

    const moModalThem = () => {
        setDangSua(null);
        setForm(FORM_RONG);
        setShowModal(true);
    };

    const moModalSua = (item) => {
        setDangSua(item);
        setForm({
            ho_ten: item.ho_ten,
            email: item.email || "",
            mat_khau: "",
            so_dien_thoai: item.so_dien_thoai || "",
            ma_trung_tam: item.ma_trung_tam || "",
        });
        setShowModal(true);
    };

    const dongModal = () => {
        setShowModal(false);
        setDangSua(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.ho_ten.trim() || !form.email.trim()) {
            alert("Vui lòng nhập đầy đủ họ tên và email.");
            return;
        }

        if (!dangSua && !form.mat_khau.trim()) {
            alert("Vui lòng nhập mật khẩu cho tài khoản mới.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                ho_ten: form.ho_ten,
                email: form.email,
                so_dien_thoai: form.so_dien_thoai || null,
                ma_trung_tam: form.ma_trung_tam ? Number(form.ma_trung_tam) : null,
            };

            if (dangSua) {
                await adminBanToChucService.capNhatBanToChuc(dangSua.ma_tai_khoan, payload);
                alert("Cập nhật Ban tổ chức thành công!");
            } else {
                await adminBanToChucService.taoBanToChuc({
                    ...payload,
                    mat_khau: form.mat_khau,
                });
                alert("Thêm Ban tổ chức thành công!");
            }

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

    const toggleTrangThai = async (item) => {
        const xacNhan = window.confirm(
            item.trang_thai === 1
                ? `Khóa tài khoản "${item.ho_ten}"?`
                : `Mở khóa tài khoản "${item.ho_ten}"?`
        );
        if (!xacNhan) return;

        try {
            const res = await adminBanToChucService.doiTrangThai(item.ma_tai_khoan);
            alert(res.message);
            loadDanhSach();
            loadThongKe();
        } catch (error) {
            alert(error.message || "Không thể đổi trạng thái.");
        }
    };

    const xoaBanToChuc = async (item) => {
        const xacNhan = window.confirm(
            `Xóa vĩnh viễn tài khoản "${item.ho_ten}"? Hành động này không thể hoàn tác.`
        );
        if (!xacNhan) return;

        try {
            const res = await adminBanToChucService.xoaBanToChuc(item.ma_tai_khoan);
            alert(res.message);
            loadDanhSach();
            loadThongKe();
        } catch (error) {
            alert(error.message || "Không thể xóa tài khoản.");
        }
    };

    // ================= Chi tiết sự kiện =================

    const xemChiTiet = async (item) => {
        setBtcXemChiTiet(item);
        setShowChiTiet(true);
        setLoadingSuKien(true);
        try {
            const data = await adminBanToChucService.getSuKienCuaBanToChuc(item.ma_tai_khoan);
            setSuKienList(data);
        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được danh sách sự kiện.");
        } finally {
            setLoadingSuKien(false);
        }
    };

    const dongChiTiet = () => {
        setShowChiTiet(false);
        setBtcXemChiTiet(null);
        setSuKienList([]);
    };

    // ================= CRUD Trung tâm / Đơn vị =================

    const moTrungTamModalThem = () => {
        setDangSuaTrungTam(null);
        setTrungTamForm(TRUNG_TAM_FORM_RONG);
        setShowTrungTamModal(true);
    };

    const moTrungTamModalSua = (tt) => {
        setDangSuaTrungTam(tt);
        setTrungTamForm({ ten_trung_tam: tt.ten_trung_tam, mo_ta: tt.mo_ta || "" });
        setShowTrungTamModal(true);
    };

    const dongTrungTamModal = () => {
        setShowTrungTamModal(false);
        setDangSuaTrungTam(null);
    };

    const handleTrungTamFormChange = (e) => {
        const { name, value } = e.target;
        setTrungTamForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitTrungTam = async (e) => {
        e.preventDefault();

        if (!trungTamForm.ten_trung_tam.trim()) {
            alert("Vui lòng nhập tên đơn vị.");
            return;
        }

        try {
            setSubmittingTrungTam(true);

            if (dangSuaTrungTam) {
                await adminBanToChucService.capNhatTrungTam(dangSuaTrungTam.ma_trung_tam, trungTamForm);
                alert("Cập nhật đơn vị thành công!");
            } else {
                await adminBanToChucService.taoTrungTam(trungTamForm);
                alert("Thêm đơn vị thành công!");
            }

            setTrungTamForm(TRUNG_TAM_FORM_RONG);
            setDangSuaTrungTam(null);
            loadTrungTam();

        } catch (error) {
            console.error(error);
            alert(error.message || "Có lỗi xảy ra.");
        } finally {
            setSubmittingTrungTam(false);
        }
    };

    const xoaTrungTam = async (tt) => {
        const xacNhan = window.confirm(`Xóa đơn vị "${tt.ten_trung_tam}"?`);
        if (!xacNhan) return;

        try {
            const res = await adminBanToChucService.xoaTrungTam(tt.ma_trung_tam);
            alert(res.message);
            loadTrungTam();
        } catch (error) {
            alert(error.message || "Không thể xóa đơn vị.");
        }
    };

    return (
        <div className="admin-page organizer-page">

            {/* ================= HEADER ================= */}

            <div className="admin-page-header organizer-header">
                <div>
                    <h1 className="admin-page-title">Quản lý Ban tổ chức</h1>
                    <p className="admin-page-subtitle">
                        Quản lý toàn bộ tài khoản Ban tổ chức và đơn vị tổ chức sự kiện
                    </p>
                </div>

                <div className="organizer-header-action">
                    <button type="button" className="btn btn-outline" onClick={moTrungTamModalThem}>
                        <Building />
                        <span>Quản lý đơn vị</span>
                    </button>
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

            {/* ================= THỐNG KÊ ================= */}

            <div className="organizer-stat-grid">

                <div className="organizer-stat-card">
                    <span className="stat-title">Tổng Ban tổ chức</span>
                    <h2>{thongKe.tong_ban_to_chuc}</h2>
                    <p>Tổng tài khoản Ban tổ chức</p>
                </div>

                <div className="organizer-stat-card success">
                    <span className="stat-title">Đang hoạt động</span>
                    <h2>{thongKe.dang_hoat_dong}</h2>
                    <p>Có thể quản lý sự kiện</p>
                </div>

                <div className="organizer-stat-card danger">
                    <span className="stat-title">Đã khóa</span>
                    <h2>{thongKe.da_khoa}</h2>
                    <p>Tài khoản đang bị khóa</p>
                </div>

                <div className="organizer-stat-card warning">
                    <span className="stat-title">Sự kiện phụ trách</span>
                    <h2>{thongKe.tong_su_kien}</h2>
                    <p>Tổng số sự kiện</p>
                </div>

            </div>

            {/* ================= TOOLBAR ================= */}

            <div className="card organizer-toolbar">

                <div className="organizer-toolbar-left">

                    <div className="organizer-search">
                        <Search />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo họ tên hoặc Email..."
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                        />
                    </div>

                    <div className="organizer-filter">

                        <select value={locTrungTam} onChange={(e) => setLocTrungTam(e.target.value)}>
                            <option value="all">Tất cả đơn vị</option>
                            {trungTamList.map((tt) => (
                                <option key={tt.ma_trung_tam} value={tt.ma_trung_tam}>
                                    {tt.ten_trung_tam}
                                </option>
                            ))}
                        </select>

                        <select value={locTrangThai} onChange={(e) => setLocTrangThai(e.target.value)}>
                            <option value="all">Tất cả trạng thái</option>
                            <option value="1">Hoạt động</option>
                            <option value="0">Đã khóa</option>
                        </select>

                    </div>

                </div>

                <div className="organizer-toolbar-right">
                    <button type="button" className="btn btn-primary" onClick={moModalThem}>
                        <PlusLg />
                        <span>Thêm Ban tổ chức</span>
                    </button>
                </div>

            </div>

            {/* ================= TABLE ================= */}

            <div className="card organizer-table-card">

                <div className="organizer-table-header">
                    <div>
                        <h3>Danh sách Ban tổ chức</h3>
                        <p>{loading ? "Đang tải..." : `Hiển thị ${organizers.length} Ban tổ chức`}</p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table organizer-table">
                        <thead>
                            <tr>
                                <th width="60">STT</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Đơn vị</th>
                                <th>Điện thoại</th>
                                <th>Sự kiện</th>
                                <th>Trạng thái</th>
                                <th width="170">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {organizers.map((item, index) => (
                                <tr key={item.ma_tai_khoan}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="organizer-user">
                                            <strong>{item.ho_ten}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="organizer-email">{item.email}</span>
                                    </td>
                                    <td>{item.ten_trung_tam || "—"}</td>
                                    <td>{item.so_dien_thoai || "—"}</td>
                                    <td>
                                        <span className="event-count">{item.so_su_kien} Sự kiện</span>
                                    </td>
                                    <td>
                                        <span className={item.trang_thai === 1 ? "status active" : "status lock"}>
                                            {item.trang_thai === 1 ? "Hoạt động" : "Đã khóa"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-action">

                                            <button
                                                type="button"
                                                className="table-view"
                                                title="Xem chi tiết sự kiện"
                                                onClick={() => xemChiTiet(item)}
                                            >
                                                <Eye />
                                            </button>

                                            <button
                                                type="button"
                                                className="table-edit"
                                                title="Chỉnh sửa"
                                                onClick={() => moModalSua(item)}
                                            >
                                                <PencilSquare />
                                            </button>

                                            <button
                                                type="button"
                                                className="table-edit"
                                                title={item.trang_thai === 1 ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                                onClick={() => toggleTrangThai(item)}
                                            >
                                                {item.trang_thai === 1 ? <LockFill /> : <UnlockFill />}
                                            </button>

                                            <button
                                                type="button"
                                                className="table-delete"
                                                title="Xóa"
                                                onClick={() => xoaBanToChuc(item)}
                                            >
                                                <Trash />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && organizers.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "24px" }}>
                                        Không có Ban tổ chức nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* ================= MODAL THÊM / SỬA BTC ================= */}

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
                        style={{ width: "480px", maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", padding: "24px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: "16px" }}>
                            {dangSua ? "Chỉnh sửa Ban tổ chức" : "Thêm Ban tổ chức mới"}
                        </h3>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Họ tên *</label>
                                <input
                                    type="text" className="form-control" name="ho_ten"
                                    value={form.ho_ten} onChange={handleFormChange} required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Email *</label>
                                <input
                                    type="email" className="form-control" name="email"
                                    value={form.email} onChange={handleFormChange} required
                                />
                            </div>

                            {!dangSua && (
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label>Mật khẩu *</label>
                                    <input
                                        type="password" className="form-control" name="mat_khau"
                                        value={form.mat_khau} onChange={handleFormChange} required
                                    />
                                </div>
                            )}

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Đơn vị / Trung tâm</label>
                                <select
                                    className="form-select" name="ma_trung_tam"
                                    value={form.ma_trung_tam} onChange={handleFormChange}
                                >
                                    <option value="">-- Chưa gán đơn vị --</option>
                                    {trungTamList.map((tt) => (
                                        <option key={tt.ma_trung_tam} value={tt.ma_trung_tam}>
                                            {tt.ten_trung_tam}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Số điện thoại</label>
                                <input
                                    type="text" className="form-control" name="so_dien_thoai"
                                    value={form.so_dien_thoai} onChange={handleFormChange}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }}>
                                <button type="button" className="btn btn-outline" onClick={dongModal}>Hủy</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? "Đang lưu..." : "Lưu"}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* ================= MODAL CHI TIẾT SỰ KIỆN ================= */}

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
                        style={{ width: "600px", maxWidth: "90vw", maxHeight: "80vh", overflowY: "auto", padding: "24px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: "4px" }}>Sự kiện của {btcXemChiTiet?.ho_ten}</h3>
                        <p style={{ marginBottom: "16px", color: "#888" }}>{btcXemChiTiet?.email}</p>

                        {loadingSuKien ? (
                            <p>Đang tải...</p>
                        ) : suKienList.length === 0 ? (
                            <p>Ban tổ chức này chưa tạo sự kiện nào.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Tên sự kiện</th>
                                        <th>Bắt đầu</th>
                                        <th>Đăng ký</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suKienList.map((sk) => (
                                        <tr key={sk.ma_su_kien}>
                                            <td>{sk.ten_su_kien}</td>
                                            <td>
                                                {sk.thoi_gian_bat_dau
                                                    ? new Date(sk.thoi_gian_bat_dau).toLocaleDateString("vi-VN")
                                                    : "—"}
                                            </td>
                                            <td>{sk.so_luong_dang_ky}</td>
                                            <td>{sk.trang_thai}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                            <button type="button" className="btn btn-outline" onClick={dongChiTiet}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL QUẢN LÝ ĐƠN VỊ / TRUNG TÂM ================= */}

            {showTrungTamModal && (
                <div
                    className="modal-overlay"
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
                    }}
                    onClick={dongTrungTamModal}
                >
                    <div
                        className="card"
                        style={{ width: "560px", maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto", padding: "24px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: "16px" }}>Quản lý đơn vị / Trung tâm tổ chức</h3>

                        <form onSubmit={handleSubmitTrungTam} style={{ marginBottom: "20px" }}>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                <input
                                    type="text" className="form-control" name="ten_trung_tam"
                                    placeholder="Tên đơn vị (VD: Đoàn Thanh niên, CLB CNTT...)"
                                    value={trungTamForm.ten_trung_tam}
                                    onChange={handleTrungTamFormChange}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className="btn btn-primary" disabled={submittingTrungTam}>
                                    {dangSuaTrungTam ? "Cập nhật" : "Thêm"}
                                </button>
                                {dangSuaTrungTam && (
                                    <button type="button" className="btn btn-outline" onClick={moTrungTamModalThem}>
                                        Hủy sửa
                                    </button>
                                )}
                            </div>
                            <textarea
                                className="form-control"
                                name="mo_ta"
                                placeholder="Mô tả (không bắt buộc)"
                                value={trungTamForm.mo_ta}
                                onChange={handleTrungTamFormChange}
                                rows={2}
                            />
                        </form>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Tên đơn vị</th>
                                    <th>Số BTC</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trungTamList.map((tt) => (
                                    <tr key={tt.ma_trung_tam}>
                                        <td>{tt.ten_trung_tam}</td>
                                        <td>{tt.so_thanh_vien}</td>
                                        <td>
                                            <div className="table-action">
                                                <button
                                                    type="button" className="table-edit" title="Sửa"
                                                    onClick={() => moTrungTamModalSua(tt)}
                                                >
                                                    <PencilSquare />
                                                </button>
                                                <button
                                                    type="button" className="table-delete" title="Xóa"
                                                    onClick={() => xoaTrungTam(tt)}
                                                >
                                                    <Trash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {trungTamList.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: "center", padding: "16px" }}>
                                            Chưa có đơn vị nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                            <button type="button" className="btn btn-outline" onClick={dongTrungTamModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default OrganizerManagement;
