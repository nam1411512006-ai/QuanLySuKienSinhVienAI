import {
    CalendarEventFill,
    PeopleFill,
    PersonWorkspace,
    CheckCircleFill,
    ArrowUpRight,
    ArrowDownRight,
} from "react-bootstrap-icons";

const dinhDangSo = (n) => (n ?? 0).toLocaleString("vi-VN");

const DashboardStatisticCards = ({ theThongKe }) => {

    if (!theThongKe) return null;

    const thayDoiSuKien = theThongKe.thay_doi_su_kien_thang_nay;

    const statistics = [
        {
            id: 1,
            title: "Tổng sự kiện",
            value: dinhDangSo(theThongKe.tong_su_kien),
            description:
                thayDoiSuKien === 0
                    ? "Không đổi so với tháng trước"
                    : `${thayDoiSuKien > 0 ? "+" : ""}${thayDoiSuKien} sự kiện so với tháng trước`,
            tang: thayDoiSuKien >= 0,
            icon: <CalendarEventFill />,
            color: "primary",
        },
        {
            id: 2,
            title: "Sinh viên",
            value: dinhDangSo(theThongKe.tong_sinh_vien),
            description: `+${dinhDangSo(theThongKe.sinh_vien_moi_thang_nay)} sinh viên mới tháng này`,
            tang: true,
            icon: <PeopleFill />,
            color: "success",
        },
        {
            id: 3,
            title: "Ban tổ chức",
            value: dinhDangSo(theThongKe.tong_ban_to_chuc),
            description: `${dinhDangSo(theThongKe.ban_to_chuc_dang_hoat_dong)} đang hoạt động`,
            tang: true,
            icon: <PersonWorkspace />,
            color: "warning",
        },
        {
            id: 4,
            title: "Điểm danh hôm nay",
            value: dinhDangSo(theThongKe.diem_danh_hom_nay),
            description: `${theThongKe.ty_le_diem_danh_hom_nay}% hoàn thành`,
            tang: theThongKe.ty_le_diem_danh_hom_nay >= 50,
            icon: <CheckCircleFill />,
            color: "danger",
        },
    ];

    return (
        <div className="dashboard-statistic-cards">

            {statistics.map((item) => (

                <div
                    key={item.id}
                    className={`dashboard-statistic-card ${item.color}`}
                >

                    <div className="dashboard-statistic-top">

                        <div className="dashboard-statistic-icon">

                            {item.icon}

                        </div>

                        {item.tang ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}

                    </div>

                    <div className="dashboard-statistic-content">

                        <span className="dashboard-statistic-title">

                            {item.title}

                        </span>

                        <h2 className="dashboard-statistic-value">

                            {item.value}

                        </h2>

                        <p className="dashboard-statistic-desc">

                            {item.description}

                        </p>

                    </div>

                </div>

            ))}

        </div>
    );
};

export default DashboardStatisticCards;
