import {
    FaSearch,
    FaSortAmountDown,
    FaThLarge,
    FaList,
} from "react-icons/fa";

import "../../assets/css/event-toolbar.css";

const ThanhCongCuSuKien = ({
    keyword,
    setKeyword,
    tongSuKien = 0,
    sapXep,
    setSapXep,
    cheDoHienThi = "grid",
    setCheDoHienThi = () => { },
}) => {

    return (

        <div className="thanh-cong-cu">

            <div className="toolbar-trai">

                <h2>

                    Khám phá sự kiện

                </h2>

                <span>

                    Có <strong>{tongSuKien}</strong> sự kiện

                </span>

            </div>

            <div className="toolbar-phai">

                <div className="toolbar-search">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                    />

                </div>

                <select
                    value={sapXep}
                    onChange={(e) =>
                        setSapXep(e.target.value)
                    }
                >

                    <option value="">

                        Mặc định

                    </option>

                    <option value="newest">

                        Mới nhất

                    </option>

                    <option value="oldest">

                        Cũ nhất

                    </option>

                    <option value="score">

                        Điểm cao nhất

                    </option>

                </select>

                <div className="toolbar-view">

                    <button
                        className={
                            cheDoHienThi === "grid"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setCheDoHienThi("grid")
                        }
                    >

                        <FaThLarge />

                    </button>

                    <button
                        className={
                            cheDoHienThi === "list"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setCheDoHienThi("list")
                        }
                    >

                        <FaList />

                    </button>

                </div>

            </div>

        </div>

    );

};

export default ThanhCongCuSuKien;