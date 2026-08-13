import { useEffect, useState } from "react";
import organizerService from "../../services/organizerService";

const ReviewsPage = () => {

    const [events, setEvents] = useState([]);
    const [maSuKien, setMaSuKien] = useState("");
    const [danhGiaList, setDanhGiaList] = useState([]);

    useEffect(() => {

        loadEvents();

    }, []);

    const loadEvents = async () => {

        try {

            const response = await organizerService.getEvents();

            setEvents(response);

        } catch (error) {

            console.log(error);

        }

    };

    const loadDanhGia = async (id) => {

        if (!id) {

            setDanhGiaList([]);

            return;

        }

        try {

            const response = await organizerService.getDanhGia(id);

            setDanhGiaList(response);

        } catch (error) {

            console.log(error);

        }

    };

    const handleChangeEvent = (e) => {

        const id = e.target.value;

        setMaSuKien(id);

        loadDanhGia(id);

    };

    const veSao = (soSao) => {

        return "⭐".repeat(soSao) + "☆".repeat(5 - soSao);

    };

    const diemTrungBinh = () => {

        if (danhGiaList.length === 0) {

            return 0;

        }

        const tong = danhGiaList.reduce((sum, item) => sum + item.so_sao, 0);

        return (tong / danhGiaList.length).toFixed(1);

    };

    return (

        <div className="container mt-4">

            <h3 className="mb-3">Đánh giá sự kiện</h3>

            <div className="mb-3">

                <label className="form-label">Chọn sự kiện</label>

                <select
                    className="form-select"
                    value={maSuKien}
                    onChange={handleChangeEvent}
                >

                    <option value="">-- Chọn sự kiện --</option>

                    {

                        events.map((item) => (

                            <option
                                key={item.ma_su_kien}
                                value={item.ma_su_kien}
                            >

                                {item.ten_su_kien}

                            </option>

                        ))

                    }

                </select>

            </div>

            {

                maSuKien && (

                    <>

                        <p>

                            Điểm trung bình: <b>{diemTrungBinh()} / 5</b>
                            {" "}({danhGiaList.length} đánh giá)

                        </p>

                        {

                            danhGiaList.length === 0 ? (

                                <p className="text-center text-muted">
                                    Chưa có đánh giá nào
                                </p>

                            ) : (

                                danhGiaList.map((item) => (

                                    <div
                                        key={item.ma_danh_gia}
                                        className="card mb-2"
                                    >

                                        <div className="card-body">

                                            <div className="d-flex justify-content-between">

                                                <b>{item.ho_ten}</b>

                                                <span>{veSao(item.so_sao)}</span>

                                            </div>

                                            <p className="mb-0 mt-2">

                                                {item.noi_dung || "(Không có nội dung)"}

                                            </p>

                                        </div>

                                    </div>

                                ))

                            )

                        }

                    </>

                )

            }

        </div>

    );

};

export default ReviewsPage;