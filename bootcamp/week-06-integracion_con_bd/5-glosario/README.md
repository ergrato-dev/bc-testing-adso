# Glosario — Semana 6

**BD de pruebas desechable**: base de datos que solo usan los tests y que se puede borrar y crear de nuevo sin perder nada. En este bootcamp, un contenedor de Docker Compose.

**Contexto de persistencia**: caché de JPA con las entidades que ya cargó o guardó. Mientras una entidad esté ahí, `findById` la devuelve sin consultar la BD.

**`DATABASE_URL`**: variable de entorno con la cadena de conexión a la BD. La leen la app y los tests, así nadie escribe credenciales en el código.

**`@DataJpaTest`**: anotación de Spring Boot que levanta solo la capa JPA y hace rollback al final de cada test.

**Datos semilla**: registros que un test inserta en su Arrange para tener un punto de partida conocido.

**`docker compose down -v`**: apaga los contenedores y borra sus volúmenes, es decir, los datos de la BD.

**`fileParallelism`**: opción de Vitest que decide si los archivos de test corren en paralelo. Con una sola BD compartida se desactiva.

**`flush`**: operación de JPA o SQLAlchemy que envía a la BD los cambios pendientes de la sesión sin confirmar la transacción.

**Healthcheck**: comando con el que Docker comprueba si un servicio está listo. `docker compose up --wait` espera a que pase.

**Integración (prueba de)**: prueba que ejecuta tu código junto con un sistema real, como la base de datos, para verificar que se entienden.

**`join_transaction_mode`**: opción de la `Session` de SQLAlchemy que decide qué pasa con sus `commit()` y `rollback()` cuando la conexión ya tiene una transacción abierta. Con `"create_savepoint"` se convierten en savepoints.

**Migración**: script versionado que crea o modifica el esquema de la BD (Alembic, migraciones de Knex, Flyway). Garantiza el mismo esquema en desarrollo, pruebas y producción.

**Modo estricto de MySQL**: configuración (`STRICT_TRANS_TABLES`) que hace que MySQL rechace un valor inválido en lugar de truncarlo o ajustarlo en silencio.

**Rollback**: deshacer todo lo hecho dentro de una transacción. Como estrategia de limpieza, cada test corre en una transacción que nunca se confirma.

**Savepoint**: punto dentro de una transacción al que se puede volver sin deshacer toda la transacción.

**Skip (test saltado)**: test que el runner no ejecuta porque no se cumple una condición, como la falta de `DATABASE_URL`. Aparece como *skipped*, no como aprobado.

**Testcontainers**: librería que levanta contenedores de Docker desde el propio código de test.

**Truncado (`TRUNCATE`)**: vaciar una tabla completa de una sola vez. Como estrategia de limpieza, se hace antes de cada test.

**`VARCHAR(n)`**: tipo de columna de texto con longitud máxima `n`. La BD rechaza un valor más largo; un repositorio falso no.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Webgrafía — Semana 6](../4-recursos/webgrafia/README.md) | [Semana 6](../README.md) | [Rúbrica de evaluación — Semana 6](../rubrica-evaluacion.md) |
