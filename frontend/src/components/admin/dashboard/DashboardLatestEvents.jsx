import { useNavigate } from "react-router-dom";
import {
    CalendarEventFill,
    EyeFill,
    PencilSquare,
} from "react-bootstrap-icons";

const NHAN_TRANG_THAI = {
    DangMo: "Đang mở đăng ký",
    DaKhoa: "Đã khóa đăng ký",
    DangDienRa: "Đang diễn ra",
    HoanThanh: "Đã kết thúc",
    DaHuy: "Đã hủy",
};

const xayDungUrlAnh = (anh_bia) => {
    if (!anh_bia) return "https://placehold.co/80x60?text=BETU";
    if (anh_bia.startsWith("http")) return anh_bia;
    return `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/uploads/${anh_bia}`;
};

const DashboardLatestEvents = ({ suKienGanDay = [] }) => {

    const navigate = useNavigate();

    return (
        <div className="dashboard-events-card">

            <div className="dashboard-events-header">

                <div>

                    <h3>

                        <CalendarEventFill />

                        Sự kiện mới nhất

                    </h3>

                    <p>
                        Danh sách sự kiện gần đây của hệ thống
                    </p>

                </div>

                <button
                    type="button"
                    className="dashboard-view-all"
                    onClick={() => navigate("/admin/events")}
                >

                    Xem tất cả

                </button>

            </div>

            <div className="dashboard-events-table-wrapper">

                <table className="dashboard-events-table">

                    <thead>

                        <tr>

                            <th>Hình</th>

                            <th>Sự kiện</th>

                            <th>Ban tổ chức</th>

                            <th>Ngày</th>

                            <th>Đăng ký</th>

                            <th>Trạng thái</th>

                            <th>Thao tác</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            suKienGanDay.map((event) => (

                                <tr key={event.ma_su_kien}>

                                    <td>

                                        <img
                                            src={xayDungUrlAnh(event.anh_bia)}
                                            alt={event.ten_su_kien}
                                        />

                                    </td>

                                    <td>

                                        <strong>

                                            {event.ten_su_kien}

                                        </strong>

                                    </td>

                                    <td>

                                        {event.ten_ban_to_chuc || "—"}

                                    </td>

                                    <td>

                                        {event.thoi_gian_bat_dau
                                            ? new Date(event.thoi_gian_bat_dau).toLocaleDateString("vi-VN")
                                            : "—"}

                                    </td>

                                    <td>

                                        {event.so_luong_dang_ky}

                                    </td>

                                    <td>

                                        <span
                                            className={`dashboard-status ${event.trang_thai}`}
                                        >

                                            {NHAN_TRANG_THAI[event.trang_thai] || event.trang_thai}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="dashboard-actions">

                                            <button
                                                type="button"
                                                onClick={() => navigate("/admin/events")}
                                            >

                                                <EyeFill />

                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => navigate("/admin/events")}
                                            >

                                                <PencilSquare />

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        }

                        {suKienGanDay.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                                    Chưa có sự kiện nào.
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default DashboardLatestEvents;
