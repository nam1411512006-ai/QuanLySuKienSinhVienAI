import { useNavigate } from "react-router-dom";

import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaStar,
    FaArrowRight,
    FaUsers,
} from "react-icons/fa";

import "../../assets/css/sukien.css";


// ==========================================================
// BACKEND PRODUCTION
// ==========================================================

const API_URL = "https://quanly-su-kien-backend.onrender.com";


// ==========================================================
// XỬ LÝ URL ẢNH SỰ KIỆN
// ==========================================================

const getImageUrl = (anhBia) => {

    // Không có ảnh
    if (!anhBia) {
        return "https://placehold.co/600x400?text=No+Image";
    }

    // Nếu Backend đã trả URL đầy đủ
    if (
        anhBia.startsWith("http://") ||
        anhBia.startsWith("https://")
    ) {
        return anhBia;
    }

    // Chuyển về string và loại bỏ khoảng trắng
    let fileName = String(anhBia).trim();

    // Xóa "/" ở đầu
    fileName = fileName.replace(/^\/+/, "");

    // Nếu dữ liệu là:
    // uploads/event/est2026.jpg
    fileName = fileName.replace(
        /^uploads\/event\//i,
        ""
    );

    // Nếu dữ liệu là:
    // event/est2026.jpg
    fileName = fileName.replace(
        /^event\//i,
        ""
    );

    // URL cuối cùng
    return `${API_URL}/uploads/event/${fileName}`;
};


// ==========================================================
// FORMAT NGÀY
// ==========================================================

const formatDate = (date) => {

    if (!date) {
        return "";
    }

    return new Date(date).toLocaleDateString(
        "vi-VN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }
    );
};


// ==========================================================
// COMPONENT CARD SỰ KIỆN
// ==========================================================

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


    // ======================================================
    // SỐ CHỖ CÒN LẠI
    // ======================================================

    const soChoConLai = Math.max(
        Number(soLuong) - Number(daDangKy),
        0
    );


    // ======================================================
    // TỶ LỆ ĐĂNG KÝ
    // ======================================================

    const tiLeDangKy =
        Number(soLuong) > 0
            ? Math.min(
                (Number(daDangKy) / Number(soLuong)) * 100,
                100
            )
            : 0;


    // ======================================================
    // CLASS TRẠNG THÁI
    // ======================================================

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


    // ======================================================
    // TÊN TRẠNG THÁI
    // ======================================================

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


    // ======================================================
    // URL ẢNH
    // ======================================================

    const imageUrl = getImageUrl(anhBia);


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="the-su-kien">


            {/* ==================================================
                ẢNH SỰ KIỆN
            ================================================== */}

            <div className="anh-su-kien">

                <img
                    src={imageUrl}
                    alt={ten || "Ảnh sự kiện"}
                    loading="lazy"
                    onError={(e) => {

                        // Tránh vòng lặp onError
                        e.currentTarget.onerror = null;

                        e.currentTarget.src =
                            "https://placehold.co/600x400?text=No+Image";
                    }}
                />


                {/* Loại sự kiện */}

                <span className="badge-loai">
                    {loaiSuKien || "Sự kiện"}
                </span>


                {/* Trạng thái */}

                <span
                    className={
                        `trang-thai-su-kien ${layClassTrangThai()}`
                    }
                >
                    {hienThiTrangThai()}
                </span>

            </div>


            {/* ==================================================
                NỘI DUNG CARD
            ================================================== */}

            <div className="noi-dung-the">


                {/* Tên sự kiện */}

                <h3 className="ten-su-kien">
                    {ten}
                </h3>


                {/* ==================================================
                    THÔNG TIN NGÀY + ĐỊA ĐIỂM
                ================================================== */}

                <div className="thong-tin-su-kien">


                    {/* Ngày */}

                    <div className="dong-thong-tin">

                        <FaCalendarAlt />

                        <span>
                            {formatDate(ngay)}
                        </span>

                    </div>


                    {/* Địa điểm */}

                    <div className="dong-thong-tin">

                        <FaMapMarkerAlt />

                        <span>
                            {diaDiem}
                        </span>

                    </div>

                </div>


                {/* ==================================================
                    SỐ LƯỢNG NGƯỜI ĐĂNG KÝ
                ================================================== */}

                <div className="so-luong">

                    <FaUsers />

                    <span>
                        Còn{" "}
                        <strong>
                            {soChoConLai}
                        </strong>{" "}
                        / {soLuong} chỗ
                    </span>

                </div>


                {/* ==================================================
                    THANH TIẾN TRÌNH
                ================================================== */}

                <div className="thanh-tien-trinh">

                    <div
                        className="thanh-tien-trinh-da-day"
                        style={{
                            width: `${tiLeDangKy}%`,
                        }}
                    />

                </div>


                {/* ==================================================
                    ĐIỂM RÈN LUYỆN
                ================================================== */}

                <div className="diem-ren-luyen">

                    <FaStar />

                    <span>
                        +{diem || 0} điểm rèn luyện
                    </span>

                </div>


                {/* ==================================================
                    NÚT CHI TIẾT
                ================================================== */}

                <div className="chan-the">

                    <button
                        type="button"
                        className="nut-chi-tiet"
                        onClick={() =>
                            navigate(`/su-kien/${id}`)
                        }
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