import axiosClient from "../api/axiosClient";

const taiKhoanService = {
    getProfile() {
        return axiosClient.get("/tai-khoan/profile");
    },

    updateProfile(data) {
        return axiosClient.put("/tai-khoan/profile", data);
    },

    changePassword(data) {
        return axiosClient.put("/tai-khoan/change-password", data);
    },

    uploadAvatar(file) {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post("/tai-khoan/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

export default taiKhoanService;