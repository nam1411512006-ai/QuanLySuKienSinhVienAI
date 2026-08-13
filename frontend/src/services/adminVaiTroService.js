import axiosClient from "../api/axiosClient";

const getDanhSach = async () => {
    return await axiosClient.get("/admin/vai-tro");
};

const taoVaiTro = async (data) => {
    return await axiosClient.post("/admin/vai-tro", data);
};

const capNhatVaiTro = async (maVaiTro, data) => {
    return await axiosClient.put(`/admin/vai-tro/${maVaiTro}`, data);
};

const xoaVaiTro = async (maVaiTro) => {
    return await axiosClient.delete(`/admin/vai-tro/${maVaiTro}`);
};

export default {
    getDanhSach,
    taoVaiTro,
    capNhatVaiTro,
    xoaVaiTro,
};
