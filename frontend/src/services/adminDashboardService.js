import axiosClient from "../api/axiosClient";

const getDashboard = async () => {
    return await axiosClient.get("/admin/dashboard");
};

export default {
    getDashboard,
};
