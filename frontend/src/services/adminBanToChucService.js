import axiosClient from "../api/axiosClient";

const getDanhSach = async (params) => {
    return await axiosClient.get("/admin/ban-to-chuc", { params });
};

const getThongKe = async () => {
    return await axiosClient.get("/admin/ban-to-chuc/thong-ke");
};

const taoBanToChuc = async (data) => {
    return await axiosClient.post("/admin/ban-to-chuc", data);
};

const capNhatBanToChuc = async (maTaiKhoan, data) => {
    return await axiosClient.put(`/admin/ban-to-chuc/${maTaiKhoan}`, data);
};

const doiTrangThai = async (maTaiKhoan) => {
    return await axiosClient.patch(`/admin/ban-to-chuc/${maTaiKhoan}/trang-thai`);
};

const xoaBanToChuc = async (maTaiKhoan) => {
    return await axiosClient.delete(`/admin/ban-to-chuc/${maTaiKhoan}`);
};

const getSuKienCuaBanToChuc = async (maTaiKhoan) => {
    return await axiosClient.get(`/admin/ban-to-chuc/${maTaiKhoan}/su-kien`);
};

// ===== Trung tam / Don vi to chuc =====

const getDanhSachTrungTam = async () => {
    return await axiosClient.get("/admin/ban-to-chuc/trung-tam");
};

const taoTrungTam = async (data) => {
    return await axiosClient.post("/admin/ban-to-chuc/trung-tam", data);
};

const capNhatTrungTam = async (maTrungTam, data) => {
    return await axiosClient.put(`/admin/ban-to-chuc/trung-tam/${maTrungTam}`, data);
};

const xoaTrungTam = async (maTrungTam) => {
    return await axiosClient.delete(`/admin/ban-to-chuc/trung-tam/${maTrungTam}`);
};

export default {
    getDanhSach,
    getThongKe,
    taoBanToChuc,
    capNhatBanToChuc,
    doiTrangThai,
    xoaBanToChuc,
    getSuKienCuaBanToChuc,
    getDanhSachTrungTam,
    taoTrungTam,
    capNhatTrungTam,
    xoaTrungTam,
};
