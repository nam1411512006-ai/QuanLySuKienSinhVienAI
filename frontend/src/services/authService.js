import axiosClient from "../api/axiosClient";

export const authService = {
    login: (data) => axiosClient.post("/auth/login", data),
};