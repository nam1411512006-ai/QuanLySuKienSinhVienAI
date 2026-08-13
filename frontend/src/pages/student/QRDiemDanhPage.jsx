import { useRef, useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "../../assets/css/qr-checkin.css";
import diemDanhService from "../../services/diemDanhService";

const QRDiemDanhPage = () => {
    const qrRef = useRef(null);
    const scanner = useRef(null);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const startScanner = async () => {

        if (scanner.current) return;

        setLoading(true);

        scanner.current = new Html5Qrcode("reader");

        try {

            await scanner.current.start(
                {
                    facingMode: "environment"
                },
                {
                    fps: 10,
                    qrbox: 250
                },

                async (decodedText) => {

                    await scanner.current.stop();

                    scanner.current = null;

                    try {

                        const res = await diemDanhService.diemDanh(decodedText);

                        const user = JSON.parse(localStorage.getItem("user")) || {};

                        setResult({

                            qr: decodedText,

                            hoTen: user.ho_ten || "",

                            mssv: user.mssv || "",

                            suKien: res.ten_su_kien,

                            thoiGian: new Date(res.thoi_gian_quet).toLocaleString("vi-VN"),

                            trangThai: res.trang_thai === "ThanhCong"
                                ? "Đã điểm danh"
                                : res.trang_thai,

                        });

                    } catch (err) {

                        alert(err.message || "Điểm danh thất bại.");

                    } finally {

                        setLoading(false);

                    }

                },

                () => { }

            );

        }
        catch {

            setLoading(false);

            alert("Không thể mở camera.");

        }

    };

    const stopScanner = async () => {

        if (scanner.current) {

            await scanner.current.stop();

            scanner.current = null;

        }

        setLoading(false);

    };

    useEffect(() => {

        return () => {

            stopScanner();

        };

    }, []);

    return (

        <div className="qr-page">

            <div className="qr-card">

                <div className="qr-header">

                    <div>

                        <h2>📷 QR Điểm Danh</h2>

                        <p>

                            Đưa mã QR của sự kiện vào camera để điểm danh.

                        </p>

                    </div>

                    <div className="status waiting">

                        {loading ? "Đang quét..." : "Sẵn sàng"}

                    </div>

                </div>

                <div
                    id="reader"
                    ref={qrRef}
                    className="camera-box"
                ></div>

                <div className="btn-group">

                    <button
                        className="scan-btn"
                        onClick={startScanner}
                    >
                        📷 Bật Camera
                    </button>

                    {
                        loading &&

                        <button
                            className="stop-btn"
                            onClick={stopScanner}
                        >
                            ✖ Dừng Camera
                        </button>

                    }

                </div>

                {

                    result &&

                    <div className="success-box">

                        <div className="success-title">

                            ✅ Điểm danh thành công

                        </div>

                        <div className="info-row">

                            <span>Họ tên</span>

                            <strong>{result.hoTen}</strong>

                        </div>

                        <div className="info-row">

                            <span>MSSV</span>

                            <strong>{result.mssv}</strong>

                        </div>

                        <div className="info-row">

                            <span>Sự kiện</span>

                            <strong>{result.suKien}</strong>

                        </div>

                        <div className="info-row">

                            <span>Thời gian</span>

                            <strong>{result.thoiGian}</strong>

                        </div>

                        <div className="info-row">

                            <span>Trạng thái</span>

                            <strong className="success-status">

                                {result.trangThai}

                            </strong>

                        </div>

                    </div>

                }

            </div>

        </div>

    );

};

export default QRDiemDanhPage;