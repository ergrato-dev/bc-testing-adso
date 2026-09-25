# Semana 8 — CI completo y calidad de la suite

> Semana 8 de 9 (+1 opcional) · **Rotación de capas** · Piso de cobertura: **80%**

Tu CI de la semana 2 está en verde. Pero mira el resumen de los tests: los de integración de la semana 6 salen como **skipped**, porque en el CI no hay base de datos, y los E2E de la semana 7 ni siquiera corren. Un CI en verde que no ejecuta la mitad de la suite da una falsa tranquilidad.

En la referencia se ve con claridad: los jobs de siempre pasan con 8, 7 y 6 tests saltados. Cuando se enciende la BD como servicio y se agregan los E2E, el mismo código se pone en **rojo** con los defectos de las semanas 6 y 7. Y el frontend tiene **100% de cobertura** con esos dos defectos dentro. Esta semana completas el CI y aprendes a leer la cobertura sin engañarte.

---

## Objetivos

Al finalizar esta semana serás capaz de:

1. Explicar qué mide la cobertura de líneas, de ramas y de funciones, y qué **no** mide ninguna.
2. Usar una rama sin cubrir como pista de un defecto, y no solo como un número que subir.
3. Levantar PostgreSQL o MySQL como servicio de un job de GitHub Actions y correr contra él los tests de integración.
4. Correr los E2E en el CI, con el backend en segundo plano y sin pausas fijas.
5. Acelerar el CI con caché y dejar reportes de cobertura y de Playwright como artefactos.
6. Detectar un CI que miente: tests saltados, reintentos que esconden inestabilidad y checks que no son obligatorios.

---

## Distribución del tiempo (8 h)

| Actividad | Contenido | Tiempo |
|---|---|---|
| Teoría | Qué mide la cobertura, el CI completo, calidad de la suite | 1.5 h |
| Receta | Ampliar el workflow de la semana 2 (común a toda la ficha, un job por capa) | 2.5 h |
| Reto | CI completo del proyecto desde cuatro ángulos + umbral del 80% | 3 h |
| Revisión | Vocero aleatorio y retro | 1 h |

---

## Contenido

### Teoría

1. [Qué mide la cobertura (y qué no)](1-teoria/01-que-mide-la-cobertura.md)
2. [El CI completo: servicios, E2E, caché y artefactos](1-teoria/02-ci-completo.md)
3. [Un CI que no miente](1-teoria/03-un-ci-que-no-miente.md)

### Receta

| Receta | Para quién |
|---|---|
| [GitHub Actions: BD como servicio, integración, E2E, caché y artefactos](2-recetas/ci/README.md) | Todo el grupo; cada integrante arma el job de su capa |

El modelo verificado es el CI de este repo: [`.github/workflows/referencia.yml`](../../.github/workflows/referencia.yml).

### Reto

- [El CI completo del proyecto formativo desde cuatro ángulos](3-reto/README.md)

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
| [Semana 7 — Playwright a fondo](../week-07-playwright_a_fondo/README.md) | [README del bootcamp](../../README.md) | [Semana 9 — Integrador](../week-09-integrador/README.md) |
