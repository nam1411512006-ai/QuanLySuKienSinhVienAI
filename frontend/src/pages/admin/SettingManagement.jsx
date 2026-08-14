import { useEffect, useRef, useState } from "react";
import { InfoCircle, Upload } from "react-bootstrap-icons";
import adminCaiDatService from "../../services/adminCaiDatService";

const MAY_CHU_ANH = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/uploads/`;

const xayDungUrlAnh = (ten_file) => {
    if (!ten_file) return "";
    if (ten_file.startsWith("http")) return ten_file; // du lieu cu nhap tay bang URL, van hien thi duoc
    return `${MAY_CHU_ANH}${ten_file}`;
};

const SettingManagement = () => {

    const [form, setForm] = useState({
        ten_truong: "",
        ten_viet_tat: "",
        website: "",
        email_lien_he: "",
        logo_url: "",
        banner_url: "",
        gioi_han_upload_mb: "10",
    });
    const [thongTinHeThong, setThongTinHeThong] = useState(null);
    const [trangThaiSmtp, setTrangThaiSmtp] = useState(null);
    const [emailThu, setEmailThu] = useState("");
    const [dangGuiThu, setDangGuiThu] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const logoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    useEffect(() => {
        loadDuLieu();
    }, []);

    const loadDuLieu = async () => {
        try {
            setLoading(true);
            const [caiDat, htt, smtp] = await Promise.all([
                adminCaiDatService.getCaiDat(),
                adminCaiDatService.getThongTinHeThong(),
                adminCaiDatService.getTrangThaiSmtp(),
            ]);
            setForm(caiDat);
            setThongTinHeThong(htt);
            setTrangThaiSmtp(smtp);
        } catch (error) {
            console.error(error);
            if (error?.response?.status === 500 || /caidathethong/i.test(error?.message || "")) {
                alert(
                    "Chưa tạo được bảng CaiDatHeThong trong database. " +
                    "Hãy chạy file database/migration_module9_caidat.sql trước."
                );
            } else {
                alert(error.message || "Không tải được cài đặt.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleChonAnh = async (e, truong, setDangUpload) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setDangUpload(true);
            const res = await adminCaiDatService.uploadAnh(file);
            setForm((prev) => ({ ...prev, [truong]: res.url }));
        } catch (error) {
            console.error(error);
            alert(error.message || "Tải ảnh lên thất bại.");
        } finally {
            setDangUpload(false);
            e.target.value = "";
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const data = await adminCaiDatService.capNhatCaiDat(form);
            setForm(data);
            alert("Đã lưu cài đặt thành công!");
        } catch (error) {
            console.error(error);
            alert(error.message || "Không thể lưu cài đặt.");
        } finally {
            setSaving(false);
        }
    };

    const handleGuiEmailThu = async (e) => {
        e.preventDefault();

        if (!emailThu.trim()) {
            alert("Vui lòng nhập email nhận thử.");
            return;
        }

        try {
            setDangGuiThu(true);
            const res = await adminCaiDatService.guiEmailThu(emailThu.trim());
            alert(res.message);
        } catch (error) {
            console.error(error);
            alert(error.message || "Gửi email thất bại.");
        } finally {
            setDangGuiThu(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page setting-page">
                <p style={{ padding: "24px" }}>Đang tải cài đặt...</p>
            </div>
        );
    }

    return (
        <div className="admin-page setting-page">

            {/* ================= HEADER ================= */}

            <div className="admin-page-header setting-header">
                <div>
                    <h1 className="admin-page-title">Cài đặt hệ thống</h1>
                    <p className="admin-page-subtitle">
                        Cấu hình thông tin chung của hệ thống
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave}>

                {/* ================= THÔNG TIN TRƯỜNG ================= */}

                <div className="card setting-card">
                    <div className="setting-card-header">
                        <h3>Thông tin trường</h3>
                    </div>

                    <div className="setting-group">
                        <label>Tên trường</label>
                        <input
                            type="text" className="form-control" name="ten_truong"
                            value={form.ten_truong} onChange={handleChange}
                            placeholder="VD: Trường Đại học Kinh tế - Kỹ thuật ..."
                        />
                    </div>

                    <div className="setting-group">
                        <label>Tên viết tắt</label>
                        <input
                            type="text" className="form-control" name="ten_viet_tat"
                            value={form.ten_viet_tat} onChange={handleChange}
                            placeholder="VD: BETU"
                        />
                    </div>

                    <div className="setting-group">
                        <label>Website</label>
                        <input
                            type="text" className="form-control" name="website"
                            value={form.website} onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="setting-group">
                        <label>Email liên hệ</label>
                        <input
                            type="email" className="form-control" name="email_lien_he"
                            value={form.email_lien_he} onChange={handleChange}
                            placeholder="lienhe@truong.edu.vn"
                        />
                    </div>
                </div>

                {/* ================= LOGO & BANNER ================= */}

                <div className="card setting-card">
                    <div className="setting-card-header">
                        <h3>Logo & Banner</h3>
                    </div>

                    <div className="setting-group">
                        <label>Logo</label>

                        {form.logo_url && (
                            <img
                                src={xayDungUrlAnh(form.logo_url)}
                                alt="Logo"
                                style={{ height: "64px", display: "block", marginBottom: "8px", borderRadius: "6px", border: "1px solid #eee" }}
                            />
                        )}

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            ref={logoInputRef}
                            style={{ display: "none" }}
                            onChange={(e) => handleChonAnh(e, "logo_url", setUploadingLogo)}
                        />

                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => logoInputRef.current?.click()}
                            disabled={uploadingLogo}
                        >
                            <Upload style={{ marginRight: "6px" }} />
                            {uploadingLogo ? "Đang tải lên..." : form.logo_url ? "Đổi logo" : "Tải logo lên"}
                        </button>
                    </div>

                    <div className="setting-group">
                        <label>Banner</label>

                        {form.banner_url && (
                            <img
                                src={xayDungUrlAnh(form.banner_url)}
                                alt="Banner"
                                style={{ maxHeight: "120px", display: "block", marginBottom: "8px", borderRadius: "6px", border: "1px solid #eee" }}
                            />
                        )}

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            ref={bannerInputRef}
                            style={{ display: "none" }}
                            onChange={(e) => handleChonAnh(e, "banner_url", setUploadingBanner)}
                        />

                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => bannerInputRef.current?.click()}
                            disabled={uploadingBanner}
                        >
                            <Upload style={{ marginRight: "6px" }} />
                            {uploadingBanner ? "Đang tải lên..." : form.banner_url ? "Đổi banner" : "Tải banner lên"}
                        </button>
                    </div>

                    <p style={{ fontSize: "13px", color: "#888" }}>
                        <InfoCircle style={{ marginRight: "4px" }} />
                        Ảnh được lưu trực tiếp trên server (thư mục uploads/), không phụ thuộc link ngoài.
                        Chấp nhận PNG/JPG/WEBP/GIF, tối đa 10MB. Nhớ bấm "Lưu cài đặt" bên dưới sau khi
                        tải ảnh lên để ghi nhận thay đổi.
                    </p>
                </div>

                {/* ================= GIỚI HẠN UPLOAD ================= */}

                <div className="card setting-card">
                    <div className="setting-card-header">
                        <h3>Cấu hình chung</h3>
                    </div>

                    <div className="setting-group">
                        <label>Giới hạn kích thước tệp gợi ý (MB)</label>
                        <input
                            type="number" className="form-control" name="gioi_han_upload_mb"
                            value={form.gioi_han_upload_mb} onChange={handleChange}
                            min={1}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", margin: "16px 0" }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu cài đặt"}
                    </button>
                </div>

            </form>

            {/* ================= EMAIL (SMTP) - THẬT ================= */}

            <div className="card setting-card">
                <div className="setting-card-header">
                    <h3>Email (SMTP)</h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span className={trangThaiSmtp?.da_cau_hinh ? "status active" : "status lock"}>
                        {trangThaiSmtp?.da_cau_hinh ? "Đã cấu hình" : "Chưa cấu hình"}
                    </span>
                    {trangThaiSmtp?.da_cau_hinh && (
                        <span style={{ color: "#888", fontSize: "13px" }}>
                            {trangThaiSmtp.smtp_host} · {trangThaiSmtp.smtp_user}
                        </span>
                    )}
                </div>

                {trangThaiSmtp?.da_cau_hinh ? (
                    <>
                        <p style={{ fontSize: "14px", color: "#555", marginBottom: "12px" }}>
                            Hệ thống sẽ tự động gửi email xác nhận cho sinh viên khi họ đăng ký sự kiện thành công.
                        </p>
                        <form onSubmit={handleGuiEmailThu} className="input-group">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Nhập email để gửi thử..."
                                value={emailThu}
                                onChange={(e) => setEmailThu(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary" disabled={dangGuiThu}>
                                {dangGuiThu ? "Đang gửi..." : "Gửi email thử"}
                            </button>
                        </form>
                    </>
                ) : (
                    <p style={{ fontSize: "14px", color: "#888", lineHeight: 1.6 }}>
                        <InfoCircle style={{ marginRight: "6px" }} />
                        Chưa cấu hình. Để bật gửi email, điền các biến <code>SMTP_HOST</code>,{" "}
                        <code>SMTP_PORT</code>, <code>SMTP_USER</code>, <code>SMTP_PASSWORD</code> trong
                        file <code>backend/.env</code> (không lưu qua giao diện web để tránh lộ mật khẩu
                        email trong database), sau đó khởi động lại server backend.
                    </p>
                )}
            </div>

            {/* ================= CÁC MỤC CHƯA HỖ TRỢ ================= */}

            <div className="card setting-card">
                <div className="setting-card-header">
                    <h3>AI Chatbot, Bảo mật nâng cao, Sao lưu tự động</h3>
                </div>
                <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.6 }}>
                    <InfoCircle style={{ marginRight: "6px" }} />
                    Tích hợp AI Chatbot, xác thực 2 bước và sao lưu dữ liệu tự động
                    <strong> hiện chưa được cài đặt ở phần backend</strong> của hệ thống. Các thông số
                    như JWT hết hạn, CORS... hiện đang được cấu hình cố định qua file
                    <code> backend/.env</code> trên server (không chỉnh qua giao diện web để đảm bảo an
                    toàn), thay vì lưu trong database. Nếu cần bật các tính năng này, cần lập trình
                    viên bổ sung phần backend tương ứng trước.
                </p>
            </div>

            {/* ================= THÔNG TIN HỆ THỐNG (đọc từ DB thật) ================= */}

            {thongTinHeThong && (
                <div className="card setting-card">
                    <div className="setting-card-header">
                        <h3>Thông tin hệ thống</h3>
                    </div>

                    <div className="table-container">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Phiên bản API</td>
                                    <td><strong>{thongTinHeThong.phien_ban_api}</strong></td>
                                </tr>
                                <tr>
                                    <td>Môi trường</td>
                                    <td><strong>{thongTinHeThong.moi_truong}</strong></td>
                                </tr>
                                <tr>
                                    <td>Tổng tài khoản</td>
                                    <td><strong>{thongTinHeThong.tong_tai_khoan}</strong></td>
                                </tr>
                                <tr>
                                    <td>Tổng sự kiện</td>
                                    <td><strong>{thongTinHeThong.tong_su_kien}</strong></td>
                                </tr>
                                <tr>
                                    <td>Tổng lượt đăng ký</td>
                                    <td><strong>{thongTinHeThong.tong_dang_ky}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SettingManagement;
