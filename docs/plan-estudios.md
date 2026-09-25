# Plan de estudios — Bootcamp Testing ADSO

## Datos generales

| Dato | Valor |
|---|---|
| Público | Aprendices ADSO SENA de VI trimestre, con proyecto formativo en curso |
| Duración | 9 semanas núcleo + 1 opcional (un trimestre) |
| Dedicación | 8 h/semana (72 h núcleo, 80 h con la semana opcional) |
| Modalidad | Grupos de 3 a 5 aprendices sobre su propio proyecto formativo |
| Stacks | React + (FastAPI \| Express \| Spring Boot) + (PostgreSQL \| MySQL) |
| Nivel de entrada | Sabe programar en el stack de su proyecto; sin experiencia en testing |

## Principios de diseño

1. **Un tema común por semana, con recetas por stack.** Toda la ficha aprende el mismo concepto y cada grupo lo aplica con su stack. El instructor dicta un solo tema, no tres cursos.
2. **El producto es el proyecto formativo.** El reto semanal no tiene starter: se resuelve en el repo del grupo y la evidencia sirve para el proyecto SENA.
3. **Todos aprenden todo.** La rotación de capas y el vocero aleatorio garantizan que cada aprendiz pase por front, API, BD y E2E (ver [guia-instructor.md](guia-instructor.md)).
4. **Resultado visible desde el día 1.** Playwright abre la semana 1: ver el navegador llenando un formulario solo engancha a la ficha antes de entrar en la teoría.
5. **Si la ficha llega solo a la semana 9, el cierre está completo.** La semana 10 es extensión.

## Distribución semanal (8 h)

| Actividad | Tiempo |
|---|---|
| Teoría común | 1.5 h |
| Recetas guiadas (cada grupo en su stack) | 2.5 h |
| Reto sobre el proyecto formativo | 3 h |
| Revisión con vocero aleatorio + retro | 1 h |

---

## Semana 1 — Por qué probar y primer E2E

- **Objetivo**: entender para qué sirve una prueba automatizada y ver una funcionando contra el proyecto propio.
- **Teoría**: qué es un defecto y cuánto cuesta encontrarlo tarde; la pirámide de pruebas (unitaria, integración, E2E); patrón AAA.
- **Receta**: instalar Playwright, grabar un flujo con `playwright codegen` y convertirlo en un test legible con aserciones.
- **Reto**: un test E2E de un flujo del proyecto (login, registro o creación de un recurso) que pase en local. Se crean la matriz de rotación y la carpeta de tests del repo del grupo.
- **Capa en rotación**: E2E para todos (es la semana de arranque).

## Semana 2 — Pruebas unitarias con AAA

- **Objetivo**: probar lógica de negocio aislada, rápida y repetible.
- **Teoría**: unidad bajo prueba, principios FIRST, nombres que documentan el comportamiento, casos borde.
- **Recetas**: Vitest (utilidades de React y servicios de Express), pytest (servicios de FastAPI), JUnit 5 + AssertJ (servicios de Spring Boot).
- **Reto**: al menos 3 tests unitarios por integrante sobre reglas de negocio reales del proyecto.

## Semana 3 — Componentes React

- **Objetivo**: probar la interfaz como la usa una persona, no sus detalles internos.
- **Teoría**: React Testing Library, prioridad de queries (`getByRole`, `getByLabelText`), `user-event`, qué no probar.
- **Receta**: React (común a toda la ficha).
- **Reto**: tests de un formulario del proyecto: render, validación visible y envío.

## Semana 4 — Pruebas de API

- **Objetivo**: verificar el contrato HTTP del backend.
- **Teoría**: estados HTTP por escenario, forma del JSON, validación de entrada, errores 4xx y 5xx.
- **Recetas**: FastAPI `TestClient`, Express + supertest, Spring Boot MockMvc (`@WebMvcTest`).
- **Reto**: happy path + validación + recurso inexistente para dos endpoints del proyecto.

## Semana 5 — Dobles de prueba

- **Objetivo**: aislar lo que no controlas (API externa, reloj, correo, BD en tests unitarios).
- **Teoría**: dummy, stub, mock, spy y fake; cuándo un mock es una mala señal.
- **Recetas**: `vi.mock` y MSW para aislar React del API, `vi.mock` en Express, pytest-mock / `dependency_overrides` en FastAPI, Mockito en Spring Boot.
- **Reto**: probar una pieza del proyecto que dependa de un servicio externo o de otra capa.

## Semana 6 — Integración con BD real

- **Objetivo**: probar repositorios y endpoints contra PostgreSQL o MySQL reales, sin tocar la BD de desarrollo.
- **Teoría**: diferencia entre prueba unitaria e integración, BD de pruebas desechable, datos semilla, limpieza entre tests (transacción con rollback o truncado).
- **Recetas**: `docker-compose.yml` con servicios de prueba; conexión desde FastAPI (SQLAlchemy), Express y Spring Boot (JPA), para PostgreSQL y MySQL.
- **Reto**: tests de integración de al menos un repositorio y un endpoint contra la BD del proyecto en Docker.

## Semana 7 — Playwright a fondo

- **Objetivo**: E2E estables sobre los flujos críticos.
- **Teoría**: locators accesibles, auto-waiting, flakiness y cómo evitarla, preparar datos por API antes del test, un objeto de página sencillo.
- **Receta**: Playwright contra front y API levantados con la BD en Docker.
- **Reto**: los 3 flujos críticos del proyecto cubiertos por E2E.

## Semana 8 — Cobertura y CI

- **Objetivo**: que la suite corra sola en cada push.
- **Teoría**: qué mide y qué no mide la cobertura; GitHub Actions: jobs, servicios (`postgres`/`mysql`), caché y artefactos.
- **Recetas**: cobertura con Vitest (`@vitest/coverage-v8`), pytest-cov y JaCoCo; workflow de ejemplo por stack.
- **Reto**: workflow del proyecto en verde con tests de front, backend y E2E.

## Semana 9 — Integrador

- **Objetivo**: consolidar y sustentar.
- **Actividad**: suite completa en verde en CI, informe breve de la estrategia de pruebas (qué se prueba en cada capa y por qué) y sustentación con vocero aleatorio: cada integrante responde por cualquier capa.

## Semana 10 (opcional) — TDD

- **Objetivo**: escribir la prueba antes del código.
- **Teoría**: ciclo Red-Green-Refactor, pasos pequeños.
- **Recetas**: Vitest, pytest y JUnit 5.
- **Reto**: implementar una historia de usuario nueva del proyecto guiada por pruebas.

---

## Estado de publicación

| Sem | Estado |
|:---:|---|
| 1–10 | ⏳ Pendiente |
