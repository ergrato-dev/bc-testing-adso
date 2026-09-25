GUERNICA = {"id": 1, "name": "Guernica", "artist": "Picasso", "year": 1937}


def test_list_pieces_responds_200_with_all_pieces(client):
    response = client.get("/api/pieces")

    assert response.status_code == 200
    assert response.json() == [GUERNICA]


def test_get_piece_responds_200_when_piece_exists(client):
    response = client.get("/api/pieces/1")

    assert response.status_code == 200
    assert response.json() == GUERNICA


def test_get_piece_responds_404_when_piece_does_not_exist(client):
    response = client.get("/api/pieces/99")

    assert response.status_code == 404
    assert response.json()["detail"] == "piece not found"


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


def test_delete_piece_responds_204_when_piece_exists(client):
    response = client.delete("/api/pieces/1")

    assert response.status_code == 204


def test_delete_piece_responds_404_when_piece_does_not_exist(client):
    response = client.delete("/api/pieces/99")

    assert response.status_code == 404
