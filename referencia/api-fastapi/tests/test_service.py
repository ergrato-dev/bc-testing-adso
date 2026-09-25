import pytest

from app.service import ValidationError, validate_piece


def test_validate_piece_returns_trimmed_data_when_piece_is_valid():
    # Arrange
    data = {"name": "  Guernica ", "artist": "Picasso", "year": 1937}

    # Act
    piece = validate_piece(data, current_year=2026)

    # Assert
    assert piece == {"name": "Guernica", "artist": "Picasso", "year": 1937}


def test_validate_piece_raises_error_when_year_is_in_the_future():
    data = {"name": "Future", "artist": "Nobody", "year": 2027}

    with pytest.raises(ValidationError, match="future"):
        validate_piece(data, current_year=2026)
