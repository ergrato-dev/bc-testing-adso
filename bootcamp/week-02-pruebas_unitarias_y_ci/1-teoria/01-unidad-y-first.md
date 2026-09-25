# La unidad bajo prueba y los principios FIRST

> Transversal: aplica a todos los stacks.

## Qué es una unidad

Una **unidad** es la pieza más pequeña de lógica que tiene sentido probar sola: una función, un método de un servicio o una clase de dominio. La prueba unitaria la ejecuta **sin** servidor HTTP, **sin** base de datos y **sin** navegador.

En un proyecto ADSO típico, las unidades con más valor son:

| Capa | Unidades candidatas |
|---|---|
| Frontend React | Validaciones de formularios, cálculos (totales, fechas), transformaciones de datos para mostrar |
| Backend | Servicios con reglas de negocio: validar, calcular precios, decidir estados, aplicar permisos |
| Modelo o dominio | Entidades con reglas propias, conversiones entre DTO y entidad |

No todo merece prueba unitaria. Un controlador que solo recibe la petición y llama al servicio se prueba mejor como API (semana 4). Un repositorio que solo ejecuta SQL se prueba contra una BD real (semana 6).

## Separar la lógica para poder probarla

Si la regla de negocio vive mezclada con el código HTTP o con el componente React, no puedes probarla sola. La app de referencia la separa en todas las capas:

```
React:    PieceForm.jsx  ──usa──>  validatePieceForm()      ← unidad
Backend:  rutas / controller  ──>  servicio: validatePiece()  ← unidad
```

Cuando en tu proyecto encuentres una regla escondida dentro de un endpoint o de un `onSubmit`, **extráela a una función**. Ese cambio pequeño es lo que vuelve testeable tu código.

## Los principios FIRST

Una buena prueba unitaria es:

| Principio | Significado | Cómo se rompe en la práctica |
|---|---|---|
| **F**ast (rápida) | Milisegundos | Se conecta a una BD o hace peticiones HTTP |
| **I**solated (aislada) | No depende de otros tests ni del orden | Un test deja datos que otro necesita |
| **R**epeatable (repetible) | Mismo resultado siempre y en cualquier equipo | Usa la fecha actual, números aleatorios o la zona horaria |
| **S**elf-validating (autoverificable) | Pasa o falla sola, sin revisar a mano | Imprime resultados con `console.log` o `print` en vez de aserciones |
| **T**imely (oportuna) | Se escribe junto con el código | Se deja "para el final" y nunca se escribe |

## El reloj: el enemigo silencioso de Repeatable

La regla "el año de la pieza no puede ser futuro" depende de **hoy**. Si el test usa la fecha real, un test que hoy pasa puede fallar el 1 de enero. La referencia lo resuelve recibiendo el año actual como parámetro:

**Express (JavaScript)**

```javascript
export function validatePiece(data, currentYear = new Date().getFullYear()) { … }

// En el test, el año es fijo: el resultado nunca cambia
validatePiece({ name: 'Future', artist: 'Nobody', year: 2027 }, 2026);
```

**FastAPI (Python)**

```python
def validate_piece(data: dict, current_year: int | None = None) -> dict:
    current_year = current_year or date.today().year
```

**Spring Boot (Java)**

```java
public static Piece validate(PieceRequest request, int currentYear) { … }
// El servicio la llama con Year.now().getValue(); el test, con 2026
```

El mismo truco sirve para cualquier dependencia que no controlas: fecha, azar, configuración. Recibe el valor por parámetro y deja un valor por defecto para producción.

## Anatomía de un test unitario

Los tres stacks siguen la misma forma AAA que ya conoces:

```javascript
// Vitest (React y Express)
it('should return trimmed data when piece is valid', () => {
  const data = { name: '  Guernica ', artist: 'Picasso', year: 1937 };   // Arrange
  const piece = validatePiece(data, 2026);                              // Act
  expect(piece).toEqual({ name: 'Guernica', artist: 'Picasso', year: 1937 }); // Assert
});
```

```python
# pytest (FastAPI)
def test_validate_piece_returns_trimmed_data_when_piece_is_valid():
    data = {"name": "  Guernica ", "artist": "Picasso", "year": 1937}
    piece = validate_piece(data, current_year=2026)
    assert piece == {"name": "Guernica", "artist": "Picasso", "year": 1937}
```

```java
// JUnit 5 + AssertJ (Spring Boot)
@Test
@DisplayName("should return trimmed piece when request is valid")
void shouldReturnTrimmedPieceWhenRequestIsValid() {
    var request = new PieceRequest("  Guernica ", "Picasso", 1937);
    Piece piece = PiecesService.validate(request, 2026);
    assertThat(piece.getName()).isEqualTo("Guernica");
}
```

## Qué verificar

- **El resultado** que devuelve la unidad, o **el error** que lanza.
- **No** los detalles internos: variables privadas, cuántas veces se llamó a un método auxiliar. Si refactorizas sin cambiar el comportamiento, los tests deben seguir pasando.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Semana 2 — Pruebas unitarias con AAA y umbral en CI](../README.md) | [Semana 2](../README.md) | [Diseño de casos: particiones, valores límite y tests parametrizados](02-diseno-de-casos.md) |
