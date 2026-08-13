import axiosClient from "../api/axiosClient";

const getDanhSach = async (params) => {
    return await axiosClient.get("/admin/tai-khoan", { params });
};

const getThongKe = async () => {
    return await axiosClient.get("/admin/tai-khoan/thong-ke");
};

const taoTaiKhoan = async (data) => {
    return await axiosClient.post("/admin/tai-khoan", data);
};

const capNhatTaiKhoan = async (maTaiKhoan, data) => {
    return await axiosClient.put(`/admin/tai-khoan/${maTaiKhoan}`, data);
};

const doiTrangThai = async (maTaiKhoan) => {
    return await axiosClient.patch(`/admin/tai-khoan/${maTaiKhoan}/trang-thai`);
};

const xoaTaiKhoan = async (maTaiKhoan) => {
    return await axiosClient.delete(`/admin/tai-khoan/${maTaiKhoan}`);
};

export default {
    getDanhSach,
    getThongKe,
    taoTaiKhoan,
    capNhatTaiKhoan,
    doiTrangThai,
    xoaTaiKhoan,
};
