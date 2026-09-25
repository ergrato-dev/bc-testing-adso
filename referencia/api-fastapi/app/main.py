from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends, FastAPI, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.notifier import LogNotifier
from app.repository import SqlRepository, get_engine
from app.service import NotFoundError, PiecesService, ValidationError

app = FastAPI(title="Museo API")


class PieceIn(BaseModel):
    name: str
    artist: str
    year: int


def get_repository() -> Iterator[SqlRepository]:
    # En los tests se reemplaza con app.dependency_overrides[get_repository]
    with Session(get_engine()) as session:
        yield SqlRepository(session)


def get_notifier() -> LogNotifier:
    # En los tests se reemplaza con app.dependency_overrides[get_notifier]
    return LogNotifier()


def get_service(
    repository: Annotated[object, Depends(get_repository)],
    notifier: Annotated[object, Depends(get_notifier)],
) -> PiecesService:
    return PiecesService(repository, notifier)


Service = Annotated[PiecesService, Depends(get_service)]


# Traduce los errores del servicio a códigos HTTP
@app.exception_handler(ValidationError)
def handle_validation_error(request: Request, exc: ValidationError):
    return JSONResponse(status_code=422, content={"detail": str(exc)})


@app.exception_handler(NotFoundError)
def handle_not_found(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.get("/api/pieces")
def list_pieces(service: Service):
    return service.list()


@app.get("/api/pieces/{piece_id}")
def get_piece(piece_id: int, service: Service):
    return service.get(piece_id)


@app.post("/api/pieces", status_code=201)
def create_piece(body: PieceIn, service: Service):
    return service.create(body.model_dump())


@app.delete("/api/pieces/{piece_id}", status_code=204)
def delete_piece(piece_id: int, service: Service):
    service.remove(piece_id)
    return Response(status_code=204)
