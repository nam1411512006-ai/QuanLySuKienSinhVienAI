import axiosClient from "../api/axiosClient";

// Quét QR để điểm danh (sinh viên)
const diemDanh = async (maQr) => {
    return await axiosClient.post("/diem-danh", { ma_qr: maQr });
};

export default {
    diemDanh,
};
