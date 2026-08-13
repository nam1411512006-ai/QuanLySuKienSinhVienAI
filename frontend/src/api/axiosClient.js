// Import thư viện Axios để thực hiện các HTTP Request đến Backend
import axios from "axios";

// Tạo một đối tượng Axios dùng chung cho toàn bộ dự án
const axiosClient = axios.create({

    // Địa chỉ gốc của REST API FastAPI
    // Khi gọi axiosClient.get("/su-kien")
    // ==> Request thực tế sẽ là:
    // http://127.0.0.1:8000/api/v1/su-kien
    baseURL: "http://127.0.0.1:8000/api/v1",

    // Thời gian chờ tối đa là 10 giây
    // Nếu Backend không phản hồi trong thời gian này sẽ báo lỗi Timeout
    timeout: 10000,

    // Header mặc định gửi lên Backend
    headers: {
        "Content-Type": "application/json",
    },
});

// ==========================
// REQUEST INTERCEPTOR
// ==========================
// Hàm này sẽ được chạy TRƯỚC MỌI REQUEST gửi đến Backend
axiosClient.interceptors.request.use((config) => {

    // Lấy Access Token đã lưu sau khi đăng nhập
    const token = localStorage.getItem("access_token");

    // Nếu người dùng đã đăng nhập
    if (token) {

        // Tự động thêm Authorization Header
        // Backend FastAPI sẽ dùng JWT để xác thực người dùng
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Trả lại cấu hình Request để Axios tiếp tục gửi đi
    return config;
});

// ==========================
// RESPONSE INTERCEPTOR
// ==========================
// Hàm này chạy SAU KHI Backend trả kết quả về
axiosClient.interceptors.response.use(

    // Nếu Request thành công
    (response) =>

        // Chỉ trả về phần data
        // Không cần response.status, response.headers,...
        response.data,

    // Nếu Request thất bại
    (error) => {

        // Lấy thông báo lỗi từ Backend nếu có
        const message =
            error.response?.data?.detail ||
            error.response?.data?.message ||

            // Nếu Backend không phản hồi thì dùng thông báo mặc định
            "Không thể kết nối máy chủ";

        // Trả lỗi về cho Component xử lý
        return Promise.reject(new Error(message));
    }
);

// Export axiosClient để các Service khác sử dụng
export default axiosClient;