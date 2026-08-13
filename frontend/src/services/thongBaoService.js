import axiosClient from "../api/axiosClient";


// Lấy danh sách thông báo
const getDanhSachThongBao = async () => {

    const response = await axiosClient.get(
        "/thong-bao"
    );

    return response;

};


// Lấy số thông báo chưa đọc
const getSoThongBaoChuaDoc = async () => {

    const response = await axiosClient.get(
        "/thong-bao/chua-doc"
    );

    return response;

};


// Đánh dấu một thông báo đã đọc
const danhDauDaDoc = async (maNhan) => {

    const response = await axiosClient.put(
        `/thong-bao/${maNhan}/da-doc`
    );

    return response;

};


// Đánh dấu tất cả đã đọc
const danhDauTatCa = async () => {

    const response = await axiosClient.put(
        "/thong-bao/da-doc-tat-ca"
    );

    return response;

};




const getById = async (id) => {

    const response = await axiosClient.get(
        `/thong-bao/chi-tiet/${id}`
    );

    return response;

};

export default {

    getDanhSachThongBao,

    getSoThongBaoChuaDoc,

    danhDauDaDoc,

    danhDauTatCa,

    getById

};