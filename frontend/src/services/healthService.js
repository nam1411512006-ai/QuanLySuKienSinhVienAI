import axiosClient from "../api/axiosClient";

export const healthService = {
    check: () => axiosClient.get("/health"),
};
