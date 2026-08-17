import { useNavigate } from "react-router-dom";
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaStar,
    FaArrowRight,
    FaUsers,
} from "react-icons/fa";

import "../../assets/css/sukien.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const getImageUrl = (anhBia) => {

    if (!anhBia) {
        return "https://placehold.co/600x400?text=No+Image";
    }

    if (anhBia.startsWith("http")) {
        return anhBia;
    }

    return `${API_URL}/uploads/event/${anhBia}`;

};

const formatDate = (date) => {

    if (!date) return "";

    return new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

};

const CardSuKien = ({
    id,
    ten,
    ngay,
    diaDiem,
    diem,
    trangThai,
    anhBia,
    loaiSuKien = "Sự kiện",
    soLuong = 0,
    daDangKy = 0,
}) => {

    const navigate = useNavigate();

    const soChoConLai = Math.max(
        Number(soLuong) - Number(daDangKy),
        0
    );

    const tiLeDangKy =
        Number(soLuong) > 0
            ? Math.min(
                (Number(daDangKy) / Number(soLuong)) * 100,
                100
            )
            : 0;

    const layClassTrangThai = () => {

        switch (trangThai) {

            case "SapMo":
                return "trang-thai-sap-mo";

            case "DangMo":
                return "trang-thai-mo";

            case "DongDangKy":
                return "trang-thai-dong";

            case "DangDienRa":
                return "trang-thai-dang-dien-ra";

            case "DaDay":
                return "trang-thai-day";

            case "KetThuc":
                return "trang-thai-ket-thuc";

            default:
                return "trang-thai-mo";

        }

    };

    const hienThiTrangThai = () => {

        switch (trangThai) {

            case "SapMo":
                return "Sắp mở";

            case "DangMo":
                return "Đang mở";

            case "DongDangKy":
                return "Đã đóng";

            case "DangDienRa":
                return "Đang diễn ra";

            case "DaDay":
                return "Đã đầy";

            case "KetThuc":
                return "Đã kết thúc";

            default:
                return trangThai || "Đang mở";

        }

    };

    return (

        <div className="the-su-kien">

            <div className="anh-su-kien">

                <img
                    src={getImageUrl(anhBia)}
                    alt={ten}
                    onError={(e) => {
                        e.target.src =
                            "https://placehold.co/600x400?text=No+Image";
                    }}
                />

                <span className="badge-loai">
                    {loaiSuKien}
                </span>

                <span
                    className={`trang-thai-su-kien ${layClassTrangThai()}`}
                >
                    {hienThiTrangThai()}
                </span>

            </div>

            <div className="noi-dung-the">

                <h3 className="ten-su-kien">
                    {ten}
                </h3>

                <div className="thong-tin-su-kien">

                    <div className="dong-thong-tin">

                        <FaCalendarAlt />

                        <span>
                            {formatDate(ngay)}
                        </span>

                    </div>

                    <div className="dong-thong-tin">

                        <FaMapMarkerAlt />

                        <span>
                            {diaDiem}
                        </span>

                    </div>

                </div>

                <div className="so-luong">

                    <FaUsers />

                    <span>

                        Còn <strong>{soChoConLai}</strong> / {soLuong} chỗ

                    </span>

                </div>

                <div className="thanh-tien-trinh">

                    <div
                        className="thanh-tien-trinh-da-day"
                        style={{
                            width: `${tiLeDangKy}%`,
                        }}
                    />

                </div>

                <div className="diem-ren-luyen">

                    <FaStar />

                    <span>

                        +{diem} điểm rèn luyện

                    </span>

                </div>

                <div className="chan-the">

                    <button
                        className="nut-chi-tiet"
                        onClick={() => navigate(`/su-kien/${id}`)}
                    >

                        Xem chi tiết

                        <FaArrowRight />

                    </button>

                </div>

            </div>

        </div>

    );

};

export default CardSuKien;