import { Outlet, NavLink, useNavigate } from "react-router-dom";
import useCaiDatCongKhai from "../hooks/useCaiDatCongKhai";
import {
    FaHome,
    FaCalendarAlt,
    FaUsers,
    FaQrcode,
    FaStar,
    FaBell,
    FaChartBar,
    FaUser,
    FaSignOutAlt,
    FaAward,
} from "react-icons/fa";

import "../assets/css/OrganizerLayout.css";

const OrganizerLayout = () => {

    const navigate = useNavigate();
    const { ten_truong, ten_viet_tat, logo_url_day_du } = useCaiDatCongKhai();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <div className="organizer-layout">

            <aside className="sidebar">

                <div className="sidebar-brand">
                    {logo_url_day_du && (
                        <img
                            src={logo_url_day_du}
                            alt={ten_truong}
                            className="sidebar-brand-logo"
                        />
                    )}
                    <h2 title={ten_truong}>{ten_viet_tat || ten_truong}</h2>
                </div>

                <NavLink to="/organizer/dashboard">
                    <FaHome />
                    Dashboard
                </NavLink>

                <NavLink to="/organizer/events">
                    <FaCalendarAlt />
                    Quản lý sự kiện
                </NavLink>

                <NavLink to="/organizer/registers">
                    <FaUsers />
                    Đăng ký
                </NavLink>

                <NavLink to="/organizer/attendance">
                    <FaQrcode />
                    Điểm danh
                </NavLink>

                <NavLink to="/organizer/training-points">
                    <FaAward />
                    Điểm rèn luyện
                </NavLink>

                <NavLink to="/organizer/reviews">
                    <FaStar />
                    Đánh giá
                </NavLink>

                <NavLink to="/organizer/notifications">
                    <FaBell />
                    Thông báo
                </NavLink>

                <NavLink to="/organizer/reports">
                    <FaChartBar />
                    Báo cáo
                </NavLink>

                <NavLink to="/organizer/profile">
                    <FaUser />
                    Hồ sơ
                </NavLink>

            </aside>

            <div className="content">

                <header className="topbar">

                    <div>

                        Xin chào <b>{user?.ho_ten}</b>

                    </div>

                    <button onClick={logout}>

                        <FaSignOutAlt />

                        Đăng xuất

                    </button>

                </header>

                <div className="page-content">

                    <Outlet />

                </div>

            </div>

        </div>

    );

};

export default OrganizerLayout;