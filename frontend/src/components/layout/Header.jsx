import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaBell,
    FaChevronDown,
    FaSearch,
    FaCalendarAlt,
    FaCheckCircle,
    FaBullhorn,
    FaUser,
    FaMedal,
    FaCalendarCheck,
    FaSignOutAlt,
    FaEnvelope,
    FaBars,
} from "react-icons/fa";

import "../../assets/css/header.css";

import useNotification from "../../hooks/useNotification";

const Header = ({ onToggleSidebar }) => {

    const navigate = useNavigate();

    const notificationRef = useRef(null);

    const accountRef = useRef(null);

    const [showNotification, setShowNotification] = useState(false);

    const [showAccount, setShowAccount] = useState(false);



    const [keyword, setKeyword] = useState("");

    const {

        notifications,

        unread,

        loadThongBao,

        danhDauDaDoc,

    } = useNotification();

    const user = useMemo(() => {

        try {

            const data = localStorage.getItem("user");

            return data ? JSON.parse(data) : null;

        } catch {

            return null;

        }

    }, []);



    const handleLogout = () => {

        localStorage.removeItem("access_token");

        localStorage.removeItem("user");

        navigate("/");

    };

    useEffect(() => {



        const handleClickOutside = (e) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(e.target)
            ) {

                setShowNotification(false);

            }

            if (
                accountRef.current &&
                !accountRef.current.contains(e.target)
            ) {

                setShowAccount(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    return (

        <header className="header">

            <div className="header-left">

                <button
                    className="menu-btn"
                    onClick={onToggleSidebar}
                    aria-label="Mở menu"
                >
                    <FaBars />
                </button>

                <div className="search-box">

                    <FaSearch className="search-icon" />

                    <input
                        type="text"
                        placeholder="Tìm kiếm sự kiện..."
                        value={keyword}
                        onChange={(e) => {

                            const value = e.target.value;

                            // cập nhật ô nhập
                            setKeyword(value);

                            // chuyển sang trang danh sách sự kiện
                            navigate(
                                `/su-kien?keyword=${encodeURIComponent(value)}`
                            );

                        }}
                    />

                </div>

            </div>

            <div className="header-right">

                <div
                    className="notification-wrapper"
                    ref={notificationRef}
                >

                    <button
                        className="header-notification-btn"
                        onClick={() => {

                            setShowNotification(!showNotification);

                            setShowAccount(false);

                        }}
                    >

                        <FaBell />

                        {
                            unread > 0 &&
                            <span className="notification-badge">
                                {unread}
                            </span>
                        }

                    </button>
                    {

                        showNotification && (

                            <div className="notification-dropdown">

                                <div className="dropdown-header">

                                    <h4>Thông báo</h4>

                                    <button
                                        onClick={() => {

                                            navigate("/thong-bao");

                                            setShowNotification(false);

                                        }}
                                    >

                                        Xem tất cả

                                    </button>

                                </div>

                                {

                                    notifications.length === 0 ? (

                                        <div className="dropdown-empty">

                                            Chưa có thông báo

                                        </div>

                                    ) : (

                                        notifications
                                            .slice(0, 5)
                                            .map(item => (

                                                <div
                                                    key={item.id}
                                                    className={`dropdown-item ${!item.daDoc ? "new" : ""}`}
                                                    onClick={async () => {

                                                        try {

                                                            if (!item.daDoc) {

                                                                await danhDauDaDoc(item.id);



                                                            }

                                                        } catch (error) {

                                                            console.error(error);

                                                        }

                                                        navigate("/thong-bao");

                                                        setShowNotification(false);

                                                    }}
                                                >

                                                    <div className="dropdown-icon">

                                                        <FaBell />

                                                    </div>

                                                    <div className="dropdown-content">

                                                        <h5>

                                                            {item.title}

                                                        </h5>

                                                        <p>

                                                            {item.content}

                                                        </p>

                                                        <span>

                                                            {item.time}

                                                        </span>

                                                    </div>

                                                </div>

                                            ))

                                    )

                                }

                            </div>

                        )

                    }

                </div>

                <div
                    className="account-wrapper"
                    ref={accountRef}
                >

                    <div
                        className="user-info"
                        onClick={() => {

                            setShowAccount(!showAccount);

                            setShowNotification(false);

                        }}
                    >

                        {

                            user?.avatar ? (

                                <img
                                    src={user.avatar}
                                    alt="Avatar"
                                />

                            ) : (

                                <div className="avatar-placeholder">

                                    {

                                        user?.ho_ten
                                            ? user.ho_ten.charAt(0).toUpperCase()
                                            : "S"

                                    }

                                </div>

                            )

                        }

                        <div>

                            <h6>

                                {

                                    user?.ho_ten ||
                                    user?.HoTen ||
                                    "Sinh viên"

                                }

                            </h6>

                        </div>

                        <FaChevronDown />

                    </div>

                    {showAccount && (
                        <div className="account-dropdown">

                            <div className="account-header">

                                {

                                    user?.avatar ? (

                                        <img
                                            src={user.avatar}
                                            alt=""
                                        />

                                    ) : (

                                        <div className="avatar-large">

                                            {

                                                user?.ho_ten
                                                    ? user.ho_ten.charAt(0).toUpperCase()
                                                    : "S"

                                            }

                                        </div>

                                    )

                                }

                                <h4>

                                    {

                                        user?.ho_ten ||
                                        user?.HoTen ||
                                        "Sinh viên"

                                    }

                                </h4>

                            </div>

                            <button
                                className="account-item"
                                onClick={() => {

                                    navigate("/ho-so");

                                    setShowAccount(false);

                                }}
                            >

                                <FaUser />

                                Hồ sơ

                            </button>

                            <button
                                className="account-item"
                                onClick={() => {

                                    navigate("/diem-ren-luyen");

                                    setShowAccount(false);

                                }}
                            >

                                <FaMedal />

                                Điểm rèn luyện

                            </button>

                            <button
                                className="account-item"
                                onClick={() => {

                                    navigate("/su-kien-cua-toi");

                                    setShowAccount(false);

                                }}
                            >

                                <FaCalendarCheck />

                                Sự kiện của tôi

                            </button>

                            <button
                                className="account-item"
                                onClick={() => {

                                    navigate("/thong-bao");

                                    setShowAccount(false);

                                }}
                            >

                                <FaBell />

                                Thông báo

                            </button>

                            <div className="account-divider"></div>

                            <button
                                className="account-item logout"
                                onClick={handleLogout}
                            >

                                <FaSignOutAlt />

                                Đăng xuất

                            </button>

                        </div>
                    )}





                </div>

            </div>

        </header>

    );

};

export default Header;