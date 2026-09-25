# Una BD de pruebas desechable

> Transversal: aplica a todos los stacks.

## Nunca la BD de desarrollo

Los tests de integración escriben y borran datos. Si apuntan a la BD de desarrollo:

- **Destruyen tus datos**: un truncado limpia la tabla que usabas para probar la app a mano.
- **Fallan al azar**: un test que espera una lista vacía encuentra las piezas que creaste ayer.
- **No se pueden repetir**: en el computador de otro integrante la BD tiene otros datos.

La solución es una BD **solo para tests**, que puedes borrar y crear de nuevo en segundos sin perder nada.

![La BD de desarrollo y la BD de pruebas, separadas](../0-assets/02-bd-de-pruebas.svg)

## Docker Compose

La referencia ya trae una en [`referencia/docker-compose.yml`](../../../referencia/docker-compose.yml). Lo importante de ese archivo:

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:18-alpine      # la misma versión mayor que producción
    environment:
      POSTGRES_USER: museo
      POSTGRES_PASSWORD: museo     # clave de una BD local desechable, no de producción
      POSTGRES_DB: museo_test
    ports:
      - "5433:5432"                # puerto distinto al de la BD de desarrollo
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U museo -d museo_test"]
      interval: 2s
      retries: 15
```

| Decisión | Por qué |
|---|---|
| Puerto 5433 (MySQL: 3307) | No choca con la BD de desarrollo en 5432 o 3306 |
| Nombre `museo_test` | Si algo apunta a la BD equivocada, el nombre lo delata |
| `healthcheck` | Docker sabe cuándo la BD está lista para recibir conexiones |
| Sin volumen con nombre | `docker compose down -v` borra todo: la BD es desechable |

Los comandos del día:

```bash
docker compose up -d --wait postgres   # --wait espera al healthcheck
docker compose down -v                 # apaga y borra los datos
```

Sin `--wait`, los tests pueden arrancar antes de que la BD acepte conexiones y fallan con `ECONNREFUSED` o `Connection refused`.

## La conexión llega por variable de entorno

El test no sabe usuario, clave ni puerto: los lee de `DATABASE_URL`, igual que la app. Así el mismo test corre en tu equipo, en el de tus compañeros y en el CI de la semana 8.

```bash
# Express
DB_CLIENT=pg DATABASE_URL=postgres://museo:museo@localhost:5433/museo_test pnpm test

# FastAPI
DATABASE_URL=postgresql+psycopg://museo:museo@localhost:5433/museo_test uv run pytest

# Spring Boot
DATABASE_URL=jdbc:postgresql://localhost:5433/museo_test ./mvnw verify
```

> ⚠️ Ninguna credencial va en un archivo de test. Ni siquiera la de la BD de prueba: el día que alguien copie el test para otro entorno, la clave viaja con él.

## Sin BD, el test se salta

Los tests unitarios y de API no necesitan Docker, y así debe seguir. Los de integración se **saltan** cuando no hay `DATABASE_URL`:

```javascript
// Express (Vitest)
describe.skipIf(!process.env.DATABASE_URL)('knex repository', () => { /* ... */ });
```

```python
# FastAPI (pytest)
pytestmark = pytest.mark.skipif(not os.environ.get("DATABASE_URL"), reason="needs DATABASE_URL")
```

```java
// Spring Boot (JUnit 5)
@EnabledIfEnvironmentVariable(named = "DATABASE_URL", matches = ".+")
class PieceRepositoryIntegrationTest { /* ... */ }
```

El reporte los muestra como *skipped*, no como aprobados. Revisa ese número: un test de integración que siempre se salta no prueba nada. En la semana 8 el CI levanta la BD y define `DATABASE_URL`, así que ahí corren siempre.

## El esquema

La BD de pruebas empieza vacía. La tabla tiene que existir antes del primer test:

| Stack | En la referencia | En un proyecto real |
|---|---|---|
| Express | `ensureSchema(db)` | Migraciones de Knex (`knex migrate:latest`) |
| FastAPI | `Base.metadata.create_all(engine)` | Migraciones de Alembic (`alembic upgrade head`) |
| Spring Boot | `ddl-auto=update` | Flyway o Liquibase |

Cada backend crea la tabla a su manera: Knex y SQLAlchemy crean `id` como `integer`, Hibernate como `bigint`, y `ddl-auto=update` llega a **modificar** la columna de una tabla que ya existía. El esquema de los tests depende de qué backend creó o tocó la tabla por última vez. Con migraciones hay un solo esquema, versionado junto al código.

Si tu proyecto usa migraciones, córrelas contra la BD de pruebas antes de los tests. Así pruebas también las migraciones: una migración rota falla aquí y no el día del despliegue.

## Una alternativa: Testcontainers

[Testcontainers](https://testcontainers.com/) levanta el contenedor desde el propio test y lo apaga al terminar, sin `docker compose`. Existe para Java, Node.js y Python. Es cómodo, pero agrega una dependencia y oculta la BD; en este bootcamp usamos Docker Compose porque es la misma herramienta que ya usas para desarrollar y porque puedes conectarte a la BD de pruebas para ver qué dejó un test.
