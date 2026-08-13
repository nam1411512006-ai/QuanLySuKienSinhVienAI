import { BarChartFill, PieChartFill } from "react-bootstrap-icons";

const DashboardChart = ({ suKienTheoThang = [], phanBoTrangThai }) => {

    const monthlyData = suKienTheoThang.map((item) => ({
        month: `T${item.thang}`,
        total: item.so_luong,
    }));

    const maxValue = Math.max(1, ...monthlyData.map((item) => item.total));

    const hoanThanh = phanBoTrangThai?.hoan_thanh ?? 0;
    const dangDienRa = phanBoTrangThai?.dang_dien_ra ?? 0;
    const sapDienRa = phanBoTrangThai?.sap_dien_ra ?? 0;

    return (

        <div className="dashboard-chart">

            {/* ==========================
                BAR CHART
            ========================== */}

            <div className="dashboard-chart-card">

                <div className="dashboard-chart-header">

                    <div>

                        <h3>

                            <BarChartFill />

                            Thống kê sự kiện

                        </h3>

                        <p>
                            Số lượng sự kiện theo từng tháng ({new Date().getFullYear()})
                        </p>

                    </div>

                </div>

                <div className="dashboard-chart-body">

                    {

                        monthlyData.map((item) => (

                            <div
                                key={item.month}
                                className="dashboard-chart-item"
                            >

                                <div
                                    className="dashboard-chart-bar"
                                    style={{
                                        height:
                                            `${(item.total / maxValue) * 220}px`
                                    }}
                                ></div>

                                <strong>

                                    {item.total}

                                </strong>

                                <span>

                                    {item.month}

                                </span>

                            </div>

                        ))

                    }

                </div>

            </div>

            {/* ==========================
                SUMMARY
            ========================== */}

            <div className="dashboard-summary-card">

                <div className="dashboard-chart-header">

                    <div>

                        <h3>

                            <PieChartFill />

                            Tổng quan

                        </h3>

                        <p>

                            Trạng thái sự kiện

                        </p>

                    </div>

                </div>

                <div className="dashboard-summary-circle">

                    <div className="dashboard-summary-content">

                        <h2>

                            {hoanThanh}%

                        </h2>

                        <span>

                            Hoàn thành

                        </span>

                    </div>

                </div>

                <div className="dashboard-summary-list">

                    <div>

                        <span className="summary-dot blue"></span>

                        <label>

                            Hoàn thành

                        </label>

                        <strong>

                            {hoanThanh}%

                        </strong>

                    </div>

                    <div>

                        <span className="summary-dot green"></span>

                        <label>

                            Đang diễn ra

                        </label>

                        <strong>

                            {dangDienRa}%

                        </strong>

                    </div>

                    <div>

                        <span className="summary-dot orange"></span>

                        <label>

                            Sắp diễn ra

                        </label>

                        <strong>

                            {sapDienRa}%

                        </strong>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default DashboardChart;
