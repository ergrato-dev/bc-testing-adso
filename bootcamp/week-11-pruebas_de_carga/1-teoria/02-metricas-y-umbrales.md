# Métricas y umbrales

> Transversal: aplica a todos los stacks.

## Lo que mide k6

Al terminar, k6 imprime un resumen. Estas son las líneas que importan:

| Métrica | Qué es |
|---|---|
| `http_req_duration` | Tiempo de cada petición, desde que sale hasta que llega la respuesta completa |
| `http_req_failed` | Porcentaje de peticiones fallidas (estado 4xx o 5xx, o sin respuesta) |
| `http_reqs` | Peticiones totales y **por segundo** (*throughput*) |
| `iterations` | Vueltas completas del guion |
| `checks` | Porcentaje de verificaciones (`check`) que pasaron |

`http_req_failed` y `checks` no son lo mismo. Un `200` con una lista vacía cuando debía traer datos no es un fallo para `http_req_failed`. Para eso escribes un `check`.

## Por qué el promedio engaña

```text
http_req_duration: avg=6.69ms med=2.56ms p(90)=6.88ms p(95)=16.33ms max=425.43ms
```

El promedio (`avg`) dice 7 ms y parece bueno. Pero 1 de cada 20 peticiones tardó más de 16 ms, y alguna tardó 425 ms. Si cada persona hace 20 peticiones en una sesión, dos de cada tres viven al menos una de las lentas.

Un **percentil** dice "el X% de las peticiones tardó esto o menos":

| Percentil | Lectura |
|---|---|
| `med` (p50) | La mitad tardó menos que esto |
| `p(95)` | El 95% tardó menos; el 5% más lento, más |
| `p(99)` | Solo el 1% más lento superó esto |

Los acuerdos de rendimiento se escriben con **p95** o **p99**, nunca con el promedio: un promedio bajo esconde a quien espera.

## Umbrales: el test que aprueba o reprueba

Sin umbrales, k6 imprime números y siempre termina "bien". Con `thresholds`, la prueba **falla** si no se cumple el acuerdo, igual que un `expect`:

```js
export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],       // menos del 1% de errores
    http_req_duration: ['p(95)<300'],     // el 95% en menos de 300 ms
  },
};
```

Si un umbral no se cumple, k6 termina con código de salida distinto de cero. Eso es lo que permite ponerlo en el CI de la semana 8: un PR que vuelve lenta la lista sale en rojo.

Los umbrales se pueden aplicar por endpoint con **etiquetas** (`tags`): crear una pieza puede tener un umbral más holgado que listarlas.

```js
'http_req_duration{name:listar}': ['p(95)<300'],
```

¿De dónde sale el número? De lo que la persona usuaria tolera y de una medición previa. Una regla práctica: mide primero, y fija el umbral un poco por encima de lo medido. Así detecta cuando algo empeora sin fallar por ruido.

## El punto de quiebre

En una prueba de estrés no hay umbral que aprobar: se busca **en qué escalón** el sistema cambia de comportamiento. Hay dos señales:

1. **El throughput deja de crecer.** Duplicas los VUs y las peticiones por segundo siguen iguales: el API está saturado. Cada VU nuevo solo agrega espera.
2. **La latencia o los errores se disparan.** El p95 pasa de milisegundos a segundos, o aparecen `5xx` y conexiones rechazadas.

Encontrar el punto de quiebre es solo la mitad. La otra mitad es la **causa**: una consulta sin índice, una lista sin paginación, el pool de conexiones de la BD agotado, un solo proceso atendiendo todo. La receta muestra un caso real en la app de referencia.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Tipos de prueba de carga](01-tipos-de-prueba-de-carga.md) | [Semana 11 (opcional)](../README.md) | [Receta — k6: smoke, carga y estrés](../2-recetas/k6/README.md) |
