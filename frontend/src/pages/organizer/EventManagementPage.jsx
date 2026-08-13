import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import organizerService from "../../services/organizerService";

const EventManagementPage = () => {

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);

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

    const handleThem = () => {

        navigate("/organizer/events/new");

    };

    const handleSua = (id) => {

        navigate(`/organizer/events/edit/${id}`);

    };

    const handleXoa = async (id) => {

        const xacNhan = window.confirm("Ban co chac chan muon xoa su kien nay?");

        if (!xacNhan) {

            return;

        }

        try {

            await organizerService.deleteEvent(id);

            loadEvents();

        } catch (error) {

            console.log(error);

            alert("Xoa that bai, vui long thu lai");

        }

    };

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3>Quản lý sự kiện</h3>

                <button className="btn btn-primary" onClick={handleThem}>

                    Thêm sự kiện

                </button>

            </div>

            <table className="table table-bordered">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Tên sự kiện</th>

                        <th>Địa điểm</th>

                        <th>Điểm RL</th>

                        <th>Trạng thái</th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {

                        events.map((item) => (

                            <tr key={item.ma_su_kien}>

                                <td>{item.ma_su_kien}</td>

                                <td>{item.ten_su_kien}</td>

                                <td>{item.dia_diem}</td>

                                <td>{item.diem_cong}</td>

                                <td>{item.trang_thai}</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleSua(item.ma_su_kien)}
                                    >

                                        Sửa

                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleXoa(item.ma_su_kien)}
                                    >

                                        Xóa

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

};

export default EventManagementPage;