# El CI completo: servicios, E2E, caché y artefactos

> Transversal: aplica a todos los stacks. Los ejemplos salen de [`.github/workflows/referencia.yml`](../../../.github/workflows/referencia.yml), que corre en verde en cada push de este repo.

## La forma del workflow

![Jobs del CI completo](../0-assets/02-jobs-del-ci.svg)

| Job | Qué corre | Necesita |
|---|---|---|
| Frontend | Vitest + Testing Library con umbral | Node y pnpm |
| Backend | Unitarias y de API con umbral | El runtime del stack |
| Integración | Los mismos tests del backend **con** `DATABASE_URL` | La BD como servicio |
| E2E | Playwright contra front + backend + BD | Todo lo anterior levantado en el job |

Los jobs corren **en paralelo**. Cada uno arranca en una máquina limpia: lo que instala o levanta un job no existe en otro.

## La BD como servicio

GitHub Actions puede levantar contenedores junto al job con `services`. Es el `docker-compose.yml` de la semana 6, dentro del workflow:

```yaml
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
```

| Parte | Para qué |
|---|---|
| `ports` | El job corre en la máquina y llega al contenedor por `localhost:5433`, el mismo puerto que usas en tu equipo |
| `options` con `--health-cmd` | GitHub espera a que el healthcheck pase antes del primer paso: es el `--wait` de la semana 6 |
| `env` | Las credenciales de una BD desechable que muere con el job. Las de producción irían en *secrets*, nunca aquí |

Después, los tests reciben `DATABASE_URL` como en tu equipo, y los tests de integración **dejan de saltarse**:

```yaml
    env:
      DATABASE_URL: postgres://museo:museo@localhost:5433/museo_test
```

Para MySQL cambian la imagen (`mysql:8.4`), las variables (`MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_ROOT_PASSWORD`), el puerto (`3307:3306`) y el healthcheck (`mysqladmin ping -h 127.0.0.1 -umuseo -pmuseo`).

## E2E en el CI

El job de E2E tiene que hacer a mano lo que hiciste en tres terminales en la semana 7:

1. **Levantar el backend en segundo plano** con `&`. El proceso sigue vivo en los pasos siguientes del mismo job:

   ```yaml
         - name: Start api-express
           working-directory: referencia/api-express
           env:
             DATABASE_URL: postgres://museo:museo@localhost:5433/museo_test
           run: |
             pnpm install
             pnpm start > api.log 2>&1 &
   ```

2. **Instalar el navegador** con sus dependencias del sistema: `pnpm exec playwright install --with-deps chromium`.
3. **Esperar al API sin pausas fijas**: `curl` reintenta hasta que responde.

   ```yaml
         - name: Wait for the API
           run: curl --silent --fail --retry 30 --retry-delay 2 --retry-all-errors http://localhost:8000/api/pieces
   ```

4. **Correr los tests**: Playwright levanta el frontend con su `webServer`, como en tu equipo.

## Caché

Cada job descarga sus dependencias desde cero. La caché guarda el almacén de paquetes entre corridas, con una **clave** calculada a partir de los archivos que declaran las dependencias:

| Stack | Cómo |
|---|---|
| pnpm | `actions/setup-node` con `cache: pnpm` y `cache-dependency-path` |
| uv | `astral-sh/setup-uv` con `enable-cache: true` |
| Maven | `actions/setup-java` con `cache: maven` |

```yaml
      - uses: actions/setup-node@v7.0.0
        with:
          node-version-file: .nvmrc
          # Caché del almacén de pnpm. Este repo no versiona lockfiles (fija versiones
          # exactas en package.json), así que la clave se calcula con package.json
          cache: pnpm
          cache-dependency-path: referencia/${{ matrix.app }}/package.json
```

Si `cache-dependency-path` apunta a un archivo que no existe (por ejemplo un `pnpm-lock.yaml` que tu repo no versiona), el paso **falla** con *Some specified paths were not resolved*. Le pasó a la referencia.

Los navegadores de Playwright no se cachean: la documentación de Playwright recomienda instalarlos en cada corrida, porque restaurarlos tarda casi lo mismo que descargarlos.

## Artefactos

Cuando un job falla, la máquina desaparece. Un **artefacto** guarda archivos del job para descargarlos desde la pestaña **Actions**:

```yaml
      - uses: actions/upload-artifact@v7.0.1
        if: failure()
        with:
          name: e2e-${{ matrix.backend }}
          path: |
            referencia/e2e/playwright-report/
            referencia/${{ matrix.backend }}/api.log
          retention-days: 7
```

| Artefacto | Cuándo | Para qué |
|---|---|---|
| Reporte de Playwright (con trazas) | `if: failure()` | Abrir la traza del test que falló, igual que en tu equipo |
| Log del backend | `if: failure()` | Ver el error del servidor que el navegador solo mostró como un `500` |
| Reporte de cobertura | `if: always()` | Revisar las ramas sin cubrir sin correr nada en local |

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Qué mide la cobertura (y qué no)](01-que-mide-la-cobertura.md) | [Semana 8](../README.md) | [Un CI que no miente](03-un-ci-que-no-miente.md) |
