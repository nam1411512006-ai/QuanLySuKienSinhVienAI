import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUser,
    FaLock,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import { authService } from "../../services/authService";
import useCaiDatCongKhai from "../../hooks/useCaiDatCongKhai";
import "../../assets/css/form.css";

const DangNhapPage = () => {

    const navigate = useNavigate();
    const { ten_truong, logo_url_day_du } = useCaiDatCongKhai();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ email và mật khẩu.");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.login({
                email: email.trim(),
                password: password.trim(),
            });

            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("user", JSON.stringify(response.user));

            const role = response.user.ten_vai_tro;

            if (role === "BanToChuc") {
                navigate("/organizer/dashboard");
            }
            else if (role === "Admin") {
                navigate("/admin/dashboard");
            }
            else {
                navigate("/trang-chu");
            }
        }
        catch (err) {
            setError(err.message || "Đăng nhập thất bại.");
        }
        finally {
            setLoading(false);
        }
    };

    return (

        <div className="login-page">

            <div className="login-left">

                <div className="login-overlay">

                    <div className="login-content">

                        <h1>{ten_truong}</h1>

                        <h2>
                            Kết nối nhịp đập
                            <br />
                            Cộng đồng Sinh viên
                        </h2>

                        <p>
                            Khám phá hàng ngàn sự kiện hấp dẫn,
                            tích lũy điểm rèn luyện và mở rộng
                            mạng lưới bạn bè.
                        </p>

                    </div>

                </div>

            </div>

            <div className="login-right">

                <form className="login-card" onSubmit={handleLogin}>

                    <div className="login-logo">

                        {logo_url_day_du ? (
                            <img
                                src={logo_url_day_du}
                                alt="Logo"
                                style={{ height: "28px", verticalAlign: "middle", marginRight: "6px" }}
                            />
                        ) : (
                            "🎓 "
                        )}
                        <span>{ten_truong}</span>

                    </div>

                    <h2>Chào mừng trở lại!</h2>

                    <p className="login-subtitle">

                        Sử dụng tài khoản sinh viên để đăng nhập hệ thống.

                    </p>

                    <div className="login-input-group">

                        <FaUser className="login-input-icon" />

                        <input
                            className="login-input"
                            type="text"
                            placeholder="MSSV hoặc Email trường"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                    <div className="login-input-group">

                        <FaLock className="login-input-icon" />

                        <input
                            className="login-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            className="login-show-password"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >

                            {showPassword ? <FaEyeSlash /> : <FaEye />}

                        </button>

                    </div>

                    {
                        error && (
                            <p style={{ color: "#dc3545", marginTop: "8px" }}>
                                {error}
                            </p>
                        )
                    }

                    <div className="login-option">

                        <label>

                            <input type="checkbox" />

                            Ghi nhớ đăng nhập

                        </label>

                        <a href="#">Quên mật khẩu?</a>

                    </div>

                    <button
                        className="login-btn"
                        type="submit"
                        disabled={loading}
                    >

                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}

                    </button>

                </form>

            </div>

        </div>

    );

};

export default DangNhapPage;