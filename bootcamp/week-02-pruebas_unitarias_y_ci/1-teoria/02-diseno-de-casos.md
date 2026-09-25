# Diseño de casos: particiones, valores límite y tests parametrizados

> Transversal: aplica a todos los stacks.

## El bug que la cobertura no ve

La app de referencia tiene 97% de cobertura. Haz este experimento en el servicio de tu stack: cambia la regla del año futuro de `>` a `>=`.

```diff
- if (data.year > currentYear)
+ if (data.year >= currentYear)
```

Ahora una pieza creada **este año** es rechazada: un defecto real. Corre los tests: **todos pasan**, y la cobertura sigue en 97%.

¿Por qué? Porque ningún test prueba el año actual. Los tests usan 1937 (válido) y 2027 (futuro), y los dos se comportan igual con `>` y con `>=`. La cobertura dice que la línea **se ejecutó**, no que su lógica **se verificó** en el punto donde puede fallar.

Los casos no se eligen al azar. Hay técnicas para encontrarlos.

## Particiones de equivalencia

Divide los valores de entrada en grupos que el código trata igual. Basta un representante por grupo:

| Regla: el año no puede ser futuro (hoy: 2026) | Representante |
|---|---|
| Partición válida: años pasados y el actual | 1937 |
| Partición inválida: años futuros | 2999 |
| Partición inválida: no es entero | `"1937"`, `null` |

## Valores límite

Los defectos se esconden en los **bordes** entre particiones: un `>` que debía ser `>=`, un `<` que debía ser `<=`. Prueba justo en el borde y a cada lado:

| Valor | Esperado | Por qué |
|---|---|---|
| 2025 | Válido | Justo antes del borde |
| **2026** | **Válido** | **El borde**: aquí muere el bug de `>=` |
| 2027 | Inválido | Justo después del borde |

Aplica lo mismo a cualquier regla con límites de tu proyecto: edad mínima (17, 18, 19), stock (0, 1), longitud de contraseña (7, 8, 9), descuento máximo, cupos disponibles.

## Casos que casi siempre olvidas

- **Vacío y solo espacios**: `""`, `"   "`, `"\t"`.
- **Ausente**: `null`, `None`, un campo que no viene en el JSON.
- **Tipo incorrecto**: `"18"` en lugar de `18`.
- **Colecciones**: lista vacía, un elemento, muchos.

## Tests parametrizados

Cuando varios casos comparten la misma estructura, un test parametrizado evita copiar y pegar. Cada fila se ejecuta y se reporta como un test independiente.

**Vitest (React y Express)**

```javascript
it.each([
  [{ artist: 'Picasso', year: 1937 }, 'name is required'],
  [{ name: 'Guernica', artist: '  ', year: 1937 }, 'artist is required'],
  [{ name: 'Future', artist: 'Nobody', year: 2027 }, 'year cannot be in the future'],
])('should throw ValidationError when data is %o', (data, message) => {
  expect(() => validatePiece(data, 2026)).toThrow(new ValidationError(message));
});
```

**pytest (FastAPI)**

```python
@pytest.mark.parametrize(
    ("data", "message"),
    [
        ({"name": " ", "artist": "Picasso", "year": 1937}, "name is required"),
        ({"name": "Future", "artist": "Nobody", "year": 2027}, "year cannot be in the future"),
    ],
)
def test_validate_piece_raises_error_when_data_is_invalid(data, message):
    with pytest.raises(ValidationError, match=message):
        validate_piece(data, current_year=2026)
```

**JUnit 5 (Spring Boot)**

```java
@ParameterizedTest(name = "{3}")
@CsvSource(nullValues = "null", value = {
    "' ', Picasso, 1937, name is required",
    "Guernica, null, 1937, artist is required",
})
void shouldThrowWhenDataIsInvalid(String name, String artist, Integer year, String message) {
    assertThatThrownBy(() -> PiecesService.validate(new PieceRequest(name, artist, year), 2026))
            .hasMessage(message);
}
```

> ⚠️ Parametriza casos del **mismo** comportamiento. Si un caso necesita otra estructura de Arrange o de Assert, escribe un test aparte.

## Mutación manual: tu mejor detector de tests débiles

El experimento del inicio tiene nombre: **prueba de mutación**. Consiste en introducir un defecto pequeño a propósito y comprobar que algún test lo detecta:

1. Cambia un operador (`>` por `>=`, `&&` por `||`) o borra una línea de validación.
2. Corre los tests.
3. Si **ningún** test falla, el mutante "sobrevivió": falta un caso.
4. Escribe el caso que lo mata y deshaz la mutación.

Hazlo con cada regla de negocio que pruebes. En la revisión de esta semana, el vocero puede tener que hacerlo en vivo.
