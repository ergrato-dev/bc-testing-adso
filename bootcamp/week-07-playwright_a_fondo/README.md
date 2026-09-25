# Semana 7 — Playwright a fondo

> Semana 7 de 9 (+1 opcional) · Tema común: **E2E para todo el grupo** · Piso de cobertura: **75%**

En la semana 1 grabaste tu primer E2E. Seis semanas después tienes tests unitarios, de componentes, de API, con dobles y de integración, y aun así hay defectos que solo aparecen con **la app completa en un navegador real**: con clics de verdad, con la red real y con sus tiempos. En la referencia hay dos. Un doble clic en **Guardar** registra la pieza dos veces. Y si guardas mientras la lista todavía carga, la pieza queda en la BD pero **desaparece de la pantalla**. Ningún test de las semanas anteriores los ve.

Esta semana conviertes los E2E del proyecto en una suite estable, que falla solo cuando la app falla.

---

## Objetivos

Al finalizar esta semana serás capaz de:

1. Elegir locators accesibles y escribir aserciones que esperan solas, sin `waitForTimeout`.
2. Distinguir un test inestable (*flaky*) de un defecto real que solo aparece con ciertos tiempos.
3. Reproducir a propósito condiciones difíciles (doble clic, red lenta) para convertir un fallo ocasional en uno seguro.
4. Preparar y limpiar los datos de cada test por API, sin depender de lo que ya hay en la BD.
5. Organizar los tests con un objeto de página sencillo, sin esconder las aserciones.
6. Diagnosticar un fallo con el reporte HTML y el visor de trazas.

---

## Distribución del tiempo (8 h)

| Actividad | Contenido | Tiempo |
|---|---|---|
| Teoría | Locators y auto-waiting, flakiness, datos por API y objeto de página | 1.5 h |
| Receta | Playwright contra front + API + BD en Docker (común a toda la ficha) | 2.5 h |
| Reto | Los 3 flujos críticos del proyecto en E2E estables + umbral del 75% | 3 h |
| Revisión | Vocero aleatorio y retro | 1 h |

---

## Contenido

### Teoría

1. [Locators y esperas: cómo piensa Playwright](1-teoria/01-locators-y-esperas.md)
2. [Flaky o defecto: los tiempos importan](1-teoria/02-flakiness.md)
3. [Datos por API y objeto de página](1-teoria/03-datos-y-objeto-de-pagina.md)

### Receta

| Receta | Para quién |
|---|---|
| [Playwright: flujos estables y dos defectos que solo ve el navegador](2-recetas/playwright/README.md) | Todo el grupo, con el backend de su stack |

### Reto

- [Los flujos críticos del proyecto formativo en E2E](3-reto/README.md)

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
| [Semana 6 — Integración con BD real](../week-06-integracion_con_bd/README.md) | [README del bootcamp](../../README.md) | [Semana 8 — CI completo y calidad de la suite](../week-08-ci_completo/README.md) |
