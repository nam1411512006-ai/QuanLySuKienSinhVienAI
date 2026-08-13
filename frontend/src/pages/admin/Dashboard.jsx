import { useEffect, useState } from "react";
import "../../assets/css/admin/admin.css";

import DashboardStatisticCards from "../../components/admin/dashboard/DashboardStatisticCards";
import DashboardChart from "../../components/admin/dashboard/DashboardChart";
import DashboardLatestEvents from "../../components/admin/dashboard/DashboardLatestEvents";
import DashboardNotification from "../../components/admin/dashboard/DashboardNotification";
import DashboardRecentActivity from "../../components/admin/dashboard/DashboardRecentActivity";
import adminDashboardService from "../../services/adminDashboardService";

const Dashboard = () => {

    const [duLieu, setDuLieu] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await adminDashboardService.getDashboard();
            setDuLieu(data);
        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được dữ liệu Dashboard.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <h1 className="admin-page-title">
                    Dashboard
                </h1>

                <p className="admin-page-subtitle">
                    Tổng quan hệ thống quản lý sự kiện sinh viên
                </p>

            </div>

            {loading && !duLieu ? (
                <p style={{ padding: "24px" }}>Đang tải dữ liệu...</p>
            ) : duLieu ? (
                <>
                    <DashboardStatisticCards theThongKe={duLieu.the_thong_ke} />

                    <DashboardChart
                        suKienTheoThang={duLieu.su_kien_theo_thang}
                        phanBoTrangThai={duLieu.phan_bo_trang_thai}
                    />

                    <DashboardLatestEvents suKienGanDay={duLieu.su_kien_gan_day} />

                    <div className="dashboard-bottom">

                        <DashboardNotification thongBaoGanDay={duLieu.thong_bao_gan_day} />

                        <DashboardRecentActivity hoatDongGanDay={duLieu.hoat_dong_gan_day} />

                    </div>
                </>
            ) : null}

        </div>
    );
};

export default Dashboard;
