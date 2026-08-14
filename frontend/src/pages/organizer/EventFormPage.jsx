import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import organizerService from "../../services/organizerService";

const EventFormPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dangSua = Boolean(id);

    const [loaiSuKienList, setLoaiSuKienList] = useState([]);
    const [trungTamList, setTrungTamList] = useState([]);

    const [form, setForm] = useState({
        ma_loai_su_kien: "",
        ma_trung_tam: "",
        ten_su_kien: "",
        mo_ta: "",
        dia_diem: "",
        thoi_gian_bat_dau_dang_ky: "",
        thoi_gian_ket_thuc_dang_ky: "",
        thoi_gian_bat_dau: "",
        thoi_gian_ket_thuc: "",
        so_luong_toi_da: "",
        diem_cong: 0,
        anh_bia: "",
    });

    const [dangUploadAnh, setDangUploadAnh] = useState(false);

    useEffect(() => {

        loadDanhMuc();

        if (dangSua) {

            loadEvent();

        }

    }, []);

    const loadDanhMuc = async () => {

        try {

            const loai = await organizerService.getLoaiSuKien();
            const trungTam = await organizerService.getTrungTam();

            setLoaiSuKienList(loai);
            setTrungTamList(trungTam);

        } catch (error) {

            console.log(error);

        }

    };

    const loadEvent = async () => {

        try {

            const data = await organizerService.getEvent(id);

            setForm({
                ma_loai_su_kien: data.ma_loai_su_kien || "",
                ma_trung_tam: data.ma_trung_tam || "",
                ten_su_kien: data.ten_su_kien || "",
                mo_ta: data.mo_ta || "",
                dia_diem: data.dia_diem || "",
                thoi_gian_bat_dau_dang_ky: chuyenSangDatetimeLocal(data.thoi_gian_bat_dau_dang_ky),
                thoi_gian_ket_thuc_dang_ky: chuyenSangDatetimeLocal(data.thoi_gian_ket_thuc_dang_ky),
                thoi_gian_bat_dau: chuyenSangDatetimeLocal(data.thoi_gian_bat_dau),
                thoi_gian_ket_thuc: chuyenSangDatetimeLocal(data.thoi_gian_ket_thuc),
                so_luong_toi_da: data.so_luong_toi_da || "",
                diem_cong: data.diem_cong || 0,
                anh_bia: data.anh_bia || "",
            });

        } catch (error) {

            console.log(error);

        }

    };

    // Chuyển "2026-08-10T09:00:00" thành dạng "2026-08-10T09:00" mà ô input datetime-local cần
    const chuyenSangDatetimeLocal = (value) => {

        if (!value) {

            return "";

        }

        return value.slice(0, 16);

    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleChonAnhBia = async (e) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        try {

            setDangUploadAnh(true);

            const res = await organizerService.uploadAnh(file);

            setForm((prev) => ({
                ...prev,
                anh_bia: res.url,
            }));

        } catch (error) {

            console.log(error);

            alert(error.message || "Tải ảnh lên thất bại, vui lòng thử lại.");

        } finally {

            setDangUploadAnh(false);

            e.target.value = "";

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const data = {
            ma_loai_su_kien: Number(form.ma_loai_su_kien),
            ma_trung_tam: Number(form.ma_trung_tam),
            ten_su_kien: form.ten_su_kien,
            mo_ta: form.mo_ta,
            dia_diem: form.dia_diem,
            thoi_gian_bat_dau_dang_ky: form.thoi_gian_bat_dau_dang_ky || null,
            thoi_gian_ket_thuc_dang_ky: form.thoi_gian_ket_thuc_dang_ky || null,
            thoi_gian_bat_dau: form.thoi_gian_bat_dau,
            thoi_gian_ket_thuc: form.thoi_gian_ket_thuc,
            so_luong_toi_da: form.so_luong_toi_da ? Number(form.so_luong_toi_da) : null,
            diem_cong: Number(form.diem_cong),
            anh_bia: form.anh_bia || null,
        };

        try {

            if (dangSua) {

                await organizerService.updateEvent(id, data);

            } else {

                await organizerService.createEvent(data);

            }

            navigate("/organizer/events");

        } catch (error) {

            console.log(error);

            alert("Co loi xay ra, vui long kiem tra lai du lieu");

        }

    };

    return (

        <div className="container mt-4" style={{ maxWidth: "600px" }}>

            <h3 className="mb-3">
                {dangSua ? "Chỉnh sửa sự kiện" : "Thêm sự kiện"}
            </h3>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label className="form-label">Ảnh bìa sự kiện</label>

                    {form.anh_bia && (

                        <div className="mb-2">
                            <img
                                src={
                                    form.anh_bia.startsWith("http")
                                        ? form.anh_bia
                                        : `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/uploads/${form.anh_bia}`
                                }
                                alt="Ảnh bìa"
                                style={{ maxWidth: "100%", maxHeight: "220px", borderRadius: "10px", display: "block", objectFit: "cover" }}
                            />
                        </div>

                    )}

                    <input
                        type="file"
                        className="form-control"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={handleChonAnhBia}
                        disabled={dangUploadAnh}
                    />

                    {dangUploadAnh && (
                        <small className="text-muted">Đang tải ảnh lên...</small>
                    )}

                </div>

                <div className="mb-3">

                    <label className="form-label">Tên sự kiện</label>

                    <input
                        type="text"
                        className="form-control"
                        name="ten_su_kien"
                        value={form.ten_su_kien}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">Mô tả</label>

                    <textarea
                        className="form-control"
                        name="mo_ta"
                        value={form.mo_ta}
                        onChange={handleChange}
                        rows={3}
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">Địa điểm</label>

                    <input
                        type="text"
                        className="form-control"
                        name="dia_diem"
                        value={form.dia_diem}
                        onChange={handleChange}
                    />

                </div>

                <div className="row mb-3">

                    <div className="col">

                        <label className="form-label">Loại sự kiện</label>

                        <select
                            className="form-select"
                            name="ma_loai_su_kien"
                            value={form.ma_loai_su_kien}
                            onChange={handleChange}
                            required
                        >

                            <option value="">-- Chọn --</option>

                            {

                                loaiSuKienList.map((item) => (

                                    <option
                                        key={item.ma_loai_su_kien}
                                        value={item.ma_loai_su_kien}
                                    >

                                        {item.ten_loai_su_kien}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="col">

                        <label className="form-label">Trung tâm tổ chức</label>

                        <select
                            className="form-select"
                            name="ma_trung_tam"
                            value={form.ma_trung_tam}
                            onChange={handleChange}
                            required
                        >

                            <option value="">-- Chọn --</option>

                            {

                                trungTamList.map((item) => (

                                    <option
                                        key={item.ma_trung_tam}
                                        value={item.ma_trung_tam}
                                    >

                                        {item.ten_trung_tam}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                </div>

                <div className="row mb-3">

                    <div className="col">

                        <label className="form-label">Thời gian mở đăng ký</label>

                        <input
                            type="datetime-local"
                            className="form-control"
                            name="thoi_gian_bat_dau_dang_ky"
                            value={form.thoi_gian_bat_dau_dang_ky}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="col">

                        <label className="form-label">Thời gian đóng đăng ký</label>

                        <input
                            type="datetime-local"
                            className="form-control"
                            name="thoi_gian_ket_thuc_dang_ky"
                            value={form.thoi_gian_ket_thuc_dang_ky}
                            onChange={handleChange}
                            required
                        />

                    </div>

                </div>

                <div className="row mb-3">

                    <div className="col">

                        <label className="form-label">Thời gian bắt đầu (diễn ra)</label>

                        <input
                            type="datetime-local"
                            className="form-control"
                            name="thoi_gian_bat_dau"
                            value={form.thoi_gian_bat_dau}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="col">

                        <label className="form-label">Thời gian kết thúc (diễn ra)</label>

                        <input
                            type="datetime-local"
                            className="form-control"
                            name="thoi_gian_ket_thuc"
                            value={form.thoi_gian_ket_thuc}
                            onChange={handleChange}
                            required
                        />

                    </div>

                </div>

                <div className="row mb-3">

                    <div className="col">

                        <label className="form-label">Số lượng tối đa</label>

                        <input
                            type="number"
                            className="form-control"
                            name="so_luong_toi_da"
                            value={form.so_luong_toi_da}
                            onChange={handleChange}
                            min={0}
                        />

                    </div>

                    <div className="col">

                        <label className="form-label">Điểm rèn luyện cộng</label>

                        <input
                            type="number"
                            className="form-control"
                            name="diem_cong"
                            value={form.diem_cong}
                            onChange={handleChange}
                            min={0}
                        />

                    </div>

                </div>

                <button type="submit" className="btn btn-primary me-2">
                    Lưu
                </button>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/organizer/events")}
                >
                    Hủy
                </button>

            </form>

        </div>

    );

};

export default EventFormPage;