import axiosClient from "../api/axiosClient";

const suKienService = {
    getAll: () => axiosClient.get("/su-kien"),
    getById: (id) => axiosClient.get(`/su-kien/${id}`),
};

export default suKienService;