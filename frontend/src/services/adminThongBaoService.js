import axiosClient from "../api/axiosClient";

const getDanhSach = async (params) => {
    return await axiosClient.get("/admin/thong-bao", { params });
};

const getThongKe = async () => {
    return await axiosClient.get("/admin/thong-bao/thong-ke");
};

const getChiTiet = async (maThongBao) => {
    return await axiosClient.get(`/admin/thong-bao/${maThongBao}`);
};

const taoThongBao = async (data) => {
    return await axiosClient.post("/admin/thong-bao", data);
};

const xoaThongBao = async (maThongBao) => {
    return await axiosClient.delete(`/admin/thong-bao/${maThongBao}`);
};

export default {
    getDanhSach,
    getThongKe,
    getChiTiet,
    taoThongBao,
    xoaThongBao,
};
