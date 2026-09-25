# Receta — Dobles en Spring Boot con Mockito

> Capas API y BD de grupos Spring Boot · Tiempo estimado: 2.5 h

Código: [`referencia/api-springboot/`](../../../../referencia/api-springboot/). No necesitas Docker.

```bash
cd referencia/api-springboot
./mvnw verify
```

---

## Paso 1: La dependencia externa

Abre y sigue el camino del notificador:

1. [`Notifier.java`](../../../../referencia/api-springboot/src/main/java/dev/ergrato/museo/Notifier.java): una interfaz de un solo método. Es **tuya**: no depende de ninguna librería de correo.
2. [`LogNotifier.java`](../../../../referencia/api-springboot/src/main/java/dev/ergrato/museo/LogNotifier.java): la implementación real (`@Component`). En un proyecto sería un correo. Está excluida de JaCoCo: representa un servicio externo.
3. [`PiecesService.java`](../../../../referencia/api-springboot/src/main/java/dev/ergrato/museo/PiecesService.java): recibe `PieceRepository` y `Notifier` por el constructor. En `create`, después de guardar, notifica dentro de un `try/catch`.

Corre `./mvnw verify` y abre `target/site/jacoco/index.html`: en `PiecesService`, el método `create` está en rojo. La cobertura total de líneas está apenas sobre el 80%.

## Paso 2: Agregar el mock del notificador

En [`PiecesServiceTest.java`](../../../../referencia/api-springboot/src/test/java/dev/ergrato/museo/PiecesServiceTest.java), junto al `@Mock` del repositorio:

```java
    @Mock
    private Notifier notifier;
```

`@InjectMocks` construye `PiecesService` con los dos mocks por el constructor.

## Paso 3: Spy con `ArgumentCaptor`, se notifica la pieza guardada

```java
    @Test
    @DisplayName("should notify the saved piece")
    void shouldNotifyTheSavedPiece() {
        // Arrange: save devuelve lo mismo que recibe, como el repositorio real
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        ArgumentCaptor<Piece> captor = ArgumentCaptor.forClass(Piece.class);

        // Act
        service.create(new PieceRequest("Guernica", "Picasso", 1937));

        // Assert: captura el argumento y lo revisa con AssertJ
        verify(notifier).pieceCreated(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("Guernica");
    }
```

Imports nuevos: `org.mockito.ArgumentCaptor` y `static org.mockito.ArgumentMatchers.any`.

## Paso 4: Ni se guarda ni se notifica si la pieza es inválida

```java
    @Test
    @DisplayName("should not save nor notify when request is invalid")
    void shouldNotSaveNorNotifyWhenRequestIsInvalid() {
        assertThatThrownBy(() -> service.create(new PieceRequest("", "Picasso", 1937)))
                .isInstanceOf(PiecesService.ValidationException.class);

        verifyNoInteractions(repository, notifier);
    }
```

## Paso 5: Stub que falla, la pieza se crea igual

`pieceCreated` devuelve `void`, así que el stub se escribe con `doThrow`:

```java
    @Test
    @DisplayName("should return the saved piece when notifier fails")
    void shouldReturnTheSavedPieceWhenNotifierFails() {
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        doThrow(new RuntimeException("smtp down")).when(notifier).pieceCreated(any());

        Piece piece = service.create(new PieceRequest("Guernica", "Picasso", 1937));

        assertThat(piece.getName()).isEqualTo("Guernica");
    }
```

Corre `./mvnw verify` y vuelve al reporte: `create` quedó cubierto y la cobertura total subió.

## Paso 6: Mutaciones

Haz cada una, corre `./mvnw test -Dtest=PiecesServiceTest` y deshazla:

1. Quita el `try/catch` y deja solo `notifier.pieceCreated(piece);`. ¿Qué test falla?
2. Comenta la línea `notifier.pieceCreated(piece);`. ¿Qué test falla? Fíjate en que falla más de uno: el test del Paso 5 prepara un `doThrow` que nunca se usa, y Mockito estricto lo reporta como `UnnecessaryStubbingException`.
3. Mueve la notificación **antes** de `repository.save(...)`, pasándole la pieza sin `id`. ¿Qué verifica el test del Paso 3 y por qué **no** lo detecta? ¿Qué aserción le agregarías?

## Paso 7: ¿Y el controlador?

En `PiecesControllerTest` el servicio completo es un `@MockitoBean`, así que ahí **no** se puede probar la regla del notificador: el código de `create` nunca se ejecuta. Esa es la frontera de cada tipo de test: el controlador se prueba con el servicio simulado, y el servicio con el repositorio y el notificador simulados.

---

## Checklist

- [ ] Seguí el camino del notificador y entendí por qué `Notifier` es una interfaz propia
- [ ] Verifiqué con `ArgumentCaptor` qué pieza se notifica
- [ ] Verifiqué con `verifyNoInteractions` que no se guarda ni se notifica una pieza inválida
- [ ] Probé con `doThrow` que la pieza se crea igual cuando el notificador falla
- [ ] Hice las tres mutaciones y entendí por qué la tercera se escapa
