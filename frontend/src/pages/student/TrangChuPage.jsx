import { useEffect, useState } from "react";

import BannerSuKien from "../../components/event/BannerSuKien";
import CardSuKien from "../../components/event/CardSuKien";
import SearchBar from "../../components/common/SearchBar";
import AIWidget from "../../components/ai/AIWidget";
import ThongBaoCard from "../../components/notification/ThongBaoCard";

import suKienService from "../../services/suKienService";
import useCaiDatCongKhai from "../../hooks/useCaiDatCongKhai";

import "../../assets/css/home.css";

const TrangChuPage = () => {

    const [suKienList, setSuKienList] = useState([]);
    const { banner_url_day_du } = useCaiDatCongKhai();

    useEffect(() => {
        loadSuKien();
    }, []);

    const loadSuKien = async () => {
        try {
            const data = await suKienService.getAll();

            console.log("Dữ liệu sự kiện trang chủ:", data);

            setSuKienList(data);

        } catch (error) {
            console.error("Lỗi tải sự kiện:", error);
        }
    };

    return (
        <div className="home-container">

            {/* ================= BANNER ================= */}
            <BannerSuKien
                anhBanner={banner_url_day_du}
            />

            {/* ================= TÌM KIẾM ================= */}
            <SearchBar />

            {/* ================= SỰ KIỆN NỔI BẬT ================= */}
            <div className="home-section">

                <h2 className="section-title">
                    Sự kiện nổi bật
                </h2>

                <div className="event-grid">

                    {suKienList.map((item) => (

                        <CardSuKien
                            key={item.ma_su_kien}

                            /* Thông tin cơ bản */
                            id={item.ma_su_kien}
                            ten={item.ten_su_kien}
                            ngay={item.thoi_gian_bat_dau}
                            diaDiem={item.dia_diem}
                            diem={item.diem_cong}
                            trangThai={item.trang_thai}

                            /* Loại sự kiện */
                            loaiSuKien={item.ten_loai_su_kien}

                            /* Số lượng */
                            soLuong={item.so_luong_toi_da}
                            daDangKy={item.so_luong_da_dang_ky}

                            /* Ảnh */
                            anhBia={item.anh_bia}
                        />

                    ))}

                </div>

            </div>

            {/* ================= THÔNG BÁO + AI ================= */}
            <div className="home-bottom">

                <div>

                    <div className="home-section">

                        <h2 className="section-title">
                            Thông báo mới
                        </h2>

                        <ThongBaoCard
                            tieuDe="Đăng ký thành công"
                            noiDung="Bạn đã đăng ký thành công Workshop AI."
                            thoiGian="2 phút trước"
                            loai="sukien"
                        />

                        <ThongBaoCard
                            tieuDe="Sự kiện mới"
                            noiDung="Có sự kiện mới dành cho sinh viên CNTT."
                            thoiGian="10 phút trước"
                            loai="thongbao"
                        />

                    </div>

                </div>

                <AIWidget />

            </div>

        </div>
    );
};

export default TrangChuPage;