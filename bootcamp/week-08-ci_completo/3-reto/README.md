# Reto — El CI completo del proyecto formativo desde cuatro ángulos

> Entregable grupal con evidencia individual · Tiempo estimado: 3 h · Piso de cobertura al cerrar la semana: **80%** en frontend y backend

## Parte 1: Rotar de capa y leer el CI actual (20 min)

Cada integrante anota en la columna **S8** de la matriz una capa distinta a la de S6 (la S7 fue E2E para todos).

Antes de tocar el workflow, el grupo abre el último run de `main` y anota en el PR de la semana:

- Cuántos tests **saltados** hay en cada job, y por qué.
- Cuánto tarda cada job.
- Qué checks son obligatorios hoy en el ruleset de `main`.

| Capa | Ángulo |
|---|---|
| **Front** | El job de frontend con caché y el reporte de cobertura como artefacto. Descarga el reporte, busca **ramas sin cubrir** en los componentes y, para cada una, escribe el test o justifica en el PR por qué no hace falta |
| **API** | El job de integración con la BD como servicio: los tests de la semana 6 corren con cero *skipped*. Cada test que falle en el CI y no en tu equipo es un hallazgo: documenta la causa |
| **BD** | El servicio de la BD igual al de producción (motor y versión), las migraciones corriendo en el job antes de los tests, y el reporte de cobertura del backend como artefacto con sus ramas sin cubrir analizadas, igual que la capa Front |
| **E2E** | El job de E2E: backend en segundo plano, espera con `curl`, reporte de Playwright como artefacto si falla. Los 3 flujos críticos de la semana 7 pasan en el CI |

## Parte 2: El workflow completo (2 h)

Cada integrante trabaja el job de su capa con la [receta](../2-recetas/ci/README.md):

1. Su job queda en verde y su log muestra **cero** tests saltados de su capa.
2. **Rojo provocado**: rompe algo a propósito en su job (tabla del paso 5 de la receta), guarda el enlace al run en rojo y corrígelo. Los dos enlaces van en el PR.
3. Al menos un test nuevo nacido del análisis de su capa: una rama sin cubrir, un test que fallaba solo en el CI o un flujo E2E que faltaba.
4. **Mutación**: sobre ese test nuevo, documenta en el PR qué cambio en el código lo hace fallar.
5. Commit con tu usuario y PR revisado por alguien de otra capa.

Si el frontend y el backend viven en repos separados, cada repo tiene su workflow. El job de E2E va en el repo del frontend y hace checkout del backend con `actions/checkout` y la opción `repository` (el repo debe ser público o requiere un token).

## Parte 3: El CI no miente (20 min, en grupo)

Revisen juntos el workflow con el checklist de la teoría 3:

- [ ] Frontend, backend, integración y E2E corren en cada PR
- [ ] Cero tests saltados en el CI (o cada salto justificado en el PR)
- [ ] Todos los jobs son obligatorios en el ruleset de `main`
- [ ] Artefactos para diagnosticar sin reproducir en local
- [ ] Ningún test marcado como *flaky* sin investigar

Abran un PR de prueba con un test roto en **cada** capa y confirmen que el merge queda bloqueado. Ciérrenlo sin fusionar.

## Parte 4: Cierre de semana, umbral del 80% (20 min)

1. Con los PR fusionados, anoten en la matriz la cobertura real de frontend y backend.
2. Abran un PR que suba el umbral de **cada** parte al mayor entre **80** y su cobertura real, redondeada hacia abajo.
3. El CI completo debe quedar en verde. Es la condición para sustentar en la semana 9.

## Entregables

- [ ] Columna S8 de la matriz con una capa distinta a la de S6 para cada integrante
- [ ] Estado inicial del CI anotado en el PR (saltados, tiempos, checks obligatorios)
- [ ] Workflow con frontend, backend, integración (BD como servicio) y E2E, en verde en `main`
- [ ] Caché en al menos un job y artefactos de cobertura y de Playwright
- [ ] Un rojo provocado y corregido por integrante, con los enlaces a los runs
- [ ] Ramas sin cubrir analizadas en frontend y backend
- [ ] Todos los jobs obligatorios en el ruleset, comprobado con un PR de prueba
- [ ] Umbral ≥ 80% en frontend y backend

## Preparación para el vocero aleatorio

El instructor escoge a alguien al azar y le pide, sobre un job que **no** escribió:

- Explicar cómo llega la BD a ese job y cómo sabe el job que ya puede usarla.
- Mostrar en el reporte de cobertura una rama sin cubrir y decir qué comportamiento queda sin probar.
- Decir qué pasaría si se borrara `DATABASE_URL` del job, y por qué el CI seguiría en verde.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — GitHub Actions: BD como servicio, integración, E2E, caché y artefactos](../2-recetas/ci/README.md) | [Semana 8](../README.md) | [Ebooks gratuitos — Semana 8](../4-recursos/ebooks-free/README.md) |
