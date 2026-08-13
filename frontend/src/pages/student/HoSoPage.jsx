import { useEffect, useRef, useState } from "react";

import "../../assets/css/hoso.css";
import profileApi from "../../api/profileApi";

import {
    FaCamera,
    FaEdit,
    FaLock,
    FaEnvelope,
    FaPhoneAlt,
    FaBirthdayCake,
    FaMapMarkerAlt,
    FaUniversity,
    FaGraduationCap,
    FaUsers,
    FaMedal,
    FaCertificate,
    FaBell,
    FaSignOutAlt
} from "react-icons/fa";

const MAY_CHU_ANH = "http://localhost:8000/uploads/";

const xayDungUrlAnh = (ten_file) => {
    if (!ten_file) return "https://i.pravatar.cc/200?img=12";
    if (ten_file.startsWith("http")) return ten_file; // dữ liệu cũ nhập tay bằng URL, vẫn hiển thị được
    return `${MAY_CHU_ANH}${ten_file}`;
};

const HoSoPage = () => {

    const [loading, setLoading] = useState(true);
    const [dangTaiAvatar, setDangTaiAvatar] = useState(false);
    const fileAvatarRef = useRef(null);

    const [student, setStudent] = useState({
        hoTen: "",
        mssv: "",
        avatar: "",
        email: "",
        sdt: "",
        ngaySinh: "",
        gioiTinh: "",
        diaChi: "",
        khoa: "",
        chuyenNganh: "",
        lop: "",
        khoaHoc: "",
        coVan: ""
    });

    const [openEdit, setOpenEdit] = useState(false);

    const [openPassword, setOpenPassword] = useState(false);

    const [editData, setEditData] = useState({
        ho_ten: "",
        so_dien_thoai: "",
        ngay_sinh: "",
        gioi_tinh: "",
        anh_dai_dien: ""
    });

    const [passwordData, setPasswordData] = useState({
        mat_khau_cu: "",
        mat_khau_moi: "",
        xac_nhan: ""
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            setLoading(true);

            const data = await profileApi.getProfile();

            setStudent({
                hoTen: data.ho_ten || "",
                mssv: data.mssv || "",
                avatar:
                    data.anh_dai_dien ||
                    "https://i.pravatar.cc/200?img=12",
                email: data.email || "",
                sdt: data.so_dien_thoai || "",
                ngaySinh: data.ngay_sinh || "",
                gioiTinh: data.gioi_tinh || "",
                diaChi: "",
                khoa: "",
                chuyenNganh: "",
                lop: "",
                khoaHoc: "",
                coVan: ""
            });

            setEditData({
                ho_ten: data.ho_ten || "",
                so_dien_thoai: data.so_dien_thoai || "",
                ngay_sinh: data.ngay_sinh || "",
                gioi_tinh: data.gioi_tinh || "",
                anh_dai_dien: data.anh_dai_dien || ""
            });

        } catch (err) {

            alert(err.message);

        } finally {

            setLoading(false);

        }

    };

    const handleChonAnhDaiDien = async (e) => {

        const file = e.target.files?.[0];
        if (!file) return;

        try {

            setDangTaiAvatar(true);

            const data = await profileApi.uploadAvatar(file);

            setStudent((prev) => ({
                ...prev,
                avatar: data.anh_dai_dien,
            }));

            setEditData((prev) => ({
                ...prev,
                anh_dai_dien: data.anh_dai_dien,
            }));

            alert("Cập nhật ảnh đại diện thành công!");

        } catch (err) {

            alert(err.message || "Tải ảnh lên thất bại.");

        } finally {

            setDangTaiAvatar(false);
            e.target.value = "";

        }

    };

    const formatDate = (date) => {

        if (!date) return "";

        return new Date(date).toLocaleDateString("vi-VN");

    };

    const statistics = [
        {
            title: "Sự kiện tham gia",
            value: 18,
            color: "#2563eb",
            icon: <FaUsers />
        },
        {
            title: "Điểm rèn luyện",
            value: 92,
            color: "#16a34a",
            icon: <FaMedal />
        },
        {
            title: "Chứng nhận",
            value: 15,
            color: "#f59e0b",
            icon: <FaCertificate />
        },
        {
            title: "Thông báo",
            value: 8,
            color: "#ef4444",
            icon: <FaBell />
        }
    ];

    const activities = [
        {
            event: "Workshop AI trong giáo dục",
            date: "18/07/2026",
            status: "Đã tham gia"
        },
        {
            event: "Ngày hội CNTT",
            date: "12/07/2026",
            status: "Hoàn thành"
        },
        {
            event: "Hiến máu nhân đạo",
            date: "05/07/2026",
            status: "Đã xác nhận"
        }
    ];

    const handleUpdateProfile = async () => {

        try {

            await profileApi.updateProfile(editData);

            alert("Cập nhật thông tin thành công");

            setOpenEdit(false);

            loadProfile();

        } catch (err) {

            alert(err.message);

        }

    };

    const handleChangePassword = async () => {

        if (passwordData.mat_khau_moi !== passwordData.xac_nhan) {

            alert("Xác nhận mật khẩu không khớp");

            return;

        }

        try {

            await profileApi.changePassword({
                mat_khau_cu: passwordData.mat_khau_cu,
                mat_khau_moi: passwordData.mat_khau_moi
            });

            alert("Đổi mật khẩu thành công");

            setPasswordData({
                mat_khau_cu: "",
                mat_khau_moi: "",
                xac_nhan: ""
            });

            setOpenPassword(false);

        } catch (err) {

            alert(err.message);

        }

    };

    const handleLogout = () => {

        localStorage.removeItem("access_token");

        window.location.href = "/";

    };

    if (loading) {

        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "40px"
                }}
            >
                Đang tải dữ liệu...
            </div>
        );

    }

    return (
        <div className="profile-page">

            <div className="profile-banner">

                <div className="profile-avatar">

                    <img
                        src={xayDungUrlAnh(student.avatar)}
                        alt="avatar"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileAvatarRef}
                        style={{ display: "none" }}
                        onChange={handleChonAnhDaiDien}
                    />

                    <button
                        type="button"
                        onClick={() => fileAvatarRef.current?.click()}
                        disabled={dangTaiAvatar}
                        title="Đổi ảnh đại diện"
                    >

                        <FaCamera />

                    </button>

                </div>

                <div className="profile-info">

                    <h2>{student.hoTen}</h2>

                    <span>{student.mssv}</span>

                    <p>{student.khoa || "Chưa cập nhật khoa"}</p>

                </div>

                <div className="profile-action">

                    <button
                        className="btn-primary"
                        onClick={() => setOpenEdit(true)}
                    >

                        <FaEdit />

                        Chỉnh sửa

                    </button>

                    <button
                        className="btn-outline"
                        onClick={() => setOpenPassword(true)}
                    >

                        <FaLock />

                        Đổi mật khẩu

                    </button>

                </div>

            </div>

            <div className="profile-statistics">

                {

                    statistics.map((item, index) => (

                        <div
                            key={index}
                            className="stat-card"
                        >

                            <div
                                className="stat-icon"
                                style={{
                                    background: item.color
                                }}
                            >

                                {item.icon}

                            </div>

                            <div>

                                <h3>{item.value}</h3>

                                <p>{item.title}</p>

                            </div>

                        </div>

                    ))

                }

            </div>

            <div className="profile-content">

                <div className="profile-card">

                    <h3>

                        Thông tin cá nhân

                    </h3>

                    <div className="info-grid">

                        <div>

                            <FaEnvelope />

                            <div>

                                <label>Email</label>

                                <span>{student.email}</span>

                            </div>

                        </div>

                        <div>

                            <FaPhoneAlt />

                            <div>

                                <label>Số điện thoại</label>

                                <span>{student.sdt}</span>

                            </div>

                        </div>

                        <div>

                            <FaBirthdayCake />

                            <div>

                                <label>Ngày sinh</label>

                                <span>{formatDate(student.ngaySinh)}</span>

                            </div>

                        </div>

                        <div>

                            <FaUsers />

                            <div>

                                <label>Giới tính</label>

                                <span>{student.gioiTinh || "Chưa cập nhật"}</span>

                            </div>

                        </div>

                        <div>

                            <FaMapMarkerAlt />

                            <div>

                                <label>Địa chỉ</label>

                                <span>{student.diaChi || "Chưa cập nhật"}</span>

                            </div>

                        </div>

                    </div>

                </div>
                <div className="profile-card">

                    <h3>

                        Thông tin học tập

                    </h3>

                    <div className="info-grid">

                        <div>

                            <FaUniversity />

                            <div>

                                <label>Khoa</label>

                                <span>{student.khoa || "Chưa cập nhật"}</span>

                            </div>

                        </div>

                        <div>

                            <FaGraduationCap />

                            <div>

                                <label>Chuyên ngành</label>

                                <span>{student.chuyenNganh || "Chưa cập nhật"}</span>

                            </div>

                        </div>

                        <div>

                            <FaUsers />

                            <div>

                                <label>Lớp</label>

                                <span>{student.lop || "Chưa cập nhật"}</span>

                            </div>

                        </div>

                        <div>

                            <FaGraduationCap />

                            <div>

                                <label>Khóa học</label>

                                <span>{student.khoaHoc || "Chưa cập nhật"}</span>

                            </div>

                        </div>

                        <div>

                            <FaUniversity />

                            <div>

                                <label>Cố vấn học tập</label>

                                <span>{student.coVan || "Chưa cập nhật"}</span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="profile-card">

                <h3>

                    Hoạt động gần đây

                </h3>

                <div className="activity-list">

                    {

                        activities.map((item, index) => (

                            <div
                                key={index}
                                className="activity-item"
                            >

                                <div>

                                    <h4>

                                        {item.event}

                                    </h4>

                                    <span>

                                        {item.date}

                                    </span>

                                </div>

                                <strong>

                                    {item.status}

                                </strong>

                            </div>

                        ))

                    }

                </div>

            </div>

            <div className="logout-box">

                <button
                    onClick={handleLogout}
                >

                    <FaSignOutAlt />

                    Đăng xuất

                </button>

            </div>
            {/* ===========================
        MODAL CHỈNH SỬA HỒ SƠ
    ============================ */}

            {

                openEdit && (

                    <div className="hoso-modal-overlay">
                        <div className="hoso-modal">

                            <h2>

                                Chỉnh sửa hồ sơ

                            </h2>

                            <div className="form-group">

                                <label>

                                    Họ và tên

                                </label>

                                <input
                                    type="text"
                                    value={editData.ho_ten}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            ho_ten: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    Số điện thoại

                                </label>

                                <input
                                    type="text"
                                    value={editData.so_dien_thoai}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            so_dien_thoai: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    Ngày sinh

                                </label>

                                <input
                                    type="date"
                                    value={editData.ngay_sinh}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            ngay_sinh: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    Giới tính

                                </label>

                                <select
                                    value={editData.gioi_tinh}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            gioi_tinh: e.target.value
                                        })
                                    }
                                >

                                    <option value="">

                                        -- Chọn giới tính --

                                    </option>

                                    <option value="Nam">

                                        Nam

                                    </option>

                                    <option value="Nữ">

                                        Nữ

                                    </option>

                                    <option value="Khác">

                                        Khác

                                    </option>

                                </select>

                            </div>

                            <div className="modal-actions">

                                <button
                                    className="btn-outline"
                                    onClick={() => setOpenEdit(false)}
                                >

                                    Hủy

                                </button>

                                <button
                                    className="btn-primary"
                                    onClick={handleUpdateProfile}
                                >

                                    Lưu thay đổi

                                </button>

                            </div>

                        </div>

                    </div>

                )

            }
            {/* ===========================
        MODAL ĐỔI MẬT KHẨU
    ============================ */}

            {

                openPassword && (

                    <div className="hoso-modal-overlay">
                        <div className="hoso-modal">

                            <h2>

                                Đổi mật khẩu

                            </h2>

                            <div className="form-group">

                                <label>

                                    Mật khẩu hiện tại

                                </label>

                                <input
                                    type="password"
                                    value={passwordData.mat_khau_cu}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            mat_khau_cu: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    Mật khẩu mới

                                </label>

                                <input
                                    type="password"
                                    value={passwordData.mat_khau_moi}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            mat_khau_moi: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    Xác nhận mật khẩu

                                </label>

                                <input
                                    type="password"
                                    value={passwordData.xac_nhan}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            xac_nhan: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="modal-actions">

                                <button
                                    className="btn-outline"
                                    onClick={() => {

                                        setOpenPassword(false);

                                        setPasswordData({

                                            mat_khau_cu: "",
                                            mat_khau_moi: "",
                                            xac_nhan: ""

                                        });

                                    }}
                                >

                                    Hủy

                                </button>

                                <button
                                    className="btn-primary"
                                    onClick={handleChangePassword}
                                >

                                    Đổi mật khẩu

                                </button>

                            </div>

                        </div>

                    </div>

                )

            }

        </div>

    );

};

export default HoSoPage;