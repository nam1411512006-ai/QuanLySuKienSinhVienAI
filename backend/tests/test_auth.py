from conftest import client


def test_login_success():
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "nam.cn10032@sv.edu.vn",
            "password": "10032"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "nam.cn10032@sv.edu.vn"