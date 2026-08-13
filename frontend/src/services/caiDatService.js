import axiosClient from "../api/axiosClient";

const getCongKhai = async () => {
    return await axiosClient.get("/cai-dat/cong-khai");
};

export default {
    getCongKhai,
};
