# Receta — TDD en Spring Boot con JUnit 5

> Grupos Spring Boot · Tiempo estimado: 2.5 h

Código: [`referencia/api-springboot/`](../../../../referencia/api-springboot/). No necesitas Docker: el servicio se prueba con el repositorio reemplazado por Mockito, y el controlador con `@WebMvcTest`.

```bash
cd referencia/api-springboot
./mvnw test
```

Durante los ciclos usa `./mvnw test` (más rápido); al final, `./mvnw verify` con la regla de cobertura.

**La historia**: como visitante del museo, quiero filtrar la lista por artista (`GET /api/pieces?artist=picasso`), sin importar mayúsculas ni espacios, para encontrar sus obras.

Lista de pruebas (teoría 2):

```text
[ ] filtra por el nombre exacto del artista
[ ] no importan las mayúsculas
[ ] no importan los espacios alrededor
[ ] si el artista viene en blanco, devuelve todo
[ ] el API recibe el filtro como ?artist=
```

---

## Ciclo 1: filtra por el nombre exacto

**Red**. En [`PiecesServiceTest.java`](../../../../referencia/api-springboot/src/test/java/dev/ergrato/museo/PiecesServiceTest.java), agrega `import java.util.List;` y este test al final de la clase:

```java
    @Test
    @DisplayName("should return only the pieces of the given artist")
    void shouldReturnOnlyThePiecesOfTheGivenArtist() {
        // Arrange
        var guernica = new Piece("Guernica", "Picasso", 1937);
        var meninas = new Piece("Las meninas", "Velázquez", 1656);
        when(repository.findAll()).thenReturn(List.of(guernica, meninas));

        // Act
        List<Piece> pieces = service.list("Picasso");

        // Assert
        assertThat(pieces).containsExactly(guernica);
    }
```

`./mvnw test` falla **al compilar**: `method list in class dev.ergrato.museo.PiecesService cannot be applied to given types`. En Java, "no compila" es el primer rojo.

**Green**. Tres cambios mínimos para compilar y pasar:

1. En [`PiecesService.java`](../../../../referencia/api-springboot/src/main/java/dev/ergrato/museo/PiecesService.java), el método recibe el artista:

   ```java
       public List<Piece> list(String artist) {
           List<Piece> pieces = repository.findAll();
           if (artist == null) {
               return pieces;
           }
           return pieces.stream().filter(piece -> piece.getArtist().equals(artist)).toList();
       }
   ```

2. En [`PiecesController.java`](../../../../referencia/api-springboot/src/main/java/dev/ergrato/museo/PiecesController.java), el controlador todavía no lee la URL: **falsifica** con `null` (teoría 2), porque ningún test pide más:

   ```java
           return service.list(null);
   ```

3. En [`PiecesControllerTest.java`](../../../../referencia/api-springboot/src/test/java/dev/ergrato/museo/PiecesControllerTest.java), el stub de la semana 4 usa la firma nueva: cambia `when(service.list())` por `when(service.list(null))`.

Cambiar una firma rompe los tests que la usan. Eso no es un rojo del ciclo: es el precio de cambiar un contrato, y los tests te dicen exactamente dónde.

## Ciclo 2: no importan las mayúsculas

**Red**:

```java
    @Test
    @DisplayName("should ignore case when filtering by artist")
    void shouldIgnoreCaseWhenFilteringByArtist() {
        var guernica = new Piece("Guernica", "Picasso", 1937);
        when(repository.findAll()).thenReturn(List.of(guernica));

        assertThat(service.list("picasso")).containsExactly(guernica);
    }
```

**Green**: cambia `equals(artist)` por `equalsIgnoreCase(artist)`.

## Ciclo 3: no importan los espacios

**Red**:

```java
    @Test
    @DisplayName("should ignore surrounding spaces when filtering by artist")
    void shouldIgnoreSurroundingSpacesWhenFilteringByArtist() {
        var guernica = new Piece("Guernica", "Picasso", 1937);
        when(repository.findAll()).thenReturn(List.of(guernica));

        assertThat(service.list("  Picasso ")).containsExactly(guernica);
    }
```

**Green**: `equalsIgnoreCase(artist.strip())`.

## Ciclo 4: en blanco devuelve todo

**Red**:

```java
    @Test
    @DisplayName("should return all pieces when artist is blank")
    void shouldReturnAllPiecesWhenArtistIsBlank() {
        var guernica = new Piece("Guernica", "Picasso", 1937);
        var meninas = new Piece("Las meninas", "Velázquez", 1656);
        when(repository.findAll()).thenReturn(List.of(guernica, meninas));

        assertThat(service.list("   ")).containsExactly(guernica, meninas);
    }
```

**Green**: la condición de salida también cubre el blanco:

```java
        if (artist == null || artist.isBlank()) {
```

## Refactor: el código

Nombra el valor normalizado para que el filtro se lea solo:

```java
        String wanted = artist.strip();
        return pieces.stream().filter(piece -> piece.getArtist().equalsIgnoreCase(wanted)).toList();
```

## Refactor: los tests

Los tres primeros tests son el mismo con otro dato. Reemplázalos por uno parametrizado (con `import org.junit.jupiter.params.provider.ValueSource;`):

```java
    @ParameterizedTest(name = "artist \"{0}\"")
    @DisplayName("should return only the pieces of the given artist")
    @ValueSource(strings = {"Picasso", "picasso", "  Picasso "})
    void shouldReturnOnlyThePiecesOfTheGivenArtist(String artist) {
        // Arrange
        var guernica = new Piece("Guernica", "Picasso", 1937);
        var meninas = new Piece("Las meninas", "Velázquez", 1656);
        when(repository.findAll()).thenReturn(List.of(guernica, meninas));

        // Act
        List<Piece> pieces = service.list(artist);

        // Assert
        assertThat(pieces).containsExactly(guernica);
    }
```

## Ciclo 5: el API recibe el filtro

**Red**. En `PiecesControllerTest.java`:

```java
    @Test
    @DisplayName("should respond 200 with only the pieces of the artist")
    void shouldRespond200WithOnlyThePiecesOfTheArtist() throws Exception {
        when(service.list("picasso")).thenReturn(List.of(new Piece("Guernica", "Picasso", 1937)));

        mockMvc.perform(get("/api/pieces").param("artist", "picasso"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Guernica"));
    }
```

Falla con `No value at JSON path "$[0].name"`: el controlador sigue pasando `null`, el mock no tiene respuesta para esa llamada y devuelve una lista vacía. Es el test que desarma la falsificación del ciclo 1.

**Green**. En `PiecesController.java`, lee el parámetro (con `import org.springframework.web.bind.annotation.RequestParam;`):

```java
    public List<Piece> list(@RequestParam(required = false) String artist) {
        return service.list(artist);
```

Corre `./mvnw verify`: 20 tests en verde y la regla de cobertura de JaCoCo cumplida.

## Mutaciones

1. En `list`, cambia `equalsIgnoreCase(wanted)` por `equals(wanted)`. ¿Qué casos del `@ValueSource` fallan, y por qué `"Picasso"` no?
2. Quita `required = false` del `@RequestParam`. ¿Qué test de la semana 4 se pone en rojo y con qué código HTTP?

---

## Checklist

- [ ] Escribí la lista de pruebas antes del primer test
- [ ] Vi el primer Red como error de compilación y los siguientes como fallos de aserción
- [ ] Falsifiqué el controlador en el ciclo 1 y el ciclo 5 me obligó a leer el parámetro
- [ ] Refactoricé el código y los tests con la suite en verde
- [ ] Hice las dos mutaciones y vi qué tests las detectan
