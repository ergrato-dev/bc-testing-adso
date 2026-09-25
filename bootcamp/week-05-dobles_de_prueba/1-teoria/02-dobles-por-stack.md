# Dobles en cada stack

> Cada sección indica su stack.

## Vitest (React y Express)

| Herramienta | Qué hace |
|---|---|
| `vi.fn()` | Crea una función doble. Registra sus llamadas |
| `.mockReturnValue(x)` / `.mockResolvedValue(x)` | Stub: devuelve `x` (o una promesa de `x`) |
| `.mockRejectedValue(err)` / `.mockImplementation(() => { throw err })` | Stub que falla |
| `vi.spyOn(objeto, 'metodo')` | Spy sobre un método **existente**; con `.mockImplementation` lo reemplaza |
| `vi.mock('./modulo.js')` | Reemplaza **todas** las exportaciones de un módulo por `vi.fn()` |
| `vi.restoreAllMocks()` | Devuelve los métodos espiados a su implementación original |

Aserciones de comportamiento:

```javascript
expect(notifier.pieceCreated).toHaveBeenCalledOnce();
expect(notifier.pieceCreated).toHaveBeenCalledWith(piece);
expect(notifier.pieceCreated).not.toHaveBeenCalled();
expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('smtp down'));
```

Un doble no necesita librería: un objeto literal con un `vi.fn()` cumple el contrato del notificador.

```javascript
const notifier = { pieceCreated: vi.fn() };
const service = createPiecesService(createMemoryRepository(), notifier);
```

## pytest (FastAPI)

`pytest-mock` entrega el fixture `mocker`, un envoltorio de `unittest.mock` que deshace los cambios al terminar cada test.

| Herramienta | Qué hace |
|---|---|
| `mocker.Mock()` | Objeto doble: cualquier atributo o método que le pidas existe y registra sus llamadas |
| `doble.metodo.return_value = x` | Stub: devuelve `x` |
| `doble.metodo.side_effect = RuntimeError("…")` | Stub que lanza una excepción |
| `mocker.patch("modulo.nombre")` | Reemplaza temporalmente un nombre importado en un módulo |
| `app.dependency_overrides[dep] = lambda: doble` | Inyecta un doble en los endpoints de FastAPI |

```python
notifier = mocker.Mock()
service = PiecesService(MemoryRepository(), notifier)

piece = service.create(GUERNICA)

notifier.piece_created.assert_called_once_with(piece)
```

Otras verificaciones: `assert_not_called()`, `assert_called_once()`, `call_count`, `call_args`.

> ⚠️ **`mocker.patch` va donde se usa, no donde se define.** Si `app/service.py` hace `from app.notifier import LogNotifier`, se parchea `"app.service.LogNotifier"`, no `"app.notifier.LogNotifier"`. Por eso es preferible **inyectar** las dependencias (como el `notifier` del servicio) y evitar `patch` cuando se pueda.

Para verificar logs, pytest trae el fixture `caplog`:

```python
def test_create_still_saves_the_piece_when_notifier_fails(mocker, caplog):
    ...
    assert "smtp down" in caplog.text
```

## Mockito (Spring Boot)

| Herramienta | Qué hace |
|---|---|
| `@Mock Notifier notifier` | Crea un mock (requiere `@ExtendWith(MockitoExtension.class)`) |
| `@InjectMocks PiecesService service` | Crea el servicio pasándole los `@Mock` por el constructor |
| `when(mock.metodo(x)).thenReturn(y)` | Stub |
| `doThrow(ex).when(mock).metodoVoid(any())` | Stub que falla, para métodos `void` |
| `verify(mock).metodo(x)` | Verifica una llamada |
| `verifyNoInteractions(mock1, mock2)` | Verifica que no se usó |
| `ArgumentCaptor<T>` | Captura el argumento para revisarlo con AssertJ |

```java
@ExtendWith(MockitoExtension.class)
class PiecesServiceTest {

    @Mock
    private PieceRepository repository;

    @Mock
    private Notifier notifier;

    @InjectMocks
    private PiecesService service;

    @Test
    @DisplayName("should notify the saved piece")
    void shouldNotifyTheSavedPiece() {
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        ArgumentCaptor<Piece> captor = ArgumentCaptor.forClass(Piece.class);

        service.create(new PieceRequest("Guernica", "Picasso", 1937));

        verify(notifier).pieceCreated(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("Guernica");
    }
}
```

`thenAnswer(invocation -> invocation.getArgument(0))` hace que `save` devuelva lo mismo que recibió, como haría el repositorio real.

> Mockito es **estricto** con `MockitoExtension`: si preparas un stub que el test nunca usa, el test falla con `UnnecessaryStubbingException`. Es una ayuda: te avisa de código muerto en el Arrange.

## MSW (frontend)

`vi.mock('../src/api.js')` reemplaza el módulo completo, así que el código de `api.js` **nunca se ejecuta** en los tests. MSW (Mock Service Worker) intercepta la **petición HTTP** y deja correr tu cliente real:

```javascript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/pieces', () => HttpResponse.json([{ id: 1, name: 'Guernica', artist: 'Picasso', year: 1937 }])),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Dentro de un test, `server.use(...)` cambia la respuesta solo para ese test, por ejemplo para simular un `500`. Lo practicas en la receta de React.
