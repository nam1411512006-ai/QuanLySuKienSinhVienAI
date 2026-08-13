import {
    PersonPlusFill,
    CalendarEventFill,
    CheckCircleFill,
} from "react-bootstrap-icons";

const thoiGianTruoc = (thoiGianIso) => {
    if (!thoiGianIso) return "";

    const giay = Math.floor((Date.now() - new Date(thoiGianIso).getTime()) / 1000);

    if (giay < 60) return "Vừa xong";
    if (giay < 3600) return `${Math.floor(giay / 60)} phút trước`;
    if (giay < 86400) return `${Math.floor(giay / 3600)} giờ trước`;
    return `${Math.floor(giay / 86400)} ngày trước`;
};

const CAU_HINH_LOAI = {
    dang_ky: { icon: <PersonPlusFill />, color: "primary" },
    su_kien_moi: { icon: <CalendarEventFill />, color: "success" },
    diem_danh: { icon: <CheckCircleFill />, color: "warning" },
};

const DashboardRecentActivity = ({ hoatDongGanDay = [] }) => {

    return (

        <div className="dashboard-activity-card">

            <div className="dashboard-activity-header">

                <h3>

                    Hoạt động gần đây

                </h3>

                <p>

                    Những thay đổi mới nhất của hệ thống

                </p>

            </div>

            <div className="dashboard-activity-list">

                {

                    hoatDongGanDay.map((item, idx) => {

                        const cauHinh = CAU_HINH_LOAI[item.loai] || CAU_HINH_LOAI.dang_ky;

                        return (

                            <div
                                key={`${item.loai}-${idx}`}
                                className="dashboard-activity-item"
                            >

                                <div
                                    className={`dashboard-activity-icon ${cauHinh.color}`}
                                >

                                    {cauHinh.icon}

                                </div>

                                <div className="dashboard-activity-content">

                                    <h4>

                                        {item.noi_dung}

                                    </h4>

                                    <span>

                                        {thoiGianTruoc(item.thoi_gian)}

                                    </span>

                                </div>

                            </div>

                        );
                    })

                }

                {hoatDongGanDay.length === 0 && (
                    <p style={{ padding: "12px 20px", color: "#888" }}>Chưa có hoạt động nào.</p>
                )}

            </div>

        </div>

    );

};

export default DashboardRecentActivity;
