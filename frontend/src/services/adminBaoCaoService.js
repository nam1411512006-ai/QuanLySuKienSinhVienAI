import axiosClient from "../api/axiosClient";

const getBaoCao = async (params) => {
    return await axiosClient.get("/admin/bao-cao", { params });
};

export default {
    getBaoCao,
};
