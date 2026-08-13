import {
    FaArrowRight,
    FaCalendarAlt,
    FaUsers,
    FaAward,
} from "react-icons/fa";

import "../../assets/css/banner.css";

const BannerSuKien = ({
    tongSuKien = 11,
    tongSinhVien = 4500,
    diemToiDa = 65,
    anhBanner = "",
}) => {

    return (

        <section
            className="banner"
            style={
                anhBanner
                    ? {
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${anhBanner})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                      }
                    : undefined
            }
        >

            <div className="banner-overlay"></div>

            {!anhBanner && (
                <div className="banner-background">

                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>

                </div>
            )}

            <div className="banner-content">

                <div className="banner-left">

                    <span className="banner-badge">

                        🎓 BETU EVENT PLATFORM

                    </span>

                    <h1>

                        Khám phá
                        <br />

                        <span>Sự kiện sinh viên</span>

                    </h1>

                    <p>

                        Tham gia các hoạt động học thuật, hội thảo,
                        văn nghệ, tình nguyện và thể thao.
                        Đăng ký trực tuyến, điểm danh QR
                        và tích lũy điểm rèn luyện nhanh chóng.

                    </p>

                    <div className="banner-buttons">

                        <button className="primary-btn">

                            Khám phá ngay

                            <FaArrowRight />

                        </button>

                        <button className="secondary-btn">

                            Lịch sự kiện

                        </button>

                    </div>

                </div>

                <div className="banner-right">

                    <div className="banner-card">

                        <div className="banner-icon">

                            <FaCalendarAlt />

                        </div>

                        <div>

                            <h2>{tongSuKien}+</h2>

                            <span>Sự kiện đang mở</span>

                        </div>

                    </div>

                    <div className="banner-card">

                        <div className="banner-icon">

                            <FaUsers />

                        </div>

                        <div>

                            <h2>{tongSinhVien.toLocaleString()}+</h2>

                            <span>Sinh viên tham gia</span>

                        </div>

                    </div>

                    <div className="banner-card">

                        <div className="banner-icon">

                            <FaAward />

                        </div>

                        <div>

                            <h2>{diemToiDa}</h2>

                            <span>Điểm rèn luyện tối đa</span>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default BannerSuKien;