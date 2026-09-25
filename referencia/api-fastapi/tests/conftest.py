import pytest
from fastapi.testclient import TestClient

from app.main import app, get_repository
from tests.fakes import MemoryRepository


@pytest.fixture
def repository():
    return MemoryRepository([{"id": 1, "name": "Guernica", "artist": "Picasso", "year": 1937}])


@pytest.fixture
def client(repository):
    # Reemplaza el repositorio de BD por uno en memoria solo durante el test
    app.dependency_overrides[get_repository] = lambda: repository
    yield TestClient(app)
    app.dependency_overrides.clear()
