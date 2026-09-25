import pytest

from app.service import NotFoundError, PiecesService, ValidationError, validate_piece
from tests.fakes import MemoryRepository


def test_validate_piece_returns_trimmed_data_when_piece_is_valid():
    # Arrange
    data = {"name": "  Guernica ", "artist": "Picasso", "year": 1937}

    # Act
    piece = validate_piece(data, current_year=2026)

    # Assert
    assert piece == {"name": "Guernica", "artist": "Picasso", "year": 1937}


@pytest.mark.parametrize(
    ("data", "message"),
    [
        ({"name": " ", "artist": "Picasso", "year": 1937}, "name is required"),
        ({"name": "Guernica", "artist": None, "year": 1937}, "artist is required"),
        ({"name": "Future", "artist": "Nobody", "year": 2027}, "year cannot be in the future"),
    ],
)
def test_validate_piece_raises_error_when_data_is_invalid(data, message):
    with pytest.raises(ValidationError, match=message):
        validate_piece(data, current_year=2026)


def test_get_raises_not_found_when_piece_does_not_exist():
    service = PiecesService(MemoryRepository())

    with pytest.raises(NotFoundError):
        service.get(99)


def test_remove_raises_not_found_when_piece_does_not_exist():
    service = PiecesService(MemoryRepository())

    with pytest.raises(NotFoundError):
        service.remove(99)
