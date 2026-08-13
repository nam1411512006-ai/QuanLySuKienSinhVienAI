import {
    useEffect,
    useState,
} from "react";

import NotificationContext from "./NotificationContext";
import thongBaoService from "../services/thongBaoService";

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);

    // =====================================================
    // LOAD DANH SÁCH THÔNG BÁO
    // =====================================================

    const loadThongBao = async () => {
        try {
            const data =
                await thongBaoService.getDanhSachThongBao();

            const unreadData =
                await thongBaoService.getSoThongBaoChuaDoc();

            console.log("===== DANH SÁCH =====");
            console.log(data);

            console.log("===== API CHƯA ĐỌC =====");
            console.log(unreadData);

            const homNay = new Date();

            const result = data.map((item) => {
                const ngay = new Date(
                    item.thoi_gian_gui
                );

                const diff = Math.floor(
                    (homNay - ngay) /
                    (1000 * 60 * 60 * 24)
                );

                let nhom = "tuantruoc";

                if (diff === 0) {
                    nhom = "homnay";
                } else if (diff === 1) {
                    nhom = "homqua";
                }

                return {
                    id: item.ma_nhan,

                    maThongBao:
                        item.ma_thong_bao,

                    // Trang thông báo
                    tieuDe: item.tieu_de,
                    noiDung: item.noi_dung,
                    loai: item.loai_thong_bao,
                    daDoc: item.da_doc,
                    thoiGian:
                        ngay.toLocaleString(),
                    nhom,

                    // Header
                    title: item.tieu_de,
                    content: item.noi_dung,
                    unread: !item.da_doc,
                    time: ngay.toLocaleString(),
                };
            });

            setNotifications(result);

            const soLuong =
                unreadData.soLuongChuaDoc ??
                unreadData.so_luong ??
                0;

            console.log("===== UNREAD =====");
            console.log(soLuong);

            setUnread(soLuong);
        } catch (error) {
            console.error(
                "Lỗi tải thông báo:",
                error
            );
        }
    };

    // =====================================================
    // ĐÁNH DẤU ĐÃ ĐỌC
    // =====================================================

    const danhDauDaDoc = async (id) => {
        try {
            await thongBaoService.danhDauDaDoc(id);

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            daDoc: true,
                            unread: false,
                        }
                        : item
                )
            );

            setUnread((prev) =>
                prev > 0 ? prev - 1 : 0
            );
        } catch (error) {
            console.error(error);
        }
    };

    // =====================================================
    // ĐÁNH DẤU TẤT CẢ
    // =====================================================

    const danhDauTatCa = async () => {
        try {
            await thongBaoService.danhDauTatCa();

            setNotifications((prev) =>
                prev.map((item) => ({
                    ...item,
                    daDoc: true,
                    unread: false,
                }))
            );

            setUnread(0);
        } catch (error) {
            console.error(error);
        }
    };

    // =====================================================
    // LOAD LẦN ĐẦU
    // =====================================================

    useEffect(() => {
        loadThongBao();
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unread,
                loadThongBao,
                danhDauDaDoc,
                danhDauTatCa,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;