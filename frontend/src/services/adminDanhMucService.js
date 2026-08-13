import axiosClient from "../api/axiosClient";

const getDanhSach = async (params) => {
    return await axiosClient.get("/admin/danh-muc", { params });
};

const getThongKe = async () => {
    return await axiosClient.get("/admin/danh-muc/thong-ke");
};

const taoDanhMuc = async (data) => {
    return await axiosClient.post("/admin/danh-muc", data);
};

const capNhatDanhMuc = async (maLoaiSuKien, data) => {
    return await axiosClient.put(`/admin/danh-muc/${maLoaiSuKien}`, data);
};

const doiTrangThai = async (maLoaiSuKien) => {
    return await axiosClient.patch(`/admin/danh-muc/${maLoaiSuKien}/trang-thai`);
};

const xoaDanhMuc = async (maLoaiSuKien) => {
    return await axiosClient.delete(`/admin/danh-muc/${maLoaiSuKien}`);
};

export default {
    getDanhSach,
    getThongKe,
    taoDanhMuc,
    capNhatDanhMuc,
    doiTrangThai,
    xoaDanhMuc,
};
