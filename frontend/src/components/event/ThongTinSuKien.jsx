import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dangKyService from "../../services/dangKyService";

import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaUsers,
    FaStar,
    FaShareAlt,
    FaCheckCircle,
} from "react-icons/fa";

import "../../assets/css/event-detail.css";

const ThongTinSuKien = ({ suKien }) => {
    const navigate = useNavigate();
    const [trangThaiDangKy, setTrangThaiDangKy] = useState(null);

    useEffect(() => {
        const kiemTraDangKy = async () => {
            const token = localStorage.getItem("access_token");

            if (!token || !suKien) return;

            try {
                const danhSach =
                    await dangKyService.getDanhSachDangKy();

                const dangKy = danhSach.find(
                    (item) =>
                        item.ma_su_kien === suKien.ma_su_kien
                );

                if (dangKy) {
                    setTrangThaiDangKy(dangKy.trang_thai);
                } else {
                    setTrangThaiDangKy(null);
                }
            } catch (err) {
                console.error(err);
            }
        };

        kiemTraDangKy();
    }, [suKien]);

    if (!suKien) {
        return <h2>Không có dữ liệu sự kiện.</h2>;
    }

    const hinhAnh = suKien.anh_bia
        ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/uploads/${suKien.anh_bia}`
        : "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80";

    const formatTrangThai = (trangThai) => {
        switch (trangThai) {
            case "SapMo":
                return "Sắp mở đăng ký";

            case "DangMo":
                return "Đang mở đăng ký";

            case "DongDangKy":
                return "Đã đóng đăng ký";

            case "DangDienRa":
                return "Đang diễn ra";

            case "DaDay":
                return "Đã đủ số lượng";

            case "DaKhoa":
                return "Đã bị khóa";

            case "KetThuc":
                return "Đã kết thúc";

            default:
                return "Không xác định";
        }
    };

    const formatNgay = (ngay) => {
        return new Date(ngay).toLocaleDateString("vi-VN");
    };

    const formatGio = (ngay) => {
        return new Date(ngay).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleDangKy = () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            alert("Vui lòng đăng nhập.");
            navigate("/");
            return;
        }

        if (
            trangThaiDangKy === "DaDangKy" ||
            trangThaiDangKy === "DaDiemDanh" ||
            trangThaiDangKy === "HoanThanh"
        ) {
            alert("Bạn đã đăng ký sự kiện này.");
            return;
        }

        navigate(`/dang-ky-su-kien/${suKien.ma_su_kien}`);
    };

    return (
        <div className="event-detail">
            <div className="event-hero">
                <img
                    src={hinhAnh}
                    alt={suKien.ten_su_kien}
                />

                <div className="event-overlay">
                    <span className="event-status">
                        <FaCheckCircle />
                        {formatTrangThai(suKien.trang_thai)}
                    </span>

                    <h1>{suKien.ten_su_kien}</h1>
                </div>
            </div>

            <div className="detail-container">
                <div className="detail-left">
                    <div className="detail-info">
                        <div className="info-item">
                            <FaCalendarAlt />

                            <div>
                                <strong>Ngày tổ chức</strong>

                                <span>
                                    {formatNgay(
                                        suKien.thoi_gian_bat_dau
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="info-item">
                            <FaClock />

                            <div>
                                <strong>Thời gian</strong>

                                <span>
                                    {formatGio(
                                        suKien.thoi_gian_bat_dau
                                    )}
                                    {" - "}
                                    {formatGio(
                                        suKien.thoi_gian_ket_thuc
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="info-item">
                            <FaMapMarkerAlt />

                            <div>
                                <strong>Địa điểm</strong>

                                <span>
                                    {suKien.dia_diem}
                                </span>
                            </div>
                        </div>

                        <div className="info-item">
                            <FaUsers />

                            <div>
                                <strong>Số lượng</strong>

                                <span>
                                    {suKien.so_luong_toi_da} sinh viên
                                </span>
                            </div>
                        </div>

                        <div className="info-item">
                            <FaStar />

                            <div>
                                <strong>Điểm rèn luyện</strong>

                                <span>
                                    +{suKien.diem_cong} điểm
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-description">
                        <h2>Giới thiệu sự kiện</h2>

                        <p>{suKien.mo_ta}</p>
                    </div>
                </div>

                <div className="detail-right">
                    <div className="register-card">
                        <h3>Tham gia sự kiện</h3>

                        <p>
                            Đăng ký ngay để giữ chỗ và nhận điểm rèn
                            luyện sau khi hoàn thành.
                        </p>

                        <div className="quick-info">
                            <div>
                                <strong>Trạng thái</strong>

                                <span>
                                    {formatTrangThai(
                                        suKien.trang_thai
                                    )}
                                </span>
                            </div>

                            <div>
                                <strong>Điểm RL</strong>

                                <span>
                                    +{suKien.diem_cong}
                                </span>
                            </div>

                            <div>
                                <strong>Sức chứa</strong>

                                <span>
                                    {suKien.so_luong_toi_da}
                                </span>
                            </div>

                            <div>
                                <strong>Địa điểm</strong>

                                <span>
                                    {suKien.dia_diem}
                                </span>
                            </div>
                        </div>

                        {trangThaiDangKy === "DaDangKy" ? (
                            <button
                                className="btn-success"
                                disabled
                            >
                                ✔ Bạn đã đăng ký
                            </button>
                        ) : trangThaiDangKy === "DaDiemDanh" ? (
                            <button
                                className="btn-success"
                                disabled
                            >
                                ✔ Đã tham gia
                            </button>
                        ) : trangThaiDangKy === "HoanThanh" ? (
                            <button
                                className="btn-success"
                                disabled
                            >
                                ✔ Hoàn thành
                            </button>
                        ) : suKien.trang_thai === "SapMo" ? (
                            <button
                                className="btn-primary"
                                disabled
                            >
                                Sắp mở đăng ký
                            </button>
                        ) : suKien.trang_thai === "DangMo" ? (
                            <button
                                className="btn-primary"
                                onClick={handleDangKy}
                            >
                                Đăng ký ngay
                            </button>
                        ) : suKien.trang_thai === "DongDangKy" ? (
                            <button
                                className="btn-primary"
                                disabled
                            >
                                Đã đóng đăng ký
                            </button>
                        ) : suKien.trang_thai === "DaKhoa" ? (
                            <button
                                className="btn-primary"
                                disabled
                            >
                                Sự kiện đã bị khóa
                            </button>
                        ) : suKien.trang_thai === "DangDienRa" ? (
                            <button
                                className="btn-primary"
                                disabled
                            >
                                Sự kiện đang diễn ra
                            </button>
                        ) : (
                            <button
                                className="btn-primary"
                                disabled
                            >
                                Đã kết thúc
                            </button>
                        )}

                        <button
                            className="btn-secondary"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: suKien.ten_su_kien,
                                        text: suKien.mo_ta,
                                        url: window.location.href,
                                    });
                                } else {
                                    navigator.clipboard.writeText(
                                        window.location.href
                                    );

                                    alert(
                                        "Đã sao chép liên kết."
                                    );
                                }
                            }}
                        >
                            <FaShareAlt />
                            Chia sẻ sự kiện
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThongTinSuKien;