from conftest import client


def test_get_all_su_kien():
    response = client.get("/api/v1/su-kien")

    assert response.status_code == 200
    assert isinstance(response.json(), list)