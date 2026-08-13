import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

import "../assets/css/admin/admin.css";

const AdminLayout = () => {

    const [moSidebarMobile, setMoSidebarMobile] = useState(false);

    return (
        <div className="admin-layout">

            <AdminSidebar
                hienThiTrenMobile={moSidebarMobile}
                onDong={() => setMoSidebarMobile(false)}
            />

            {moSidebarMobile && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setMoSidebarMobile(false)}
                />
            )}

            <div className="admin-main">

                <AdminHeader onToggleSidebar={() => setMoSidebarMobile((v) => !v)} />

                <main className="admin-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};

export default AdminLayout;