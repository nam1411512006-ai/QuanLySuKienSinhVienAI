import { NavLink } from "react-router-dom";
import useCaiDatCongKhai from "../../hooks/useCaiDatCongKhai";
import {
    FaHome,
    FaCalendarAlt,
    FaClipboardList,
    FaQrcode,
    FaMedal,
    FaRobot,
    FaUser,
    FaStar,
    FaBell,
} from "react-icons/fa";

import "../../assets/css/sidebar.css";

const menuItems = [
    {
        ten: "Trang chủ",
        duongDan: "/trang-chu",
        icon: FaHome,
    },
    {
        ten: "Danh sách sự kiện",
        duongDan: "/su-kien",
        icon: FaCalendarAlt,
    },
    {
        ten: "Sự kiện của tôi",
        duongDan: "/su-kien-cua-toi",
        icon: FaClipboardList,
    },
    {
        ten: "QR điểm danh",
        duongDan: "/qr-diem-danh",
        icon: FaQrcode,
    },
    {
        ten: "Điểm rèn luyện",
        duongDan: "/diem-ren-luyen",
        icon: FaMedal,
    },
    {
        ten: "AI Chat",
        duongDan: "/ai-chat",
        icon: FaRobot,
    },
    {
        ten: "Hồ sơ",
        duongDan: "/ho-so",
        icon: FaUser,
    },
    {
        ten: "Đánh giá",
        duongDan: "/danh-gia",
        icon: FaStar,
    },
    {
        ten: "Thông báo",
        duongDan: "/thong-bao",
        icon: FaBell,
    },
];

const Sidebar = ({ hienThiTrenMobile, onDong }) => {
    const { ten_truong, ten_viet_tat, logo_url_day_du, website, email_lien_he } = useCaiDatCongKhai();
    return (
        <aside className={`sidebar${hienThiTrenMobile ? " show" : ""}`}>
            <div className="sidebar-logo">
                {logo_url_day_du ? (
                    <img
                        src={logo_url_day_du}
                        alt={ten_truong}
                        className="sidebar-logo-img"
                    />
                ) : (
                    <div className="sidebar-logo-fallback">
                        {ten_viet_tat ? ten_viet_tat.slice(0, 2).toUpperCase() : "SV"}
                    </div>
                )}
                <h3 title={ten_truong}>{ten_viet_tat || ten_truong}</h3>
                <p>Student Portal</p>
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.duongDan}
                            to={item.duongDan}
                            onClick={onDong}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >
                            <Icon className="sidebar-icon" />
                            <span>{item.ten}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {(website || email_lien_he) && (
                <div className="sidebar-footer">
                    {website && <div>{website}</div>}
                    {email_lien_he && <div>{email_lien_he}</div>}
                </div>
            )}
        </aside>
    );
};

export default Sidebar;