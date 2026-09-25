# Rúbrica de evaluación — Semana 6

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | Unitaria frente a integración, BD desechable, estrategias de limpieza |
| Desempeño 💪 | 40% | Individual | Tests de integración propios desde su ángulo, independientes entre sí, con un mutante documentado |
| Producto 📦 | 30% | Grupal | Repositorio y endpoint probados contra la BD real en Docker, un hallazgo corregido y umbral ≥ 70% |

---

## Conocimiento 🧠 (30%, individual)

### Criterios

1. Explica, con un test del grupo, qué defecto encontraría ese test que un test con el repositorio falso no encuentra.
2. Explica por qué los tests usan una BD de pruebas desechable y nunca la de desarrollo, y cómo llega la conexión al test.
3. Compara la limpieza con rollback y con truncado, y dice cuál usa el grupo y por qué.
4. Explica por qué una restricción de la BD (longitud, `NOT NULL`, única) debe tener también una regla en el servicio.

### Niveles

- **Alto (27–30)**: responde los cuatro criterios sobre un test que no escribió.
- **Medio (21–26)**: responde con apoyo o solo sobre sus propios tests.
- **Bajo (0–20)**: no distingue una prueba de integración de una unitaria con dobles.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Al menos 3 tests de integración propios desde el ángulo de su capa (commits con su usuario).
2. Cada test prepara sus propios datos y no depende del orden ni de datos dejados por otro test.
3. Conexión por variable de entorno, sin credenciales en los archivos de test.
4. PR con un mutante documentado, revisado por alguien de otra capa.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios.
- **Medio (28–35)**: tests correctos pero que dependen del orden de ejecución o de datos que ya estaban en la BD.
- **Bajo (0–27)**: menos de 3 tests propios, o tests que usan la BD de desarrollo.

---

## Producto 📦 (30%, grupal)

### Criterios

1. BD de pruebas del proyecto en Docker Compose, en un puerto distinto al de desarrollo.
2. Al menos un repositorio y un endpoint probados contra la BD real, con limpieza entre tests.
3. Al menos un hallazgo de integración (algo que el fake no veía) documentado en el PR y corregido con su test.
4. La suite de integración pasa dos veces seguidas sin reiniciar la BD.
5. Umbral ≥ 70% (o la cobertura real si es mayor) en frontend y backend, con CI en verde.

### Niveles

- **Alto (27–30)**: cumple los cinco criterios.
- **Medio (21–26)**: integración probada pero sin hallazgo documentado, o la suite falla en la segunda corrida.
- **Bajo (0–20)**: CI en rojo, umbral por debajo del 70% o tests contra la BD de desarrollo.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio** esta semana.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Glosario — Semana 6](5-glosario/README.md) | [Semana 6](README.md) | [Semana 7 — Playwright a fondo](../week-07-playwright_a_fondo/README.md) |
