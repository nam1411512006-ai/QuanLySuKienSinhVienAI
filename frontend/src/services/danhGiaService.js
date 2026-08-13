import axiosClient from "../api/axiosClient";

// Danh sách sự kiện đã tham gia và chưa đánh giá
const getSuKienChoDanhGia = async () => {
    return await axiosClient.get("/danh-gia/cho-danh-gia");
};

// Gửi đánh giá cho 1 sự kiện
const guiDanhGia = async (maSuKien, soSao, noiDung) => {
    return await axiosClient.post(`/danh-gia/${maSuKien}`, {
        so_sao: soSao,
        noi_dung: noiDung,
    });
};

export default {
    getSuKienChoDanhGia,
    guiDanhGia,
};
