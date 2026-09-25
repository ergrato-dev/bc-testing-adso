# Receta — Pruebas unitarias en FastAPI con pytest

> Capas API y BD de grupos FastAPI · Tiempo estimado: 1.5 h

Código: [`referencia/api-fastapi/`](../../../../referencia/api-fastapi/). No necesitas Docker ni la BD: las pruebas unitarias no tocan infraestructura.

```bash
cd referencia/api-fastapi
uv sync
```

---

## Paso 1: Correr la suite y ubicar la unidad

```bash
uv run pytest
```

Verás los tests en verde y la tabla de cobertura con `Required test coverage of 80.0% reached`. Abre [`app/service.py`](../../../../referencia/api-fastapi/app/service.py) y ubica la unidad de esta receta: `validate_piece(data, current_year=None)`.

Fíjate en que:

- No importa nada de FastAPI ni de SQLAlchemy: es Python puro.
- Recibe `current_year` como parámetro. Así el test fija el año y es **repetible** (la "R" de FIRST).

## Paso 2: Leer los tests existentes

Abre [`tests/test_service.py`](../../../../referencia/api-fastapi/tests/test_service.py):

- El primer test sigue AAA con comentarios explícitos.
- `test_validate_piece_raises_error_when_data_is_invalid` usa `@pytest.mark.parametrize`: tres casos, cada uno reportado como un test aparte.

Mientras trabajas, corre solo ese archivo y con más detalle. `--no-cov` evita que el umbral falle cuando corres una parte de la suite:

```bash
uv run pytest tests/test_service.py -v --no-cov
```

## Paso 3: El bug que nadie ve

En `app/service.py`, cambia la regla del año:

```diff
-    if data["year"] > current_year:
+    if data["year"] >= current_year:
```

Corre los tests: **todos pasan**. Sin embargo, ahora una pieza de este año es rechazada. Ese es el mutante que sobrevive por falta de un caso en el **valor límite**.

## Paso 4: Escribir el test del valor límite

Sin deshacer el cambio, agrega este test en `tests/test_service.py`:

```python
def test_validate_piece_accepts_piece_from_current_year():
    # Arrange: el borde exacto de la regla
    data = {"name": "Recent", "artist": "Someone", "year": 2026}

    # Act
    piece = validate_piece(data, current_year=2026)

    # Assert
    assert piece["year"] == 2026
```

El test falla con `ValidationError: year cannot be in the future`. **Acabas de matar al mutante.** Deshaz el cambio del Paso 3 y confirma que todo vuelve a verde.

## Paso 5: Ampliar el test parametrizado

Agrega una fila a la lista de `parametrize` para un nombre que solo contiene un tabulador:

```python
        ({"name": "\t", "artist": "Picasso", "year": 1937}, "name is required"),
```

¿Pasa? ¿Por qué? Pista: mira qué hace `strip()` con `\t`.

## Paso 6: Tu propia mutación

Elige otra línea de `validate_piece` y mútala. Ideas:

- Borra el `.strip()` de `artist`.
- Cambia `data.get("name") or ""` por `data["name"]`. ¿Qué pasa con una pieza sin nombre?

Corre los tests. Si ningún test falla, escribe el caso que lo detecta. Deshaz la mutación.

## Paso 7: Leer el reporte de cobertura

```bash
uv run pytest --cov-report=html
```

Abre `htmlcov/index.html` en el navegador y entra a `app/service.py`. Las líneas en rojo no se ejecutaron. Recuerda lo que aprendiste en el Paso 3: el verde en el reporte no garantiza que la lógica esté verificada.

> 📌 En tu proyecto, las validaciones de tipo las hace Pydantic (un `year: int` rechaza `"abc"` antes de llegar al servicio). Las **reglas de negocio** (año no futuro, stock no negativo, fechas coherentes) viven en el servicio: esas son las que pruebas aquí.

---

## Checklist

- [ ] Ubiqué la unidad y entendí por qué recibe `current_year`
- [ ] Vi sobrevivir el mutante `>=` con la suite en verde
- [ ] Escribí el test del valor límite y vi cómo lo mata
- [ ] Agregué un caso al test parametrizado
- [ ] Hice mi propia mutación y, si sobrevivió, escribí el test que la detecta

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — Lógica pura del frontend React con Vitest](../react/README.md) | [Semana 2](../../README.md) | [Receta — Pruebas unitarias en Express con Vitest](../express/README.md) |
