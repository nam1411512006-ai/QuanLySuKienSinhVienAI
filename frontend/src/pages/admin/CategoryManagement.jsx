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
import adminDanhMucService from "../../services/adminDanhMucService";

const FORM_RONG = {
    ten_loai_su_kien: "",
    mo_ta: "",
};

const CategoryManagement = () => {

    const [categories, setCategories] = useState([]);
    const [thongKe, setThongKe] = useState({
        tong_danh_muc: 0,
        dang_su_dung: 0,
        da_khoa: 0,
        tong_su_kien: 0,
    });
    const [loading, setLoading] = useState(true);

    const [tuKhoa, setTuKhoa] = useState("");
    const [locTrangThai, setLocTrangThai] = useState("all");

    const [showModal, setShowModal] = useState(false);
    const [dangSua, setDangSua] = useState(null);
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
    }, [tuKhoa, locTrangThai]);

    const loadThongKe = async () => {
        try {
            const data = await adminDanhMucService.getThongKe();
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
            if (locTrangThai !== "all") params.trang_thai = locTrangThai;

            const data = await adminDanhMucService.getDanhSach(params);
            setCategories(data);

        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được danh sách danh mục.");
        } finally {
            setLoading(false);
        }
    };

    const lamMoi = () => {
        setTuKhoa("");
        setLocTrangThai("all");
        loadDanhSach();
        loadThongKe();
    };

    const xuatExcel = () => {
        const header = ["Tên danh mục", "Mô tả", "Số sự kiện", "Trạng thái"];
        const rows = categories.map((c) => [
            c.ten_loai_su_kien,
            c.mo_ta || "",
            c.so_su_kien,
            c.trang_thai === 1 ? "Đang sử dụng" : "Đã khóa",
        ]);
        const csv = [header, ...rows]
            .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "danh_sach_danh_muc.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const moModalThem = () => {
        setDangSua(null);
        setForm(FORM_RONG);
        setShowModal(true);
    };

    const moModalSua = (item) => {
        setDangSua(item);
        setForm({
            ten_loai_su_kien: item.ten_loai_su_kien,
            mo_ta: item.mo_ta || "",
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

        if (!form.ten_loai_su_kien.trim()) {
            alert("Vui lòng nhập tên danh mục.");
            return;
        }

        try {
            setSubmitting(true);

            if (dangSua) {
                await adminDanhMucService.capNhatDanhMuc(dangSua.ma_loai_su_kien, form);
                alert("Cập nhật danh mục thành công!");
            } else {
                await adminDanhMucService.taoDanhMuc(form);
                alert("Tạo danh mục thành công!");
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
                ? `Khóa danh mục "${item.ten_loai_su_kien}"?`
                : `Mở khóa danh mục "${item.ten_loai_su_kien}"?`
        );
        if (!xacNhan) return;

        try {
            const res = await adminDanhMucService.doiTrangThai(item.ma_loai_su_kien);
            alert(res.message);
            loadDanhSach();
            loadThongKe();
        } catch (error) {
            alert(error.message || "Không thể đổi trạng thái.");
        }
    };

    const xoaDanhMuc = async (item) => {
        const xacNhan = window.confirm(
            `Xóa vĩnh viễn danh mục "${item.ten_loai_su_kien}"?`
        );
        if (!xacNhan) return;

        try {
            const res = await adminDanhMucService.xoaDanhMuc(item.ma_loai_su_kien);
            alert(res.message);
            loadDanhSach();
            loadThongKe();
        } catch (error) {
            alert(error.message || "Không thể xóa danh mục.");
        }
    };

    return (

        <div className="admin-page category-page">

            {/* ================= HEADER ================= */}

            <div className="admin-page-header category-header">

                <div>
                    <h1 className="admin-page-title">Quản lý Danh mục</h1>
                    <p className="admin-page-subtitle">Quản lý toàn bộ danh mục sự kiện</p>
                </div>

                <div className="category-header-action">
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

            <div className="category-stat-grid">

                <div className="category-stat-card">
                    <span className="stat-title">Tổng danh mục</span>
                    <h2>{thongKe.tong_danh_muc}</h2>
                    <p>Danh mục hiện có</p>
                </div>

                <div className="category-stat-card success">
                    <span className="stat-title">Đang sử dụng</span>
                    <h2>{thongKe.dang_su_dung}</h2>
                    <p>Danh mục hoạt động</p>
                </div>

                <div className="category-stat-card danger">
                    <span className="stat-title">Đã khóa</span>
                    <h2>{thongKe.da_khoa}</h2>
                    <p>Danh mục tạm ẩn</p>
                </div>

                <div className="category-stat-card warning">
                    <span className="stat-title">Tổng sự kiện</span>
                    <h2>{thongKe.tong_su_kien}</h2>
                    <p>Thuộc các danh mục</p>
                </div>

            </div>

            {/* ================= TOOLBAR ================= */}

            <div className="card category-toolbar">

                <div className="category-toolbar-left">

                    <div className="category-search">
                        <Search />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên danh mục..."
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                        />
                    </div>

                    <div className="category-filter">
                        <select
                            value={locTrangThai}
                            onChange={(e) => setLocTrangThai(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="1">Đang sử dụng</option>
                            <option value="0">Đã khóa</option>
                        </select>
                    </div>

                </div>

                <div className="category-toolbar-right">
                    <button className="btn btn-primary" onClick={moModalThem}>
                        <PlusLg />
                        Thêm danh mục
                    </button>
                </div>

            </div>

            {/* ================= TABLE ================= */}

            <div className="card category-table-card">

                <div className="category-table-header">
                    <div>
                        <h3>Danh sách danh mục</h3>
                        <p>{loading ? "Đang tải..." : `Hiển thị ${categories.length} danh mục`}</p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table category-table">
                        <thead>
                            <tr>
                                <th width="70">STT</th>
                                <th>Tên danh mục</th>
                                <th>Mô tả</th>
                                <th width="140">Sự kiện</th>
                                <th width="140">Trạng thái</th>
                                <th width="170">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((item, index) => (
                                <tr key={item.ma_loai_su_kien}>
                                    <td>{index + 1}</td>
                                    <td><strong>{item.ten_loai_su_kien}</strong></td>
                                    <td>{item.mo_ta || "—"}</td>
                                    <td>
                                        <span className="event-count">
                                            {item.so_su_kien} sự kiện
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={
                                                item.trang_thai === 1
                                                    ? "status active"
                                                    : "status lock"
                                            }
                                        >
                                            {item.trang_thai === 1 ? "Đang sử dụng" : "Đã khóa"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-action">

                                            <button
                                                className="table-edit"
                                                title="Chỉnh sửa"
                                                onClick={() => moModalSua(item)}
                                            >
                                                <PencilSquare />
                                            </button>

                                            <button
                                                className="table-edit"
                                                title={item.trang_thai === 1 ? "Khóa" : "Mở khóa"}
                                                onClick={() => toggleTrangThai(item)}
                                            >
                                                {item.trang_thai === 1 ? <LockFill /> : <UnlockFill />}
                                            </button>

                                            <button
                                                className="table-delete"
                                                title="Xóa"
                                                onClick={() => xoaDanhMuc(item)}
                                            >
                                                <Trash />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && categories.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: "24px" }}>
                                        Không có danh mục nào phù hợp.
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
                            padding: "24px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: "16px" }}>
                            {dangSua ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                        </h3>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Tên danh mục *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="ten_loai_su_kien"
                                    value={form.ten_loai_su_kien}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Mô tả</label>
                                <textarea
                                    className="form-control"
                                    name="mo_ta"
                                    rows={3}
                                    value={form.mo_ta}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }}>
                                <button type="button" className="btn btn-outline" onClick={dongModal}>
                                    Hủy
                                </button>
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

export default CategoryManagement;
