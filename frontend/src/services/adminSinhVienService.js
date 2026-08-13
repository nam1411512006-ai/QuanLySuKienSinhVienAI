import axiosClient from "../api/axiosClient";

const getDanhSach = async (params) => {
    return await axiosClient.get("/admin/sinh-vien", { params });
};

const getThongKe = async () => {
    return await axiosClient.get("/admin/sinh-vien/thong-ke");
};

const taoSinhVien = async (data) => {
    return await axiosClient.post("/admin/sinh-vien", data);
};

const capNhatSinhVien = async (maTaiKhoan, data) => {
    return await axiosClient.put(`/admin/sinh-vien/${maTaiKhoan}`, data);
};

const doiTrangThai = async (maTaiKhoan) => {
    return await axiosClient.patch(`/admin/sinh-vien/${maTaiKhoan}/trang-thai`);
};

const xoaSinhVien = async (maTaiKhoan) => {
    return await axiosClient.delete(`/admin/sinh-vien/${maTaiKhoan}`);
};

const getDiemRenLuyen = async (maTaiKhoan) => {
    return await axiosClient.get(`/admin/sinh-vien/${maTaiKhoan}/diem-ren-luyen`);
};

const getSuKienDaThamGia = async (maTaiKhoan) => {
    return await axiosClient.get(`/admin/sinh-vien/${maTaiKhoan}/su-kien`);
};

export default {
    getDanhSach,
    getThongKe,
    taoSinhVien,
    capNhatSinhVien,
    doiTrangThai,
    xoaSinhVien,
    getDiemRenLuyen,
    getSuKienDaThamGia,
};
