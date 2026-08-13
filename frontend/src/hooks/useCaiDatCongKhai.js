import { useEffect, useState } from "react";
import caiDatService from "../services/caiDatService";

const MAY_CHU_ANH = "http://localhost:8000/uploads/";

export const xayDungUrlAnhCaiDat = (ten_file) => {
    if (!ten_file) return "";
    if (ten_file.startsWith("http")) return ten_file;
    return `${MAY_CHU_ANH}${ten_file}`;
};

const MAC_DINH = {
    ten_truong: "BETU Event",
    ten_viet_tat: "BETU",
    logo_url: "",
    banner_url: "",
    website: "",
    email_lien_he: "",
};

/**
 * Hook dung chung cho toan bo giao dien (sidebar, header, trang dang nhap...)
 * de hien thi logo/ten truong that su duoc admin cau hinh trong Module Cai dat.
 * Neu chua cau hinh gi, tu dong fallback ve ten mac dinh "BETU Event".
 */
export default function useCaiDatCongKhai() {
    const [caiDat, setCaiDat] = useState(MAC_DINH);
    const [daTai, setDaTai] = useState(false);

    useEffect(() => {
        let huy = false;

        caiDatService
            .getCongKhai()
            .then((data) => {
                if (huy) return;
                setCaiDat({
                    ten_truong: data.ten_truong?.trim() || MAC_DINH.ten_truong,
                    ten_viet_tat: data.ten_viet_tat?.trim() || MAC_DINH.ten_viet_tat,
                    logo_url: data.logo_url || "",
                    banner_url: data.banner_url || "",
                    website: data.website?.trim() || "",
                    email_lien_he: data.email_lien_he?.trim() || "",
                });
            })
            .catch(() => {
                // Giu gia tri mac dinh neu API loi (vi du server chua chay migration)
            })
            .finally(() => {
                if (!huy) setDaTai(true);
            });

        return () => {
            huy = true;
        };
    }, []);

    return {
        ...caiDat,
        logo_url_day_du: xayDungUrlAnhCaiDat(caiDat.logo_url),
        banner_url_day_du: xayDungUrlAnhCaiDat(caiDat.banner_url),
        daTai,
    };
}
