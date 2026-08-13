import { Outlet } from "react-router-dom";
import { useState } from "react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

import "../assets/css/layout.css";

const StudentLayout = () => {

    const [moSidebarMobile, setMoSidebarMobile] = useState(false);

    return (
        <div className="student-layout">
            <Sidebar
                hienThiTrenMobile={moSidebarMobile}
                onDong={() => setMoSidebarMobile(false)}
            />

            {moSidebarMobile && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMoSidebarMobile(false)}
                />
            )}

            <div className="main-wrapper">
                <Header onToggleSidebar={() => setMoSidebarMobile((v) => !v)} />

                <main className="main-content">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default StudentLayout;