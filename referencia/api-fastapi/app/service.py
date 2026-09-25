"""Reglas de negocio de las piezas del museo.

No sabe nada de HTTP ni de la BD: recibe un repositorio por parámetro,
así se puede probar con un repositorio en memoria (semanas 2 y 5).
"""

from datetime import date


class ValidationError(Exception):
    pass


class NotFoundError(Exception):
    pass


def validate_piece(data: dict, current_year: int | None = None) -> dict:
    current_year = current_year or date.today().year
    name = (data.get("name") or "").strip()
    artist = (data.get("artist") or "").strip()
    if not name:
        raise ValidationError("name is required")
    if not artist:
        raise ValidationError("artist is required")
    if data["year"] > current_year:
        raise ValidationError("year cannot be in the future")
    return {"name": name, "artist": artist, "year": data["year"]}


class PiecesService:
    def __init__(self, repository):
        self.repository = repository

    def list(self) -> list[dict]:
        return self.repository.find_all()

    def get(self, piece_id: int) -> dict:
        piece = self.repository.find_by_id(piece_id)
        if piece is None:
            raise NotFoundError("piece not found")
        return piece

    def create(self, data: dict) -> dict:
        return self.repository.create(validate_piece(data))

    def remove(self, piece_id: int) -> None:
        if not self.repository.delete(piece_id):
            raise NotFoundError("piece not found")
