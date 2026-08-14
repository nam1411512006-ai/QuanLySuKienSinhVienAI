import { useEffect, useState } from "react";
import "../../assets/css/danhgia.css";
import {
    FaStar,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPaperPlane
} from "react-icons/fa";
import danhGiaService from "../../services/danhGiaService";

const DanhGiaPage = () => {

    const [dsSuKien, setDsSuKien] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [maSuKienDaChon, setMaSuKienDaChon] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        loadDanhSach();
    }, []);

    const loadDanhSach = async () => {
        try {
            setLoading(true);

            const data = await danhGiaService.getSuKienChoDanhGia();

            setDsSuKien(data);

            if (data.length > 0) {
                setMaSuKienDaChon(String(data[0].ma_su_kien));
            }

        } catch (error) {
            console.error(error);
            alert(error.message || "Không tải được danh sách sự kiện.");
        } finally {
            setLoading(false);
        }
    };

    const suKienDangChon = dsSuKien.find(
        (item) => String(item.ma_su_kien) === String(maSuKienDaChon)
    );

    const formatNgay = (ngay) => {
        if (!ngay) return "";
        return new Date(ngay).toLocaleDateString("vi-VN");
    };

    const handleSubmit = async () => {

        if (!suKienDangChon) {
            alert("Vui lòng chọn sự kiện cần đánh giá.");
            return;
        }

        if (!comment.trim()) {
            alert("Vui lòng nhập cảm nhận của bạn.");
            return;
        }

        try {
            setSubmitting(true);

            const res = await danhGiaService.guiDanhGia(
                suKienDangChon.ma_su_kien,
                rating,
                comment
            );

            alert(res.message || "Gửi đánh giá thành công!");

            setComment("");
            setRating(5);

            // Sự kiện vừa đánh giá xong thì bỏ khỏi danh sách để không đánh giá trùng
            const dsMoi = dsSuKien.filter(
                (item) => item.ma_su_kien !== suKienDangChon.ma_su_kien
            );
            setDsSuKien(dsMoi);
            setMaSuKienDaChon(dsMoi.length > 0 ? String(dsMoi[0].ma_su_kien) : "");

        } catch (error) {
            console.error(error);
            alert(error.message || "Gửi đánh giá thất bại.");
        } finally {
            setSubmitting(false);
        }

    };

    if (loading) {
        return (
            <div className="review-page">
                <h2>Đang tải dữ liệu...</h2>
            </div>
        );
    }

    if (dsSuKien.length === 0) {
        return (
            <div className="review-page">
                <div className="review-card">
                    <h3>Đánh giá sự kiện</h3>
                    <p>
                        Bạn chưa có sự kiện nào đã tham gia và đủ điều kiện đánh giá
                        (chỉ áp dụng cho sự kiện đã điểm danh / đã hoàn thành, và
                        mỗi sự kiện chỉ đánh giá được 1 lần).
                    </p>
                </div>
            </div>
        );
    }

    const hinhAnh = suKienDangChon?.anh_bia
        ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/uploads/${suKienDangChon.anh_bia}`
        : "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200";

    return (

        <div className="review-page">

            <div className="review-banner">

                <img
                    src={hinhAnh}
                    alt=""
                />

                <div className="review-overlay">

                    <h2>
                        {suKienDangChon?.ten_su_kien}
                    </h2>

                    <div className="review-event-info">

                        <span>
                            <FaCalendarAlt />
                            {formatNgay(suKienDangChon?.thoi_gian_bat_dau)}
                        </span>

                        <span>
                            <FaMapMarkerAlt />
                            {suKienDangChon?.dia_diem || "Đang cập nhật"}
                        </span>

                    </div>

                </div>

            </div>

            <div className="review-card">

                <h3>
                    Đánh giá sự kiện
                </h3>

                <p>
                    Hãy chia sẻ trải nghiệm của bạn sau khi tham gia sự kiện.
                </p>

                {
                    dsSuKien.length > 1 && (
                        <div className="form-group" style={{ marginBottom: "16px" }}>
                            <label>Chọn sự kiện</label>
                            <select
                                className="form-select"
                                value={maSuKienDaChon}
                                onChange={(e) => setMaSuKienDaChon(e.target.value)}
                            >
                                {
                                    dsSuKien.map((item) => (
                                        <option
                                            key={item.ma_su_kien}
                                            value={item.ma_su_kien}
                                        >
                                            {item.ten_su_kien}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    )
                }

                <div className="rating-box">

                    {
                        [...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                className={
                                    index < rating
                                        ? "star active"
                                        : "star"
                                }
                                onClick={() => setRating(index + 1)}
                            />
                        ))
                    }

                </div>

                <textarea
                    placeholder="Nhập cảm nhận của bạn..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    className="review-submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    <FaPaperPlane />
                    {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>

            </div>

        </div>

    );

};

export default DanhGiaPage;
