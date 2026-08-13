import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaBell,
    FaCalendarAlt,
    FaCheckCircle,
} from "react-icons/fa";

import thongBaoService from "../../services/thongBaoService";

import "../../assets/css/notification.css";

const ChiTietThongBaoPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [thongBao, setThongBao] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChiTiet();
    }, []);

    const loadChiTiet = async () => {
        try {
            setLoading(true);

            const data =
                await thongBaoService.getById(id);

            setThongBao(data);
        } catch (error) {
            console.error(
                "Lỗi lấy chi tiết thông báo:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const renderIcon = () => {
        if (!thongBao) {
            return <FaBell />;
        }

        switch (thongBao.loai_thong_bao) {
            case "DiemDanh":
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

    if (loading) {
        return (
            <div className="empty-notification">
                Đang tải thông báo...
            </div>
        );
    }

    if (!thongBao) {
        return (
            <div className="empty-notification">
                Không tìm thấy thông báo
            </div>
        );
    }

    return (
        <div className="notification-page">
            <button
                className="mark-read-btn"
                onClick={() =>
                    navigate("/thong-bao")
                }
            >
                <FaArrowLeft />
                Quay lại
            </button>

            <div className="notification-detail-card">
                <div
                    className={`notification-icon ${thongBao.loai_thong_bao
                        }`}
                >
                    {renderIcon()}
                </div>

                <div>
                    <h2>{thongBao.tieu_de}</h2>

                    <p className="detail-content">
                        {thongBao.noi_dung}
                    </p>

                    <div className="detail-info">
                        <p>
                            Loại thông báo:

                            <strong>
                                {
                                    thongBao.loai_thong_bao
                                }
                            </strong>
                        </p>

                        <p>
                            Thời gian gửi:

                            <strong>
                                {new Date(
                                    thongBao.thoi_gian_gui
                                ).toLocaleString()}
                            </strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChiTietThongBaoPage;