def test_create_piece_responds_201_when_body_is_valid(client):
    response = client.post(
        "/api/pieces", json={"name": "La persistencia de la memoria", "artist": "Dalí", "year": 1931}
    )

    assert response.status_code == 201
    assert response.json() == {"id": 2, "name": "La persistencia de la memoria", "artist": "Dalí", "year": 1931}


def test_create_piece_responds_422_when_name_is_blank(client):
    response = client.post("/api/pieces", json={"name": "  ", "artist": "Dalí", "year": 1931})

    assert response.status_code == 422
    assert response.json()["detail"] == "name is required"


def test_get_piece_responds_404_when_piece_does_not_exist(client):
    response = client.get("/api/pieces/99")

    assert response.status_code == 404
