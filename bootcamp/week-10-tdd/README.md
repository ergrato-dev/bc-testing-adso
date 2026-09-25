# Semana 10 (opcional) — TDD

> Semana opcional · Tema común: **todo el grupo, sobre una historia nueva** · Cobertura: se mantiene **≥ 80%**

Durante nueve semanas escribiste tests **después** del código: para entenderlo, para encontrar sus defectos y para protegerlo. Esta semana inviertes el orden. Con **TDD** (*Test-Driven Development*) escribes primero un test que falla, después el código mínimo que lo hace pasar, y luego mejoras el diseño con la suite en verde. La historia es nueva en la referencia y en tu proyecto: **filtrar la lista de piezas por artista** (`GET /api/pieces?artist=picasso`), sin importar mayúsculas ni espacios.

Si la ficha no llega a esta semana, el bootcamp está completo: la semana 9 es el cierre.

---

## Objetivos

Al finalizar esta semana serás capaz de:

1. Aplicar el ciclo Red-Green-Refactor en pasos pequeños.
2. Escribir una lista de pruebas antes de programar y elegir el siguiente caso.
3. Distinguir un Red que falla por la razón correcta de uno que falla por otra cosa.
4. Refactorizar el código **y** los tests con la suite en verde.
5. Dejar en el historial de Git la evidencia de cada ciclo.

---

## Distribución del tiempo (8 h)

| Actividad | Contenido | Tiempo |
|---|---|---|
| Teoría | El ciclo, la lista de pruebas y los pasos pequeños | 1.5 h |
| Recetas | La historia del filtro por artista en tu backend, ciclo por ciclo | 2.5 h |
| Reto | Una historia de usuario nueva del proyecto, guiada por pruebas | 3 h |
| Revisión | Vocero aleatorio y retro | 1 h |

---

## Contenido

### Teoría

1. [El ciclo Red-Green-Refactor](1-teoria/01-ciclo-tdd.md)
2. [La lista de pruebas y los pasos pequeños](1-teoria/02-pasos-pequenos.md)

### Recetas

| Receta | Para quién |
|---|---|
| [Express: TDD con Vitest](2-recetas/express/README.md) | Grupos Express |
| [FastAPI: TDD con pytest](2-recetas/fastapi/README.md) | Grupos FastAPI |
| [Spring Boot: TDD con JUnit 5](2-recetas/springboot/README.md) | Grupos Spring Boot |

### Reto

- [Una historia de usuario del proyecto formativo, guiada por pruebas](3-reto/README.md)

### Recursos

- [Ebooks gratuitos](4-recursos/ebooks-free/README.md)
- [Videografía](4-recursos/videografia/README.md)
- [Webgrafía](4-recursos/webgrafia/README.md)

### Glosario

- [Términos de la semana](5-glosario/README.md)

### Evaluación

- [Rúbrica de la semana](rubrica-evaluacion.md)

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Semana 9 — Integrador](../week-09-integrador/README.md) | [README del bootcamp](../../README.md) | — |
