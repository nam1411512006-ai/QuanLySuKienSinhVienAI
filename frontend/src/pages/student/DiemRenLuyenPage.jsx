import {
    FaAward,
    FaCalendarCheck,
    FaClipboardCheck,
    FaStar,
    FaSchool,
    FaUsers,
    FaArrowUp
} from "react-icons/fa";

import "../../assets/css/diemrenluyen.css";

const DiemRenLuyenPage = () => {

    /* ================================
       DỮ LIỆU MẪU
    ================================= */

    const tongDiem = 52;

    const diemToiDa = 65;

    const diemNhaTruong = 35;

    const diemNhaTruongToiDa = 40;

    const diemSuKien = 17;

    const diemSuKienToiDa = 25;

    const tongDangKy = 18;

    const tongThamGia = 15;

    const tongHoanThanh = 14;

    const phanTramTong =
        (tongDiem / diemToiDa) * 100;

    const phanTramTruong =
        (diemNhaTruong / diemNhaTruongToiDa) * 100;

    const phanTramSuKien =
        (diemSuKien / diemSuKienToiDa) * 100;

    const xepLoai = () => {

        if (tongDiem >= 60)
            return "Xuất sắc";

        if (tongDiem >= 50)
            return "Tốt";

        if (tongDiem >= 40)
            return "Khá";

        if (tongDiem >= 30)
            return "Trung bình";

        return "Chưa đạt";

    };

    return (

        <div className="drl-page">

            {/* ================= HERO ================= */}

            <div className="hero-card">

                <div className="hero-left">

                    <span className="hero-label">

                        ĐIỂM RÈN LUYỆN HỌC KỲ II

                    </span>

                    <h1>

                        {tongDiem}
                        <small>/{diemToiDa}</small>

                    </h1>

                    <h3>

                        {xepLoai()}

                    </h3>

                    <div className="hero-progress">

                        <div
                            className="hero-progress-value"
                            style={{
                                width: `${phanTramTong}%`
                            }}
                        />

                    </div>

                    <p>

                        Bạn đã hoàn thành

                        <strong>

                            {" "}
                            {Math.round(phanTramTong)}%

                        </strong>

                        {" "}điểm rèn luyện học kỳ.

                    </p>

                </div>

                <div className="hero-right">

                    <FaAward className="hero-icon" />

                </div>

            </div>

            {/* ================= THỐNG KÊ ================= */}

            <div className="stats-grid">

                <div className="stats-card">

                    <FaCalendarCheck className="stats-icon" />

                    <h4>

                        Đã đăng ký

                    </h4>

                    <h2>

                        {tongDangKy}

                    </h2>

                    <span>

                        Sự kiện

                    </span>

                </div>

                <div className="stats-card">

                    <FaClipboardCheck className="stats-icon" />

                    <h4>

                        Đã tham gia

                    </h4>

                    <h2>

                        {tongThamGia}

                    </h2>

                    <span>

                        Sự kiện

                    </span>

                </div>

                <div className="stats-card">

                    <FaArrowUp className="stats-icon" />

                    <h4>

                        Hoàn thành

                    </h4>

                    <h2>

                        {tongHoanThanh}

                    </h2>

                    <span>

                        Hoạt động

                    </span>

                </div>

                <div className="stats-card">

                    <FaStar className="stats-icon" />

                    <h4>

                        Điểm sự kiện

                    </h4>

                    <h2>

                        {diemSuKien}

                        <small>

                            /25

                        </small>

                    </h2>

                    <span>

                        Tích lũy

                    </span>

                </div>

            </div>

            {/* ================= PHÂN CHIA ĐIỂM ================= */}

            <div className="score-section">

                <div className="score-card">

                    <div className="score-header">

                        <FaSchool />

                        <h3>

                            Điểm Nhà trường

                        </h3>

                    </div>

                    <h2>

                        {diemNhaTruong}

                        <small>

                            /40

                        </small>

                    </h2>

                    <div className="progress">

                        <div
                            className="progress-bar"
                            style={{
                                width: `${phanTramTruong}%`
                            }}
                        />

                    </div>

                    <p>

                        Bao gồm:

                    </p>

                    <ul>

                        <li>Học tập</li>

                        <li>Ý thức</li>

                        <li>Kỷ luật</li>

                        <li>Đoàn - Hội</li>

                    </ul>

                </div>

                <div className="score-card">

                    <div className="score-header">

                        <FaUsers />

                        <h3>

                            Điểm từ sự kiện

                        </h3>

                    </div>

                    <h2>

                        {diemSuKien}

                        <small>

                            /25

                        </small>

                    </h2>

                    <div className="progress">

                        <div
                            className="progress-bar event-progress"
                            style={{
                                width: `${phanTramSuKien}%`
                            }}
                        />

                    </div>

                    <p>

                        Tích lũy từ:

                    </p>

                    <ul>

                        <li>Workshop</li>

                        <li>Hội thảo</li>

                        <li>Tình nguyện</li>

                        <li>Hiến máu</li>

                        <li>Sự kiện của trường</li>

                    </ul>

                </div>

            </div>

            {/* ================= AI + MỤC TIÊU ================= */}

            <div className="middle-grid">

                <div className="ai-card">

                    <div className="section-title">

                        🤖 AI Phân tích

                    </div>

                    <div className="ai-content">

                        <h4>

                            Bạn còn thiếu

                            <span className="highlight">
                                {" "}13 điểm
                            </span>

                            để đạt mức tối đa.

                        </h4>

                        <div className="ai-item">

                            <strong>Điểm Nhà trường:</strong>

                            <span>

                                Còn thiếu {diemNhaTruongToiDa - diemNhaTruong} điểm

                            </span>

                        </div>

                        <div className="ai-item">

                            <strong>Điểm sự kiện:</strong>

                            <span>

                                Còn thiếu {diemSuKienToiDa - diemSuKien} điểm

                            </span>

                        </div>

                        <hr />

                        <p>

                            AI đề xuất các hoạt động giúp bạn tăng điểm nhanh:

                        </p>

                        <ul className="ai-list">

                            <li>

                                ✅ Workshop AI (+5)

                            </li>

                            <li>

                                ✅ Hiến máu nhân đạo (+10)

                            </li>

                            <li>

                                ✅ Tiếp sức mùa thi (+8)

                            </li>

                            <li>

                                ✅ Mùa hè xanh (+8)

                            </li>

                        </ul>

                        <div className="ai-result">

                            Nếu hoàn thành 2 hoạt động đầu,
                            bạn sẽ đạt

                            <strong>

                                {" "}65/65 điểm.

                            </strong>

                        </div>

                    </div>

                </div>

                <div className="goal-card">

                    <div className="section-title">

                        🎯 Mục tiêu học kỳ

                    </div>

                    <div className="goal-score">

                        <span>

                            Hiện tại

                        </span>

                        <h2>

                            {tongDiem}

                        </h2>

                    </div>

                    <div className="goal-progress">

                        <div
                            className="goal-progress-value"
                            style={{
                                width: `${phanTramTong}%`
                            }}
                        />

                    </div>

                    <div className="goal-footer">

                        <div>

                            <small>

                                Còn thiếu

                            </small>

                            <h4>

                                {diemToiDa - tongDiem}

                                điểm

                            </h4>

                        </div>

                        <div>

                            <small>

                                Mục tiêu

                            </small>

                            <h4>

                                65 điểm

                            </h4>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================= LỊCH SỬ ================= */}

            <div className="history-card">

                <div className="section-title">

                    📜 Lịch sử cộng / trừ điểm

                </div>

                <div className="timeline">

                    <div className="timeline-item positive">

                        <div className="timeline-dot"></div>

                        <div className="timeline-content">

                            <h4>

                                Workshop AI

                            </h4>

                            <p>

                                Tham gia đầy đủ và hoàn thành điểm danh.

                            </p>

                            <span>

                                20/07/2026

                            </span>

                        </div>

                        <div className="timeline-score positive">

                            +5

                        </div>

                    </div>

                    <div className="timeline-item positive">

                        <div className="timeline-dot"></div>

                        <div className="timeline-content">

                            <h4>

                                Hiến máu nhân đạo

                            </h4>

                            <p>

                                Hoạt động tình nguyện cấp trường.

                            </p>

                            <span>

                                18/07/2026

                            </span>

                        </div>

                        <div className="timeline-score positive">

                            +10

                        </div>

                    </div>

                    <div className="timeline-item positive">

                        <div className="timeline-dot"></div>

                        <div className="timeline-content">

                            <h4>

                                Ngày hội việc làm

                            </h4>

                            <p>

                                Check-in thành công.

                            </p>

                            <span>

                                12/07/2026

                            </span>

                        </div>

                        <div className="timeline-score positive">

                            +8

                        </div>

                    </div>

                    <div className="timeline-item negative">

                        <div className="timeline-dot"></div>

                        <div className="timeline-content">

                            <h4>

                                Vắng buổi sinh hoạt

                            </h4>

                            <p>

                                Không tham gia theo quy định.

                            </p>

                            <span>

                                01/07/2026

                            </span>

                        </div>

                        <div className="timeline-score negative">

                            -3

                        </div>

                    </div>

                </div>

            </div>

            {/* ================= TIÊU CHÍ ================= */}

            <div className="criteria-section">

                <div className="section-title">

                    📊 Chi tiết theo tiêu chí

                </div>

                <div className="criteria-grid">

                    <div className="criteria-card">

                        <h4>📚 Học tập</h4>

                        <span>18 / 20 điểm</span>

                        <div className="progress">

                            <div
                                className="progress-bar"
                                style={{ width: "90%" }}
                            />

                        </div>

                    </div>

                    <div className="criteria-card">

                        <h4>🎓 Đoàn - Hội</h4>

                        <span>15 / 20 điểm</span>

                        <div className="progress">

                            <div
                                className="progress-bar"
                                style={{ width: "75%" }}
                            />

                        </div>

                    </div>

                    <div className="criteria-card">

                        <h4>🤝 Tình nguyện</h4>

                        <span>10 / 10 điểm</span>

                        <div className="progress">

                            <div
                                className="progress-bar"
                                style={{ width: "100%" }}
                            />

                        </div>

                    </div>

                    <div className="criteria-card">

                        <h4>🛡 Ý thức kỷ luật</h4>

                        <span>9 / 15 điểm</span>

                        <div className="progress">

                            <div
                                className="progress-bar"
                                style={{ width: "60%" }}
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* ================= THÀNH TÍCH ================= */}

            <div className="achievement-card">

                <div className="section-title">

                    🏅 Thành tích đạt được

                </div>

                <div className="achievement-grid">

                    <div className="achievement-item">

                        <div className="achievement-icon">

                            🎯

                        </div>

                        <h5>

                            15 Sự kiện

                        </h5>

                        <p>

                            Tham gia từ đầu học kỳ.

                        </p>

                    </div>

                    <div className="achievement-item">

                        <div className="achievement-icon">

                            ❤️

                        </div>

                        <h5>

                            Hiến máu

                        </h5>

                        <p>

                            Hoạt động nhân đạo.

                        </p>

                    </div>

                    <div className="achievement-item">

                        <div className="achievement-icon">

                            🌱

                        </div>

                        <h5>

                            Tình nguyện

                        </h5>

                        <p>

                            Hoàn thành Mùa hè xanh.

                        </p>

                    </div>

                    <div className="achievement-item achievement-lock">

                        <div className="achievement-icon">

                            🔒

                        </div>

                        <h5>

                            Đại sứ sinh viên

                        </h5>

                        <p>

                            Cần đạt 65 điểm để mở khóa.

                        </p>

                    </div>

                </div>

            </div>

            {/* ================= XẾP LOẠI ================= */}

            <div className="ranking-card">

                <div className="section-title">

                    📋 Quy đổi xếp loại điểm rèn luyện

                </div>

                <table className="table align-middle">

                    <thead>

                        <tr>

                            <th>Xếp loại</th>

                            <th>Số điểm</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>

                                🏆 Xuất sắc

                            </td>

                            <td>

                                60 - 65 điểm

                            </td>

                        </tr>

                        <tr>

                            <td>

                                🥇 Tốt

                            </td>

                            <td>

                                50 - 59 điểm

                            </td>

                        </tr>

                        <tr>

                            <td>

                                🥈 Khá

                            </td>

                            <td>

                                40 - 49 điểm

                            </td>

                        </tr>

                        <tr>

                            <td>

                                🥉 Trung bình

                            </td>

                            <td>

                                30 - 39 điểm

                            </td>

                        </tr>

                        <tr>

                            <td>

                                ❌ Chưa đạt

                            </td>

                            <td>

                                Dưới 30 điểm

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default DiemRenLuyenPage;