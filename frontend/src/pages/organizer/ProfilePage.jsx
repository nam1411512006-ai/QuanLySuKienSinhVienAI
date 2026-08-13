import { useEffect, useState } from "react";
import taiKhoanService from "../../services/taiKhoanService";

const ProfilePage = () => {

    const [profile, setProfile] = useState(null);

    const [form, setForm] = useState({
        ho_ten: "",
        so_dien_thoai: "",
        ngay_sinh: "",
        gioi_tinh: "",
    });

    const [matKhau, setMatKhau] = useState({
        mat_khau_cu: "",
        mat_khau_moi: "",
    });

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const data = await taiKhoanService.getProfile();

            setProfile(data);

            setForm({
                ho_ten: data.ho_ten || "",
                so_dien_thoai: data.so_dien_thoai || "",
                ngay_sinh: data.ngay_sinh || "",
                gioi_tinh: data.gioi_tinh || "",
            });

        } catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await taiKhoanService.updateProfile(form);

            alert("Cap nhat thanh cong");

            loadProfile();

        } catch (error) {

            console.log(error);

            alert("Cap nhat that bai");

        }

    };

    const handleChangePassword = async (e) => {

        e.preventDefault();

        try {

            await taiKhoanService.changePassword(matKhau);

            alert("Doi mat khau thanh cong");

            setMatKhau({
                mat_khau_cu: "",
                mat_khau_moi: "",
            });

        } catch (error) {

            console.log(error);

            alert("Doi mat khau that bai, kiem tra lai mat khau cu");

        }

    };

    if (!profile) {

        return <div className="container mt-4">Dang tai...</div>;

    }

    return (

        <div className="container mt-4" style={{ maxWidth: "500px" }}>

            <h3 className="mb-3">Hồ sơ cá nhân</h3>

            <form onSubmit={handleSubmit} className="mb-5">

                <div className="mb-3">

                    <label className="form-label">Email (không đổi được)</label>

                    <input
                        type="text"
                        className="form-control"
                        value={profile.email || ""}
                        disabled
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">Họ tên</label>

                    <input
                        type="text"
                        className="form-control"
                        name="ho_ten"
                        value={form.ho_ten}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">Số điện thoại</label>

                    <input
                        type="text"
                        className="form-control"
                        name="so_dien_thoai"
                        value={form.so_dien_thoai}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">Ngày sinh</label>

                    <input
                        type="date"
                        className="form-control"
                        name="ngay_sinh"
                        value={form.ngay_sinh}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">Giới tính</label>

                    <select
                        className="form-select"
                        name="gioi_tinh"
                        value={form.gioi_tinh}
                        onChange={handleChange}
                    >

                        <option value="">-- Chọn --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nu">Nữ</option>
                        <option value="Khac">Khác</option>

                    </select>

                </div>

                <button type="submit" className="btn btn-primary">
                    Lưu thông tin
                </button>

            </form>

            <hr />

            <h4 className="mb-3 mt-4">Đổi mật khẩu</h4>

            <form onSubmit={handleChangePassword}>

                <div className="mb-3">

                    <label className="form-label">Mật khẩu cũ</label>

                    <input
                        type="password"
                        className="form-control"
                        value={matKhau.mat_khau_cu}
                        onChange={(e) => setMatKhau((prev) => ({
                            ...prev,
                            mat_khau_cu: e.target.value,
                        }))}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">Mật khẩu mới</label>

                    <input
                        type="password"
                        className="form-control"
                        value={matKhau.mat_khau_moi}
                        onChange={(e) => setMatKhau((prev) => ({
                            ...prev,
                            mat_khau_moi: e.target.value,
                        }))}
                        required
                    />

                </div>

                <button type="submit" className="btn btn-warning">
                    Đổi mật khẩu
                </button>

            </form>

        </div>

    );

};

export default ProfilePage;