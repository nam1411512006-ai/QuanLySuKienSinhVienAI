import { useEffect, useState } from "react";
import thongBaoService from "../../services/thongBaoService";

const NotificationsPage = () => {

    const [danhSach, setDanhSach] = useState([]);

    useEffect(() => {

        loadThongBao();

    }, []);

    const loadThongBao = async () => {

        try {

            const response = await thongBaoService.getDanhSachThongBao();

            setDanhSach(response);

        } catch (error) {

            console.log(error);

        }

    };

    const handleDocThongBao = async (item) => {

        try {

            if (!item.da_doc) {

                await thongBaoService.danhDauDaDoc(item.ma_nhan);

                loadThongBao();

            }

        } catch (error) {

            console.log(error);

        }

    };

    const handleDocTatCa = async () => {

        try {

            await thongBaoService.danhDauTatCa();

            loadThongBao();

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3>Thông báo</h3>

                <button className="btn btn-outline-primary btn-sm" onClick={handleDocTatCa}>
                    Đánh dấu tất cả đã đọc
                </button>

            </div>

            <ul className="list-group">

                {

                    danhSach.length === 0 ? (

                        <li className="list-group-item text-center">
                            Không có thông báo nào
                        </li>

                    ) : (

                        danhSach.map((item) => (

                            <li
                                key={item.ma_nhan}
                                className={`list-group-item ${!item.da_doc ? "list-group-item-light fw-bold" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDocThongBao(item)}
                            >

                                {item.tieu_de}

                            </li>

                        ))

                    )

                }

            </ul>

        </div>

    );

};

export default NotificationsPage;