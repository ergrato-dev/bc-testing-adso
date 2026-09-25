# Receta — TDD en FastAPI con pytest

> Grupos FastAPI · Tiempo estimado: 2.5 h

Código: [`referencia/api-fastapi/`](../../../../referencia/api-fastapi/). No necesitas Docker: el filtro se construye sobre el servicio con el repositorio falso.

```bash
cd referencia/api-fastapi
uv sync
uv run pytest --no-cov -q
```

Durante los ciclos usa `--no-cov -q`: la salida es corta y el umbral de cobertura no se mezcla con el rojo del ciclo. Al final corre `uv run pytest` completo.

**La historia**: como visitante del museo, quiero filtrar la lista por artista (`GET /api/pieces?artist=picasso`), sin importar mayúsculas ni espacios, para encontrar sus obras.

Lista de pruebas (teoría 2):

```text
[ ] filtra por el nombre exacto del artista
[ ] no importan las mayúsculas
[ ] no importan los espacios alrededor
[ ] si el artista viene en blanco, devuelve todo
[ ] el API recibe el filtro como ?artist=
```

---

## Ciclo 1: filtra por el nombre exacto

**Red**. Agrega al final de [`tests/test_service.py`](../../../../referencia/api-fastapi/tests/test_service.py):

```python
GUERNICA = {"id": 1, "name": "Guernica", "artist": "Picasso", "year": 1937}
MENINAS = {"id": 2, "name": "Las meninas", "artist": "Velázquez", "year": 1656}


def test_list_returns_only_the_pieces_of_the_given_artist():
    # Arrange
    service = PiecesService(MemoryRepository([GUERNICA, MENINAS]), notifier=None)

    # Act
    pieces = service.list("Picasso")

    # Assert
    assert pieces == [GUERNICA]
```

Falla con `TypeError: PiecesService.list() takes 1 positional argument but 2 were given`. En el primer ciclo es el Red correcto: el método todavía no recibe el artista.

**Green**. En [`app/service.py`](../../../../referencia/api-fastapi/app/service.py), reemplaza el método `list`:

```python
    def list(self, artist: str | None = None) -> list[dict]:
        pieces = self.repository.find_all()
        if not artist:
            return pieces
        return [piece for piece in pieces if piece["artist"] == artist]
```

Compara con `==`: ningún test pide más todavía. Los tests del API de la semana 4 siguen en verde (sin `artist`, devuelve todo).

## Ciclo 2: no importan las mayúsculas

**Red**:

```python
def test_list_ignores_case_when_filtering_by_artist():
    service = PiecesService(MemoryRepository([GUERNICA, MENINAS]), notifier=None)

    assert service.list("picasso") == [GUERNICA]
```

**Green**:

```python
        return [piece for piece in pieces if piece["artist"].lower() == artist.lower()]
```

## Ciclo 3: no importan los espacios

**Red**:

```python
def test_list_ignores_surrounding_spaces_when_filtering_by_artist():
    service = PiecesService(MemoryRepository([GUERNICA, MENINAS]), notifier=None)

    assert service.list("  Picasso ") == [GUERNICA]
```

**Green**:

```python
        return [piece for piece in pieces if piece["artist"].lower() == artist.strip().lower()]
```

## Ciclo 4: en blanco devuelve todo

**Red**:

```python
def test_list_returns_all_pieces_when_artist_is_blank():
    service = PiecesService(MemoryRepository([GUERNICA, MENINAS]), notifier=None)

    assert service.list("   ") == [GUERNICA, MENINAS]
```

Falla: `"   "` no es falso para `if not artist`, así que filtra por `""` y no encuentra nada.

**Green**. Normaliza **antes** de decidir:

```python
        wanted = (artist or "").strip().lower()
        if not wanted:
            return pieces
        return [piece for piece in pieces if piece["artist"].lower() == wanted]
```

## Refactor: el código

La normalización aparece dos veces. Extráela como función, encima de `validate_piece`:

```python
def normalize(text: str) -> str:
    """Compara nombres de artista sin importar mayúsculas ni espacios alrededor."""
    return text.strip().lower()
```

Y úsala en `list`:

```python
        wanted = normalize(artist or "")
        if not wanted:
            return pieces
        return [piece for piece in pieces if normalize(piece["artist"]) == wanted]
```

## Refactor: los tests

Los tres primeros tests son el mismo con otro dato. Reemplázalos por uno parametrizado:

```python
@pytest.mark.parametrize("artist", ["Picasso", "picasso", "  Picasso "])
def test_list_returns_only_the_pieces_of_the_given_artist(artist):
    # Arrange
    service = PiecesService(MemoryRepository([GUERNICA, MENINAS]), notifier=None)

    # Act
    pieces = service.list(artist)

    # Assert
    assert pieces == [GUERNICA]
```

Sigue en verde.

## Ciclo 5: el API recibe el filtro

**Red**. Al final de [`tests/test_api.py`](../../../../referencia/api-fastapi/tests/test_api.py), usando el fixture `repository` de `conftest.py`, que ya trae a Guernica:

```python
def test_list_pieces_responds_200_with_only_the_pieces_of_the_artist(client, repository):
    repository.create({"name": "Las meninas", "artist": "Velázquez", "year": 1656})

    response = client.get("/api/pieces", params={"artist": "picasso"})

    assert response.status_code == 200
    assert response.json() == [GUERNICA]
```

**Green**. En [`app/main.py`](../../../../referencia/api-fastapi/app/main.py), declara el parámetro de consulta:

```python
@app.get("/api/pieces")
def list_pieces(service: Service, artist: str | None = None):
    return service.list(artist)
```

FastAPI toma `artist` de la URL porque no es parte de la ruta. Corre `uv run pytest`: 18 tests en verde y el umbral de cobertura cumplido.

## Mutaciones

1. En `list`, cambia `normalize(piece["artist"]) == wanted` por `piece["artist"] == wanted`. ¿Cuántos casos del `parametrize` fallan?
2. Borra `if not wanted: return pieces`. ¿Qué tests de la semana 4 se ponen en rojo?

---

## Checklist

- [ ] Escribí la lista de pruebas antes del primer test
- [ ] Vi cada Red fallar por la razón correcta antes de escribir el Green
- [ ] Cada Green fue el cambio mínimo
- [ ] Refactoricé el código y los tests con la suite en verde
- [ ] Hice las dos mutaciones y vi qué tests las detectan
