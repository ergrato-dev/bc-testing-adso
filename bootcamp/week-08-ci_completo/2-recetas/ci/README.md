# Receta — GitHub Actions: BD como servicio, integración, E2E, caché y artefactos

> Todo el grupo; cada integrante arma el job de su capa · Tiempo estimado: 2.5 h

Vas a ampliar el workflow `.github/workflows/tests.yml` que creaste en la semana 2. El modelo es el CI de este repo: [`.github/workflows/referencia.yml`](../../../../.github/workflows/referencia.yml). Todos sus jobs corren en verde en cada push, y cada bloque de esta receta sale de él o de una corrida de verificación con los tests de las semanas 6 y 7.

Las plantillas suponen un repo con las carpetas `frontend/`, `backend/` y `e2e/`, PostgreSQL y las variables de la referencia. Ajusta rutas, puertos, nombres de BD y comandos a tu proyecto.

---

## Paso 1: Ver el CI de la referencia (todo el grupo, 15 min)

1. Abre la pestaña **Actions** del repo del bootcamp y entra al último run del workflow `referencia` en `main`.
2. Abre el job `e2e (api-express)` y recorre los pasos: `Start api-express`, `Wait for the API`, `pnpm test`.
3. Abre el job `api-express` y busca el resumen de Vitest: `19 passed | 8 skipped`. Esos 8 son los tests que se saltan sin BD.
4. Abajo del resumen del run, en **Artifacts**, descarga `coverage-frontend-react` y abre su `index.html`.

## Paso 2: Frontend con caché y artefacto de cobertura (capa Front)

En el job `frontend` de tu workflow, agrega la caché a `setup-node` y un paso final que sube el reporte:

```yaml
      - uses: actions/setup-node@v7.0.0
        with:
          node-version: "22"
          cache: pnpm
          cache-dependency-path: frontend/package.json
      - run: pnpm install
      - run: pnpm test
      - uses: actions/upload-artifact@v7.0.1
        if: always()
        with:
          name: coverage-frontend
          path: frontend/coverage/
          retention-days: 7
```

- `cache-dependency-path` apunta a un archivo que **existe** en el repo. Si tu proyecto versiona `pnpm-lock.yaml`, usa ese; si no, `package.json`. Un archivo inexistente hace fallar el paso con *Some specified paths were not resolved*.
- `if: always()` sube el reporte aunque el umbral falle: es justo cuando más lo necesitas.

Haz push dos veces. En la segunda corrida, el log de `setup-node` dice `Cache restored successfully`.

## Paso 3: Integración con la BD como servicio (capas API y BD)

Agrega un job nuevo. Deja solo el bloque de tu backend.

```yaml
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:18-alpine
        env:
          POSTGRES_USER: museo
          POSTGRES_PASSWORD: museo
          POSTGRES_DB: museo_test
        ports:
          - "5433:5432"
        options: >-
          --health-cmd "pg_isready -U museo -d museo_test"
          --health-interval 2s
          --health-retries 15
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v7.0.1

      # ── Express ──────────────────────────────────────────
      - uses: pnpm/action-setup@v6.1.0
        with:
          package_json_file: backend/package.json
      - uses: actions/setup-node@v7.0.0
        with:
          node-version: "22"
          cache: pnpm
          cache-dependency-path: backend/package.json
      - run: pnpm install && pnpm test
        env:
          DB_CLIENT: pg
          DATABASE_URL: postgres://museo:museo@localhost:5433/museo_test

      # ── FastAPI ──────────────────────────────────────────
      - uses: astral-sh/setup-uv@v10.2.0
        with:
          enable-cache: true
      - run: uv sync && uv run pytest -rs
        env:
          DATABASE_URL: postgresql+psycopg://museo:museo@localhost:5433/museo_test

      # ── Spring Boot ──────────────────────────────────────
      - uses: actions/setup-java@v6.0.1
        with:
          distribution: temurin
          java-version: "21"
          cache: maven
      - run: ./mvnw -B verify
        env:
          DATABASE_URL: jdbc:postgresql://localhost:5433/museo_test
```

`uv run pytest -rs` agrega al final la razón de cada test saltado: si aparece `needs DATABASE_URL`, la variable no llegó.

Con **MySQL**, cambia el servicio (el mismo bloque del [`docker-compose.yml`](../../../../referencia/docker-compose.yml) de la referencia) y la URL:

```yaml
      mysql:
        image: mysql:8.4
        env:
          MYSQL_USER: museo
          MYSQL_PASSWORD: museo
          MYSQL_DATABASE: museo_test
          MYSQL_ROOT_PASSWORD: root
        ports:
          - "3307:3306"
        options: >-
          --health-cmd "mysqladmin ping -h 127.0.0.1 -umuseo -pmuseo"
          --health-interval 2s
          --health-retries 30
```

Haz push y abre el log del job. Compáralo con el del job `backend` de la semana 2:

| Stack | Job `backend` (sin BD) | Job `integration` (con BD) |
|---|---|---|
| Express | `N passed \| M skipped` | `N+M passed`, sin *skipped* |
| FastAPI | `N passed, M skipped` | `N+M passed` |
| Spring Boot | `Skipped: M` | `Skipped: 0` |

