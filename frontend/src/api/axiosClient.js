// Import thư viện Axios để thực hiện các HTTP Request đến Backend
import axios from "axios";

// =====================================================
// ĐỊA CHỈ BACKEND
// =====================================================
//
// Local:
// VITE_API_URL chưa được khai báo
// => http://127.0.0.1:8000
//
// Docker:
// VITE_API_URL có thể được cấu hình
// => địa chỉ Backend tương ứng
//
const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// =====================================================
// TẠO AXIOS CLIENT
// =====================================================

const axiosClient = axios.create({

    // Địa chỉ gốc của REST API FastAPI
    baseURL: `${API_URL}/api/v1`,

    // Thời gian chờ tối đa là 10 giây
    timeout: 10000,

    // Header mặc định gửi lên Backend
    headers: {
        "Content-Type": "application/json",
    },
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

axiosClient.interceptors.request.use(
    (config) => {

        // Lấy Access Token sau khi đăng nhập
        const token = localStorage.getItem("access_token");

        // Nếu người dùng đã đăng nhập
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

axiosClient.interceptors.response.use(

    // Request thành công
    (response) => {
        return response.data;
    },

    // Request thất bại
    (error) => {

        const message =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Không thể kết nối máy chủ";

        return Promise.reject(new Error(message));
    }
);

// =====================================================
// EXPORT
// =====================================================

export default axiosClient;