# Un CI que no miente

> Transversal: aplica a todos los stacks.

Un CI en verde debería significar "todo lo que probamos, pasó". Hay cuatro formas de que signifique menos.

## 1. Tests saltados

En la referencia, los jobs de frontend y backend de la semana 2 están en verde. Sus logs dicen:

```text
api-express      Tests  19 passed | 8 skipped (27)
api-fastapi      17 passed, 7 skipped
api-springboot   Tests run: 23, Failures: 0, Errors: 0, Skipped: 6
```

Son los tests de integración de la semana 6, que se saltan sin `DATABASE_URL`. Con la BD como servicio, los mismos tests corren y el log dice `27 passed`, `24 passed` y `Skipped: 0`. Y si el código tiene los defectos de la semana 6, el job se pone en **rojo**:

```text
× should respond 422 when name is longer than the column
× should respond 404 with JSON when id is abc
× should respond 404 with JSON when id is 2147483648
```

Saltar tests sin BD es correcto en tu equipo. En el CI, **cada test saltado es un test que no protege nada**. Revisa el número de *skipped* en cada job, no solo el color.

## 2. Reintentos que esconden

La configuración de Playwright de la referencia reintenta una vez en el CI (`retries: process.env.CI ? 1 : 0`). Un test que falla y pasa al reintentar queda marcado como **flaky**, y el job queda en verde.

| En el log | Significa | Qué hacer |
|---|---|---|
| `✘ … (retry #1)` y el job en rojo | Falla siempre: probablemente un defecto | Leer la traza del artefacto |
| `flaky` y el job en verde | Falla a veces | Tratarlo como tarea pendiente (teoría 2 de la semana 7) |

Si el grupo prefiere que un test inestable detenga el merge, `playwright test --fail-on-flaky-tests` convierte los *flaky* en rojo.

En la referencia, los dos defectos de la semana 7 fallan también en el reintento, en los tres backends: no son inestabilidad, son defectos.

## 3. Checks que no son obligatorios

Un job nuevo en el workflow **no** bloquea el merge hasta que lo marcas como obligatorio en el ruleset de `main` (semana 2, paso 5). Si agregas los jobs de integración y E2E y no actualizas el ruleset, un PR puede fusionarse con ellos en rojo.

Cada vez que el workflow gana un job, el ruleset debe ganar un check.

## 4. "Vuelve a correrlo"

El botón **Re-run jobs** existe para fallos de la infraestructura: un registro de paquetes caído o un runner que se quedó sin disco. Si lo usas cada vez que algo sale en rojo, estás haciendo a mano lo que hacen los reintentos: esconder la inestabilidad.

Antes de volver a correr:

1. Lee el primer error del log, no el último.
2. Descarga el artefacto (reporte de Playwright, log del backend, cobertura).
3. Corre **el mismo comando** en tu equipo con la misma configuración (`DATABASE_URL`, `CI=1`).

## Cuánto debe tardar

Un CI lento se deja de esperar: la gente fusiona sin mirar. Referencia de tiempos en la app de referencia, con la caché activa:

| Job | Duración aproximada |
|---|---|
| Frontend, backend | 10 a 45 s |
| E2E por backend | 50 a 80 s |

Si tu CI pasa de 10 minutos, busca primero dependencias sin caché, E2E que preparan datos por la UI y tests que esperan con pausas fijas.

## Checklist de un CI confiable

- [ ] Frontend, backend, integración y E2E corren en cada PR
- [ ] Cero tests saltados en el CI (o cada salto justificado en el PR)
- [ ] Todos los jobs son obligatorios en el ruleset de `main`
- [ ] Umbral de cobertura del 80% en frontend y backend
- [ ] Artefactos para diagnosticar sin reproducir en local
- [ ] Los *flaky* se investigan; no se reintenta hasta que pasen
