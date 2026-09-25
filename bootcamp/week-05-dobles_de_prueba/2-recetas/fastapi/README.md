# Receta — Dobles en FastAPI con pytest-mock

> Capas API y BD de grupos FastAPI · Tiempo estimado: 2.5 h

Código: [`referencia/api-fastapi/`](../../../../referencia/api-fastapi/). No necesitas Docker.

```bash
cd referencia/api-fastapi
uv sync
uv run pytest
```

---

## Paso 1: La dependencia externa

Abre y sigue el camino del notificador:

1. [`app/service.py`](../../../../referencia/api-fastapi/app/service.py): `PiecesService(repository, notifier)`. En `create`, después de guardar llama a `notifier.piece_created(piece)` dentro de un `try/except`: si falla, registra una advertencia con `logger.warning` y devuelve la pieza igual.
2. [`app/notifier.py`](../../../../referencia/api-fastapi/app/notifier.py): la implementación real (en un proyecto sería un correo).
3. [`app/main.py`](../../../../referencia/api-fastapi/app/main.py): la dependencia `get_notifier()` entrega el notificador a `get_service`.
4. [`tests/test_service.py`](../../../../referencia/api-fastapi/tests/test_service.py): los tests que no crean piezas pasan `notifier=None`, un **dummy**.

Corre `uv run pytest` y mira la cobertura de `app/service.py`: las líneas del `except` están sin cubrir. Ningún test prueba qué pasa cuando el notificador falla.

## Paso 2: Spy, se notifica una vez con la pieza guardada

Crea `tests/test_notifier.py`:

```python
import pytest

from app.main import app, get_notifier
from app.service import PiecesService, ValidationError
from tests.fakes import MemoryRepository

GUERNICA = {"name": "Guernica", "artist": "Picasso", "year": 1937}


def test_create_notifies_the_created_piece_once(mocker):
    # Arrange: mocker.Mock() acepta cualquier método y registra sus llamadas
    notifier = mocker.Mock()
    service = PiecesService(MemoryRepository(), notifier)

    # Act
    piece = service.create(GUERNICA)

    # Assert: una sola vez, con la pieza ya guardada (con su id)
    notifier.piece_created.assert_called_once_with(piece)
```

## Paso 3: Spy, no se notifica si la pieza es inválida

```python
def test_create_does_not_notify_when_piece_is_invalid(mocker):
    notifier = mocker.Mock()
    service = PiecesService(MemoryRepository(), notifier)

    with pytest.raises(ValidationError):
        service.create({**GUERNICA, "name": ""})

    notifier.piece_created.assert_not_called()
```

## Paso 4: Stub que falla, la pieza se crea igual

```python
def test_create_still_saves_the_piece_when_notifier_fails(mocker, caplog):
    # Stub: el notificador siempre lanza una excepción
    notifier = mocker.Mock()
    notifier.piece_created.side_effect = RuntimeError("smtp down")
    service = PiecesService(MemoryRepository(), notifier)

    piece = service.create(GUERNICA)

    assert piece["id"] == 1
    assert "smtp down" in caplog.text   # caplog captura lo que se registró con logging
```

## Paso 5: La misma regla vista desde el API

Con `dependency_overrides` inyectas el doble en el endpoint:

```python
def test_create_piece_responds_201_when_notifier_fails(client, mocker):
    failing = mocker.Mock()
    failing.piece_created.side_effect = RuntimeError("smtp down")
    app.dependency_overrides[get_notifier] = lambda: failing

    response = client.post("/api/pieces", json=GUERNICA)

    assert response.status_code == 201
```

El fixture `client` limpia todos los `dependency_overrides` al terminar, también este.

## Paso 6: Mutaciones

Haz cada una, corre `uv run pytest --no-cov` y deshazla:

1. Quita el `try/except` y deja solo `self.notifier.piece_created(piece)`. ¿Qué tests fallan?
2. Comenta la llamada `self.notifier.piece_created(piece)` (deja `pass` en el `try`). ¿Qué tests fallan?
3. Mueve la notificación **antes** de `self.repository.create(...)`, pasándole `data`. ¿Qué test lo detecta y por qué?

## Paso 7: `patch` frente a inyección

Otra forma de reemplazar el notificador sería parchear la clase:

```python
mocker.patch("app.main.LogNotifier")
```

- ¿Por qué el texto es `"app.main.LogNotifier"` y no `"app.notifier.LogNotifier"`? (Pista: la teoría, "patch va donde se usa").
- ¿Qué pasa con ese `patch` si mañana alguien renombra el import en `main.py`?
- ¿Por qué la referencia prefiere recibir el `notifier` como parámetro?

---

## Checklist

- [ ] Seguí el camino del notificador desde `get_notifier` hasta el servicio
- [ ] Verifiqué con un spy que se notifica una vez con la pieza guardada
- [ ] Verifiqué que no se notifica cuando la pieza es inválida
- [ ] Probé con un stub que falla que la pieza se crea igual, desde el servicio y desde el API
- [ ] Hice las tres mutaciones y vi qué test detecta cada una

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — MSW para el cliente HTTP del frontend](../react/README.md) | [Semana 5](../../README.md) | [Receta — Dobles en Express con `vi.fn` y `vi.spyOn`](../express/README.md) |
