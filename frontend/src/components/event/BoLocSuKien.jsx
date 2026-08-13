import {
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaFlag,
    FaStar,
    FaRedo,
} from "react-icons/fa";

import "../../assets/css/event-filter.css";

const BoLocSuKien = ({
    keyword = "",
    setKeyword = () => { },
    loai = "",
    setLoai = () => { },
    trangThai = "",
    setTrangThai = () => { },
    diem = 0,
    setDiem = () => { },
    onReset = () => { },
}) => {

    return (

        <aside className="bo-loc-su-kien">

            <div className="tieu-de-bo-loc">

                <FaFilter />

                <h3>Bộ lọc</h3>

            </div>

            <div className="nhom-bo-loc">

                <label>

                    <FaSearch />

                    Tìm kiếm

                </label>

                <input
                    type="text"
                    placeholder="Nhập tên sự kiện..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

            </div>

            <div className="nhom-bo-loc">

                <label>

                    <FaCalendarAlt />

                    Loại sự kiện

                </label>

                <select
                    value={loai}
                    onChange={(e) => setLoai(e.target.value)}
                >

                    <option value="">
                        Tất cả
                    </option>

                    <option value="HocThuat">
                        Học thuật
                    </option>

                    <option value="VanNghe">
                        Văn nghệ
                    </option>

                    <option value="TheThao">
                        Thể thao
                    </option>

                    <option value="TinhNguyen">
                        Tình nguyện
                    </option>

                </select>

            </div>

            <div className="nhom-bo-loc">

                <label>

                    <FaFlag />

                    Trạng thái

                </label>

                <select
                    value={trangThai}
                    onChange={(e) => setTrangThai(e.target.value)}
                >

                    <option value="">
                        Tất cả
                    </option>

                    <option value="DangMo">
                        Đang mở
                    </option>

                    <option value="SapDienRa">
                        Sắp diễn ra
                    </option>

                    <option value="DaKetThuc">
                        Đã kết thúc
                    </option>

                </select>

            </div>

            <div className="nhom-bo-loc">

                <label>

                    <FaStar />

                    Điểm rèn luyện

                </label>

                <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={diem}
                    onChange={(e) => setDiem(Number(e.target.value))}
                />

                <span className="gia-tri-diem">

                    Từ <strong>{diem}</strong> điểm

                </span>

            </div>

            <button
                className="nut-xoa-bo-loc"
                onClick={onReset}
            >

                <FaRedo />

                Xóa bộ lọc

            </button>

        </aside>

    );

};

export default BoLocSuKien;