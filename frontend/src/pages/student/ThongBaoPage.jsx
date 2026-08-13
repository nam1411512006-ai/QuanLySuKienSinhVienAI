import { useEffect, useMemo, useState } from "react";
import ThongBaoCard from "../../components/notification/ThongBaoCard";

import "../../assets/css/notification.css";
import useNotification from "../../hooks/useNotification";

const ThongBaoPage = () => {

    const [filter, setFilter] = useState("tatca");



    const [loading, setLoading] = useState(true);
    const {
        notifications,
        loadThongBao,
        danhDauDaDoc,
        danhDauTatCa,
    } = useNotification();

    // =====================================================
    // LOAD THÔNG BÁO
    // =====================================================

    useEffect(() => {

        const load = async () => {

            try {

                await loadThongBao();

            } finally {

                setLoading(false);

            }

        };

        load();

    }, []);



    // =====================================================
    // CHƯA ĐỌC
    // =====================================================

    const unreadCount =
        notifications.filter(
            item => !item.daDoc
        ).length;

    // =====================================================
    // ĐÁNH DẤU TẤT CẢ
    // =====================================================

    const markAllRead = async () => {

        try {

            await danhDauTatCa();

        }

        catch (error) {

            console.error(error);

        }

    };

    // =====================================================
    // LỌC
    // =====================================================

    const filteredNotifications = useMemo(() => {

        return notifications.filter(item => {

            if (filter === "chuadoc")
                return !item.daDoc;

            if (filter === "dadoc")
                return item.daDoc;

            return true;

        });

    }, [notifications, filter]);

    // =====================================================
    // NHÓM
    // =====================================================

    const renderGroup = (title, key) => {

        const list = filteredNotifications.filter(

            item => item.nhom === key

        );

        if (list.length === 0)
            return null;

        return (

            <div className="notification-group">

                <h3 className="notification-group-title">

                    {title}

                </h3>

                {

                    list.map(item => (

                        <ThongBaoCard

                            key={item.id}

                            id={item.id}

                            tieuDe={item.tieuDe}

                            noiDung={item.noiDung}

                            thoiGian={item.thoiGian}

                            loai={item.loai}

                            daDoc={item.daDoc}


                            onRead={async (id) => {

                                try {

                                    await danhDauDaDoc(id);

                                }

                                catch (error) {

                                    console.error(error);

                                }

                            }}


                        />
                    ))

                }

            </div>

        );

    };
    return (

        <div className="notification-page">

            <div className="notification-header">

                <div>

                    <h2>🔔 Thông báo</h2>

                    <p>
                        Bạn có <strong>{unreadCount}</strong> thông báo chưa đọc.
                    </p>

                </div>

                <button
                    className="mark-read-btn"
                    onClick={markAllRead}
                >
                    Đánh dấu tất cả đã đọc
                </button>

            </div>

            <div className="notification-toolbar">

                <div className="notification-filter">

                    <button
                        className={filter === "tatca" ? "active" : ""}
                        onClick={() => setFilter("tatca")}
                    >
                        Tất cả
                    </button>

                    <button
                        className={filter === "chuadoc" ? "active" : ""}
                        onClick={() => setFilter("chuadoc")}
                    >
                        Chưa đọc
                    </button>

                    <button
                        className={filter === "dadoc" ? "active" : ""}
                        onClick={() => setFilter("dadoc")}
                    >
                        Đã đọc
                    </button>

                </div>

            </div>

            {
                loading ? (

                    <div className="empty-notification">

                        <h3>Đang tải...</h3>

                    </div>

                ) : filteredNotifications.length === 0 ? (

                    <div className="empty-notification">

                        <h3>Không có thông báo</h3>

                        <p>
                            Hiện chưa có thông báo phù hợp.
                        </p>

                    </div>

                ) : (

                    <>

                        {renderGroup("Hôm nay", "homnay")}

                        {renderGroup("Hôm qua", "homqua")}

                        {renderGroup("Tuần trước", "tuantruoc")}

                    </>

                )
            }

        </div>

    );

};

export default ThongBaoPage;