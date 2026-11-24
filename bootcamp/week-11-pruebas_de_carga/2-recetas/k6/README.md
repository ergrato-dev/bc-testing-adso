# Receta — k6: smoke, carga y estrés

> Todos los grupos · Tiempo estimado: 2.5 h

Scripts: [`referencia/carga/`](../../../../referencia/carga/). k6 habla HTTP con el API, así que la receta es la misma para los tres backends. Lo único que cambia es cómo se arranca el API.

## 1. Instalar k6

Usa la versión **2.3.0**, fijada como el resto de dependencias del bootcamp.

| Sistema | Instalación |
|---|---|
| Linux (Debian/Ubuntu) | Descarga `k6-v2.3.0-linux-amd64.deb` de la [página de la versión](https://github.com/grafana/k6/releases/tag/v2.3.0) y `sudo apt install ./k6-v2.3.0-linux-amd64.deb` |
| Windows | Descarga `k6-v2.3.0-windows-amd64.msi` de la misma página y ejecútalo |
| macOS | Descarga el `.zip` de tu procesador (`arm64` para Apple Silicon) y pon `k6` en tu `PATH` |
| Con Docker, sin instalar | `docker run --rm -i --network host grafana/k6:2.3.0 run - < carga/smoke.js` |

```bash
k6 version   # k6 v2.3.0 (...)
```

> 💡 Con Docker Desktop (Windows y macOS), `--network host` no llega a tu equipo. Agrega `-e BASE_URL=http://host.docker.internal:8000` al `docker run`.

## 2. Levantar el API con la BD vacía

Cada corrida empieza con la BD limpia: la prueba de carga registra piezas y la tabla crece.

```bash
cd referencia
docker compose down -v                  # borra lo que haya quedado
docker compose up -d --wait postgres
```

Arranca **un** backend contra esa BD, como en el [paso 2 del README de la referencia](../../../../referencia/README.md#2-correr-un-backend). Debe quedar en `http://localhost:8000`. Deja esa terminal abierta y trabaja en otra, desde `referencia/`.

## 3. Smoke: 1 usuario durante 30 segundos

```js
// carga/smoke.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL ?? 'http://localhost:8000';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],     // menos del 1% de errores
    http_req_duration: ['p(95)<200'],   // el 95% responde en menos de 200 ms
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/pieces`);
  check(res, {
    'status 200': (r) => r.status === 200,
    'devuelve una lista': (r) => Array.isArray(r.json()),
  });
  sleep(1);
}
```

Lo que hace cada parte:

- `options` define la forma de la carga (1 VU, 30 s) y los umbrales.
- La función `default` es el guion que repite cada VU. Cada vuelta es una iteración.
- `check` es una verificación: **no** detiene la prueba si falla, cuenta cuántas pasan.
- `sleep(1)` simula a una persona que lee antes de hacer otra petición.

```bash
k6 run carga/smoke.js
```

Busca en el resumen:

```text
  █ THRESHOLDS
    http_req_duration
    ✓ 'p(95)<200' p(95)=3.65ms
    http_req_failed
    ✓ 'rate<0.01' rate=0.00%

  █ TOTAL RESULTS
    checks_succeeded...: 100.00% 60 out of 60
    http_req_duration..: avg=2.39ms min=1.28ms med=2.23ms max=5.21ms p(90)=2.91ms p(95)=3.65ms
    iterations.........: 30      0.908965/s
```

Tus números serán otros: dependen de tu equipo. Lo que importa es que los umbrales pasen.

**Rómpelo a propósito.** Cambia el umbral a `p(95)<1` y vuelve a correr. k6 marca `✗`, imprime `thresholds on metrics 'http_req_duration' have been crossed` y termina con un código de salida distinto de cero:

```bash
k6 run carga/smoke.js; echo "código de salida: $?"   # 99
```

Eso es lo que hace que un umbral pueda poner el CI en rojo. Deja el umbral como estaba.

## 4. Carga: 20 usuarios haciendo lo de siempre

`carga/carga.js` sube a 20 VUs en 30 s, se mantiene 1 minuto y baja. Cada VU registra una pieza, la consulta y lista todas:

```js
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // rampa de subida
    { duration: '1m', target: 20 },   // carga sostenida
    { duration: '30s', target: 0 },   // rampa de bajada
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    'http_req_duration{name:listar}': ['p(95)<300'],
    'http_req_duration{name:crear}': ['p(95)<300'],
  },
};

