# Receta — Integración en FastAPI con SQLAlchemy y rollback

> Grupos FastAPI · Tiempo estimado: 2.5 h

Código: [`referencia/api-fastapi/`](../../../../referencia/api-fastapi/). Esta semana **sí** necesitas Docker.

---

## Paso 1: Una BD de pruebas recién creada

```bash
cd referencia
docker compose down -v                        # borra lo que haya dejado otra receta
docker compose up -d --wait postgres mysql
cd api-fastapi
uv sync
uv run pytest
```

> Empieza con `down -v`: cada backend crea la tabla `pieces` a su manera. SQLAlchemy crea `id` como `INTEGER`, y si antes corriste la referencia de Spring Boot, Hibernate la dejó en `BIGINT`. Con la BD recién creada, la tabla es la que crea tu backend.

## Paso 2: Una sesión que se deshace al final de cada test

Abre [`app/repository.py`](../../../../referencia/api-fastapi/app/repository.py). `SqlRepository` recibe una `Session` y hace `commit()` en `create` y `delete`. Está excluido de la cobertura desde la semana 1 (`omit` en [`pyproject.toml`](../../../../referencia/api-fastapi/pyproject.toml)): ningún test lo ha ejecutado nunca.

Agrega al final de [`tests/conftest.py`](../../../../referencia/api-fastapi/tests/conftest.py):

```python
@pytest.fixture
def db_session():
    # Rollback: todo el test ocurre dentro de una transacción que nunca se confirma.
    # create_savepoint convierte los commit() y rollback() del código en savepoints.
    with get_engine().connect() as connection:
        transaction = connection.begin()
        session = Session(bind=connection, join_transaction_mode="create_savepoint")
        yield session
        session.close()
        transaction.rollback()
```

Y los imports que usa, arriba del archivo:

```python
from sqlalchemy.orm import Session

from app.repository import get_engine
```

Sigue el camino:

1. `connection.begin()` abre la transacción del test.
2. La sesión se une a esa transacción. Con `join_transaction_mode="create_savepoint"`, cada `commit()` del repositorio confirma un *savepoint*, no la transacción.
3. Al terminar el test, `transaction.rollback()` deshace todo: la tabla queda como estaba.

`get_engine()` se llama **dentro** del fixture, así que solo se conecta si un test lo pide. Los tests con el repositorio falso siguen sin necesitar Docker.

> Sin `create_savepoint`, un `rollback()` hecho por el código (por ejemplo, después de un error de la BD) cierra la transacción del test, y lo que el código guarde después queda en la BD.

## Paso 3: El repositorio contra la BD real

Crea `tests/test_repository_integration.py`:

```python
import os

import pytest

from app.repository import Piece, SqlRepository

# Sin DATABASE_URL (sin Docker) estos tests se saltan
pytestmark = pytest.mark.skipif(not os.environ.get("DATABASE_URL"), reason="needs DATABASE_URL")

GUERNICA = {"name": "Guernica", "artist": "Picasso", "year": 1937}


def test_find_by_id_returns_piece_when_it_was_created(db_session):
    # Arrange
    repository = SqlRepository(db_session)
    created = repository.create(GUERNICA)

    # Act
    found = repository.find_by_id(created["id"])

    # Assert: el id lo decide la BD, por eso se usa el que devolvió create
    assert found == {"id": created["id"], **GUERNICA}


def test_find_by_id_returns_none_when_piece_does_not_exist(db_session):
    assert SqlRepository(db_session).find_by_id(999) is None


def test_find_all_returns_pieces_ordered_by_id(db_session):
    # Arrange: se insertan directo en la BD, con los ids en desorden
    db_session.add_all([
        Piece(id=2, name="Las meninas", artist="Velázquez", year=1656),
        Piece(id=1, **GUERNICA),
    ])
    db_session.flush()

    # Act
    pieces = SqlRepository(db_session).find_all()

    # Assert
    assert [piece["id"] for piece in pieces] == [1, 2]


def test_delete_returns_false_when_piece_does_not_exist(db_session):
    assert SqlRepository(db_session).delete(999) is False
```

Córrelo sin BD y con cada motor:

```bash
uv run pytest                                                                                    # 4 skipped
DATABASE_URL=postgresql+psycopg://museo:museo@localhost:5433/museo_test uv run pytest
DATABASE_URL=mysql+pymysql://museo:museo@localhost:3307/museo_test uv run pytest
```

Los cuatro pasan con los dos motores. Fíjate en dos decisiones:

- El test de orden inserta **directo en la sesión** con ids en desorden y hace `flush()` para enviarlos a la BD. Si creara las piezas con `repository.create`, llegarían en orden y el test no probaría el `order_by`.
- No hay ids fijos en las aserciones, salvo en el test que los inserta a mano. En PostgreSQL, el rollback **no** devuelve la secuencia de ids: cada corrida sigue contando desde donde quedó la anterior.

## Paso 4: El endpoint contra la BD real

Crea `tests/test_api_integration.py`. Es el mismo `TestClient` de la semana 4, pero el override entrega el repositorio real sobre la sesión del test:

