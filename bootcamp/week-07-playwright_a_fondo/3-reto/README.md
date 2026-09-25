# Reto — Los flujos críticos del proyecto formativo en E2E

> Entregable grupal con evidencia individual · Tiempo estimado: 3 h · Piso de cobertura al cerrar la semana: **75%** en frontend **y** backend

## Parte 1: Elegir los 3 flujos críticos (20 min, en grupo)

Semana de tema común: todo el grupo trabaja E2E. Anoten **E2E** en la columna **S7** de la matriz (no cuenta para la rotación).

Un flujo es **crítico** si, cuando falla, el proyecto deja de servir para lo que existe. Pregúntense:

- ¿Qué hace la persona usuaria **todos los días** con la app? (registrar, buscar, reservar)
- ¿Qué flujo mueve **dinero, datos personales o acceso**? (pagar, registrarse, iniciar sesión, cambiar un rol)
- ¿Qué flujo mostrarían en la sustentación del proyecto SENA?

Elijan 3 y anótenlos en el PR con el porqué de cada uno. Repártanlos:

| Integrantes | Reparto |
|---|---|
| 3 | Un flujo por persona |
| 4 | Un flujo por persona; la cuarta persona hace la Parte 3 sobre los tres flujos |
| 5 | Un flujo por persona; la cuarta y la quinta se reparten la Parte 3 |

**Responsable del backend**: el umbral también aplica al backend, y esta semana nadie trabaja ahí. La persona que tuvo la capa **API en S6** se encarga además de llevar el backend al 75% con tests unitarios o de API, con las técnicas de las semanas 2 y 4.

## Parte 2: E2E estables de cada flujo (1 h 45 min)

Antes de escribir, una sola persona deja lista la base de la suite en un PR corto:

1. Configuración con `baseURL`, reporte HTML y traza (`trace: 'on-first-retry'`), como en [`referencia/e2e/playwright.config.js`](../../../referencia/e2e/playwright.config.js).
2. El backend corre contra la **BD de pruebas** de la semana 6, nunca contra la de desarrollo.
3. Si el proyecto tiene login, la sesión se prepara **una sola vez** y se reutiliza, no se hace por la UI en cada test (ver "Authentication" en la webgrafía).

Después, cada integrante escribe **al menos 2 tests** de su flujo:

1. Locators accesibles (`getByRole`, `getByLabel`). Si un elemento no tiene nombre accesible, arréglalo en el componente antes de recurrir a `getByTestId`: también es un defecto de accesibilidad.
2. Aserciones web-first y **ningún** `waitForTimeout`.
3. Por la UI solo lo que el test prueba. Los datos que necesita se crean por API, con valores únicos.
4. Un caso feliz y al menos un caso de error visible para la persona usuaria (validación, recurso inexistente, permiso denegado).
5. Si dos o más tests repiten pasos de la misma pantalla, un objeto de página sin aserciones.
6. El test pasa con `pnpm exec playwright test <archivo> --repeat-each=5`.
7. **Mutación**: rompe algo del flujo en la app (un texto, una validación, un `await`) y documenta en el PR qué test lo detectó y con qué mensaje.
8. Commit con tu usuario y PR revisado por otro integrante.

## Parte 3: Cazar defectos de tiempos (45 min)

Sobre los 3 flujos, busquen los dos defectos de la receta en su propia app:

- **Doble envío**: `dblclick` en cada botón que crea, paga o envía algo, con la respuesta del `POST` retrasada. ¿Cuántas peticiones salen? ¿Cuántos registros quedan en la BD?
- **Red lenta**: retrasen las respuestas de carga (`GET`) y usen la app mientras carga. ¿Se pierde algo? ¿Se puede hacer clic en algo que todavía no está listo?

Cada defecto encontrado se **reproduce** con un test que falla siempre, y se corrige en la app o se registra como incidencia en el repo con el test marcado con `test.fail()` y un enlace a la incidencia. Si no encuentran ninguno, anoten en el PR qué probaron y con qué retrasos: también es evidencia.

## Parte 4: Cierre de semana, umbral del 75% (30 min)

1. Corran la suite completa en paralelo: `pnpm exec playwright test --repeat-each=5`. Debe pasar entera. Si algún test falla a veces, no lo reintenten: busquen la causa con la tabla de la teoría 2.
2. Con los PR fusionados, anoten en la matriz la cobertura real de frontend y backend.
3. Abran un PR que suba el umbral de **cada** parte al mayor entre **75** y su cobertura real, redondeada hacia abajo.
4. El CI debe quedar en verde (los E2E llegan al CI en la semana 8).

## Entregables

- [ ] Columna S7 de la matriz con E2E para todo el grupo
- [ ] Los 3 flujos críticos anotados en el PR con el porqué de cada uno
- [ ] Al menos 2 E2E por integrante, estables con `--repeat-each=5`, sin `waitForTimeout`
- [ ] Datos preparados por API y, si hay login, sesión reutilizada
- [ ] Un mutante documentado por integrante
- [ ] Defectos de tiempos investigados en los 3 flujos: reproducidos y corregidos o registrados
- [ ] Umbral ≥ 75% en frontend y backend, fijado por PR y en verde en CI

## Preparación para el vocero aleatorio

El instructor escoge a alguien al azar y le pide, sobre un E2E que **no** escribió:

- Explicar qué espera Playwright antes de cada acción y aserción de ese test.
- Cambiar una aserción web-first por una lectura única (`expect(await ...)`) y explicar cuándo fallaría.
- Decir cómo prepara el test sus datos y qué pasaría si corriera dos veces en paralelo.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — Playwright: flujos estables y dos defectos que solo ve el navegador](../2-recetas/playwright/README.md) | [Semana 7](../README.md) | [Ebooks gratuitos — Semana 7](../4-recursos/ebooks-free/README.md) |
