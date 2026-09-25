"""Repositorios de piezas: uno real con SQLAlchemy y uno falso en memoria.

Ambos cumplen el mismo contrato (find_all, find_by_id, create, delete).
"""

import os
from functools import cache

from sqlalchemy import String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column


class Base(DeclarativeBase):
    pass


class Piece(Base):
    __tablename__ = "pieces"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    artist: Mapped[str] = mapped_column(String(255))
    year: Mapped[int]

    def to_dict(self) -> dict:
        return {"id": self.id, "name": self.name, "artist": self.artist, "year": self.year}


@cache
def get_engine():
    # DATABASE_URL, por ejemplo:
    #   postgresql+psycopg://museo:museo@localhost:5433/museo_test
    #   mysql+pymysql://museo:museo@localhost:3307/museo_test
    engine = create_engine(os.environ["DATABASE_URL"])
    Base.metadata.create_all(engine)
    return engine


class SqlRepository:
    def __init__(self, session: Session):
        self.session = session

    def find_all(self) -> list[dict]:
        return [p.to_dict() for p in self.session.scalars(select(Piece).order_by(Piece.id))]

    def find_by_id(self, piece_id: int) -> dict | None:
        piece = self.session.get(Piece, piece_id)
        return piece.to_dict() if piece else None

    def create(self, data: dict) -> dict:
        piece = Piece(**data)
        self.session.add(piece)
        self.session.commit()
        return piece.to_dict()

    def delete(self, piece_id: int) -> bool:
        piece = self.session.get(Piece, piece_id)
        if piece is None:
            return False
        self.session.delete(piece)
        self.session.commit()
        return True


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
