import { useEffect, useState } from "react";
import organizerService from "../../services/organizerService";

const TrainingPointsPage = () => {

    const [events, setEvents] = useState([]);
    const [maSuKien, setMaSuKien] = useState("");
    const [danhSach, setDanhSach] = useState([]);

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

    const loadDiemRenLuyen = async (id) => {

        if (!id) {

            setDanhSach([]);

            return;

        }

        try {

            const response = await organizerService.getDiemRenLuyen(id);

            setDanhSach(response);

        } catch (error) {

            console.log(error);

        }

    };

    const handleChangeEvent = (e) => {

        const id = e.target.value;

        setMaSuKien(id);

        loadDiemRenLuyen(id);

    };

    return (

        <div className="container mt-4">

            <h3 className="mb-3">Quản lý điểm rèn luyện</h3>

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

                    <table className="table table-bordered">

                        <thead>

                            <tr>

                                <th>MSSV</th>

                                <th>Họ tên</th>

                                <th>Điểm cộng</th>

                                <th>Lý do</th>

                                <th>Thời gian</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                danhSach.length === 0 ? (

                                    <tr>

                                        <td colSpan="5" className="text-center">
                                            Chưa có ai được cộng điểm cho sự kiện này
                                        </td>

                                    </tr>

                                ) : (

                                    danhSach.map((item) => (

                                        <tr key={item.ma_lich_su}>

                                            <td>{item.mssv}</td>

                                            <td>{item.ho_ten}</td>

                                            <td>

                                                <span className="badge bg-success">
                                                    +{item.so_diem}
                                                </span>

                                            </td>

                                            <td>{item.ly_do}</td>

                                            <td>
                                                {new Date(item.thoi_gian).toLocaleString("vi-VN")}
                                            </td>

                                        </tr>

                                    ))

                                )

                            }

                        </tbody>

                    </table>

                )

            }

        </div>

    );

};

export default TrainingPointsPage;