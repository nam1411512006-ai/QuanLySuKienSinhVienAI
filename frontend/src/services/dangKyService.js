import axiosClient from "../api/axiosClient";

// Đăng ký sự kiện
const dangKySuKien = async (maSuKien) => {
    return await axiosClient.post(`/dang-ky/${maSuKien}`);
};

// Hủy đăng ký
const huyDangKy = async (maDangKy) => {
    return await axiosClient.put(`/dang-ky/huy/${maDangKy}`);
};

// Danh sách đăng ký
const getDanhSachDangKy = async () => {
    return await axiosClient.get("/dang-ky");
};

export default {
    dangKySuKien,
    huyDangKy,
    getDanhSachDangKy,
};