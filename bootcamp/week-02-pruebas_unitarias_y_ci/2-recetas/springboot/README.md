# Receta — Pruebas unitarias en Spring Boot con JUnit 5

> Capas API y BD de grupos Spring Boot · Tiempo estimado: 1.5 h

Código: [`referencia/api-springboot/`](../../../../referencia/api-springboot/). No necesitas Docker ni la BD: las pruebas unitarias no levantan Spring.

```bash
cd referencia/api-springboot
```

---

## Paso 1: Correr la suite y ubicar la unidad

```bash
./mvnw verify
```

La primera vez, Maven descarga dependencias y tarda unos minutos. Al final verás `BUILD SUCCESS`: pasaron los tests **y** la regla de cobertura de JaCoCo.

Abre [`PiecesService.java`](../../../../referencia/api-springboot/src/main/java/dev/ergrato/museo/PiecesService.java) y ubica la unidad de esta receta: `PiecesService.validate(request, currentYear)`.

Fíjate en que:

- Es un método `static`: no necesita el repositorio, ni Spring, ni la BD.
- Recibe `currentYear` como parámetro. `create()` le pasa `Year.now().getValue()`; el test le pasa un año fijo y es **repetible** (la "R" de FIRST).

## Paso 2: Leer los tests existentes

Abre [`PiecesServiceTest.java`](../../../../referencia/api-springboot/src/test/java/dev/ergrato/museo/PiecesServiceTest.java):

- `shouldReturnTrimmedPieceWhenRequestIsValid` sigue AAA con comentarios explícitos y aserciones de AssertJ.
- `shouldThrowWhenDataIsInvalid` usa `@ParameterizedTest` con `@CsvSource`: tres casos, cada uno reportado aparte.
- Fíjate en que la clase **no** tiene `@SpringBootTest`: por eso corre en milisegundos.

Mientras trabajas, corre solo esa clase (sin la regla de cobertura, que se evalúa en `verify`):

```bash
./mvnw test -Dtest=PiecesServiceTest
```

## Paso 3: El bug que nadie ve

En `PiecesService.java`, cambia la regla del año:

```diff
-        if (request.year() > currentYear) {
+        if (request.year() >= currentYear) {
```

Corre los tests: **todos pasan**. Sin embargo, ahora una pieza de este año es rechazada. Ese es el mutante que sobrevive por falta de un caso en el **valor límite**.

## Paso 4: Escribir el test del valor límite

Sin deshacer el cambio, agrega este test en `PiecesServiceTest`:

```java
    @Test
    @DisplayName("should accept a piece from the current year")
    void shouldAcceptAPieceFromTheCurrentYear() {
        // Arrange: el borde exacto de la regla
        var request = new PieceRequest("Recent", "Someone", 2026);

        // Act
        Piece piece = PiecesService.validate(request, 2026);

        // Assert
        assertThat(piece.getYear()).isEqualTo(2026);
    }
```

El test falla con `ValidationException: year cannot be in the future`. **Acabas de matar al mutante.** Deshaz el cambio del Paso 3 y confirma que todo vuelve a verde.

## Paso 5: Ampliar el test parametrizado

Agrega una fila al `@CsvSource` para un artista vacío:

```java
        "Guernica, '', 1937, artist is required",
```

¿Pasa? Ahora prueba con `'   '` (solo espacios). ¿Qué método de `String` hace que también pase?

## Paso 6: Tu propia mutación

Elige otra línea de `validate` y mútala. Ideas:

- Cambia `isBlank()` por `isEmpty()` en la validación de `name`.
- Borra la validación de `year() == null`. ¿Qué error aparece?

Corre los tests. Si ningún test falla, escribe el caso que lo detecta. Deshaz la mutación.

## Paso 7: Leer el reporte de cobertura

```bash
./mvnw verify
```

Abre `target/site/jacoco/index.html` en el navegador y entra a `PiecesService`. Las líneas en rojo no se ejecutaron, y los rombos amarillos marcan ramas de un `if` sin probar. Recuerda lo que aprendiste en el Paso 3: el verde en el reporte no garantiza que la lógica esté verificada.

> 📌 En tu proyecto, si validas con Bean Validation (`@NotBlank`, `@Min`), esas anotaciones se prueban en la capa web (semana 4). Las **reglas de negocio** que dependen de otros datos o del contexto (año actual, stock, estados) viven en el servicio: esas son las que pruebas aquí.

---

## Checklist

- [ ] Ubiqué la unidad y entendí por qué recibe `currentYear`
- [ ] Vi sobrevivir el mutante `>=` con la suite en verde
- [ ] Escribí el test del valor límite y vi cómo lo mata
- [ ] Agregué un caso al test parametrizado
- [ ] Hice mi propia mutación y, si sobrevivió, escribí el test que la detecta

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — Pruebas unitarias en Express con Vitest](../express/README.md) | [Semana 2](../../README.md) | [Receta — CI con GitHub Actions en tu proyecto](../ci/README.md) |
