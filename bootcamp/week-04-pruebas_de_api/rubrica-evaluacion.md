# Rúbrica de evaluación — Semana 4

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | Contrato HTTP, aislamiento de la BD, autenticación y errores |
| Desempeño 💪 | 40% | Individual | Tests de API propios desde su ángulo, con un mutante documentado |
| Producto 📦 | 30% | Grupal | Contrato de errores consistente, hallazgos corregidos y umbral ≥ 50% |

---

## Conocimiento 🧠 (30%, individual)

### Criterios

1. Elige y justifica el código de estado de cada escenario de un endpoint del proyecto.
2. Explica qué parte de la app es real y cuál es un doble en las pruebas de API de su stack.
3. Explica por qué una respuesta de error con stack trace o SQL es un defecto de seguridad.
4. Distingue `401` de `403` y dice qué test del grupo cubre cada uno.

### Niveles

- **Alto (27–30)**: responde los cuatro criterios sobre un endpoint que no probó.
- **Medio (21–26)**: responde con apoyo o solo sobre sus propios endpoints.
- **Bajo (0–20)**: no logra explicar los tests de API del grupo.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Al menos 4 tests de API propios desde el ángulo de su capa (commits con su usuario).
2. Verifica código, cuerpo y, en al menos un test, `Content-Type`.
3. Base de datos aislada: los tests no necesitan Docker ni la BD de desarrollo.
4. PR con un mutante documentado y revisado por alguien de otra capa.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios y reporta al menos un hallazgo de contrato o seguridad.
- **Medio (28–35)**: tests correctos, pero solo de casos felices o sin mutante documentado.
- **Bajo (0–27)**: menos de 4 tests propios, o tests que dependen de la BD de desarrollo.

---

## Producto 📦 (30%, grupal)

### Criterios

1. El API responde todos los errores con un formato consistente y sin información interna, y un test lo fija.
2. Hallazgos de la semana corregidos y anotados en los PR.
3. Endpoints protegidos con los tres casos (si el proyecto tiene autenticación).
4. Umbral ≥ 50% (o la cobertura real si es mayor) en frontend y backend, con CI en verde.

### Niveles

- **Alto (27–30)**: cumple los cuatro criterios.
- **Medio (21–26)**: contrato de errores corregido solo en algunos endpoints, o sin casos `403`.
- **Bajo (0–20)**: CI en rojo, umbral por debajo del 50% o respuestas con stack traces sin corregir.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio** esta semana.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Glosario — Semana 4](5-glosario/README.md) | [Semana 4](README.md) | [Semana 5 — Dobles de prueba](../week-05-dobles_de_prueba/README.md) |
