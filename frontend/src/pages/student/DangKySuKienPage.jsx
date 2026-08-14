import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/register-event.css";
import suKienService from "../../services/suKienService";
import dangKyService from "../../services/dangKyService";

const DangKySuKienPage = () => {
    const navigate = useNavigate();
    const { maSuKien } = useParams();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [suKien, setSuKien] = useState(null);

    const [user, setUser] = useState({
        ma_tai_khoan: "",
        ho_ten: "",
        email: "",
        mssv: "",
    });

    const [agree, setAgree] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));

        if (!userData) {
            alert("Bạn cần đăng nhập để đăng ký sự kiện.");
            navigate("/");
            return;
        }

        setUser(userData);

        loadSuKien();
    }, []);

    const loadSuKien = async () => {
        try {
            const data = await suKienService.getById(maSuKien);
            setSuKien(data);
        } catch (error) {
            console.error(error);
            alert("Không tải được thông tin sự kiện.");
            navigate("/su-kien");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("vi-VN");
    };

    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleDangKy = async () => {
        if (!agree) {
            alert("Bạn phải xác nhận cam kết tham gia.");
            return;
        }

        try {
            setSubmitting(true);

            const res = await dangKyService.dangKySuKien(
                suKien.ma_su_kien
            );

            alert(res.message || "Đăng ký thành công!");

            navigate("/su-kien");
        } catch (err) {
            console.error(err);

            alert(
                err.message ||
                "Đăng ký thất bại."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="register-container">
                <h2>Đang tải dữ liệu...</h2>
            </div>
        );
    }

    if (!suKien) {
        return (
            <div className="register-container">
                <h2>Không tìm thấy sự kiện.</h2>
            </div>
        );
    }

    return (
        <div className="register-container">
            <div className="register-card">

                <h2>Đăng ký tham gia sự kiện</h2>

                <div className="event-info">

                    <div className="event-image">
                        <img
                            src={
                                suKien.anh_bia
                                    ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/uploads/${suKien.anh_bia}`
                                    : "https://placehold.co/300x200"
                            }
                            alt={suKien.ten_su_kien}
                        />
                    </div>

                    <div className="event-detail">

                        <h3>{suKien.ten_su_kien}</h3>

                        <p>
                            📅 Ngày:
                            {" "}
                            {formatDate(suKien.thoi_gian_bat_dau)}
                        </p>

                        <p>
                            🕒 Thời gian:
                            {" "}
                            {formatTime(suKien.thoi_gian_bat_dau)}
                            {" - "}
                            {formatTime(suKien.thoi_gian_ket_thuc)}
                        </p>

                        <p>
                            📍 Địa điểm:
                            {" "}
                            {suKien.dia_diem}
                        </p>

                        <p>
                            👥 Số lượng tối đa:
                            {" "}
                            {suKien.so_luong_toi_da}
                        </p>

                        <p className="point">
                            ⭐ +{suKien.diem_cong} điểm rèn luyện
                        </p>

                    </div>

                </div>

                <hr />

                <h3>Thông tin sinh viên</h3>

                <div className="form-grid">

                    <div className="form-group">
                        <label>MSSV</label>
                        <input
                            type="text"
                            value={user.mssv || ""}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            value={user.ho_ten || ""}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="text"
                            value={user.email || ""}
                            readOnly
                        />
                    </div>

                </div>

                <hr />

                <div className="agree">

                    <input
                        type="checkbox"
                        id="agree"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                    />

                    <label htmlFor="agree">
                        Tôi cam kết tham gia đầy đủ sự kiện và tuân thủ nội quy của Ban tổ chức.
                    </label>

                </div>

                <div className="button-group">

                    <button
                        className="cancel-btn"
                        onClick={() => navigate(-1)}
                        disabled={submitting}
                    >
                        Quay lại
                    </button>

                    <button
                        className="register-btn"
                        onClick={handleDangKy}
                        disabled={submitting}
                    >
                        {submitting
                            ? "Đang đăng ký..."
                            : "Xác nhận đăng ký"}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default DangKySuKienPage;