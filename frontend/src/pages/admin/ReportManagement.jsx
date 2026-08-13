import { useEffect, useState } from "react";
import { ArrowClockwise, Download } from "react-bootstrap-icons";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import adminBaoCaoService from "../../services/adminBaoCaoService";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
);

const NAM_HIEN_TAI = new Date().getFullYear();
const DS_NAM = [NAM_HIEN_TAI, NAM_HIEN_TAI - 1, NAM_HIEN_TAI - 2];

const MAU_PIE = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#84cc16"];

const NHAN_TRANG_THAI_SU_KIEN = {
    DangMo: "Đang mở đăng ký",
    DaKhoa: "Đã khóa đăng ký",
    DangDienRa: "Đang diễn ra",
    HoanThanh: "Hoàn thành",
    DaHuy: "Đã hủy",
};

const ReportManagement = () => {

    const [nam, setNam] = useState(NAM_HIEN_TAI);
    const [thang, setThang] = useState("all");
    const [baoCao, setBaoCao] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBaoCao();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nam, thang]);

    const loadBaoCao = async () => {
        try {
            setLoading(true);
            const params = { nam };
            if (thang !== "all") params.thang = thang;
            const data = await adminBaoCaoService.getBaoCao(params);
            setBaoCao(data);
        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được dữ liệu báo cáo.");
        } finally {
            setLoading(false);
        }
    };

    const xuatBaoCao = () => {
        if (!baoCao) return;

        const lines = [];
        lines.push(`BAO CAO HE THONG - Nam ${nam}${thang !== "all" ? ` / Thang ${thang}` : ""}`);
        lines.push("");
        lines.push(`Tong su kien,${baoCao.tong_quan.tong_su_kien}`);
        lines.push(`Tong sinh vien,${baoCao.tong_quan.tong_sinh_vien}`);
        lines.push(`Tong luot dang ky,${baoCao.tong_quan.tong_luot_dang_ky}`);
        lines.push(`Tong diem ren luyen da cong,${baoCao.tong_quan.tong_diem_ren_luyen_da_cong}`);
        lines.push("");
        lines.push("Top su kien,Loai,Dang ky,Trang thai");
        baoCao.top_su_kien.forEach((sk) => {
            lines.push(`${sk.ten_su_kien},${sk.ten_loai_su_kien || ""},${sk.so_luong_dang_ky},${sk.trang_thai}`);
        });
        lines.push("");
        lines.push("Top sinh vien,MSSV,So su kien,Diem RL");
        baoCao.top_sinh_vien.forEach((sv) => {
            lines.push(`${sv.ho_ten},${sv.mssv || ""},${sv.so_su_kien_tham_gia},${sv.tong_diem_ren_luyen}`);
        });

        const csv = lines.join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bao_cao_he_thong_${nam}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading && !baoCao) {
        return (
            <div className="admin-page report-page">
                <p style={{ padding: "24px" }}>Đang tải báo cáo...</p>
            </div>
        );
    }

    if (!baoCao) return null;

    const chartSuKienThang = {
        labels: baoCao.su_kien_theo_thang.map((i) => `T${i.thang}`),
        datasets: [
            {
                label: "Số sự kiện",
                data: baoCao.su_kien_theo_thang.map((i) => i.so_luong),
                backgroundColor: "#4f46e5",
                borderRadius: 4,
            },
        ],
    };

    const chartDangKyThang = {
        labels: baoCao.dang_ky_theo_thang.map((i) => `T${i.thang}`),
        datasets: [
            {
                label: "Lượt đăng ký",
                data: baoCao.dang_ky_theo_thang.map((i) => i.so_luong),
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.15)",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const chartPhanLoai = {
        labels: baoCao.phan_loai_su_kien.map((i) => i.ten_loai_su_kien),
        datasets: [
            {
                data: baoCao.phan_loai_su_kien.map((i) => i.so_luong),
                backgroundColor: MAU_PIE,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    };

    return (
        <div className="admin-page report-page">

            {/* ================= HEADER ================= */}

            <div className="admin-page-header report-header">
                <div>
                    <h1 className="admin-page-title">Thống kê hệ thống</h1>
                    <p className="admin-page-subtitle">
                        Tổng quan hoạt động của hệ thống quản lý sự kiện
                    </p>
                </div>

                <div className="report-header-action">
                    <button type="button" className="btn btn-outline" onClick={loadBaoCao}>
                        <ArrowClockwise />
                        <span>Làm mới</span>
                    </button>
                    <button type="button" className="btn btn-outline" onClick={xuatBaoCao}>
                        <Download />
                        <span>Xuất báo cáo</span>
                    </button>
                </div>
            </div>

            {/* ================= FILTER ================= */}

            <div className="card report-filter">
                <select value={nam} onChange={(e) => setNam(Number(e.target.value))}>
                    {DS_NAM.map((n) => (
                        <option key={n} value={n}>Năm {n}</option>
                    ))}
                </select>

                <select value={thang} onChange={(e) => setThang(e.target.value)}>
                    <option value="all">Tất cả tháng</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((t) => (
                        <option key={t} value={t}>Tháng {t}</option>
                    ))}
                </select>
            </div>

            {/* ================= OVERVIEW ================= */}

            <div className="report-stat-grid">
                <div className="report-stat-card">
                    <span>Tổng sự kiện</span>
                    <h2>{baoCao.tong_quan.tong_su_kien.toLocaleString("vi-VN")}</h2>
                    <p>Sự kiện đã tạo</p>
                </div>

                <div className="report-stat-card success">
                    <span>Tổng sinh viên</span>
                    <h2>{baoCao.tong_quan.tong_sinh_vien.toLocaleString("vi-VN")}</h2>
                    <p>Đã đăng ký tài khoản</p>
                </div>

                <div className="report-stat-card warning">
                    <span>Lượt đăng ký</span>
                    <h2>{baoCao.tong_quan.tong_luot_dang_ky.toLocaleString("vi-VN")}</h2>
                    <p>Trong kỳ đã chọn</p>
                </div>

                <div className="report-stat-card danger">
                    <span>Điểm RL</span>
                    <h2>{baoCao.tong_quan.tong_diem_ren_luyen_da_cong.toLocaleString("vi-VN")}</h2>
                    <p>Điểm đã cộng trong kỳ</p>
                </div>
            </div>

            {/* ================= CHART ================= */}

            <div className="report-chart-grid">
                <div className="card chart-card">
                    <h3>Thống kê sự kiện theo tháng ({nam})</h3>
                    <div style={{ height: "280px" }}>
                        <Bar data={chartSuKienThang} options={chartOptions} />
                    </div>
                </div>

                <div className="card chart-card">
                    <h3>Phân loại sự kiện</h3>
                    <div style={{ height: "280px" }}>
                        {baoCao.phan_loai_su_kien.length === 0 ? (
                            <p style={{ textAlign: "center", paddingTop: "100px", color: "#888" }}>
                                Chưa có dữ liệu.
                            </p>
                        ) : (
                            <Doughnut
                                data={chartPhanLoai}
                                options={{ responsive: true, maintainAspectRatio: false }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* ================= TOP EVENT ================= */}

            <div className="card report-table-card">
                <div className="report-table-header">
                    <div>
                        <h3>Top sự kiện có nhiều lượt đăng ký</h3>
                        <p>{baoCao.top_su_kien.length} sự kiện nổi bật</p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table report-table">
                        <thead>
                            <tr>
                                <th width="60">STT</th>
                                <th>Tên sự kiện</th>
                                <th>Danh mục</th>
                                <th width="150">Đăng ký</th>
                                <th width="140">Điểm RL</th>
                                <th width="160">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {baoCao.top_su_kien.map((sk, idx) => (
                                <tr key={sk.ma_su_kien}>
                                    <td>{idx + 1}</td>
                                    <td>{sk.ten_su_kien}</td>
                                    <td>{sk.ten_loai_su_kien || "—"}</td>
                                    <td>
                                        <span className="report-count">
                                            {sk.so_luong_dang_ky} / {sk.so_luong_toi_da ?? "∞"}
                                        </span>
                                    </td>
                                    <td>{sk.diem_cong}</td>
                                    <td>
                                        <span className="status active">
                                            {NHAN_TRANG_THAI_SU_KIEN[sk.trang_thai] || sk.trang_thai}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {baoCao.top_su_kien.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: "24px" }}>
                                        Chưa có sự kiện nào trong kỳ này.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= SECOND CHART ================= */}

            <div className="report-chart-grid">
                <div className="card chart-card">
                    <h3>Lượt đăng ký theo tháng ({nam})</h3>
                    <div style={{ height: "280px" }}>
                        <Line data={chartDangKyThang} options={chartOptions} />
                    </div>
                </div>

                <div className="card chart-card">
                    <h3>Tỷ lệ tham gia sự kiện</h3>
                    <div style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                        <Doughnut
                            data={{
                                labels: ["Đã tham gia", "Chưa điểm danh / đã hủy"],
                                datasets: [{
                                    data: [
                                        baoCao.danh_gia.ty_le_tham_gia,
                                        Math.max(0, 100 - baoCao.danh_gia.ty_le_tham_gia),
                                    ],
                                    backgroundColor: ["#22c55e", "#e5e7eb"],
                                }],
                            }}
                            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
                        />
                        <p style={{ marginTop: "-140px", fontSize: "24px", fontWeight: "bold" }}>
                            {baoCao.danh_gia.ty_le_tham_gia}%
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= TOP STUDENT ================= */}

            <div className="card report-table-card">
                <div className="report-table-header">
                    <div>
                        <h3>Top sinh viên tích cực</h3>
                        <p>Tham gia nhiều sự kiện nhất trong kỳ</p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table report-table">
                        <thead>
                            <tr>
                                <th width="70">STT</th>
                                <th>MSSV</th>
                                <th>Họ tên</th>
                                <th width="150">Sự kiện</th>
                                <th width="150">Điểm RL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {baoCao.top_sinh_vien.map((sv, idx) => (
                                <tr key={sv.ma_tai_khoan}>
                                    <td>{idx + 1}</td>
                                    <td>{sv.mssv || "—"}</td>
                                    <td>{sv.ho_ten}</td>
                                    <td>{sv.so_su_kien_tham_gia}</td>
                                    <td>{sv.tong_diem_ren_luyen}</td>
                                </tr>
                            ))}
                            {baoCao.top_sinh_vien.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "24px" }}>
                                        Chưa có dữ liệu trong kỳ này.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= SUMMARY ================= */}

            <div className="report-summary-grid">
                <div className="card summary-card">
                    <h3>Tổng kết</h3>
                    <ul>
                        <li>✔ Tổng số sự kiện: <strong>{baoCao.tong_quan.tong_su_kien}</strong></li>
                        <li>✔ Tổng lượt đăng ký: <strong>{baoCao.tong_quan.tong_luot_dang_ky}</strong></li>
                        <li>✔ Tổng sinh viên: <strong>{baoCao.tong_quan.tong_sinh_vien}</strong></li>
                        <li>✔ Điểm rèn luyện đã cộng: <strong>{baoCao.tong_quan.tong_diem_ren_luyen_da_cong}</strong></li>
                    </ul>
                </div>

                <div className="card summary-card">
                    <h3>Đánh giá hệ thống</h3>
                    <ul>
                        <li>📈 Tỷ lệ tham gia: <strong>{baoCao.danh_gia.ty_le_tham_gia}%</strong></li>
                        <li>🎯 Sự kiện trung bình/tháng: <strong>{baoCao.danh_gia.su_kien_trung_binh_thang}</strong></li>
                        <li>👨‍🎓 Trung bình lượt ĐK/Sự kiện: <strong>{baoCao.danh_gia.trung_binh_sv_moi_su_kien}</strong></li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default ReportManagement;
