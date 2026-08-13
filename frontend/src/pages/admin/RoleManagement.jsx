import { useEffect, useState } from "react";
import {
    PlusLg,
    PencilSquare,
    Trash,
    ArrowClockwise,
    ShieldLock,
} from "react-bootstrap-icons";
import adminVaiTroService from "../../services/adminVaiTroService";

const FORM_RONG = {
    ten_vai_tro: "",
    mo_ta: "",
};

const RoleManagement = () => {

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [dangSua, setDangSua] = useState(null);
    const [form, setForm] = useState(FORM_RONG);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadDanhSach();
    }, []);

    const loadDanhSach = async () => {
        try {
            setLoading(true);
            const data = await adminVaiTroService.getDanhSach();
            setRoles(data);
        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được danh sách vai trò.");
        } finally {
            setLoading(false);
        }
    };

    const tongVaiTro = roles.length;
    const tongNguoiDung = roles.reduce((tong, item) => tong + item.so_nguoi_dung, 0);

    // ================= CRUD =================

    const moModalThem = () => {
        setDangSua(null);
        setForm(FORM_RONG);
        setShowModal(true);
    };

    const moModalSua = (item) => {
        setDangSua(item);
        setForm({ ten_vai_tro: item.ten_vai_tro, mo_ta: item.mo_ta || "" });
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

        if (!form.ten_vai_tro.trim()) {
            alert("Vui lòng nhập tên vai trò.");
            return;
        }

        try {
            setSubmitting(true);

            if (dangSua) {
                await adminVaiTroService.capNhatVaiTro(dangSua.ma_vai_tro, form);
                alert("Cập nhật vai trò thành công!");
            } else {
                await adminVaiTroService.taoVaiTro(form);
                alert(
                    "Đã thêm vai trò mới. Lưu ý: hệ thống hiện phân quyền cố định theo mã vai trò " +
                    "trong mã nguồn, nên vai trò mới sẽ cần được lập trình viên gán quyền truy cập " +
                    "trong code thì mới có hiệu lực thực tế."
                );
            }

            dongModal();
            loadDanhSach();

        } catch (error) {
            console.error(error);
            alert(error.message || "Có lỗi xảy ra.");
        } finally {
            setSubmitting(false);
        }
    };

    const xoaVaiTro = async (item) => {
        if (item.la_vai_tro_he_thong) {
            alert("Không thể xóa vai trò hệ thống (Admin / Ban tổ chức / Sinh viên).");
            return;
        }

        const xacNhan = window.confirm(`Xóa vai trò "${item.ten_vai_tro}"?`);
        if (!xacNhan) return;

        try {
            const res = await adminVaiTroService.xoaVaiTro(item.ma_vai_tro);
            alert(res.message);
            loadDanhSach();
        } catch (error) {
            alert(error.message || "Không thể xóa vai trò.");
        }
    };

    return (
        <div className="admin-page role-page">

            {/* ================= HEADER ================= */}

            <div className="admin-page-header role-header">
                <div>
                    <h1 className="admin-page-title">Quản lý Phân quyền</h1>
                    <p className="admin-page-subtitle">
                        Quản lý vai trò và quyền truy cập hệ thống
                    </p>
                </div>

                <div className="role-header-action">
                    <button type="button" className="btn btn-outline" onClick={loadDanhSach}>
                        <ArrowClockwise />
                        <span>Làm mới</span>
                    </button>
                    <button type="button" className="btn btn-primary" onClick={moModalThem}>
                        <PlusLg />
                        <span>Thêm vai trò</span>
                    </button>
                </div>
            </div>

            {/* ================= STATISTIC ================= */}

            <div className="role-stat-grid">

                <div className="role-stat-card">
                    <span className="stat-title">Tổng vai trò</span>
                    <h2>{tongVaiTro}</h2>
                    <p>Vai trò trong hệ thống</p>
                </div>

                <div className="role-stat-card success">
                    <span className="stat-title">Tổng người dùng</span>
                    <h2>{tongNguoiDung}</h2>
                    <p>Tài khoản đã được phân quyền</p>
                </div>

            </div>

            {/* ================= TABLE ================= */}

            <div className="card role-table-card">

                <div className="role-table-header">
                    <div>
                        <h3>Danh sách vai trò</h3>
                        <p>{loading ? "Đang tải..." : `Hiển thị ${roles.length} vai trò`}</p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table role-table">
                        <thead>
                            <tr>
                                <th width="60">STT</th>
                                <th>Tên vai trò</th>
                                <th>Mô tả</th>
                                <th>Số người dùng</th>
                                <th width="140">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((item, index) => (
                                <tr key={item.ma_vai_tro}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <strong>{item.ten_vai_tro}</strong>
                                        {item.la_vai_tro_he_thong && (
                                            <span
                                                title="Vai trò hệ thống, không thể xóa hoặc đổi tên"
                                                style={{ marginLeft: "6px", color: "#888" }}
                                            >
                                                <ShieldLock size={14} />
                                            </span>
                                        )}
                                    </td>
                                    <td>{item.mo_ta || "—"}</td>
                                    <td>{item.so_nguoi_dung}</td>
                                    <td>
                                        <div className="table-action">
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
                                                className="table-delete"
                                                title="Xóa"
                                                onClick={() => xoaVaiTro(item)}
                                                disabled={item.la_vai_tro_he_thong}
                                                style={item.la_vai_tro_he_thong ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
                                            >
                                                <Trash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && roles.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "24px" }}>
                                        Chưa có vai trò nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* ================= PERMISSION MATRIX (tham khảo) ================= */}

            <div className="card permission-card">

                <div className="permission-header">
                    <div>
                        <h3>Ma trận phân quyền hệ thống</h3>
                        <p>
                            Quyền truy cập được quy định cố định trong mã nguồn (theo mã vai trò),
                            bảng dưới đây chỉ mang tính tham khảo và không thể chỉnh sửa tại đây.
                        </p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table permission-table">
                        <thead>
                            <tr>
                                <th>Chức năng</th>
                                <th width="170">Quản trị viên</th>
                                <th width="170">Ban tổ chức</th>
                                <th width="170">Sinh viên</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Quản lý tài khoản / vai trò / đơn vị</td>
                                <td><input type="checkbox" checked readOnly /></td>
                                <td><input type="checkbox" readOnly /></td>
                                <td><input type="checkbox" readOnly /></td>
                            </tr>
                            <tr>
                                <td>Tạo và quản lý sự kiện</td>
                                <td><input type="checkbox" checked readOnly /></td>
                                <td><input type="checkbox" checked readOnly /></td>
                                <td><input type="checkbox" readOnly /></td>
                            </tr>
                            <tr>
                                <td>Đăng ký / điểm danh sự kiện</td>
                                <td><input type="checkbox" checked readOnly /></td>
                                <td><input type="checkbox" checked readOnly /></td>
                                <td><input type="checkbox" checked readOnly /></td>
                            </tr>
                            <tr>
                                <td>Gửi thông báo</td>
                                <td><input type="checkbox" checked readOnly /></td>
                                <td><input type="checkbox" checked readOnly /></td>
                                <td><input type="checkbox" readOnly /></td>
                            </tr>
                            <tr>
                                <td>Xem điểm rèn luyện</td>
                                <td><input type="checkbox" checked readOnly /></td>
                                <td><input type="checkbox" readOnly /></td>
                                <td><input type="checkbox" checked readOnly /></td>
                            </tr>
                            <tr>
                                <td>Thống kê / báo cáo hệ thống</td>
                                <td><input type="checkbox" checked readOnly /></td>
                                <td><input type="checkbox" readOnly /></td>
                                <td><input type="checkbox" readOnly /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            {/* ================= MODAL THÊM / SỬA ================= */}

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
                            {dangSua ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
                        </h3>

                        {!dangSua && (
                            <p style={{ marginBottom: "12px", fontSize: "13px", color: "#a15c00", background: "#fff7e6", padding: "8px 12px", borderRadius: "6px" }}>
                                Lưu ý: quyền truy cập hệ thống hiện được gán cố định theo mã vai trò
                                trong mã nguồn. Vai trò mới tạo ra ở đây cần được lập trình viên bổ sung
                                logic phân quyền thì mới có hiệu lực.
                            </p>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Tên vai trò *</label>
                                <input
                                    type="text" className="form-control" name="ten_vai_tro"
                                    value={form.ten_vai_tro} onChange={handleFormChange}
                                    disabled={dangSua?.la_vai_tro_he_thong}
                                    required
                                />
                                {dangSua?.la_vai_tro_he_thong && (
                                    <small style={{ color: "#888" }}>Vai trò hệ thống không thể đổi tên.</small>
                                )}
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Mô tả</label>
                                <textarea
                                    className="form-control" name="mo_ta" rows={3}
                                    value={form.mo_ta} onChange={handleFormChange}
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

        </div>
    );
};

export default RoleManagement;
