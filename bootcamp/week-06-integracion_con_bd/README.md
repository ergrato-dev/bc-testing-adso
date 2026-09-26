# Semana 6 — Integración con BD real

> Semana 6 de 9 (+1 opcional) · **Rotación de capas** · Piso de cobertura: **70%**

Hasta ahora tus tests de backend usaron un repositorio falso: rápido, sin Docker, y útil para probar reglas y contrato. Pero el fake **no es** la base de datos. No tiene tipos de columna, ni longitudes máximas, ni restricciones. Esta semana corres los mismos escenarios contra PostgreSQL o MySQL reales, en una BD de pruebas desechable, y ves lo que los dobles no ven: en los tres backends de la referencia, un nombre de 300 caracteres pasa todos los tests de la semana 4 y responde **500** contra la BD real.

---

## Objetivos

Al finalizar esta semana serás capaz de:

1. Explicar qué verifica una prueba de integración y qué defectos encuentra que una unitaria con dobles no ve.
2. Levantar una BD de pruebas desechable con Docker Compose, separada de la BD de desarrollo.
3. Conectar los tests a esa BD por variables de entorno, sin credenciales en el código.
4. Preparar datos semilla por test y limpiar entre tests, con transacción y rollback o con truncado.
5. Probar un repositorio y un endpoint contra PostgreSQL o MySQL reales.
6. Llevar a reglas de negocio las restricciones de la BD que el API debe responder como 4xx, no como 500.

---

## Distribución del tiempo (8 h)

| Actividad | Contenido | Tiempo |
|---|---|---|
| Teoría | Unitaria frente a integración, BD de pruebas desechable, datos y limpieza | 1.5 h |
| Recetas | Integración en tu stack contra PostgreSQL o MySQL en Docker | 2.5 h |
| Reto | La BD del proyecto desde cuatro ángulos + umbral del 70% | 3 h |
| Revisión | Vocero aleatorio y retro | 1 h |

---

## Contenido

### Teoría

1. [Lo que los dobles no ven](1-teoria/01-unitaria-vs-integracion.md)
2. [Una BD de pruebas desechable](1-teoria/02-bd-de-pruebas.md)
3. [Datos semilla y limpieza entre tests](1-teoria/03-datos-y-limpieza.md)

### Recetas

Cada integrante hace la receta de **su backend**:

| Receta | Para quién |
|---|---|
| [FastAPI: SQLAlchemy con rollback por test](2-recetas/fastapi/README.md) | Grupos FastAPI |
| [Express: Knex con truncado por test](2-recetas/express/README.md) | Grupos Express |
| [Spring Boot: `@DataJpaTest` y `@SpringBootTest` contra la BD real](2-recetas/springboot/README.md) | Grupos Spring Boot |

Todas las recetas funcionan con PostgreSQL y con MySQL. La capa Front hace la receta de su backend y además la parte de contraste con MSW del [reto](3-reto/README.md).

### Reto

- [La base de datos del proyecto formativo desde cuatro ángulos](3-reto/README.md)

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

Los proyectos NN Auth son apps reales (registro, verificación de email por correo, login y dashboard) con los tres backends del bootcamp, React y PostgreSQL. Tienen aplicado lo que enseña cada semana y **defectos reales documentados a propósito** para descubrirlos en clase. Muéstralos en vivo después de la receta.

| Stack | Qué mostrar | Cómo verlo |
|---|---|---|
| FastAPI | BD `db-test` en [`docker-compose.yml`](https://github.com/ergrato-dev/proyecto-be_fastapi-fe_react/blob/main/docker-compose.yml); [`conftest.py`](https://github.com/ergrato-dev/proyecto-be_fastapi-fe_react/blob/main/be/app/tests/conftest.py) exige `TEST_DATABASE_URL`, migra con Alembic y aísla cada test con rollback | `docker compose up -d --wait db-test` y `uv run pytest` |
| Express | [`global-setup.ts`](https://github.com/ergrato-dev/proyecto-be_express-fe_react/blob/main/be/src/tests/global-setup.ts) se detiene si la BD no termina en `_test` y migra con Prisma; limpieza con `deleteMany` y archivos en serie ([`vitest.config.ts`](https://github.com/ergrato-dev/proyecto-be_express-fe_react/blob/main/be/vitest.config.ts)) | `pnpm test` (con `be/.env.test`) |
| Spring Boot | [`application-test.yml`](https://github.com/ergrato-dev/proyecto-be_springboot_java-fe_react/blob/main/be/src/test/resources/application-test.yml) lee `TEST_DATABASE_URL`; `@Transactional` hace rollback por test | `./mvnw verify` |

Hallazgo en los tres: **el token de verificación se puede usar dos veces** con dos peticiones simultáneas (ver hallazgos de [FastAPI](https://github.com/ergrato-dev/proyecto-be_fastapi-fe_react/blob/main/docs/testing/hallazgos.md), [Express](https://github.com/ergrato-dev/proyecto-be_express-fe_react/blob/main/docs/testing/hallazgos.md) y [Spring Boot](https://github.com/ergrato-dev/proyecto-be_springboot_java-fe_react/blob/main/docs/testing/hallazgos.md)). Ningún test lo ve: todos hacen una petición a la vez.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Semana 5 — Dobles de prueba](../week-05-dobles_de_prueba/README.md) | [README del bootcamp](../../README.md) | [Lo que los dobles no ven](1-teoria/01-unitaria-vs-integracion.md) |

Siguiente semana: [Semana 7 — Playwright a fondo](../week-07-playwright_a_fondo/README.md)
