import axiosClient from "../api/axiosClient";

const organizerService = {
    getDashboard() {
        return axiosClient.get("/organizer/dashboard");
    },

    getEvents() {
        return axiosClient.get("/organizer/events");
    },

    getEvent(id) {
        return axiosClient.get(`/organizer/events/${id}`);
    },

    createEvent(data) {
        return axiosClient.post("/organizer/events", data);
    },

    updateEvent(id, data) {
        return axiosClient.put(`/organizer/events/${id}`, data);
    },

    deleteEvent(id) {
        return axiosClient.delete(`/organizer/events/${id}`);
    },

    uploadAnh(file) {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post("/organizer/upload/anh", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    getRegistrations(maSuKien) {
        return axiosClient.get(`/organizer/events/${maSuKien}/dang-ky`);
    },
    taoPhienQR(maSuKien) {
        return axiosClient.post(`/organizer/events/${maSuKien}/qr`);
    },
    getLoaiSuKien() {
        return axiosClient.get("/organizer/loai-su-kien");
    },

    getTrungTam() {
        return axiosClient.get("/organizer/trung-tam");
    },
    getDanhGia(maSuKien) {
        return axiosClient.get(`/organizer/events/${maSuKien}/danh-gia`);
    },
    getReports() {
        return axiosClient.get("/organizer/reports");
    },
    getDiemRenLuyen(maSuKien) {
        return axiosClient.get(`/organizer/events/${maSuKien}/diem-ren-luyen`);
    },
    xuLyVangMat(maSuKien) {
        return axiosClient.post(`/organizer/events/${maSuKien}/xu-ly-vang-mat`);
    },
};

export default organizerService;