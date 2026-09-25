# App de referencia — Museo

App mínima que usan todas las recetas del bootcamp. Tiene un frontend React y el **mismo API** implementado en los tres backends, así que puedes combinar el front con cualquiera de ellos.

| Carpeta | Stack | Tests |
|---|---|---|
| [`frontend-react/`](frontend-react/) | React 19 + Vite | Vitest + React Testing Library |
| [`api-express/`](api-express/) | Express 5 + Knex | Vitest + supertest |
| [`api-fastapi/`](api-fastapi/) | FastAPI + SQLAlchemy | pytest + `TestClient` |
| [`api-springboot/`](api-springboot/) | Spring Boot 4 + JPA | JUnit 5 + MockMvc + AssertJ |
| [`e2e/`](e2e/) | Playwright | Tests E2E contra front + cualquier backend |
| [`docker-compose.yml`](docker-compose.yml) | PostgreSQL 18 y MySQL 8.4 **de prueba** | — |

## El API

Los tres backends escuchan en el puerto **8000**, crean la tabla `pieces` al arrancar y cumplen el mismo contrato:

| Método | Ruta | Respuestas |
|---|---|---|
| `GET` | `/api/pieces` | 200 con la lista |
| `GET` | `/api/pieces/{id}` | 200 con la pieza · 404 `{"detail": "piece not found"}` |
| `POST` | `/api/pieces` | 201 con la pieza creada · 422 `{"detail": "..."}` |
| `DELETE` | `/api/pieces/{id}` | 204 · 404 |

Reglas de negocio (en el servicio de cada backend): `name` y `artist` obligatorios, `year` entero y no futuro.

## Arquitectura (lo que hace posible probar cada capa)

```
Controlador / rutas  ──>  Servicio (reglas)  ──>  Repositorio  ──>  BD
     (HTTP)                (sin HTTP ni BD)       (real o en memoria)
```

- El **servicio** no conoce HTTP ni la BD: se prueba con tests unitarios puros.
- El **repositorio** tiene dos versiones: la real (BD) y una **en memoria** para tests sin Docker (Express y FastAPI). En Spring Boot el servicio se reemplaza con `@MockitoBean`.
- La **app** recibe sus dependencias: `createApp(repository)` en Express, `app.dependency_overrides` en FastAPI y `@WebMvcTest` en Spring Boot.

## Estrategia de pruebas

[`ESTRATEGIA.md`](ESTRATEGIA.md) resume qué prueba cada capa de esta app, qué queda fuera y los defectos conocidos. Es el ejemplo del informe que cada grupo entrega en la semana 9.

## Huecos a propósito

La referencia deja algunos defectos y comportamientos sin probar **a propósito**, para que las recetas los descubran. Por ejemplo, ante un JSON mal formado ninguno de los tres backends responde con el formato del contrato (semana 4), y contra la BD real un `name` de 256 caracteres responde `500` en los tres (semana 6). En el frontend, un doble clic en **Guardar** registra la pieza dos veces, y una pieza guardada mientras la lista carga desaparece de la pantalla (semana 7). No los corrijas aquí: la receta de cada semana muestra cómo encontrarlos y arreglarlos.

## 1. Levantar la base de datos de prueba

```bash
cd referencia
docker compose up -d --wait postgres   # o: mysql
```

| Motor | Puerto | Usuario / clave | BD |
|---|---|---|---|
| PostgreSQL | 5433 | `museo` / `museo` | `museo_test` |
| MySQL | 3307 | `museo` / `museo` | `museo_test` |

Los puertos no son los de siempre (5432 y 3306) para no chocar con la BD de desarrollo de tu proyecto. Para apagarla y borrar los datos: `docker compose down -v`.

## 2. Correr un backend

Elige **uno**. Todos quedan en `http://localhost:8000`.

**Express** (Node.js 22 + pnpm)

```bash
cd api-express
pnpm install
pnpm test
DB_CLIENT=pg DATABASE_URL=postgres://museo:museo@localhost:5433/museo_test pnpm start
# MySQL: DB_CLIENT=mysql2 DATABASE_URL=mysql://museo:museo@localhost:3307/museo_test pnpm start
```

**FastAPI** (Python 3.14 + uv)

```bash
cd api-fastapi
uv sync
uv run pytest
DATABASE_URL=postgresql+psycopg://museo:museo@localhost:5433/museo_test uv run uvicorn app.main:app --port 8000
# MySQL: DATABASE_URL=mysql+pymysql://museo:museo@localhost:3307/museo_test ...
```

**Spring Boot** (JDK 21; Maven llega con el wrapper `./mvnw`)

```bash
cd api-springboot
./mvnw verify
DATABASE_URL=jdbc:postgresql://localhost:5433/museo_test ./mvnw spring-boot:run
# MySQL: DATABASE_URL=jdbc:mysql://localhost:3307/museo_test ./mvnw spring-boot:run
```

> En Windows (PowerShell) define la variable antes del comando: `$env:DATABASE_URL="..."` y usa `mvnw.cmd` en Spring Boot.

## 3. Correr el frontend

```bash
cd frontend-react
pnpm install
pnpm test
pnpm dev
```

Vite redirige `/api` al puerto 8000 (ver `vite.config.js`), así que el front funciona con cualquiera de los tres backends.

## 4. Correr los E2E

Con la BD y un backend corriendo:

```bash
cd e2e
pnpm install
pnpm exec playwright install chromium
pnpm test
```

Playwright levanta el frontend por su cuenta (`webServer` en `playwright.config.js`). Si el puerto 5173 está ocupado, usa `FRONT_PORT=5199 pnpm test`.

> Cada comando de test mide la cobertura y **falla si baja del 80%** (umbral en `vitest.config.js`, `vite.config.js`, `pyproject.toml` y `pom.xml`). El CI de este repo ([`.github/workflows/referencia.yml`](../.github/workflows/referencia.yml)) lo exige en cada PR.

> Los tests unitarios y de API **no necesitan Docker**. La BD real solo se usa al correr la app y en los tests de integración de la semana 6.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Rúbrica base semanal](../plantillas/rubrica-grupal.md) | [README del bootcamp](../README.md) | [Estrategia de pruebas — App de referencia Museo](ESTRATEGIA.md) |
