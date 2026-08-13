import { useEffect, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import organizerService from "../../services/organizerService";

const QRDisplayPage = () => {

    const [events, setEvents] = useState([]);
    const [maSuKien, setMaSuKien] = useState("");
    const [phienQR, setPhienQR] = useState(null);
    const [dangChay, setDangChay] = useState(false);
    const [demNguoc, setDemNguoc] = useState(60);

    const timerRef = useRef(null);
    const demNguocRef = useRef(null);

    useEffect(() => {

        loadEvents();

        return () => {

            dungTuDong();

        };

    }, []);

    const loadEvents = async () => {

        try {

            const response = await organizerService.getEvents();

            setEvents(response);

        } catch (error) {

            console.log(error);

        }

    };

    const taoQRMoi = async (id) => {

        try {

            const response = await organizerService.taoPhienQR(id);

            setPhienQR(response);

            setDemNguoc(60);

        } catch (error) {

            console.log(error);

        }

    };

    const batDauTuDong = () => {

        if (!maSuKien) {

            alert("Vui long chon su kien truoc");

            return;

        }

        setDangChay(true);

        // Tạo QR đầu tiên ngay lập tức
        taoQRMoi(maSuKien);

        // Cứ 60 giây, tự tạo QR mới
        timerRef.current = setInterval(() => {

            taoQRMoi(maSuKien);

        }, 60000);

        // Cứ 1 giây, giảm số đếm ngược hiển thị cho người dùng biết
        demNguocRef.current = setInterval(() => {

            setDemNguoc((prev) => (prev > 0 ? prev - 1 : 60));

        }, 1000);

    };

    const dungTuDong = () => {

        if (timerRef.current) {

            clearInterval(timerRef.current);

            timerRef.current = null;

        }

        if (demNguocRef.current) {

            clearInterval(demNguocRef.current);

            demNguocRef.current = null;

        }

        setDangChay(false);

    };

    return (

        <div className="container mt-4 text-center">

            <h3 className="mb-3">Điểm danh QR Code</h3>

            <div className="mb-3" style={{ maxWidth: "400px", margin: "0 auto" }}>

                <select
                    className="form-select"
                    value={maSuKien}
                    disabled={dangChay}
                    onChange={(e) => setMaSuKien(e.target.value)}
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

                !dangChay ? (

                    <button
                        className="btn btn-primary"
                        onClick={batDauTuDong}
                    >

                        Bắt đầu điểm danh

                    </button>

                ) : (

                    <button
                        className="btn btn-danger"
                        onClick={dungTuDong}
                    >

                        Dừng điểm danh

                    </button>

                )

            }

            {

                phienQR && (

                    <div className="mt-4">

                        <QRCodeSVG
                            value={phienQR.ma_qr}
                            size={280}
                        />

                        <p className="mt-3">

                            Mã QR tự làm mới sau: <b>{demNguoc}s</b>

                        </p>
                        <p style={{ wordBreak: "break-all", fontSize: "12px", color: "#888" }}>
    (Debug) ma_qr: {phienQR.ma_qr}
</p>

                    </div>

                )

            }

        </div>

    );

};

export default QRDisplayPage;