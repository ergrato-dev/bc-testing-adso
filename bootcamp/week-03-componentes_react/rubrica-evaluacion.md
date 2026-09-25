# Rúbrica de evaluación — Semana 3

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | Queries y sus variantes, asincronía, qué probar en un componente |
| Desempeño 💪 | 40% | Individual | Tests propios de un componente del proyecto, con interacción, estados y un mutante |
| Producto 📦 | 30% | Grupal | Componentes clave cubiertos, CI en verde y umbral ≥ 40% en frontend y backend |

---

## Conocimiento 🧠 (30%, individual)

### Criterios

1. Justifica la query de un test según la tabla de prioridad.
2. Distingue `getBy`, `queryBy` y `findBy`, y explica por qué `getBy` no sirve para verificar ausencias.
3. Explica por qué un componente con 100% de cobertura puede tener comportamiento sin verificar, con el ejemplo del mensaje de carga.
4. Explica la relación entre accesibilidad y testabilidad con un ejemplo del proyecto.

### Niveles

- **Alto (27–30)**: responde los cuatro criterios sobre el componente de otro integrante.
- **Medio (21–26)**: responde con apoyo o solo sobre su propio componente.
- **Bajo (0–20)**: no logra explicar los tests de componentes del grupo.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Al menos 3 tests propios del componente anotado en la matriz (commits con su usuario).
2. Al menos un test con interacción mediante `user-event` y uno de un estado no feliz.
3. Queries accesibles; `getByTestId` solo con justificación escrita.
4. PR con un mutante documentado y revisado por otro integrante.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios.
- **Medio (28–35)**: tests correctos pero solo del caso feliz, con queries frágiles o sin mutante documentado.
- **Bajo (0–27)**: menos de 3 tests propios, o tests que verifican detalles de implementación (estado interno, clases CSS).

---

## Producto 📦 (30%, grupal)

### Criterios

1. Un componente distinto por integrante, entre formularios, listas o rutas protegidas.
2. `renderWithProviders` compartido si el proyecto usa rutas o contexto.
3. Backend llevado al piso por el responsable de la semana.
4. Umbral ≥ 40% (o la cobertura real si es mayor) en frontend y backend, fijado por PR, con CI en verde.

### Niveles

- **Alto (27–30)**: cumple los cuatro criterios.
- **Medio (21–26)**: umbral cumplido solo en una parte, o componentes repetidos entre integrantes.
- **Bajo (0–20)**: CI en rojo o umbral por debajo del 40%.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio** esta semana.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Glosario — Semana 3](5-glosario/README.md) | [Semana 3](README.md) | [Semana 4 — Pruebas de API](../week-04-pruebas_de_api/README.md) |
