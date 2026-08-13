import React from "react";
import ReactDOM from "react-dom/client";
import NotificationProvider from "./contexts/NotificationProvider";

// ================================
// Import Bootstrap
// Chức năng:
// Sử dụng Bootstrap để xây dựng giao diện và Responsive
// Khi demo:
// Giới thiệu dự án kết hợp ReactJS và Bootstrap
// ================================
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// ================================
// Import CSS dùng chung của toàn hệ thống
// Chức năng:
// Định nghĩa giao diện chung cho toàn bộ website
// Khi demo:
// Giới thiệu Global CSS được áp dụng cho tất cả các trang
// ================================
import "./assets/css/global.css";

// ================================
// Component gốc của ứng dụng
// Chức năng:
// Sau khi React khởi tạo sẽ render App
// App sẽ quản lý Router và toàn bộ giao diện
// Khi demo:
// Chỉ vào App và nói đây là Component gốc
// ================================
import App from "./App";

// ================================
// Điểm khởi đầu của ứng dụng React
// React sẽ render App vào thẻ <div id="root">
// trong file index.html
//
// Khi demo:
// Giới thiệu đây là Entry Point của toàn bộ hệ thống
// ================================
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </React.StrictMode>
);