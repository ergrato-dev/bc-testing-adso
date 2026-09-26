# Semana 1 — Por qué probar y primer E2E con Playwright

> Semana 1 de 9 (+1 opcional) · Capa en rotación: **E2E para todo el grupo**

Esta semana no empiezas por la teoría larga: en la primera sesión vas a ver un navegador llenando solo un formulario de **tu proyecto formativo**. Después entenderás por qué eso funciona y dónde encaja en una estrategia de pruebas.

---

## Objetivos

Al finalizar esta semana serás capaz de:

1. Explicar para qué sirve una prueba automatizada y cuánto cuesta un defecto encontrado tarde.
2. Ubicar las pruebas unitarias, de integración y E2E en la pirámide de pruebas.
3. Reconocer el patrón AAA (Arrange, Act, Assert) en cualquier test.
4. Grabar un flujo con `playwright codegen` y convertirlo en un test legible.
5. Ejecutar un test E2E contra tu proyecto y leer su resultado.
6. Medir la cobertura de tu proyecto y fijar la línea base que, desde hoy, nunca puede bajar.

---

## Distribución del tiempo (8 h)

| Actividad | Contenido | Tiempo |
|---|---|---|
| Demo de apertura | El instructor corre el E2E de la referencia con `--headed` | 0.5 h |
| Teoría | Por qué probar, pirámide, AAA, cobertura y anatomía de un test Playwright | 1.5 h |
| Recetas | Playwright contra la app de referencia + medir la cobertura | 2 h |
| Reto | Primer E2E del proyecto formativo, matriz de rotación y línea base de cobertura | 3 h |
| Revisión | Vocero aleatorio y retro | 1 h |

---

## Contenido

### Teoría

1. [Por qué probar](1-teoria/01-por-que-probar.md)
2. [La pirámide de pruebas y el patrón AAA](1-teoria/02-piramide-y-aaa.md)
3. [Anatomía de un test E2E con Playwright](1-teoria/03-anatomia-e2e-playwright.md)

### Recetas

- [Playwright contra la app de referencia](2-recetas/playwright/README.md) (1.5 h): común a toda la ficha. Playwright prueba lo que ve la persona usuaria, sin importar si el backend es FastAPI, Express o Spring Boot.
- [Medir la cobertura desde el día 1](2-recetas/cobertura/README.md) (30 min): cada grupo en su stack.

### Reto

- [Primer E2E de tu proyecto formativo](3-reto/README.md)

### Recursos

- [Ebooks gratuitos](4-recursos/ebooks-free/README.md)
- [Videografía](4-recursos/videografia/README.md)
- [Webgrafía](4-recursos/webgrafia/README.md)

### Glosario

- [Términos de la semana](5-glosario/README.md)

### Evaluación

- [Rúbrica de la semana](rubrica-evaluacion.md)

---

## Antes de empezar

- Node.js 22 y pnpm instalados.
- Docker funcionando (para la BD de la app de referencia).
- Tu proyecto formativo corriendo en local: frontend React + tu backend + tu BD.

---

## Demostración en proyecto real

Los proyectos NN Auth son apps reales (registro, verificación de email por correo, login y dashboard) con los tres backends del bootcamp, React y PostgreSQL. Tienen aplicado lo que enseña cada semana y **defectos reales documentados a propósito** para descubrirlos en clase. Muéstralos en vivo después de la receta.

| Stack | Qué mostrar | Cómo verlo |
|---|---|---|
| FastAPI | E2E del flujo completo: registro → correo en Mailpit → login → dashboard ([`auth.spec.js`](https://github.com/ergrato-dev/proyecto-be_fastapi-fe_react/blob/main/e2e/tests/auth.spec.js)) | `docker compose up -d --wait db-test mailpit` y `cd e2e && pnpm test:ui` |
| Express | El mismo flujo en otra UI ([`auth.spec.js`](https://github.com/ergrato-dev/proyecto-be_express-fe_react/blob/main/e2e/tests/auth.spec.js)) | Igual; `pnpm test:ui` muestra cada paso |
| Spring Boot | El mismo flujo con Spring Boot ([`auth.spec.js`](https://github.com/ergrato-dev/proyecto-be_springboot_java-fe_react/blob/main/e2e/tests/auth.spec.js)) | Igual; Playwright compila y arranca el backend |

Línea base de cobertura: `uv run pytest` (FastAPI), `pnpm test:coverage` (Express y frontends) y `./mvnw verify` (Spring Boot) imprimen la cobertura real.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [README del bootcamp](../../README.md) | [README del bootcamp](../../README.md) | [Por qué probar](1-teoria/01-por-que-probar.md) |

Siguiente semana: [Semana 2 — Pruebas unitarias con AAA y umbral en CI](../week-02-pruebas_unitarias_y_ci/README.md)
