// Import axiosClient đã được cấu hình sẵn
// axiosClient chứa:
// - Base URL của FastAPI
// - Timeout
// - Tự động gắn JWT Token
// - Xử lý lỗi chung cho toàn bộ hệ thống
import axiosClient from "./axiosClient";

// ======================================================
// PROFILE API
// ======================================================
// File này có nhiệm vụ quản lý các API liên quan
// đến thông tin cá nhân của sinh viên.
//
// Thay vì gọi axios trực tiếp trong Component,
// nhóm tách riêng thành Service Layer để:
// - Mã nguồn rõ ràng
// - Dễ bảo trì
// - Dễ tái sử dụng
// ======================================================
const profileApi = {

    // ==========================================
    // Lấy thông tin cá nhân của người dùng
    // ==========================================
    // Method: GET
    // API:
    // /tai-khoan/profile
    //
    // Backend sẽ trả về:
    // - Họ tên
    // - MSSV
    // - Email
    // - Khoa
    // - Lớp
    // - Ảnh đại diện
    // ...
    //
    // Được gọi khi người dùng mở trang Hồ sơ cá nhân
    getProfile() {
        return axiosClient.get("/tai-khoan/profile");
    },

    // ==========================================
    // Cập nhật thông tin cá nhân
    // ==========================================
    // Method: PUT
    //
    // data chứa các thông tin cần cập nhật
    // Ví dụ:
    // {
    //    hoTen,
    //    email,
    //    soDienThoai,
    //    diaChi,
    //    avatar
    // }
    //
    // Backend sẽ cập nhật dữ liệu trong MySQL
    updateProfile(data) {
        return axiosClient.put("/tai-khoan/profile", data);
    },

    // ==========================================
    // Đổi mật khẩu
    // ==========================================
    // Method: PUT
    //
    // data thường bao gồm:
    // {
    //    matKhauCu,
    //    matKhauMoi,
    //    xacNhanMatKhau
    // }
    //
    // Backend sẽ:
    // - Kiểm tra mật khẩu cũ
    // - Mã hóa mật khẩu mới
    // - Cập nhật vào cơ sở dữ liệu
    changePassword(data) {
        return axiosClient.put("/tai-khoan/change-password", data);
    },

    // ==========================================
    // Tải ảnh đại diện mới
    // ==========================================
    // Method: POST (multipart/form-data)
    // Trả về profile mới nhất (đã có anh_dai_dien cập nhật)
    uploadAvatar(file) {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post("/tai-khoan/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

// Export để các Component hoặc Page khác sử dụng
export default profileApi;