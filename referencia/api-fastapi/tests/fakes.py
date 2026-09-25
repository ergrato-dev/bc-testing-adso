"""Dobles de prueba compartidos por los tests."""


class MemoryRepository:
    """Repositorio falso (fake): mismo contrato, sin BD ni Docker."""

    def __init__(self, initial: list[dict] | None = None):
        self.pieces = {p["id"]: p for p in initial or []}
        self.next_id = max(self.pieces, default=0) + 1

    def find_all(self) -> list[dict]:
        return list(self.pieces.values())

    def find_by_id(self, piece_id: int) -> dict | None:
        return self.pieces.get(piece_id)

    def create(self, data: dict) -> dict:
        piece = {"id": self.next_id, **data}
        self.pieces[piece["id"]] = piece
        self.next_id += 1
        return piece

    def delete(self, piece_id: int) -> bool:
        return self.pieces.pop(piece_id, None) is not None