Así se ve en la referencia, con los tests de la semana 6: `19 passed | 8 skipped` pasa a `27 passed`; `17 passed, 7 skipped` pasa a `24 passed`; `Skipped: 6` pasa a `Skipped: 0`.

> Si el proyecto usa migraciones (Alembic, Knex, Flyway), córrelas en el job antes de los tests, igual que en tu equipo.

## Paso 4: E2E en el CI (capa E2E)

```yaml
  e2e:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:18-alpine
        env:
          POSTGRES_USER: museo
          POSTGRES_PASSWORD: museo
          POSTGRES_DB: museo_test
        ports:
          - "5433:5432"
        options: >-
          --health-cmd "pg_isready -U museo -d museo_test"
          --health-interval 2s
          --health-retries 15
    steps:
      - uses: actions/checkout@v7.0.1
      - uses: pnpm/action-setup@v6.1.0
        with:
          package_json_file: e2e/package.json
      - uses: actions/setup-node@v7.0.0
        with:
          node-version: "22"

      # Arranca el backend en segundo plano: sigue vivo en los pasos siguientes.
      # Express (para FastAPI o Spring Boot, mira los pasos equivalentes en referencia.yml)
      - name: Start backend
        working-directory: backend
        env:
          DATABASE_URL: postgres://museo:museo@localhost:5433/museo_test
        run: |
          pnpm install
          pnpm start > api.log 2>&1 &

      # Playwright levanta el frontend: necesita sus dependencias
      - run: pnpm install
        working-directory: frontend
      - run: pnpm install
        working-directory: e2e
      - run: pnpm exec playwright install --with-deps chromium
        working-directory: e2e

      # Espera a que el API responda (máximo 60 s), sin sleeps fijos
      - name: Wait for the API
        run: curl --silent --fail --retry 30 --retry-delay 2 --retry-all-errors http://localhost:8000/api/pieces

      - run: pnpm test
        working-directory: e2e

      # Si algo falla, el reporte HTML (con trazas) y el log del backend quedan descargables
      - uses: actions/upload-artifact@v7.0.1
        if: failure()
        with:
          name: e2e-report
          path: |
            e2e/playwright-report/
            backend/api.log
          retention-days: 7
```

Cada job tiene su propia máquina: por eso el servicio de la BD se declara otra vez aquí. Los pasos para arrancar FastAPI (`uv run uvicorn ... &`) y Spring Boot (`./mvnw -B -q package -DskipTests` y luego `java -jar target/*.jar &`) están en el job `e2e` de [`referencia.yml`](../../../../.github/workflows/referencia.yml).

Cambia `/api/pieces` en el `curl` por un endpoint de tu API que responda `200` sin autenticación.

## Paso 5: Provocar el rojo (cada integrante, en su job)

Un job que nunca falla no protege nada. En la rama de tu PR, haz **una** de estas y confirma que el job queda como esperas:

| Capa | Provoca | Resultado esperado |
|---|---|---|
| Front | Sube el umbral a 99 | ❌ con el mensaje del umbral; el artefacto de cobertura se sube igual |
| API / BD | Borra la línea `DATABASE_URL` del paso de tests | ✅ **en verde**, con tests *skipped*: el CI que miente (teoría 3) |
| API / BD | Cambia el puerto de la URL a `5434` | ❌ con error de conexión |
| E2E | Cambia el texto esperado de una aserción | ❌ en el intento y en el `retry #1`; descarga el artefacto y abre la traza |

En la referencia, al correr el CI con los tests de las semanas 6 y 7 pero **sin** sus correcciones, los jobs `backend` quedaron en verde y los de integración y E2E en rojo en los tres backends, con los tres artefactos del reporte de Playwright. Es la razón de esta semana.

Documenta en tu PR el enlace al run en rojo y la corrección.

## Paso 6: Hacer obligatorios los checks nuevos (todo el grupo)

En **Settings → Rules → Rulesets → main protegida → Require status checks to pass**, agrega `integration` y `e2e` junto a los de la semana 2. Abre un PR de prueba con un test roto y confirma que el botón de merge queda deshabilitado.

## Paso 7: Umbral final del 80%

Sube el umbral de frontend y backend a **80** (o a la cobertura real si es mayor, redondeada hacia abajo) en `vite.config.js` o `vitest.config.js`, `pyproject.toml` o `pom.xml`. Con el CI completo en verde, es la condición para sustentar en la semana 9.

---

## Checklist

- [ ] Recorrí el run de la referencia y encontré los tests *skipped* del job `api-express`
- [ ] Mi job usa caché y la segunda corrida la restaura
- [ ] Los tests de integración corren con la BD como servicio, sin *skipped*
- [ ] Los E2E corren en el CI con el backend en segundo plano y sin pausas fijas
- [ ] Los reportes de cobertura y de Playwright quedan como artefactos
- [ ] Provoqué un rojo en mi job y lo documenté
- [ ] Los jobs nuevos son obligatorios en el ruleset y el umbral está en 80%
