import CardSuKien from "./CardSuKien";

const DanhSachSuKien = ({
    danhSach = [],
    cheDoHienThi = "grid",
}) => {

    if (!danhSach || danhSach.length === 0) {

        return (

            <div className="empty-event">

                <img
                    src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                    alt="Không có sự kiện"
                    width={180}
                />

                <h2>
                    Không tìm thấy sự kiện
                </h2>

                <p>
                    Hiện chưa có sự kiện phù hợp với bộ lọc hoặc từ khóa tìm kiếm.
                </p>

            </div>

        );

    }

    return (

        <div
            className={
                cheDoHienThi === "list"
                    ? "event-list"
                    : "danh-sach-su-kien"
            }
        >

            {
                danhSach.map((item) => (

                    <CardSuKien

                        key={item.ma_su_kien}

                        id={item.ma_su_kien}

                        ten={item.ten_su_kien}

                        ngay={item.thoi_gian_bat_dau}

                        diaDiem={item.dia_diem}

                        diem={item.diem_cong || 0}

                        trangThai={item.trang_thai}

                        anhBia={item.anh_bia}

                        loaiSuKien={
                            item.ten_loai_su_kien ||
                            item.loai_su_kien ||
                            "Sự kiện"
                        }

                        soLuong={
                            Number(item.so_luong_toi_da ?? item.so_luong ?? 0)
                        }

                        daDangKy={
                            Number(item.so_luong_da_dang_ky ?? 0)
                        }

                    />

                ))
            }

        </div>

    );

};

export default DanhSachSuKien;