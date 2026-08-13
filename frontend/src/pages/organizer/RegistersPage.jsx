import { useEffect, useState } from "react";
import organizerService from "../../services/organizerService";

const RegistersPage = () => {

    const [events, setEvents] = useState([]);
    const [maSuKien, setMaSuKien] = useState("");
    const [registrations, setRegistrations] = useState([]);

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

    const loadRegistrations = async (id) => {

        if (!id) {

            setRegistrations([]);

            return;

        }

        try {

            const response = await organizerService.getRegistrations(id);

            setRegistrations(response);

        } catch (error) {

            console.log(error);

        }

    };

    const handleChangeEvent = (e) => {

        const id = e.target.value;

        setMaSuKien(id);

        loadRegistrations(id);

    };

    const handleXuLyVangMat = async () => {

        const xacNhan = window.confirm(
            "Xac nhan xu ly vang mat cho su kien nay? Hanh dong nay se tru diem cac sinh vien khong diem danh."
        );

        if (!xacNhan) {

            return;

        }

        try {

            const ketQua = await organizerService.xuLyVangMat(maSuKien);

            alert(`Da xu ly ${ketQua.so_luong_vang_mat} sinh vien vang mat, moi nguoi bi tru ${ketQua.diem_tru_moi_nguoi} diem`);

            loadRegistrations(maSuKien);

        } catch (error) {

            console.log(error);

            alert(error.message || "Xu ly that bai");

        }

    };

    return (

        <div className="container mt-4">

            <h3 className="mb-3">Quản lý đăng ký</h3>

            <div className="d-flex justify-content-between align-items-end mb-3">

                <div style={{ flex: 1 }}>

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

                        <button
                            className="btn btn-outline-danger ms-3"
                            onClick={handleXuLyVangMat}
                        >

                            Xử lý vắng mặt

                        </button>

                    )

                }

            </div>

            {

                maSuKien && (

                    <table className="table table-bordered">

                        <thead>

                            <tr>

                                <th>MSSV</th>

                                <th>Họ tên</th>

                                <th>Email</th>

                                <th>Thời gian đăng ký</th>

                                <th>Trạng thái</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                registrations.length === 0 ? (

                                    <tr>

                                        <td colSpan="5" className="text-center">

                                            Chưa có sinh viên nào đăng ký

                                        </td>

                                    </tr>

                                ) : (

                                    registrations.map((item) => (

                                        <tr key={item.ma_dang_ky}>

                                            <td>{item.mssv}</td>

                                            <td>{item.ho_ten}</td>

                                            <td>{item.email}</td>

                                            <td>
                                                {new Date(item.thoi_gian_dang_ky).toLocaleString("vi-VN")}
                                            </td>

                                            <td>{item.trang_thai}</td>

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

export default RegistersPage;