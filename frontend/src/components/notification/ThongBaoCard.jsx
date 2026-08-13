import { useNavigate } from "react-router-dom";

import {
    FaBell,
    FaCheckCircle,
    FaCalendarAlt,
    FaArrowRight,
} from "react-icons/fa";

import "../../assets/css/notification.css";

const ThongBaoCard = ({
    id,
    tieuDe,
    noiDung,
    thoiGian,
    loai = "thongbao",
    daDoc = false,
    onRead,
}) => {
    const navigate = useNavigate();

    // =====================================================
    // ICON THEO LOẠI THÔNG BÁO
    // =====================================================

    const renderIcon = () => {
        switch (loai) {
            case "DiemDanh":
                return <FaCheckCircle />;

            case "diemdanh":
                return <FaCheckCircle />;

            case "SuKien":
                return <FaCalendarAlt />;

            case "sukien":
                return <FaCalendarAlt />;

            case "DangKy":
                return <FaCalendarAlt />;

            default:
                return <FaBell />;
        }
    };

    const handleRead = async () => {
        try {
            if (!daDoc && onRead) {
                await onRead(id);
            }
        } catch (error) {
            console.error(
                "Lỗi đánh dấu thông báo:",
                error
            );
        }
    };

    // =====================================================
    // XEM CHI TIẾT
    // =====================================================

    const handleDetail = async (e) => {
        e.stopPropagation();

        await handleRead();

        navigate(`/thong-bao/${id}`);
    };

    return (
        <div
            className={`notification-card ${daDoc ? "" : "unread"
                }`}
            onClick={handleRead}
        >
            {/* ICON */}
            <div className={`notification-icon ${loai}`}>
                {renderIcon()}
            </div>

            {/* CONTENT */}
            <div className="notification-content">
                <div className="notification-header-row">
                    <div>
                        <h4>
                            {tieuDe || "Thông báo mới"}
                        </h4>

                        {!daDoc && (
                            <span className="notification-badge">
                                MỚI
                            </span>
                        )}
                    </div>

                    <span className="notification-time">
                        {thoiGian}
                    </span>
                </div>

                <p>{noiDung}</p>

                <button
                    className="notification-detail-btn"
                    onClick={handleDetail}
                >
                    Xem chi tiết
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default ThongBaoCard;