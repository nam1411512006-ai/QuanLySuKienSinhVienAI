import { NavLink } from "react-router-dom";
import useCaiDatCongKhai from "../../hooks/useCaiDatCongKhai";

import {
    HouseDoorFill,
    PeopleFill,
    PersonWorkspace,
    MortarboardFill,
    FolderFill,
    CalendarEventFill,
    BellFill,
    BarChartFill,
    ShieldLockFill,
    GearFill,
} from "react-bootstrap-icons";

const menus = [
    {
        title: "Bảng điều khiển",
        path: "/admin/dashboard",
        icon: <HouseDoorFill />,
    },
    {
        title: "Quản lý tài khoản",
        path: "/admin/accounts",
        icon: <PeopleFill />,
    },
    {
        title: "Quản lý Ban tổ chức",
        path: "/admin/organizers",
        icon: <PersonWorkspace />,
    },
    {
        title: "Quản lý Sinh viên",
        path: "/admin/students",
        icon: <MortarboardFill />,
    },
    {
        title: "Quản lý Danh mục",
        path: "/admin/categories",
        icon: <FolderFill />,
    },
    {
        title: "Quản lý Sự kiện",
        path: "/admin/events",
        icon: <CalendarEventFill />,
    },
    {
        title: "Thông báo",
        path: "/admin/notifications",
        icon: <BellFill />,
    },
    {
        title: "Thống kê",
        path: "/admin/reports",
        icon: <BarChartFill />,
    },
    {
        title: "Phân quyền",
        path: "/admin/roles",
        icon: <ShieldLockFill />,
    },
    {
        title: "Cài đặt",
        path: "/admin/settings",
        icon: <GearFill />,
    },
];

const AdminSidebar = ({ hienThiTrenMobile, onDong }) => {

    const { ten_truong, ten_viet_tat, logo_url_day_du } = useCaiDatCongKhai();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return (

        <aside className={`admin-sidebar${hienThiTrenMobile ? " show" : ""}`}>

            {/* ================= LOGO ================= */}

            <div className="sidebar-logo">

                {logo_url_day_du ? (

                    <img
                        src={logo_url_day_du}
                        alt={ten_truong}
                        className="sidebar-logo-icon"
                        style={{ objectFit: "contain" }}
                    />

                ) : (

                    <div className="sidebar-logo-icon">

                        {ten_viet_tat ? ten_viet_tat.slice(0, 2).toUpperCase() : "BE"}

                    </div>

                )}

                <div className="sidebar-logo-info">

                    <h2 title={ten_truong}>

                        {ten_viet_tat || ten_truong}

                    </h2>

                    <span>

                        Admin Panel

                    </span>

                </div>

            </div>

            {/* ================= USER ================= */}

            <div className="sidebar-user">

                <img
                    src={
                        user?.anh_dai_dien
                            ? (
                                user.anh_dai_dien.startsWith("http")
                                    ? user.anh_dai_dien
                                    : `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/uploads/${user.anh_dai_dien}`
                            )
                            : "https://i.pravatar.cc/100"
                    }
                    alt="Admin"
                />

                <div>

                    <h4>

                        {user?.ho_ten || "Quản trị viên"}

                    </h4>

                    <span>

                        Administrator

                    </span>

                </div>

            </div>

            {/* ================= MENU ================= */}

            <nav className="sidebar-menu">

                {

                    menus.map((menu) => (

                        <NavLink

                            key={menu.path}

                            to={menu.path}
                            onClick={onDong}

                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-item active"
                                    : "sidebar-item"
                            }

                        >

                            <span className="sidebar-icon">

                                {menu.icon}

                            </span>

                            <span className="sidebar-title">

                                {menu.title}

                            </span>

                        </NavLink>

                    ))

                }

            </nav>

        </aside>

    );

};

export default AdminSidebar;