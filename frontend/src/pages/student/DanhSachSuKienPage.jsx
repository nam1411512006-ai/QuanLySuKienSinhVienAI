import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import BannerSuKien from "../../components/event/BannerSuKien";
import BoLocSuKien from "../../components/event/BoLocSuKien";
import ThanhCongCuSuKien from "../../components/event/ThanhCongCuSuKien";
import DanhSachSuKien from "../../components/event/DanhSachSuKien";

import suKienService from "../../services/suKienService";

import "../../assets/css/sukien.css";
import "../../assets/css/banner.css";
import "../../assets/css/event-filter.css";
import "../../assets/css/event-toolbar.css";

const DanhSachSuKienPage = () => {

    const [searchParams] = useSearchParams();

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [keyword, setKeyword] = useState(
        searchParams.get("keyword") || ""
    );

    const [loai, setLoai] = useState("");

    const [trangThai, setTrangThai] = useState("");

    const [diem, setDiem] = useState(0);

    const [sapXep, setSapXep] = useState("");

    const [cheDoHienThi, setCheDoHienThi] = useState("grid");

    useEffect(() => {

        const fetchEvents = async () => {

            try {

                const data = await suKienService.getAll();

                setEvents(data);

            }
            catch (err) {

                setError(
                    err.message ||
                    "Không thể tải danh sách sự kiện."
                );

            }
            finally {

                setLoading(false);

            }

        };

        fetchEvents();

    }, []);

    useEffect(() => {

        setKeyword(
            searchParams.get("keyword") || ""
        );

    }, [searchParams]);

    const filteredEvents = useMemo(() => {

        let result = [...events];

        if (keyword.trim() !== "") {

            const search = keyword.toLowerCase();

            result = result.filter((item) =>

                item.ten_su_kien?.toLowerCase().includes(search) ||

                item.mo_ta?.toLowerCase().includes(search) ||

                item.dia_diem?.toLowerCase().includes(search)

            );

        }

        if (loai !== "") {

            result = result.filter(

                item => item.ten_loai_su_kien === loai

            );

        }

        if (trangThai !== "") {

            result = result.filter(

                item => item.trang_thai === trangThai

            );

        }

        result = result.filter(

            item => Number(item.diem_cong) >= diem

        );

        switch (sapXep) {

            case "newest":

                result.sort(

                    (a, b) =>

                        new Date(b.thoi_gian_bat_dau) -

                        new Date(a.thoi_gian_bat_dau)

                );

                break;

            case "oldest":

                result.sort(

                    (a, b) =>

                        new Date(a.thoi_gian_bat_dau) -

                        new Date(b.thoi_gian_bat_dau)

                );

                break;

            case "score":

                result.sort(

                    (a, b) =>

                        b.diem_cong - a.diem_cong

                );

                break;

            default:

                break;

        }

        return result;

    }, [

        events,

        keyword,

        loai,

        trangThai,

        diem,

        sapXep,

    ]);

    const resetBoLoc = () => {

        setKeyword("");

        setLoai("");

        setTrangThai("");

        setDiem(0);

        setSapXep("");

    };

    return (

        <div className="trang-su-kien">

            <BannerSuKien
                tongSuKien={filteredEvents.length}
            />

            <div className="noi-dung-su-kien">

                <BoLocSuKien

                    keyword={keyword}

                    setKeyword={setKeyword}

                    loai={loai}

                    setLoai={setLoai}

                    trangThai={trangThai}

                    setTrangThai={setTrangThai}

                    diem={diem}

                    setDiem={setDiem}

                    onReset={resetBoLoc}

                />

                <div className="khu-su-kien">

                    <ThanhCongCuSuKien

                        keyword={keyword}

                        setKeyword={setKeyword}

                        tongSuKien={filteredEvents.length}

                        sapXep={sapXep}

                        setSapXep={setSapXep}

                        cheDoHienThi={cheDoHienThi}

                        setCheDoHienThi={setCheDoHienThi}

                    />

                    {

                        loading && (

                            <div className="loading-box">

                                Đang tải dữ liệu...

                            </div>

                        )

                    }

                    {

                        error && (

                            <div className="error-box">

                                {error}

                            </div>

                        )

                    }

                    {

                        !loading &&
                        !error && (

                            <DanhSachSuKien
                                danhSach={filteredEvents}
                                cheDoHienThi={cheDoHienThi}
                            />

                        )

                    }

                </div>

            </div>

        </div>

    );

};

export default DanhSachSuKienPage;