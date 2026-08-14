import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    List,
    BellFill,
    ChevronDown,
    GearFill,
    BoxArrowRight,
    CameraFill,
} from "react-bootstrap-icons";

import taiKhoanService from "../../services/taiKhoanService";

const MAY_CHU_ANH = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/uploads/`;

const xayDungUrlAnh = (ten_file) => {
    if (!ten_file) return "https://i.pravatar.cc/100";
    if (ten_file.startsWith("http")) return ten_file;
    return `${MAY_CHU_ANH}${ten_file}`;
};

const AdminHeader = ({ onToggleSidebar }) => {

    const [showMenu, setShowMenu] = useState(false);
    const [avatar, setAvatar] = useState("");
    const [dangTaiAvatar, setDangTaiAvatar] = useState(false);
    const fileAvatarRef = useRef(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        taiKhoanService
            .getProfile()
            .then((data) => setAvatar(data.anh_dai_dien))
            .catch(() => { });
    }, []);

    const dangXuat = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleChonAnhDaiDien = async (e) => {

        const file = e.target.files?.[0];
        if (!file) return;

        try {

            setDangTaiAvatar(true);

            const data = await taiKhoanService.uploadAvatar(file);

            setAvatar(data.anh_dai_dien);

            // Đồng bộ lại vào localStorage để Sidebar (component khác) cũng cập nhật khi tải lại
            if (user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({ ...user, anh_dai_dien: data.anh_dai_dien })
                );
            }

            alert("Cập nhật ảnh đại diện thành công!");

        } catch (err) {

            alert(err.message || "Tải ảnh lên thất bại.");

        } finally {

            setDangTaiAvatar(false);
            e.target.value = "";

        }

    };

    return (

        <header className="admin-header">

            {/* ================= LEFT ================= */}

            <div className="admin-header-left">

                <button className="header-menu-btn" onClick={onToggleSidebar}>

                    <List />

                </button>

            </div>

            {/* ================= RIGHT ================= */}

            <div className="admin-header-right">

                <button
                    className="header-action"
                    title="Thông báo đã gửi"
                    onClick={() => navigate("/admin/notifications")}
                >

                    <BellFill />

                </button>

                {/* ================= USER ================= */}

                <div className="header-user-wrap">

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileAvatarRef}
                        style={{ display: "none" }}
                        onChange={handleChonAnhDaiDien}
                    />

                    <div
                        className="header-user"
                        onClick={() => setShowMenu(!showMenu)}
                    >

                        <div className="header-avatar-wrap">

                            <img
                                src={xayDungUrlAnh(avatar)}
                                alt="Admin"
                            />

                            <button
                                type="button"
                                className="header-avatar-camera"
                                title="Đổi ảnh đại diện"
                                disabled={dangTaiAvatar}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileAvatarRef.current?.click();
                                }}
                            >
                                <CameraFill />
                            </button>

                        </div>

                        <div>

                            <h4>

                                {user?.ho_ten || "Quản trị viên"}

                            </h4>

                            <span>

                                Administrator

                            </span>

                        </div>

                        <ChevronDown />

                    </div>

                    {/* ================= DROPDOWN ================= */}

                    {

                        showMenu && (

                            <div className="header-dropdown">

                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        navigate("/admin/settings");
                                    }}
                                >

                                    <GearFill />

                                    Cài đặt

                                </button>

                                <button onClick={dangXuat}>

                                    <BoxArrowRight />

                                    Đăng xuất

                                </button>

                            </div>

                        )

                    }

                </div>

            </div>

        </header>

    );

};

export default AdminHeader;