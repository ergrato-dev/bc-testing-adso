# Reto — El endpoint más usado del proyecto, medido y con umbrales

> Entregable grupal con evidencia individual · Tiempo estimado: 3 h · Cobertura: se mantiene **≥ 80%** en frontend y backend

> ⚠️ Todo el reto corre contra el API del grupo **en su propio equipo**, con la BD de prueba. Nunca contra el servidor de despliegue del proyecto, un servidor compartido del centro o un servicio de terceros.

## Parte 1: Elegir qué medir (30 min, en grupo)

Semana de tema común: anoten **Carga** en la columna **S11** de la matriz.

1. Elijan los **dos endpoints** más usados del proyecto: el que más se llama (casi siempre una lista o una búsqueda) y el más costoso (un login, un reporte, una creación con varias tablas).
2. Hagan la cuenta de la **carga esperada** (teoría 1) y escríbanla en el PR: cuántas personas, en qué momento pico, cuántas peticiones por minuto.
3. Acuerden los **umbrales** de cada endpoint (p95 y tasa de errores) y justifíquenlos en una línea.
4. Decidan con **cuántos datos** se mide (por ejemplo, 2 000 registros en la tabla principal) y cómo se cargan: un script de semilla o el propio guion de k6.

Repartan el trabajo:

| Parte | Quién |
|---|---|
| Semilla de datos y smoke de los dos endpoints | Una persona |
| Prueba de carga con `stages` y umbrales por endpoint (`tags`) | Una persona |
| Prueba de estrés y punto de quiebre | Una persona |
| Smoke en el CI | Una persona (en grupos de 3, la de la semilla) |

Roten: nadie toma la parte que más se parece a la capa que tuvo en la semana 8.

## Parte 2: Medir (2 h)

Los scripts van en el repo del proyecto, en una carpeta `carga/`, con la URL en `__ENV.BASE_URL` como en la receta.

1. **Smoke** de los dos endpoints, con `check` sobre el estado **y** el contenido de la respuesta. Si el endpoint pide autenticación, el token se obtiene en la función `setup()` del script ([documentación](https://grafana.com/docs/k6/latest/using-k6/test-lifecycle/)).
2. **Carga** con rampa, meseta y bajada hasta la carga esperada del paso 1, y umbrales por endpoint. Debe pasar.
3. **Estrés** por escalones. Anoten en una tabla, por escalón: VUs, peticiones por segundo, p95 y tasa de errores. Marquen el escalón donde el throughput deja de crecer o los errores aparecen.
4. **Causa**: expliquen **por qué** se rompe ahí. Algunas pistas: una consulta que trae toda la tabla, un índice que falta, el pool de conexiones de la BD, un solo worker (uvicorn sin `--workers`), un hash de contraseña lento. Si encuentran un defecto, abran una incidencia.
5. **Smoke en el CI**: el smoke corre en el workflow del proyecto después de que el API responde, y un umbral roto pone el job en rojo. Muéstrenlo con un PR de prueba que rompa el umbral a propósito.

## Parte 3: Cierre (30 min, en grupo)

1. Corran la carga y el estrés otra vez, desde la BD limpia, y comprueben que los números se parecen. Si cambian mucho entre corridas, anoten por qué.
2. Si corrigieron algo (paginación, un índice), dejen la tabla **antes y después** con la misma prueba.
3. CI completo en verde y cobertura ≥ 80%.

## Entregables

- [ ] Columna S11 de la matriz
- [ ] Cuenta de la carga esperada, umbrales justificados y cantidad de datos en el PR
- [ ] Scripts de smoke, carga y estrés en `carga/`, cada uno con el nombre de quien lo escribió en el PR
- [ ] Tabla del estrés con el punto de quiebre marcado y su causa explicada
- [ ] Smoke en el CI, con el PR que lo pone en rojo a propósito
- [ ] Incidencia abierta si la causa del punto de quiebre es un defecto
- [ ] CI completo en verde y cobertura ≥ 80%

## Preparación para el vocero aleatorio

El instructor escoge a alguien al azar y le pide, sobre una parte que **no** escribió:

- Leer el resumen de una corrida: qué dice el p95, por qué no basta el promedio.
- Señalar el punto de quiebre en la tabla y explicar la causa.
- Cambiar un umbral en vivo para que falle y explicar por qué el CI se pondría en rojo.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — k6: smoke, carga y estrés](../2-recetas/k6/README.md) | [Semana 11 (opcional)](../README.md) | [Ebooks gratuitos — Semana 11](../4-recursos/ebooks-free/README.md) |
