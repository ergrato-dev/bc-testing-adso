# Semana 11 (opcional) — Pruebas de carga y estrés

> Semana opcional · Tema común: **todo el grupo, sobre el endpoint más usado** · Cobertura: se mantiene **≥ 80%**

Hasta ahora cada test hizo **una** petición y miró si la respuesta era correcta. En producción llegan muchas a la vez. Esta semana mides cómo responde el API con 20, 50 o 200 personas usándolo al mismo tiempo, y encuentras dónde se rompe. La herramienta es **k6**: un solo programa con scripts en JavaScript, igual para los tres backends.

En la app de referencia, la prueba encuentra un defecto que ningún test de las semanas anteriores podía ver: la lista no tiene paginación. Con la tabla vacía, Express responde unas 4 700 peticiones por segundo. Con 1 800 piezas responde menos de 500.

Si la ficha no llega a esta semana, el bootcamp está completo: la semana 9 es el cierre.

---

## Objetivos

Al finalizar esta semana serás capaz de:

1. Distinguir las pruebas de smoke, carga, estrés, pico y resistencia, y qué pregunta responde cada una.
2. Escribir un script de k6 con usuarios virtuales, rampas y verificaciones.
3. Leer percentiles (p95, p99) y explicar por qué el promedio engaña.
4. Convertir un acuerdo de rendimiento en `thresholds` que aprueban o reprueban la prueba.
5. Encontrar el punto de quiebre del API y explicar la causa.

---

## Distribución del tiempo (8 h)

| Actividad | Contenido | Tiempo |
|---|---|---|
| Teoría | Tipos de prueba, métricas y umbrales | 1.5 h |
| Receta | Smoke, carga y estrés con k6 sobre la referencia | 2.5 h |
| Reto | El endpoint más usado del proyecto, medido y con umbrales | 3 h |
| Revisión | Vocero aleatorio y retro | 1 h |

---

## Contenido

### Teoría

1. [Tipos de prueba de carga](1-teoria/01-tipos-de-prueba-de-carga.md)
2. [Métricas y umbrales](1-teoria/02-metricas-y-umbrales.md)

### Receta

| Receta | Para quién |
|---|---|
| [k6: smoke, carga y estrés](2-recetas/k6/README.md) | Todos los grupos (k6 no depende del backend) |

### Reto

- [El endpoint más usado del proyecto, medido y con umbrales](3-reto/README.md)

### Recursos

- [Ebooks gratuitos](4-recursos/ebooks-free/README.md)
- [Videografía](4-recursos/videografia/README.md)
- [Webgrafía](4-recursos/webgrafia/README.md)

### Glosario

- [Términos de la semana](5-glosario/README.md)

### Evaluación

- [Rúbrica de la semana](rubrica-evaluacion.md)

---

## Demostración en proyecto real

Los proyectos NN Auth son apps reales con los tres backends del bootcamp, React y PostgreSQL. Su endpoint de login es un buen candidato para medir en vivo después de la receta: el hash de la contraseña está hecho para ser **lento**, así que el login se satura mucho antes que una lista.

| Stack | Qué mostrar | Cómo verlo |
|---|---|---|
| FastAPI | [proyecto-be_fastapi-fe_react](https://github.com/ergrato-dev/proyecto-be_fastapi-fe_react) | Estrés sobre el login: ¿en qué escalón el p95 pasa de 1 s? |
| Express | [proyecto-be_express-fe_react](https://github.com/ergrato-dev/proyecto-be_express-fe_react) | El mismo script; compara el punto de quiebre con FastAPI |
| Spring Boot | [proyecto-be_springboot_java-fe_react](https://github.com/ergrato-dev/proyecto-be_springboot_java-fe_react) | El mismo script; mira la memoria de la JVM mientras corre |

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Semana 10 (opcional) — TDD](../week-10-tdd/README.md) | [README del bootcamp](../../README.md) | [Tipos de prueba de carga](1-teoria/01-tipos-de-prueba-de-carga.md) |
