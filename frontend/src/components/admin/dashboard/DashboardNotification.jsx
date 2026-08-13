import {
    BellFill,
    ExclamationCircleFill,
    CheckCircleFill,
    InfoCircleFill,
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
    sukien: { type: "primary", icon: <BellFill /> },
    hethong: { type: "info", icon: <InfoCircleFill /> },
    diemdanh: { type: "success", icon: <CheckCircleFill /> },
    canhbao: { type: "warning", icon: <ExclamationCircleFill /> },
};

const layCauHinh = (loai) => CAU_HINH_LOAI[loai] || { type: "info", icon: <InfoCircleFill /> };

const DashboardNotification = ({ thongBaoGanDay = [] }) => {
    return (
        <div className="dashboard-notification-card">

            <div className="dashboard-notification-header">

                <h3>

                    <BellFill />

                    Thông báo mới

                </h3>

            </div>

            <div className="dashboard-notification-list">

                {thongBaoGanDay.map((item) => {

                    const cauHinh = layCauHinh(item.loai_thong_bao);

                    return (

                        <div
                            key={item.ma_thong_bao}
                            className="dashboard-notification-item"
                        >

                            <div
                                className={`dashboard-notification-icon ${cauHinh.type}`}
                            >

                                {cauHinh.icon}

                            </div>

                            <div className="dashboard-notification-content">

                                <h4>

                                    {item.tieu_de}

                                </h4>

                                <p>

                                    {item.noi_dung}

                                </p>

                                <span>

                                    {thoiGianTruoc(item.thoi_gian_gui)}

                                </span>

                            </div>

                        </div>

                    );
                })}

                {thongBaoGanDay.length === 0 && (
                    <p style={{ padding: "12px 20px", color: "#888" }}>Chưa có thông báo nào.</p>
                )}

            </div>

        </div>
    );
};

export default DashboardNotification;
