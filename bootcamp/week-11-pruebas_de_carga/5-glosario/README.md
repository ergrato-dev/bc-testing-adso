# Glosario — Semana 11

**Etiqueta (tag)**: nombre que se le pone a una petición en k6 (`tags: { name: 'listar' }`) para separar sus métricas y aplicarle un umbral propio.

**Iteración**: una vuelta completa del guion (la función `default`) de un usuario virtual.

**Latencia**: tiempo que tarda una petición en recibir su respuesta. En k6, `http_req_duration`.

**Paginación**: devolver una lista por partes (`?page=1&size=20`) en lugar de entera, para que el costo de cada petición no crezca con los datos.

**Percentil (p95, p99)**: valor por debajo del cual queda ese porcentaje de las mediciones. Un p95 de 300 ms significa que el 95% de las peticiones tardó 300 ms o menos.

**Prueba de carga (load test)**: prueba con la cantidad de usuarios que se espera en uso normal, para comprobar que se cumplen los umbrales.

**Prueba de estrés (stress test)**: prueba que sube la carga por encima de lo esperado hasta encontrar el punto de quiebre.

**Prueba de pico (spike test)**: prueba con una subida brusca y corta de usuarios.

**Prueba de resistencia (soak test)**: prueba con carga normal durante horas, para encontrar fugas de memoria o recursos que se acumulan.

**Punto de quiebre**: cantidad de carga a partir de la cual el throughput deja de crecer, o la latencia o los errores se disparan.

**Rampa**: tramo de la prueba en el que la cantidad de usuarios virtuales sube o baja de forma gradual (`stages` en k6).

**Smoke (prueba de humo)**: prueba de carga mínima (1 o 2 usuarios) para comprobar que el script y el API funcionan antes de cargar de verdad.

**Throughput**: cantidad de peticiones que el sistema atiende por unidad de tiempo, normalmente por segundo.

**Umbral (threshold)**: condición sobre una métrica (`p(95)<300`) que hace fallar la prueba si no se cumple.

**Usuario virtual (VU)**: cada uno de los usuarios simulados por k6. Repite el guion mientras dura la prueba.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Webgrafía — Semana 11](../4-recursos/webgrafia/README.md) | [Semana 11 (opcional)](../README.md) | [Rúbrica de evaluación — Semana 11 (opcional)](../rubrica-evaluacion.md) |
