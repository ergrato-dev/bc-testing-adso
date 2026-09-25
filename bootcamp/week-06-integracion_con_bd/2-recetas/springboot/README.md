# Receta — Integración en Spring Boot con `@DataJpaTest` y `@SpringBootTest`

> Grupos Spring Boot · Tiempo estimado: 2.5 h

Código: [`referencia/api-springboot/`](../../../../referencia/api-springboot/). Esta semana **sí** necesitas Docker.

---

## Paso 1: Una BD de pruebas recién creada

```bash
cd referencia
docker compose down -v                        # borra lo que haya dejado otra receta
docker compose up -d --wait postgres mysql
cd api-springboot
./mvnw verify
```

> Empieza con `down -v`: cada backend crea la tabla `pieces` a su manera. Hibernate crea `id` como `bigint`, y con `ddl-auto=update` incluso **modifica** la columna si la tabla la había creado otro backend con `integer`. Con la BD recién creada, la tabla es la que crea tu backend.

## Paso 2: El repositorio contra la BD real

[`PieceRepository`](../../../../referencia/api-springboot/src/main/java/dev/ergrato/museo/PieceRepository.java) es una interfaz de Spring Data: el SQL lo genera Hibernate. En la semana 4 el controlador se probó con el servicio reemplazado por `@MockitoBean`, y en la semana 5 el servicio con el repositorio reemplazado por `@Mock`. El repositorio real nunca se ha ejecutado en un test.

Crea `src/test/java/dev/ergrato/museo/PieceRepositoryIntegrationTest.java`:

```java
package dev.ergrato.museo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

// @DataJpaTest levanta solo JPA y hace rollback al final de cada test.
// Replace.NONE: usa la BD de DATABASE_URL, no una BD en memoria.
// Sin DATABASE_URL (sin Docker) estos tests se saltan.
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@EnabledIfEnvironmentVariable(named = "DATABASE_URL", matches = ".+")
class PieceRepositoryIntegrationTest {

    @Autowired
    private PieceRepository repository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("should find the piece by id when it was saved")
    void shouldFindThePieceByIdWhenItWasSaved() {
        // Arrange
        Piece saved = repository.save(new Piece("Guernica", "Picasso", 1937));
        // Envía el INSERT y vacía la caché de JPA: el findById debe leer de la BD
        entityManager.flush();
        entityManager.clear();

        // Act
        Piece found = repository.findById(saved.getId()).orElseThrow();

        // Assert
        assertThat(found.getName()).isEqualTo("Guernica");
        assertThat(found.getYear()).isEqualTo(1937);
    }

    @Test
    @DisplayName("should return empty when the piece does not exist")
    void shouldReturnEmptyWhenThePieceDoesNotExist() {
        assertThat(repository.findById(999L)).isEmpty();
    }

    @Test
    @DisplayName("should reject a name longer than the column")
    void shouldRejectANameLongerThanTheColumn() {
        Piece tooLong = new Piece("x".repeat(256), "Picasso", 1937);

        assertThatThrownBy(() -> repository.saveAndFlush(tooLong))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
```

Córrelo sin BD y con cada motor:

```bash
./mvnw verify                                                            # Skipped: 3
DATABASE_URL=jdbc:postgresql://localhost:5433/museo_test ./mvnw verify
DATABASE_URL=jdbc:mysql://localhost:3307/museo_test ./mvnw verify
```

Los tres pasan con los dos motores. Fíjate en tres decisiones:

- **`flush()` y `clear()`**. JPA guarda en una caché (el *contexto de persistencia*) las entidades que ya conoce. Sin esas dos líneas, `findById` devuelve el objeto de la caché y **no ejecuta ningún SELECT**: el test pasa sin haber leído nada de la BD. `@DataJpaTest` muestra el SQL en la salida; compruébalo comentando las dos líneas.
- El tercer test **documenta** una regla de la tabla: la BD rechaza un `name` de 256 caracteres. El test pasa, pero ¿qué responde el API cuando eso ocurre? Lo ves en el paso 3.
- No hay limpieza explícita: `@DataJpaTest` es `@Transactional` y hace rollback al terminar cada test.

## Paso 3: El endpoint contra la BD real

Crea `src/test/java/dev/ergrato/museo/PiecesApiIntegrationTest.java`. Es MockMvc como en la semana 4, pero con la app completa y la BD real, sin `@MockitoBean`:

```java
package dev.ergrato.museo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

// La app completa contra la BD real. @Transactional hace rollback al final de cada test:
// MockMvc corre en el mismo hilo que el test, así que comparte su transacción.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@EnabledIfEnvironmentVariable(named = "DATABASE_URL", matches = ".+")
class PiecesApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PieceRepository repository;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    @DisplayName("should save the piece in the database when body is valid")
    void shouldSaveThePieceInTheDatabaseWhenBodyIsValid() throws Exception {
        mockMvc.perform(post("/api/pieces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Guernica\",\"artist\":\"Picasso\",\"year\":1937}"))
                .andExpect(status().isCreated());

        // Se verifica en la BD, no solo en la respuesta
        assertThat(repository.findAll()).extracting(Piece::getName).containsExactly("Guernica");
    }

    @Test
    @DisplayName("should respond 422 when name is longer than the column")
    void shouldRespond422WhenNameIsLongerThanTheColumn() throws Exception {
        String body = "{\"name\":\"" + "x".repeat(256) + "\",\"artist\":\"Picasso\",\"year\":1937}";

        mockMvc.perform(post("/api/pieces").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.detail").value("name must be at most 255 characters"));
    }

    @Test
    @DisplayName("should list pieces ordered by id")
    void shouldListPiecesOrderedById() throws Exception {
        // Arrange: se insertan directo en la BD, con los ids en desorden
        jdbc.update("INSERT INTO pieces (id, name, artist, year) VALUES (2, 'Las meninas', 'Velázquez', 1656)");
        jdbc.update("INSERT INTO pieces (id, name, artist, year) VALUES (1, 'Guernica', 'Picasso', 1937)");

        mockMvc.perform(get("/api/pieces"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }
}
```

