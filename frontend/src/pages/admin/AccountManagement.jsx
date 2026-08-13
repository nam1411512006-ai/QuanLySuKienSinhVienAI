import { useEffect, useState } from "react";
import {
    Search,
    PlusLg,
    PencilSquare,
    Trash,
    ArrowClockwise,
    Download,
    LockFill,
    UnlockFill,
} from "react-bootstrap-icons";
import adminTaiKhoanService from "../../services/adminTaiKhoanService";

const VAI_TRO_LABEL = {
    1: "Admin",
    2: "Ban tổ chức",
    3: "Sinh viên",
};

const FORM_RONG = {
    ho_ten: "",
    email: "",
    mat_khau: "",
    ma_vai_tro: 3,
    so_dien_thoai: "",
    mssv: "",
};

const AccountManagement = () => {

    const [users, setUsers] = useState([]);
    const [thongKe, setThongKe] = useState({
        tong_tai_khoan: 0,
        tong_admin: 0,
        tong_ban_to_chuc: 0,
        tong_sinh_vien: 0,
    });
    const [loading, setLoading] = useState(true);

    const [tuKhoa, setTuKhoa] = useState("");
    const [locVaiTro, setLocVaiTro] = useState("all");
    const [locTrangThai, setLocTrangThai] = useState("all");

    const [showModal, setShowModal] = useState(false);
    const [dangSua, setDangSua] = useState(null); // null = thêm mới, object = đang sửa
    const [form, setForm] = useState(FORM_RONG);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadThongKe();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDanhSach();
        }, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tuKhoa, locVaiTro, locTrangThai]);

    const loadThongKe = async () => {
        try {
            const data = await adminTaiKhoanService.getThongKe();
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
            if (locVaiTro !== "all") params.ma_vai_tro = locVaiTro;
            if (locTrangThai !== "all") params.trang_thai = locTrangThai;

            const data = await adminTaiKhoanService.getDanhSach(params);
            setUsers(data);

        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được danh sách tài khoản.");
        } finally {
            setLoading(false);
        }
    };

    const lamMoi = () => {
        setTuKhoa("");
        setLocVaiTro("all");
        setLocTrangThai("all");
        loadDanhSach();
        loadThongKe();
    };

    const xuatExcel = () => {
        const header = ["Họ tên", "Email", "Vai trò", "Trạng thái", "Ngày tạo"];
        const rows = users.map((u) => [
            u.ho_ten,
            u.email || "",
            VAI_TRO_LABEL[u.ma_vai_tro] || "",
            u.trang_thai === 1 ? "Hoạt động" : "Đã khóa",
            u.ngay_tao ? new Date(u.ngay_tao).toLocaleDateString("vi-VN") : "",
        ]);
        const csv = [header, ...rows]
            .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "danh_sach_tai_khoan.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const moModalThem = () => {
        setDangSua(null);
        setForm(FORM_RONG);
        setShowModal(true);
    };

    const moModalSua = (user) => {
        setDangSua(user);
        setForm({
            ho_ten: user.ho_ten,
            email: user.email || "",
            mat_khau: "",
            ma_vai_tro: user.ma_vai_tro,
            so_dien_thoai: user.so_dien_thoai || "",
            mssv: user.mssv || "",
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

            if (dangSua) {
                await adminTaiKhoanService.capNhatTaiKhoan(dangSua.ma_tai_khoan, {
                    ho_ten: form.ho_ten,
                    email: form.email,
                    ma_vai_tro: Number(form.ma_vai_tro),
                    so_dien_thoai: form.so_dien_thoai || null,
                    mssv: form.mssv || null,
                });
                alert("Cập nhật tài khoản thành công!");
            } else {
                await adminTaiKhoanService.taoTaiKhoan({
                    ho_ten: form.ho_ten,
                    email: form.email,
                    mat_khau: form.mat_khau,
                    ma_vai_tro: Number(form.ma_vai_tro),
                    so_dien_thoai: form.so_dien_thoai || null,
                    mssv: form.mssv || null,
                });
                alert("Tạo tài khoản thành công!");
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

    const toggleTrangThai = async (user) => {
        const xacNhan = window.confirm(
            user.trang_thai === 1
                ? `Khóa tài khoản "${user.ho_ten}"?`
                : `Mở khóa tài khoản "${user.ho_ten}"?`
        );
        if (!xacNhan) return;

        try {
            const res = await adminTaiKhoanService.doiTrangThai(user.ma_tai_khoan);
            alert(res.message);
            loadDanhSach();
        } catch (error) {
            alert(error.message || "Không thể đổi trạng thái.");
        }
    };

    const xoaTaiKhoan = async (user) => {
        const xacNhan = window.confirm(
            `Xóa vĩnh viễn tài khoản "${user.ho_ten}"? Hành động này không thể hoàn tác.`
        );
        if (!xacNhan) return;

        try {
            const res = await adminTaiKhoanService.xoaTaiKhoan(user.ma_tai_khoan);
            alert(res.message);
            loadDanhSach();
            loadThongKe();
        } catch (error) {
            alert(error.message || "Không thể xóa tài khoản.");
        }
    };

    return (
        <div className="admin-page account-page">

            {/* ================= HEADER ================= */}

            <div className="admin-page-header account-page-header">

                <div className="account-heading">
                    <h1 className="admin-page-title">Quản lý tài khoản</h1>
                    <p className="admin-page-subtitle">
                        Quản lý toàn bộ tài khoản trong hệ thống
                    </p>
                </div>

                <div className="account-header-actions">

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

            {/* ================= STATISTICS ================= */}

            <div className="account-stat-grid">

                <div className="account-stat-card account-stat-total">
                    <div className="account-stat-label">Tổng tài khoản</div>
                    <div className="account-stat-value">{thongKe.tong_tai_khoan}</div>
                    <div className="account-stat-description">Tất cả tài khoản hệ thống</div>
                </div>

                <div className="account-stat-card account-stat-admin">
                    <div className="account-stat-label">Quản trị viên</div>
                    <div className="account-stat-value">{thongKe.tong_admin}</div>
                    <div className="account-stat-description">Tài khoản quản trị</div>
                </div>

                <div className="account-stat-card account-stat-organizer">
                    <div className="account-stat-label">Ban tổ chức</div>
                    <div className="account-stat-value">{thongKe.tong_ban_to_chuc}</div>
                    <div className="account-stat-description">Tài khoản tổ chức sự kiện</div>
                </div>

                <div className="account-stat-card account-stat-student">
                    <div className="account-stat-label">Sinh viên</div>
                    <div className="account-stat-value">{thongKe.tong_sinh_vien}</div>
                    <div className="account-stat-description">Tài khoản sinh viên</div>
                </div>

            </div>

            {/* ================= TOOLBAR ================= */}

            <div className="card account-toolbar">

                <div className="account-toolbar-left">

                    <div className="account-search">
                        <Search />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo họ tên hoặc Email..."
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                        />
                    </div>

                    <div className="account-filter">

                        <select
                            value={locVaiTro}
                            onChange={(e) => setLocVaiTro(e.target.value)}
                        >
                            <option value="all">Tất cả vai trò</option>
                            <option value="1">Admin</option>
                            <option value="2">Ban tổ chức</option>
                            <option value="3">Sinh viên</option>
                        </select>

                        <select
                            value={locTrangThai}
                            onChange={(e) => setLocTrangThai(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="1">Hoạt động</option>
                            <option value="0">Đã khóa</option>
                        </select>

                    </div>

                </div>

                <div className="account-toolbar-right">
                    <button
                        type="button"
                        className="btn btn-primary account-add-btn"
                        onClick={moModalThem}
                    >
                        <PlusLg />
                        <span>Thêm tài khoản</span>
                    </button>
                </div>

            </div>

            {/* ================= TABLE ================= */}

            <div className="card account-table-card">

                <div className="account-table-header">
                    <div>
                        <h3>Danh sách tài khoản</h3>
                        <p>
                            {loading ? "Đang tải..." : `Hiển thị ${users.length} tài khoản`}
                        </p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table account-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.ma_tai_khoan}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <strong className="account-user-name">
                                            {user.ho_ten}
                                        </strong>
                                        {user.mssv && (
                                            <div style={{ fontSize: "12px", color: "#888" }}>
                                                MSSV: {user.mssv}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span className="account-email">{user.email}</span>
                                    </td>
                                    <td>
                                        <span className="account-role">
                                            {VAI_TRO_LABEL[user.ma_vai_tro] || "—"}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={
                                                user.trang_thai === 1
                                                    ? "status active"
                                                    : "status lock"
                                            }
                                        >
                                            {user.trang_thai === 1 ? "Hoạt động" : "Đã khóa"}
                                        </span>
                                    </td>
                                    <td>
                                        {user.ngay_tao
                                            ? new Date(user.ngay_tao).toLocaleDateString("vi-VN")
                                            : "—"}
                                    </td>
                                    <td>
                                        <div className="table-action">

                                            <button
                                                type="button"
                                                className="table-edit"
                                                title="Chỉnh sửa tài khoản"
                                                onClick={() => moModalSua(user)}
                                            >
                                                <PencilSquare />
                                            </button>

                                            <button
                                                type="button"
                                                className="table-edit"
                                                title={
                                                    user.trang_thai === 1
                                                        ? "Khóa tài khoản"
                                                        : "Mở khóa tài khoản"
                                                }
                                                onClick={() => toggleTrangThai(user)}
                                            >
                                                {user.trang_thai === 1 ? (
                                                    <LockFill />
                                                ) : (
                                                    <UnlockFill />
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                className="table-delete"
                                                title="Xóa tài khoản"
                                                onClick={() => xoaTaiKhoan(user)}
                                            >
                                                <Trash />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && users.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "24px" }}>
                                        Không có tài khoản nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* ================= MODAL THÊM / SỬA ================= */}

            {showModal && (
                <div
                    className="modal-overlay"
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={dongModal}
                >
                    <div
                        className="card"
                        style={{
                            width: "480px",
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            padding: "24px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: "16px" }}>
                            {dangSua ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
                        </h3>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Họ tên *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="ho_ten"
                                    value={form.ho_ten}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Email *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={form.email}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            {!dangSua && (
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label>Mật khẩu *</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="mat_khau"
                                        value={form.mat_khau}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Vai trò *</label>
                                <select
                                    className="form-select"
                                    name="ma_vai_tro"
                                    value={form.ma_vai_tro}
                                    onChange={handleFormChange}
                                >
                                    <option value={1}>Admin</option>
                                    <option value={2}>Ban tổ chức</option>
                                    <option value={3}>Sinh viên</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="so_dien_thoai"
                                    value={form.so_dien_thoai}
                                    onChange={handleFormChange}
                                />
                            </div>

                            {Number(form.ma_vai_tro) === 3 && (
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label>MSSV</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="mssv"
                                        value={form.mssv}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }}>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={dongModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? "Đang lưu..." : "Lưu"}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default AccountManagement;
