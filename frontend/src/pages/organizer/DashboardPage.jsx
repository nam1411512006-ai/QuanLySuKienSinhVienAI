import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaCalendarAlt,
    FaUsers,
    FaQrcode,
    FaChartLine,
    FaPlus,
    FaClock,
    FaMapMarkerAlt,
} from "react-icons/fa";

import organizerService from "../../services/organizerService";

const DashboardPage = () => {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        tong_su_kien: 0,
        tong_dang_ky: 0,
    });

    const [reports, setReports] = useState([]);
    const [events, setEvents] = useState([]);
    const [dangTai, setDangTai] = useState(true);

    useEffect(() => {

        loadAll();

    }, []);

    const loadAll = async () => {

        try {

            const [dashboardRes, reportsRes, eventsRes] = await Promise.all([
                organizerService.getDashboard(),
                organizerService.getReports(),
                organizerService.getEvents(),
            ]);

            setDashboard(dashboardRes);
            setReports(reportsRes);
            setEvents(eventsRes);

        } catch (error) {

            console.log(error);

        } finally {

            setDangTai(false);

        }

    };

    // Tổng số điểm danh + tỷ lệ tham gia trung bình, tính từ dữ liệu thống kê có sẵn
    const tongDiemDanh = useMemo(() => {

        return reports.reduce((sum, item) => sum + item.so_luong_diem_danh, 0);

    }, [reports]);

    const tyLeTrungBinh = useMemo(() => {

        if (reports.length === 0) {

            return 0;

        }

        const tong = reports.reduce((sum, item) => sum + item.ty_le_diem_danh, 0);

        return Math.round(tong / reports.length);

    }, [reports]);

    // Top 5 sự kiện có nhiều đăng ký nhất
    const topSuKien = useMemo(() => {

        return [...reports]
            .sort((a, b) => b.so_luong_dang_ky - a.so_luong_dang_ky)
            .slice(0, 5);

    }, [reports]);

    const soDangKyLonNhat = topSuKien.length > 0 ? topSuKien[0].so_luong_dang_ky : 0;

    // 5 sự kiện sắp diễn ra gần nhất (tính từ thời điểm hiện tại)
    const suKienSapToi = useMemo(() => {

        const now = new Date();

        return [...events]
            .filter((item) => new Date(item.thoi_gian_bat_dau) > now)
            .sort((a, b) => new Date(a.thoi_gian_bat_dau) - new Date(b.thoi_gian_bat_dau))
            .slice(0, 5);

    }, [events]);

    const dinhDangNgay = (value) => {

        return new Date(value).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

    };

    if (dangTai) {

        return <div className="page-loading">Đang tải dữ liệu...</div>;

    }

    return (

        <div className="dashboard-page">

            <div className="dashboard-header">

                <div>

                    <h2>Tổng quan</h2>

                    <p className="dashboard-subtitle">
                        Toàn cảnh hoạt động tổ chức sự kiện của bạn
                    </p>

                </div>

                <button
                    className="btn btn-primary dashboard-cta"
                    onClick={() => navigate("/organizer/events/new")}
                >

                    <FaPlus />
                    Tạo sự kiện

                </button>

            </div>

            <div className="dashboard-grid">

                <div className="dashboard-card">

                    <div className="dashboard-card-icon icon-blue">
                        <FaCalendarAlt />
                    </div>

                    <h4>Tổng sự kiện</h4>

                    <h1>{dashboard.tong_su_kien}</h1>

                </div>

                <div className="dashboard-card">

                    <div className="dashboard-card-icon icon-purple">
                        <FaUsers />
                    </div>

                    <h4>Tổng đăng ký</h4>

                    <h1>{dashboard.tong_dang_ky}</h1>

                </div>

                <div className="dashboard-card">

                    <div className="dashboard-card-icon icon-green">
                        <FaQrcode />
                    </div>

                    <h4>Tổng điểm danh</h4>

                    <h1>{tongDiemDanh}</h1>

                </div>

                <div className="dashboard-card">

                    <div className="dashboard-card-icon icon-orange">
                        <FaChartLine />
                    </div>

                    <h4>Tỷ lệ tham gia TB</h4>

                    <h1>{tyLeTrungBinh}%</h1>

                </div>

            </div>

            <div className="dashboard-columns">

                <div className="dashboard-panel">

                    <h3>Top sự kiện thu hút nhất</h3>

                    {

                        topSuKien.length === 0 ? (

                            <p className="dashboard-empty">Chưa có dữ liệu đăng ký</p>

                        ) : (

                            <div className="ranking-list">

                                {

                                    topSuKien.map((item, index) => (

                                        <div className="ranking-item" key={item.ma_su_kien}>

                                            <span className="ranking-index">{index + 1}</span>

                                            <div className="ranking-body">

                                                <div className="ranking-top">

                                                    <span className="ranking-name">{item.ten_su_kien}</span>

                                                    <span className="ranking-count">
                                                        {item.so_luong_dang_ky} đăng ký
                                                    </span>

                                                </div>

                                                <div className="ranking-bar-track">

                                                    <div
                                                        className="ranking-bar-fill"
                                                        style={{
                                                            width: `${soDangKyLonNhat > 0
                                                                ? (item.so_luong_dang_ky / soDangKyLonNhat) * 100
                                                                : 0}%`,
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    ))

                                }

                            </div>

                        )

                    }

                </div>

                <div className="dashboard-panel">

                    <h3>Sự kiện sắp diễn ra</h3>

                    {

                        suKienSapToi.length === 0 ? (

                            <p className="dashboard-empty">Không có sự kiện nào sắp tới</p>

                        ) : (

                            <div className="upcoming-list">

                                {

                                    suKienSapToi.map((item) => (

                                        <div
                                            className="upcoming-item"
                                            key={item.ma_su_kien}
                                            onClick={() => navigate(`/organizer/events/edit/${item.ma_su_kien}`)}
                                        >

                                            <div className="upcoming-name">{item.ten_su_kien}</div>

                                            <div className="upcoming-meta">

                                                <span>
                                                    <FaClock />
                                                    {dinhDangNgay(item.thoi_gian_bat_dau)}
                                                </span>

                                                <span>
                                                    <FaMapMarkerAlt />
                                                    {item.dia_diem || "Chưa cập nhật"}
                                                </span>

                                            </div>

                                        </div>

                                    ))

                                }

                            </div>

                        )

                    }

                </div>

            </div>

        </div>

    );

};

export default DashboardPage;