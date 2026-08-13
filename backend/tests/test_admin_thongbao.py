from conftest import client

ADMIN_EMAIL = "admin@truong.edu.vn"
ADMIN_PASSWORD = "admin123"


def _admin_token() -> str:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def _auth_headers() -> dict:
    return {"Authorization": f"Bearer {_admin_token()}"}


def test_khong_co_token_bi_tu_choi():
    response = client.get("/api/v1/admin/thong-bao")
    assert response.status_code in (401, 403)


def test_danh_sach_thong_bao():
    response = client.get("/api/v1/admin/thong-bao", headers=_auth_headers())

    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

    item = data[0]
    assert "ma_thong_bao" in item
    assert "so_nguoi_nhan" in item
    assert "so_da_doc" in item


def test_thong_ke_thong_bao():
    response = client.get("/api/v1/admin/thong-bao/thong-ke", headers=_auth_headers())

    assert response.status_code == 200

    data = response.json()
    assert data["tong_thong_bao"] > 0
    assert data["tong_luot_nhan"] >= 0
    assert 0 <= data["ty_le_da_doc"] <= 100


def test_tao_va_xoa_thong_bao_gui_toan_bo_sinh_vien():
    headers = _auth_headers()

    payload = {
        "tieu_de": "[TEST] Thong bao kiem thu tu dong",
        "noi_dung": "Day la thong bao duoc tao boi bo test tu dong.",
        "loai_thong_bao": "HeThong",
        "doi_tuong_nhan": "SinhVien",
    }

    tao_res = client.post("/api/v1/admin/thong-bao", json=payload, headers=headers)
    assert tao_res.status_code == 200

    tb = tao_res.json()
    assert tb["tieu_de"] == payload["tieu_de"]
    assert tb["so_nguoi_nhan"] > 0
    assert tb["so_da_doc"] == 0

    ma_thong_bao = tb["ma_thong_bao"]

    # Xem chi tiet: phai co danh sach nguoi nhan tuong ung
    chi_tiet_res = client.get(f"/api/v1/admin/thong-bao/{ma_thong_bao}", headers=headers)
    assert chi_tiet_res.status_code == 200

    chi_tiet = chi_tiet_res.json()
    assert len(chi_tiet["nguoi_nhan"]) == tb["so_nguoi_nhan"]
    assert all(nn["da_doc"] is False for nn in chi_tiet["nguoi_nhan"])

    # Xoa thong bao vua tao, don dep du lieu test
    xoa_res = client.delete(f"/api/v1/admin/thong-bao/{ma_thong_bao}", headers=headers)
    assert xoa_res.status_code == 200

    # Sau khi xoa, xem chi tiet phai tra ve 404
    sau_xoa_res = client.get(f"/api/v1/admin/thong-bao/{ma_thong_bao}", headers=headers)
    assert sau_xoa_res.status_code == 404


def test_tao_thong_bao_theo_su_kien_khong_gui_ma_su_kien_bi_loi():
    headers = _auth_headers()

    payload = {
        "tieu_de": "[TEST] Thong bao theo su kien thieu ma",
        "noi_dung": "Noi dung kiem thu.",
        "loai_thong_bao": "SuKien",
        "doi_tuong_nhan": "SuKien",
    }

    response = client.post("/api/v1/admin/thong-bao", json=payload, headers=headers)
    assert response.status_code == 400
