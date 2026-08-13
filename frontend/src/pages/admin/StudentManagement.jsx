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
} from "react-bootstrap-icons";
import adminSinhVienService from "../../services/adminSinhVienService";

const FORM_RONG = {
    ho_ten: "",
    email: "",
    mat_khau: "",
    mssv: "",
    so_dien_thoai: "",
};

const StudentManagement = () => {

    const [students, setStudents] = useState([]);
    const [thongKe, setThongKe] = useState({
        tong_sinh_vien: 0,
        dang_hoat_dong: 0,
        da_khoa: 0,
        diem_ren_luyen_trung_binh: 0,
    });
    const [loading, setLoading] = useState(true);

    const [tuKhoa, setTuKhoa] = useState("");
    const [locTrangThai, setLocTrangThai] = useState("all");

    // Modal thêm/sửa
    const [showModal, setShowModal] = useState(false);
    const [dangSua, setDangSua] = useState(null);
    const [form, setForm] = useState(FORM_RONG);
    const [submitting, setSubmitting] = useState(false);

    // Modal chi tiết
    const [showChiTiet, setShowChiTiet] = useState(false);
    const [svXemChiTiet, setSvXemChiTiet] = useState(null);
    const [diemRLList, setDiemRLList] = useState([]);
    const [suKienList, setSuKienList] = useState([]);
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
    }, [tuKhoa, locTrangThai]);

    const loadThongKe = async () => {
        try {
            const data = await adminSinhVienService.getThongKe();
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

            const data = await adminSinhVienService.getDanhSach(params);
            setStudents(data);

        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được danh sách sinh viên.");
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
        const header = ["MSSV", "Họ tên", "Email", "Điện thoại", "Điểm RL hiện tại", "Sự kiện đã tham gia", "Trạng thái"];
        const rows = students.map((s) => [
            s.mssv || "",
            s.ho_ten,
            s.email || "",
            s.so_dien_thoai || "",
            s.diem_ren_luyen_hien_tai ?? "",
            s.so_su_kien_da_tham_gia,
            s.trang_thai === 1 ? "Đang học" : "Tạm khóa",
        ]);
        const csv = [header, ...rows]
            .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "danh_sach_sinh_vien.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    // ================= CRUD =================

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
            mssv: item.mssv || "",
            so_dien_thoai: item.so_dien_thoai || "",
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

        if (!form.ho_ten.trim() || !form.email.trim() || !form.mssv.trim()) {
            alert("Vui lòng nhập đầy đủ họ tên, email và MSSV.");
            return;
        }

        if (!dangSua && !form.mat_khau.trim()) {
            alert("Vui lòng nhập mật khẩu cho tài khoản mới.");
            return;
        }

        try {
            setSubmitting(true);

            if (dangSua) {
                await adminSinhVienService.capNhatSinhVien(dangSua.ma_tai_khoan, {
                    ho_ten: form.ho_ten,
                    email: form.email,
                    mssv: form.mssv,
                    so_dien_thoai: form.so_dien_thoai || null,
                });
                alert("Cập nhật sinh viên thành công!");
            } else {
                await adminSinhVienService.taoSinhVien({
                    ho_ten: form.ho_ten,
                    email: form.email,
                    mat_khau: form.mat_khau,
                    mssv: form.mssv,
                    so_dien_thoai: form.so_dien_thoai || null,
                });
                alert("Thêm sinh viên thành công!");
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
            const res = await adminSinhVienService.doiTrangThai(item.ma_tai_khoan);
            alert(res.message);
            loadDanhSach();
            loadThongKe();
        } catch (error) {
            alert(error.message || "Không thể đổi trạng thái.");
        }
    };

    const xoaSinhVien = async (item) => {
        const xacNhan = window.confirm(
            `Xóa vĩnh viễn tài khoản "${item.ho_ten}"? Hành động này không thể hoàn tác.`
        );
        if (!xacNhan) return;

        try {
            const res = await adminSinhVienService.xoaSinhVien(item.ma_tai_khoan);
            alert(res.message);
            loadDanhSach();
            loadThongKe();
        } catch (error) {
            alert(error.message || "Không thể xóa tài khoản.");
        }
    };

    // ================= Chi tiết =================

    const xemChiTiet = async (item) => {
        setSvXemChiTiet(item);
        setShowChiTiet(true);
        setLoadingChiTiet(true);
        try {
            const [diemRL, suKien] = await Promise.all([
                adminSinhVienService.getDiemRenLuyen(item.ma_tai_khoan),
                adminSinhVienService.getSuKienDaThamGia(item.ma_tai_khoan),
            ]);
            setDiemRLList(diemRL);
            setSuKienList(suKien);
        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được dữ liệu chi tiết.");
        } finally {
            setLoadingChiTiet(false);
        }
    };

    const dongChiTiet = () => {
        setShowChiTiet(false);
        setSvXemChiTiet(null);
        setDiemRLList([]);
        setSuKienList([]);
    };

    return (
        <div className="admin-page student-page">

            {/* ================= HEADER ================= */}

            <div className="admin-page-header student-header">
                <div>
                    <h1 className="admin-page-title">Quản lý Sinh viên</h1>
                    <p className="admin-page-subtitle">
                        Quản lý toàn bộ sinh viên trong hệ thống
                    </p>
                </div>

                <div className="student-header-action">
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

            <div className="student-stat-grid">

                <div className="student-stat-card">
                    <span className="stat-title">Tổng sinh viên</span>
                    <h2>{thongKe.tong_sinh_vien}</h2>
                    <p>Toàn bộ sinh viên</p>
                </div>

                <div className="student-stat-card success">
                    <span className="stat-title">Đang hoạt động</span>
                    <h2>{thongKe.dang_hoat_dong}</h2>
                    <p>Tài khoản đang hoạt động</p>
                </div>

                <div className="student-stat-card danger">
                    <span className="stat-title">Đã khóa</span>
                    <h2>{thongKe.da_khoa}</h2>
                    <p>Tài khoản đang bị khóa</p>
                </div>

                <div className="student-stat-card warning">
                    <span className="stat-title">Điểm RL TB</span>
                    <h2>{thongKe.diem_ren_luyen_trung_binh}</h2>
                    <p>Điểm rèn luyện trung bình</p>
                </div>

            </div>

            {/* ================= TOOLBAR ================= */}

            <div className="card student-toolbar">

                <div className="student-toolbar-left">

                    <div className="student-search">
                        <Search />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo MSSV, Họ tên hoặc Email..."
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                        />
                    </div>

                    <div className="student-filter">
                        <select value={locTrangThai} onChange={(e) => setLocTrangThai(e.target.value)}>
                            <option value="all">Tất cả trạng thái</option>
                            <option value="1">Đang hoạt động</option>
                            <option value="0">Đã khóa</option>
                        </select>
                    </div>

                </div>

                <div className="student-toolbar-right">
                    <button type="button" className="btn btn-primary" onClick={moModalThem}>
                        <PlusLg />
                        <span>Thêm sinh viên</span>
                    </button>
                </div>

            </div>

            {/* ================= TABLE ================= */}

            <div className="card student-table-card">

                <div className="student-table-header">
                    <div>
                        <h3>Danh sách sinh viên</h3>
                        <p>{loading ? "Đang tải..." : `Hiển thị ${students.length} sinh viên`}</p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table student-table">
                        <thead>
                            <tr>
                                <th width="60">STT</th>
                                <th>MSSV</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Điện thoại</th>
                                <th>Điểm RL</th>
                                <th>Sự kiện</th>
                                <th>Trạng thái</th>
                                <th width="170">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((item, index) => (
                                <tr key={item.ma_tai_khoan}>
                                    <td>{index + 1}</td>
                                    <td>{item.mssv || "—"}</td>
                                    <td>
                                        <strong>{item.ho_ten}</strong>
                                    </td>
                                    <td>
                                        <span className="student-email">{item.email}</span>
                                    </td>
                                    <td>{item.so_dien_thoai || "—"}</td>
                                    <td>
                                        {item.diem_ren_luyen_hien_tai !== null && item.diem_ren_luyen_hien_tai !== undefined
                                            ? item.diem_ren_luyen_hien_tai
                                            : "—"}
                                    </td>
                                    <td>
                                        <span className="event-count">{item.so_su_kien_da_tham_gia} Sự kiện</span>
                                    </td>
                                    <td>
                                        <span className={item.trang_thai === 1 ? "status active" : "status lock"}>
                                            {item.trang_thai === 1 ? "Đang hoạt động" : "Đã khóa"}
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
                                                onClick={() => xoaSinhVien(item)}
                                            >
                                                <Trash />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && students.length === 0 && (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: "center", padding: "24px" }}>
                                        Không có sinh viên nào phù hợp.
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
                            {dangSua ? "Chỉnh sửa sinh viên" : "Thêm sinh viên mới"}
                        </h3>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>MSSV *</label>
                                <input
                                    type="text" className="form-control" name="mssv"
                                    value={form.mssv} onChange={handleFormChange} required
                                />
                            </div>

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
                        <h3 style={{ marginBottom: "4px" }}>{svXemChiTiet?.ho_ten}</h3>
                        <p style={{ marginBottom: "16px", color: "#888" }}>
                            MSSV: {svXemChiTiet?.mssv || "—"} · {svXemChiTiet?.email}
                        </p>

                        {loadingChiTiet ? (
                            <p>Đang tải...</p>
                        ) : (
                            <>
                                <h4 style={{ marginBottom: "8px", fontSize: "15px" }}>Điểm rèn luyện theo học kỳ</h4>
                                {diemRLList.length === 0 ? (
                                    <p style={{ marginBottom: "16px" }}>Chưa có dữ liệu điểm rèn luyện.</p>
                                ) : (
                                    <table className="table" style={{ marginBottom: "20px" }}>
                                        <thead>
                                            <tr>
                                                <th>Học kỳ</th>
                                                <th>Năm học</th>
                                                <th>Điểm trường</th>
                                                <th>Điểm hoạt động</th>
                                                <th>Tổng điểm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {diemRLList.map((drl) => (
                                                <tr key={drl.ma_diem_ren_luyen}>
                                                    <td>HK{drl.hoc_ky}</td>
                                                    <td>{drl.nam_hoc}</td>
                                                    <td>{drl.diem_truong}</td>
                                                    <td>{drl.diem_hoat_dong}</td>
                                                    <td><strong>{drl.tong_diem}</strong></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                <h4 style={{ marginBottom: "8px", fontSize: "15px" }}>Sự kiện đã đăng ký</h4>
                                {suKienList.length === 0 ? (
                                    <p>Sinh viên này chưa đăng ký sự kiện nào.</p>
                                ) : (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Tên sự kiện</th>
                                                <th>Ngày đăng ký</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {suKienList.map((sk, idx) => (
                                                <tr key={`${sk.ma_su_kien}-${idx}`}>
                                                    <td>{sk.ten_su_kien}</td>
                                                    <td>
                                                        {sk.thoi_gian_dang_ky
                                                            ? new Date(sk.thoi_gian_dang_ky).toLocaleDateString("vi-VN")
                                                            : "—"}
                                                    </td>
                                                    <td>{sk.trang_thai_dang_ky}</td>
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

export default StudentManagement;
