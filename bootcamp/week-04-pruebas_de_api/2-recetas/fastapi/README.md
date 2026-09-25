# Receta — Pruebas de API en FastAPI con `TestClient`

> Grupos FastAPI · Tiempo estimado: 2.5 h

Código: [`referencia/api-fastapi/`](../../../../referencia/api-fastapi/). No necesitas Docker: la app se prueba con un repositorio en memoria.

```bash
cd referencia/api-fastapi
uv sync
uv run pytest
```

---

## Paso 1: Cómo se aísla la base de datos

Abre estos archivos y sigue el camino:

1. [`app/main.py`](../../../../referencia/api-fastapi/app/main.py): `get_repository()` es una **dependencia** que abre una sesión de SQLAlchemy. Los endpoints la reciben a través de `get_service`.
2. [`tests/conftest.py`](../../../../referencia/api-fastapi/tests/conftest.py): el fixture `client` reemplaza esa dependencia con `app.dependency_overrides` y entrega un `TestClient`. El fixture `repository` crea el repositorio falso de [`tests/fakes.py`](../../../../referencia/api-fastapi/tests/fakes.py) con una pieza.
3. [`tests/test_api.py`](../../../../referencia/api-fastapi/tests/test_api.py): cada test recibe `client` y envía peticiones sin servidor ni BD.

## Paso 2: Revisar la cobertura de escenarios

Compara los tests existentes con la lista mínima de la teoría. Llena esta tabla:

| Endpoint | Feliz | Validación | Inexistente | Mal formado |
|---|:---:|:---:|:---:|:---:|
| `GET /api/pieces` | ? | — | — | — |
| `GET /api/pieces/{id}` | ? | — | ? | — |
| `POST /api/pieces` | ? | ? | — | ? |
| `DELETE /api/pieces/{id}` | ? | — | ? | — |

Vas a encontrar un hueco en `POST`.

## Paso 3: Un escenario con varias peticiones

Agrega en `tests/test_api.py`:

```python
def test_get_piece_responds_404_after_deleting_it(client):
    # Arrange
    assert client.delete("/api/pieces/1").status_code == 204

    # Act
    response = client.get("/api/pieces/1")

    # Assert
    assert response.status_code == 404
```

Funciona porque el fixture `repository` es el **mismo objeto** durante todo el test: la segunda petición ve el efecto de la primera. En el test siguiente, pytest crea un repositorio nuevo.

## Paso 4: ¿Qué responde tu API a un JSON mal formado?

Agrega:

```python
def test_create_piece_responds_400_when_body_is_malformed_json(client):
    response = client.post(
        "/api/pieces", content='{"name":', headers={"Content-Type": "application/json"}
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "malformed request body"}
```

Córrelo con `uv run pytest --no-cov -k malformed`. **Falla**: FastAPI responde `422` con una **lista** de errores de Pydantic (`[{"type": "json_invalid", ...}]`), no con el `{"detail": "..."}` que espera el frontend.

## Paso 5: Corregir el contrato

Agrega en [`app/main.py`](../../../../referencia/api-fastapi/app/main.py) un manejador para los errores de validación de la petición. Traduce el JSON mal formado a `400` y deja el resto con el comportamiento por defecto de FastAPI:

```python
from fastapi.exception_handlers import request_validation_exception_handler
from fastapi.exceptions import RequestValidationError


@app.exception_handler(RequestValidationError)
async def handle_request_validation(request: Request, exc: RequestValidationError):
    # JSON mal formado: 400 con el formato del contrato. El resto, el 422 por defecto de FastAPI
    if any(error["type"] == "json_invalid" for error in exc.errors()):
        return JSONResponse(status_code=400, content={"detail": "malformed request body"})
    return await request_validation_exception_handler(request, exc)
```

Corre `uv run pytest`: el test nuevo pasa, los demás siguen en verde y la cobertura cumple el umbral.

**Mutación**: comenta el `return JSONResponse(...)` del `if`. El test debe volver a fallar. Deshaz el comentario.

## Paso 6: Tipos incorrectos, un contrato con dos formatos

Escribe un test para `year` como texto:

```python
def test_create_piece_responds_422_with_field_errors_when_year_is_not_a_number(client):
    response = client.post("/api/pieces", json={"name": "G", "artist": "P", "year": "abc"})

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "year"]
```

Pasa, pero fíjate en el formato: los errores de **tipo** los detecta Pydantic y llegan como lista; los errores de **regla de negocio** (año futuro) los devuelve el servicio como texto. El frontend tiene que manejar los dos formatos.

Discútelo en tu grupo: ¿lo dejan así y lo documentan con este test, o unifican todo en `{"detail": "..."}` ampliando el manejador del Paso 5? Cualquiera de las dos opciones es válida **si un test la fija**.

## Paso 7: Encabezados

Agrega una aserción de `Content-Type` a un test de error:

```python
    assert response.headers["content-type"] == "application/json"
```

---

## Checklist

- [ ] Entendí cómo `dependency_overrides` aísla la base de datos
- [ ] Llené la tabla de escenarios y encontré el hueco
- [ ] Escribí un test con varias peticiones
- [ ] Descubrí el formato de error de un JSON mal formado y lo corregí
- [ ] Hice la mutación del manejador y vi fallar el test
- [ ] Decidí con mi grupo el formato de los errores de tipo y lo fijé con un test

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Endpoints protegidos: autenticación y roles](../../1-teoria/03-autenticacion-en-tests.md) | [Semana 4](../../README.md) | [Receta — Pruebas de API en Express con supertest](../express/README.md) |
