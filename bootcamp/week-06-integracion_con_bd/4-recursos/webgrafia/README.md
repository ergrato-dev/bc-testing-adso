# Webgrafía — Semana 6

## Conceptos

- [Integration Test — Martin Fowler](https://martinfowler.com/bliki/IntegrationTest.html) (en inglés): los dos significados de "prueba de integración" y por qué conviene precisar cuál usas
- [Testcontainers — guías](https://testcontainers.com/guides/) (en inglés): la alternativa a Docker Compose que levanta la BD desde el test

## BD y Docker

| Tema | Documentación |
|---|---|
| Docker Compose | [`docker compose up` y la opción `--wait`](https://docs.docker.com/reference/cli/docker/compose/up/) |
| PostgreSQL | [`TRUNCATE`, `RESTART IDENTITY` y `CASCADE`](https://www.postgresql.org/docs/current/sql-truncate.html) |

## Tu stack

| Stack | Documentación |
|---|---|
| Express | [`truncate` en Knex](https://knexjs.org/guide/query-builder.html#truncate) · [`fileParallelism` en Vitest](https://vitest.dev/config/fileparallelism) |
| FastAPI | [Unir una sesión a una transacción externa (para suites de test)](https://docs.sqlalchemy.org/en/21/orm/session_transaction.html#joining-a-session-into-an-external-transaction-such-as-for-test-suites) · [Saltar tests con `skipif`](https://docs.pytest.org/en/stable/how-to/skipping.html) |
| Spring Boot | [`@DataJpaTest`](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html#testing.spring-boot-applications.autoconfigured-spring-data-jpa) · [`@SpringBootTest` con MockMvc](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html#testing.spring-boot-applications.with-mock-environment) · [Ejecución condicional por variable de entorno en JUnit](https://docs.junit.org/current/user-guide/#writing-tests-conditional-execution-environment-variables) |