export default function () {
  const piece = { name: `Pieza ${__VU}-${__ITER}`, artist: 'k6', year: 2000 };
  const created = http.post(`${BASE_URL}/api/pieces`, JSON.stringify(piece), {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'crear' },
  });
  // ...consultar la pieza creada y listar todas, cada petición con su tag
}
```

- `stages` reemplaza a `vus` y `duration`: k6 ajusta la cantidad de VUs en cada tramo.
- `__VU` y `__ITER` (número de VU y de iteración) hacen único cada nombre.
- `tags: { name: ... }` separa las métricas por endpoint, y los umbrales se aplican a cada uno.

```bash
k6 run carga/carga.js
```

Con Express sobre PostgreSQL, en un portátil:

```text
    http_req_duration{name:crear}:  ✓ 'p(95)<300' p(95)=49.04ms
    http_req_duration{name:listar}: ✓ 'p(95)<300' p(95)=7.51ms
    http_req_failed..: 0.00%  0 out of 5364
    iterations.......: 1788   13.517005/s
```

Pasa. Pero mira lo que quedó en la BD:

```bash
curl -s http://localhost:8000/api/pieces | wc -c   # ~100 KB: 1 788 piezas
```

## 5. Estrés: ¿dónde se rompe?

`carga/estres.js` pide la lista **sin** `sleep`: cada VU pide tan rápido como el API responde. No tiene umbrales, porque no se busca aprobar sino encontrar el límite. Para comparar, córrelo con una cantidad fija de VUs, primero con la BD llena (la que dejó el paso 4):

```bash
k6 run --vus 10 --duration 15s carga/estres.js
```

Ahora vacía la tabla y repite **exactamente** la misma prueba:

```bash
docker compose exec -T postgres psql -U museo -d museo_test -c "TRUNCATE pieces;"
k6 run --vus 10 --duration 15s carga/estres.js
```

Resultados medidos con 10 VUs:

| Backend | Piezas en la tabla | Peticiones/s | p95 |
|---|---:|---:|---:|
| Express | 0 | 4 706 | 3.4 ms |
| Express | 1 788 | 456 | 31 ms |
| FastAPI | 0 | 266 | 50 ms |
| FastAPI | 1 770 | 40 | 361 ms |

El mismo endpoint, con el mismo código y la misma carga, atiende **diez veces menos** peticiones con 1 800 piezas. La causa no es k6 ni la máquina: `GET /api/pieces` devuelve **todas** las piezas en cada petición, sin paginación. Cada pieza nueva hace más lenta la lista para todos.

Ningún test de las semanas 2 a 8 podía encontrarlo: todos corren con unas pocas filas, y con pocas filas la lista es rápida. La prueba de carga lo encontró porque **ella misma** llenó la tabla.

Busca también el punto de quiebre con la tabla llena. Corre `estres.js` completo (sube por escalones de 50 a 400 VUs):

```bash
k6 run carga/estres.js
```

Con Express y 1 788 piezas, las peticiones por segundo se quedan en unas 400 desde los 10 VUs. Todo lo que se agrega después es espera: el p95 sube a casi un segundo y el máximo pasa de 3 s. El API está saturado desde mucho antes de lo que parecía.

> 💡 No corrijas la referencia: es un hueco a propósito. En tu proyecto, la corrección habitual es paginar (`GET /api/pieces?page=1&size=20`) y medir otra vez. La comparación antes y después es la evidencia.

> Si tu backend es Spring Boot, la tabla queda para que la llenes tú: corre las mismas cuatro pruebas y compara.

## 6. Smoke en el CI

La carga completa no va en cada PR (tarda minutos y los runners de GitHub tienen poca CPU). El **smoke** sí: 30 s que detectan si un cambio vuelve lenta la lista. Agrega un paso al job de E2E de la semana 8, después de esperar a que el API responda:

```yaml
      - name: Smoke de carga
        run: docker run --rm -i --network host grafana/k6:2.3.0 run - < referencia/carga/smoke.js
```

El runner de GitHub ya trae Docker, y `--network host` permite llegar a `localhost:8000`. Si el p95 supera los 200 ms, el job sale en rojo.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Métricas y umbrales](../../1-teoria/02-metricas-y-umbrales.md) | [Semana 11 (opcional)](../../README.md) | [Reto — El endpoint más usado del proyecto](../../3-reto/README.md) |
