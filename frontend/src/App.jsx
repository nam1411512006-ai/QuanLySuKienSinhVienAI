// ==============================================
// App.jsx
//
// Vai trò:
// Component gốc của toàn bộ ứng dụng React.
//
// Sau khi React được khởi tạo trong main.jsx,
// App sẽ render AppRouter.
//
// Khi demo:
// Giới thiệu đây là Component gốc,
// sau đó chuyển sang AppRouter để trình bày
// React Router.
// ==============================================

import AppRouter from "./routes/AppRouter";

function App() {
  return <AppRouter />;
}

export default App;