```python
import os

import pytest
from fastapi.testclient import TestClient

from app.main import app, get_repository
from app.repository import Piece, SqlRepository

pytestmark = pytest.mark.skipif(not os.environ.get("DATABASE_URL"), reason="needs DATABASE_URL")

GUERNICA = {"name": "Guernica", "artist": "Picasso", "year": 1937}


@pytest.fixture
def db_client(db_session):
    # El API usa el repositorio real, sobre la sesión que se deshace al final del test
    app.dependency_overrides[get_repository] = lambda: SqlRepository(db_session)
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_create_piece_saves_it_in_database_when_body_is_valid(db_client, db_session):
    response = db_client.post("/api/pieces", json=GUERNICA)

    assert response.status_code == 201
    # Se verifica en la BD, no solo en la respuesta
    piece = db_session.get(Piece, response.json()["id"])
    assert piece.name == "Guernica"


def test_create_piece_responds_422_when_name_is_longer_than_column(db_client):
    response = db_client.post("/api/pieces", json={**GUERNICA, "name": "x" * 256})

    assert response.status_code == 422
    assert response.json() == {"detail": "name must be at most 255 characters"}


def test_get_piece_responds_404_when_id_is_larger_than_column(db_client):
    response = db_client.get("/api/pieces/2147483648")

    assert response.status_code == 404
    assert response.json() == {"detail": "piece not found"}
```

Córrelo con los dos motores. **Fallan**, y no con una aserción: `TestClient` vuelve a lanzar en el test la excepción que el servidor no manejó, así que ves el error exacto de la BD:

| Test | PostgreSQL | MySQL |
|---|---|---|
| `name` de 256 caracteres | `DataError`: *value too long for type character varying(255)* | `DataError`: *Data too long for column 'name'* |
| id `2147483648` | `DataError`: *integer out of range* | ✓ `404` |

Con un servidor real, los dos casos son un `500`. Con el repositorio falso de la semana 4 pasaban: el `dict` guarda cualquier texto y cualquier número.

El id `2147483648` muestra la diferencia entre motores: PostgreSQL rechaza el valor fuera del rango de la columna y MySQL solo compara y no encuentra la fila. El id `abc`, en cambio, ya lo rechaza FastAPI con un `422` antes de llegar al servicio, porque el parámetro está declarado como `int`.

## Paso 5: Corregir en el servicio

Los dos fallos son datos que el API debe rechazar **antes** de llegar a la BD, así que la corrección va en [`app/service.py`](../../../../referencia/api-fastapi/app/service.py). Primero los límites, debajo del `logger`:

```python
# Límites de las columnas de la tabla pieces: name VARCHAR(255) e id INTEGER
MAX_NAME_LENGTH = 255
MAX_ID = 2_147_483_647
```

En `validate_piece`, después de la regla de `name is required`:

```python
    if len(name) > MAX_NAME_LENGTH:
        raise ValidationError(f"name must be at most {MAX_NAME_LENGTH} characters")
```

Y al inicio de `get` y de `remove`:

```python
        # Un id que no cabe en la columna no existe: 404 sin consultar la BD
        if not 0 < piece_id <= MAX_ID:
            raise NotFoundError("piece not found")
```

Las reglas nuevas son lógica de negocio: su prueba principal es **unitaria**, rápida y sin Docker. En [`tests/test_service.py`](../../../../referencia/api-fastapi/tests/test_service.py), agrega el valor límite al `parametrize` de `test_validate_piece_raises_error_when_data_is_invalid`:

```python
        ({"name": "x" * 256, "artist": "Picasso", "year": 1937}, "name must be at most 255 characters"),
```

Y debajo de ese test, el otro lado del límite y los ids fuera de rango:

```python
def test_validate_piece_accepts_name_when_it_has_exactly_255_characters():
    piece = validate_piece({"name": "x" * 255, "artist": "Picasso", "year": 1937}, current_year=2026)

    assert len(piece["name"]) == 255


@pytest.mark.parametrize("piece_id", [0, 2_147_483_648])
def test_get_raises_not_found_when_id_is_out_of_range(piece_id):
    service = PiecesService(MemoryRepository(), notifier=None)

    with pytest.raises(NotFoundError):
        service.get(piece_id)
```

Corre `uv run pytest` sin BD y luego con cada motor: todo en verde. Córrelo **dos veces seguidas** con la misma BD, y al final revisa que la tabla quedó vacía:

```bash
docker compose exec postgres psql -U museo -d museo_test -c "select count(*) from pieces"
```

> `artist` tiene la misma columna `VARCHAR(255)` y el mismo defecto. Escribe tú el test de integración que lo demuestra y la regla que lo corrige.

## Paso 6: Mutaciones

Haz cada una en `app/repository.py`, corre los tests con PostgreSQL y con MySQL, y deshazla:

1. En `find_by_id`, cambia `return piece.to_dict() if piece else None` por `return piece.to_dict()`. ¿Qué test falla y con qué error?
2. En `delete`, cambia `return False` por `return True`. ¿Qué test lo detecta?
3. En `find_all`, quita `.order_by(Piece.id)`. Con PostgreSQL el test de orden falla; con MySQL **pasa**. ¿Por qué? (Pista: InnoDB guarda las filas ordenadas por la llave primaria.) ¿Qué te dice esto sobre probar contra el mismo motor que usa tu proyecto?

---

## Checklist

- [ ] Empecé con una BD recién creada (`docker compose down -v`)
- [ ] Expliqué cómo el fixture `db_session` deshace lo que hace cada test, aunque el repositorio haga `commit()`
- [ ] Probé los cuatro métodos del repositorio contra PostgreSQL y MySQL
- [ ] Vi los tests de integración como *skipped* al correr sin `DATABASE_URL`
- [ ] Encontré los errores que el repositorio falso no mostraba y los corregí en el servicio
- [ ] Probé las reglas nuevas con tests unitarios en su valor límite
- [ ] Corrí la suite dos veces seguidas y verifiqué que la tabla quedó vacía
- [ ] Hice las tres mutaciones y expliqué por qué la tercera depende del motor

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Datos semilla y limpieza entre tests](../../1-teoria/03-datos-y-limpieza.md) | [Semana 6](../../README.md) | [Receta — Integración en Express con Knex y truncado](../express/README.md) |
