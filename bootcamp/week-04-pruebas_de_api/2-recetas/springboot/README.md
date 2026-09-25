# Receta — Pruebas de API en Spring Boot con MockMvc

> Grupos Spring Boot · Tiempo estimado: 2.5 h

Código: [`referencia/api-springboot/`](../../../../referencia/api-springboot/). No necesitas Docker: `@WebMvcTest` no crea la conexión a la BD.

```bash
cd referencia/api-springboot
./mvnw verify
```

---

## Paso 1: Qué levanta `@WebMvcTest`

Abre [`PiecesControllerTest.java`](../../../../referencia/api-springboot/src/test/java/dev/ergrato/museo/PiecesControllerTest.java):

- `@WebMvcTest(PiecesController.class)` crea **solo** la capa web: el controlador, sus `@ExceptionHandler` y la conversión de JSON.
- `@MockitoBean PiecesService service` reemplaza el servicio. Cada test decide qué devuelve o qué excepción lanza con `when(...)`.
- No hay repositorio ni BD: por eso el test corre sin Docker.

Consecuencia importante: como el servicio es un mock, **las reglas de negocio no se ejecutan** en estos tests. Los tests de API verifican que el controlador traduce bien cada resultado del servicio a HTTP. Las reglas ya las cubren los tests unitarios de la semana 2.

## Paso 2: Revisar la cobertura de escenarios

Llena esta tabla con los tests existentes:

| Endpoint | Feliz | Validación (422) | Inexistente (404) | Mal formado (400) |
|---|:---:|:---:|:---:|:---:|
| `GET /api/pieces` | ? | — | — | — |
| `GET /api/pieces/{id}` | ? | — | ? | — |
| `POST /api/pieces` | ? | ? | — | ? |
| `DELETE /api/pieces/{id}` | ? | — | ? | — |

Vas a encontrar dos huecos: uno en `POST` y otro en `DELETE`.

## Paso 3: `DELETE` inexistente

Agrega en `PiecesControllerTest`:

```java
    @Test
    @DisplayName("should respond 404 when deleting a piece that does not exist")
    void shouldRespond404WhenDeletingAMissingPiece() throws Exception {
        // Arrange: el servicio lanza la excepción, como lo haría con un id inexistente
        doThrow(new PiecesService.NotFoundException("piece not found")).when(service).remove(99L);

        // Act + Assert
        mockMvc.perform(delete("/api/pieces/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("piece not found"));
    }
```

`remove` devuelve `void`, así que se usa `doThrow(...).when(service).remove(...)` en lugar de `when(...).thenThrow(...)`. Importa `doThrow` desde `org.mockito.Mockito`.

## Paso 4: ¿Qué responde tu API a un JSON mal formado?

Agrega:

```java
    @Test
    @DisplayName("should respond 400 with detail when body is malformed JSON")
    void shouldRespond400WhenBodyIsMalformed() throws Exception {
        mockMvc.perform(post("/api/pieces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value("malformed request body"));
    }
```

Córrelo con `./mvnw test -Dtest=PiecesControllerTest`. **Falla**: el código `400` es correcto, pero no hay `detail`. En el log aparece `HttpMessageNotReadableException`: Spring rechazó el JSON antes de llegar al controlador. Con la app corriendo de verdad, la respuesta es el JSON genérico de Spring (`timestamp`, `status`, `error`, `path`), no el formato del contrato.

## Paso 5: Corregir el contrato

Agrega en [`PiecesController.java`](../../../../referencia/api-springboot/src/main/java/dev/ergrato/museo/PiecesController.java), junto a los otros `@ExceptionHandler`:

```java
    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<Map<String, String>> handleUnreadable() {
        return ResponseEntity.badRequest().body(Map.of("detail", "malformed request body"));
    }
```

(importa `org.springframework.http.converter.HttpMessageNotReadableException`). Corre `./mvnw verify`: el test pasa y la cobertura cumple el umbral.

**Mutación**: comenta la anotación `@ExceptionHandler` del método nuevo. El test debe volver a fallar. Deshaz el comentario.

> 💡 En un proyecto con varios controladores, estos manejadores se mueven a una clase `@RestControllerAdvice` para que apliquen a todos. En `@WebMvcTest`, esa clase se carga automáticamente.

## Paso 6: Tipos incorrectos

Escribe un test para `year` como texto:

```java
    @Test
    @DisplayName("should respond 400 when year is not a number")
    void shouldRespond400WhenYearIsNotANumber() throws Exception {
        mockMvc.perform(post("/api/pieces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"G\",\"artist\":\"P\",\"year\":\"abc\"}"))
                .andExpect(status().isBadRequest());
    }
```

Pasa: Jackson no puede convertir `"abc"` en `Integer` y lanza la misma `HttpMessageNotReadableException`. Fíjate en la diferencia con un año futuro: ese es un JSON válido que rompe una **regla** y responde `422` desde el servicio. Discútelo en tu grupo y deja la decisión fijada en el test.

## Paso 7: Encabezados

Agrega a un test de error:

```java
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
```

(importa `content` desde `MockMvcResultMatchers`).

---

## Checklist

- [ ] Entendí qué levanta `@WebMvcTest` y qué reemplaza `@MockitoBean`
- [ ] Llené la tabla de escenarios y encontré los dos huecos
- [ ] Probé un `DELETE` inexistente con `doThrow`
- [ ] Descubrí la respuesta sin `detail` ante un JSON mal formado y la corregí
- [ ] Hice la mutación del manejador y vi fallar el test
- [ ] Fijé con un test el comportamiento ante tipos incorrectos

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — Pruebas de API en Express con supertest](../express/README.md) | [Semana 4](../../README.md) | [Reto — El API del proyecto formativo desde cuatro ángulos](../../3-reto/README.md) |
