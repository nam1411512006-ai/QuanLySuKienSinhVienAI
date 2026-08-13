import { BrowserRouter, Routes, Route } from "react-router-dom";

import StudentLayout from "../layouts/StudentLayout";

import DangNhapPage from "../pages/auth/DangNhapPage";

import TrangChuPage from "../pages/student/TrangChuPage";
import DanhSachSuKienPage from "../pages/student/DanhSachSuKienPage";
import ChiTietSuKienPage from "../pages/student/ChiTietSuKienPage";
import DangKySuKienPage from "../pages/student/DangKySuKienPage";
import SuKienCuaToiPage from "../pages/student/SuKienCuaToiPage";
import QRDiemDanhPage from "../pages/student/QRDiemDanhPage";
import DiemRenLuyenPage from "../pages/student/DiemRenLuyenPage";
import AIChatPage from "../pages/student/AIChatPage";
import HoSoPage from "../pages/student/HoSoPage";
import DanhGiaPage from "../pages/student/DanhGiaPage";
import ThongBaoPage from "../pages/student/ThongBaoPage";
import ChiTietThongBaoPage from "../pages/student/ChiTietThongBaoPage";
import OrganizerLayout from "../layouts/OrganizerLayout";
import DashboardPage from "../pages/organizer/DashboardPage";
import EventManagementPage from "../pages/organizer/EventManagementPage";
import EventFormPage from "../pages/organizer/EventFormPage";
import RegistersPage from "../pages/organizer/RegistersPage";
import QRDisplayPage from "../pages/organizer/QRDisplayPage";
import ReviewsPage from "../pages/organizer/ReviewsPage";
import NotificationsPage from "../pages/organizer/NotificationsPage";
import ReportsPage from "../pages/organizer/ReportsPage";
import ProfilePage from "../pages/organizer/ProfilePage";
import TrainingPointsPage from "../pages/organizer/TrainingPointsPage";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AccountManagement from "../pages/admin/AccountManagement";
import OrganizerManagement from "../pages/admin/OrganizerManagement";
import StudentManagement from "../pages/admin/StudentManagement";
import CategoryManagement from "../pages/admin/CategoryManagement";
import EventManagement from "../pages/admin/EventManagement";
import NotificationManagement from "../pages/admin/NotificationManagement";
import ReportManagement from "../pages/admin/ReportManagement";
import RoleManagement from "../pages/admin/RoleManagement";
import SettingManagement from "../pages/admin/SettingManagement";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<DangNhapPage />} />

                <Route element={<StudentLayout />}>

                    <Route path="/trang-chu" element={<TrangChuPage />} />

                    <Route path="/su-kien" element={<DanhSachSuKienPage />} />

                    <Route path="/su-kien/:id" element={<ChiTietSuKienPage />} />

                    <Route
                        path="/dang-ky-su-kien/:maSuKien"
                        element={<DangKySuKienPage />}
                    />

                    <Route path="/su-kien-cua-toi" element={<SuKienCuaToiPage />} />

                    <Route path="/qr-diem-danh" element={<QRDiemDanhPage />} />

                    <Route path="/diem-ren-luyen" element={<DiemRenLuyenPage />} />

                    <Route path="/ai-chat" element={<AIChatPage />} />

                    <Route path="/ho-so" element={<HoSoPage />} />

                    <Route path="/danh-gia" element={<DanhGiaPage />} />

                    <Route path="/thong-bao" element={<ThongBaoPage />} />

                    <Route path="/thong-bao/:id" element={<ChiTietThongBaoPage />} />

                </Route>
                <Route path="/organizer" element={<OrganizerLayout />}>

                    <Route
                        path="dashboard"
                        element={<DashboardPage />}
                    />
                    <Route
                        path="/organizer/events"
                        element={<EventManagementPage />}
                    />
                    <Route
                        path="/organizer/events/new"
                        element={<EventFormPage />}
                    />
                    <Route
                        path="/organizer/events/edit/:id"
                        element={<EventFormPage />}
                    />
                    <Route
                        path="/organizer/registers"
                        element={<RegistersPage />}
                    />
                    <Route
                        path="/organizer/attendance"
                        element={<QRDisplayPage />}
                    />
                    <Route
                        path="/organizer/training-points"
                        element={<TrainingPointsPage />}
                    />
                    <Route
                        path="/organizer/reviews"
                        element={<ReviewsPage />}
                    />
                    <Route
                        path="/organizer/notifications"
                        element={<NotificationsPage />}
                    />
                    <Route
                        path="/organizer/reports"
                        element={<ReportsPage />}
                    />
                    <Route
                        path="/organizer/profile"
                        element={<ProfilePage />}
                    />

                </Route>

                <Route path="/admin" element={<AdminLayout />}>

                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="accounts" element={<AccountManagement />} />
                    <Route path="organizers" element={<OrganizerManagement />} />
                    <Route path="students" element={<StudentManagement />} />
                    <Route path="categories" element={<CategoryManagement />} />
                    <Route path="events" element={<EventManagement />} />
                    <Route path="notifications" element={<NotificationManagement />} />
                    <Route path="reports" element={<ReportManagement />} />
                    <Route path="roles" element={<RoleManagement />} />
                    <Route path="settings" element={<SettingManagement />} />

                </Route>


            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;