Córrelo con los dos motores. **Fallan**:

| Test | PostgreSQL | MySQL |
|---|---|---|
| `name` de 256 caracteres | `DataIntegrityViolationException`: *value too long for type character varying(255)* | `DataIntegrityViolationException`: *Data too long for column 'name'* |
| Lista ordenada por id | `expected:<1> but was:<2>` | ✓ pasa |

El primero no es una aserción fallida: MockMvc lanza en el test la excepción que ningún `@ExceptionHandler` manejó. Con un servidor real es un `500`. En la semana 4 no aparecía porque el servicio era un `@MockitoBean` y nunca llegaba a la BD.

El segundo es un hallazgo propio de Spring Boot: `findAll()` de Spring Data no ordena. Los backends de Express y FastAPI ordenan la lista por id, así que el frontend recibe las piezas en otro orden según el backend. PostgreSQL devuelve las filas en el orden en que las guardó; MySQL (InnoDB) las guarda ordenadas por la llave primaria, y por eso ahí el defecto no se ve.

## Paso 4: Corregir en el servicio

Las dos correcciones van en [`PiecesService.java`](../../../../referencia/api-springboot/src/main/java/dev/ergrato/museo/PiecesService.java). Primero el límite, encima del `Logger`:

```java
    // Límite de la columna name: VARCHAR(255)
    private static final int MAX_NAME_LENGTH = 255;
```

En `validate`, después de la regla de `name is required`:

```java
        if (request.name().strip().length() > MAX_NAME_LENGTH) {
            throw new ValidationException("name must be at most " + MAX_NAME_LENGTH + " characters");
        }
```

Y en `list`, el orden explícito (con `import org.springframework.data.domain.Sort;`):

```java
        return repository.findAll(Sort.by("id"));
```

La regla nueva es lógica de negocio: su prueba principal es **unitaria**, rápida y sin Docker. En [`PiecesServiceTest.java`](../../../../referencia/api-springboot/src/test/java/dev/ergrato/museo/PiecesServiceTest.java), agrega los dos lados del límite:

```java
    @Test
    @DisplayName("should throw ValidationException when name is longer than 255 characters")
    void shouldThrowWhenNameIsLongerThan255Characters() {
        var request = new PieceRequest("x".repeat(256), "Picasso", 1937);

        assertThatThrownBy(() -> PiecesService.validate(request, 2026))
                .isInstanceOf(PiecesService.ValidationException.class)
                .hasMessage("name must be at most 255 characters");
    }

    @Test
    @DisplayName("should accept a name of exactly 255 characters")
    void shouldAcceptANameOfExactly255Characters() {
        var request = new PieceRequest("x".repeat(255), "Picasso", 1937);

        assertThat(PiecesService.validate(request, 2026).getName()).hasSize(255);
    }
```

Corre `./mvnw verify` sin BD y luego con cada motor: todo en verde, con la regla de cobertura de JaCoCo cumplida. Córrelo **dos veces seguidas** con la misma BD, y al final revisa que la tabla quedó vacía:

```bash
docker compose exec postgres psql -U museo -d museo_test -c "select count(*) from pieces"
```

> `artist` tiene la misma columna `VARCHAR(255)` y el mismo defecto. Escribe tú el test de integración que lo demuestra y la regla que lo corrige.

## Paso 5: Mutaciones

Haz cada una, corre los tests y deshazla:

1. En `PieceRepositoryIntegrationTest`, comenta `entityManager.flush()` y `entityManager.clear()`. El test sigue en verde. Busca en la salida las líneas `Hibernate: select`: ¿cuántas hay ahora? ¿Qué está probando el test sin esas dos líneas?
2. En `PiecesService.list`, vuelve a `repository.findAll()`. Con PostgreSQL el test de orden falla; con MySQL **pasa**. ¿Qué te dice esto sobre probar contra el mismo motor que usa tu proyecto?
3. En `PiecesApiIntegrationTest`, comenta `@Transactional` y corre la suite con PostgreSQL dos veces. ¿Qué tests fallan en cada corrida y por qué? Al terminar, vacía la tabla con `docker compose exec postgres psql -U museo -d museo_test -c "truncate pieces"`.

---

## Checklist

- [ ] Empecé con una BD recién creada (`docker compose down -v`)
- [ ] Probé el repositorio contra PostgreSQL y MySQL, forzando la lectura con `flush()` y `clear()`
- [ ] Vi los tests de integración como *skipped* al correr sin `DATABASE_URL`
- [ ] Encontré el `500` por longitud y la lista sin orden, que los mocks no mostraban, y los corregí en el servicio
- [ ] Probé la regla nueva con tests unitarios en su valor límite
- [ ] Corrí la suite dos veces seguidas y verifiqué que la tabla quedó vacía
- [ ] Hice las tres mutaciones y expliqué qué detecta cada una

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — Integración en Express con Knex y truncado](../express/README.md) | [Semana 6](../../README.md) | [Reto — La base de datos del proyecto formativo desde cuatro ángulos](../../3-reto/README.md) |
