import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/my-event.css";
import dangKyService from "../../services/dangKyService";

const SuKienCuaToiPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [dsSuKien, setDsSuKien] = useState([]);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        loadDanhSach();
    }, []);

    const loadDanhSach = async () => {
        try {
            setLoading(true);

            const data = await dangKyService.getDanhSachDangKy();

            setDsSuKien(data);
        } catch (error) {
            console.error(error);

            alert(
                error.message ||
                "Không tải được danh sách sự kiện."
            );
        } finally {
            setLoading(false);
        }
    };

    const huyDangKy = async (maDangKy) => {

        const ok = window.confirm(
            "Bạn có chắc muốn hủy đăng ký sự kiện này?"
        );

        if (!ok) return;

        try {

            await dangKyService.huyDangKy(maDangKy);

            alert("Hủy đăng ký thành công.");

            loadDanhSach();

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Không thể hủy đăng ký."
            );

        }

    };

    const formatDate = (date) => {

        if (!date) return "";

        return new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    };

    const getStatusText = (status) => {

        switch (status) {

            case "DaDangKy":
                return "Đã đăng ký";

            case "DaDiemDanh":
                return "Đã tham gia";

            case "HoanThanh":
                return "Hoàn thành";

            case "DaHuy":
                return "Đã hủy";

            default:
                return status;

        }

    };

    const getStatusClass = (status) => {

        switch (status) {

            case "DaDangKy":
                return "status-badge registered";

            case "DaDiemDanh":
                return "status-badge checked";

            case "HoanThanh":
                return "status-badge completed";

            case "DaHuy":
                return "status-badge cancelled";

            default:
                return "status-badge";

        }

    };

    const filteredEvents = useMemo(() => {

        if (filter === "ALL") return dsSuKien;

        return dsSuKien.filter(
            (item) => item.trang_thai === filter
        );

    }, [dsSuKien, filter]);

    if (loading) {

        return (

            <div className="my-event-container">

                <h2>Đang tải dữ liệu...</h2>

            </div>

        );

    }

    return (

        <div className="my-event-container">

            <div className="page-header">

                <h2>Sự kiện của tôi</h2>

                <p>
                    Quản lý tất cả sự kiện đã đăng ký của bạn.
                </p>

            </div>

            <div className="event-filter">

                <button
                    className={filter === "ALL" ? "active" : ""}
                    onClick={() => setFilter("ALL")}
                >
                    Tất cả
                </button>

                <button
                    className={filter === "DaDangKy" ? "active" : ""}
                    onClick={() => setFilter("DaDangKy")}
                >
                    Đã đăng ký
                </button>

                <button
                    className={filter === "DaDiemDanh" ? "active" : ""}
                    onClick={() => setFilter("DaDiemDanh")}
                >
                    Đã tham gia
                </button>

                <button
                    className={filter === "DaHuy" ? "active" : ""}
                    onClick={() => setFilter("DaHuy")}
                >
                    Đã hủy
                </button>

            </div>

            {
                filteredEvents.length === 0 ? (

                    <div className="empty-event">

                        Bạn chưa có sự kiện nào.

                    </div>

                ) : (

                    <div className="event-grid">

                        {

                            filteredEvents.map((item) => (

                                <div
                                    className="event-card-new"
                                    key={item.ma_dang_ky}
                                >

                                    <img
                                        className="event-cover"
                                        src={
                                            item.anh_bia
                                                ? `http://localhost:8000/uploads/${item.anh_bia}`
                                                : "https://placehold.co/600x350"
                                        }
                                        alt={item.ten_su_kien}
                                    />

                                    <div className="event-content">

                                        <span
                                            className={getStatusClass(item.trang_thai)}
                                        >
                                            {getStatusText(item.trang_thai)}
                                        </span>

                                        <h3>

                                            {item.ten_su_kien}

                                        </h3>

                                        <div className="event-meta">

                                            <p>

                                                📅 {formatDate(item.thoi_gian_bat_dau)}

                                            </p>

                                            <p>

                                                📍 {item.dia_diem || "Đang cập nhật"}

                                            </p>

                                            <p>

                                                ⭐ +{item.diem_cong} điểm rèn luyện

                                            </p>

                                        </div>

                                        <div className="event-actions">

                                            <button
                                                className="action-btn detail-btn"
                                                onClick={() =>
                                                    navigate(`/su-kien/${item.ma_su_kien}`)
                                                }
                                            >
                                                Xem chi tiết
                                            </button>

                                            {

                                                item.trang_thai === "DaDangKy" && (

                                                    <button
                                                        className="action-btn qr-btn"
                                                        onClick={() =>
                                                            navigate("/qr-diem-danh")
                                                        }
                                                    >
                                                        Mã QR
                                                    </button>

                                                )

                                            }

                                            {

                                                item.trang_thai === "DaDangKy" && (

                                                    <button
                                                        className="action-btn cancel-btn"
                                                        onClick={() =>
                                                            huyDangKy(item.ma_dang_ky)
                                                        }
                                                    >
                                                        Hủy đăng ký
                                                    </button>

                                                )

                                            }

                                        </div>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

};

export default SuKienCuaToiPage;