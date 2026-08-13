import { useEffect, useState } from "react";
import organizerService from "../../services/organizerService";

const ReportsPage = () => {

    const [data, setData] = useState([]);

    useEffect(() => {

        loadReports();

    }, []);

    const loadReports = async () => {

        try {

            const response = await organizerService.getReports();

            setData(response);

        } catch (error) {

            console.log(error);

        }

    };

    const mauTyLe = (tyLe) => {

        if (tyLe >= 70) {

            return "success";

        }

        if (tyLe >= 40) {

            return "warning";

        }

        return "danger";

    };

    return (

        <div className="container mt-4">

            <h3 className="mb-3">Thống kê</h3>

            <table className="table table-bordered">

                <thead>

                    <tr>

                        <th>Tên sự kiện</th>

                        <th>Số đăng ký</th>

                        <th>Số điểm danh</th>

                        <th>Tỷ lệ tham gia</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        data.length === 0 ? (

                            <tr>

                                <td colSpan="4" className="text-center">
                                    Chưa có dữ liệu
                                </td>

                            </tr>

                        ) : (

                            data.map((item) => (

                                <tr key={item.ma_su_kien}>

                                    <td>{item.ten_su_kien}</td>

                                    <td>{item.so_luong_dang_ky}</td>

                                    <td>{item.so_luong_diem_danh}</td>

                                    <td>

                                        <span className={`badge bg-${mauTyLe(item.ty_le_diem_danh)}`}>

                                            {item.ty_le_diem_danh}%

                                        </span>

                                    </td>

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

};

export default ReportsPage;