import axiosClient from "../api/axiosClient";

const getDanhSach = async (params) => {
    return await axiosClient.get("/admin/su-kien", { params });
};

const getThongKe = async () => {
    return await axiosClient.get("/admin/su-kien/thong-ke");
};

const khoaMoSuKien = async (maSuKien) => {
    return await axiosClient.patch(`/admin/su-kien/${maSuKien}/khoa`);
};

const xoaSuKien = async (maSuKien) => {
    return await axiosClient.delete(`/admin/su-kien/${maSuKien}`);
};

export default {
    getDanhSach,
    getThongKe,
    khoaMoSuKien,
    xoaSuKien,
};
