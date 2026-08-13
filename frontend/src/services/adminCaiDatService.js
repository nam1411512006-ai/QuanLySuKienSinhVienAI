import axiosClient from "../api/axiosClient";

const getCaiDat = async () => {
    return await axiosClient.get("/admin/cai-dat");
};

const capNhatCaiDat = async (data) => {
    return await axiosClient.put("/admin/cai-dat", data);
};

const getThongTinHeThong = async () => {
    return await axiosClient.get("/admin/cai-dat/thong-tin-he-thong");
};

const uploadAnh = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return await axiosClient.post("/admin/upload/anh", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

const getTrangThaiSmtp = async () => {
    return await axiosClient.get("/admin/cai-dat/trang-thai-smtp");
};

const guiEmailThu = async (emailNhan) => {
    return await axiosClient.post("/admin/cai-dat/gui-email-thu", { email_nhan: emailNhan });
};

export default {
    getCaiDat,
    capNhatCaiDat,
    getThongTinHeThong,
    uploadAnh,
    getTrangThaiSmtp,
    guiEmailThu,
};
