# Interacción y asincronía

> React · Vitest + React Testing Library

## `user-event`: interacciones como las de una persona

`user-event` simula lo que hace una persona real: al escribir, dispara cada tecla con sus eventos (`keydown`, `input`, `keyup`), respeta el foco y no escribe en campos deshabilitados.

```jsx
import userEvent from '@testing-library/user-event';

it('should call onSubmit with the piece when form is valid', async () => {
  // Arrange
  const user = userEvent.setup();           // 1. crea la "persona" antes de render
  const onSubmit = vi.fn();
  render(<PieceForm onSubmit={onSubmit} />);

  // Act                                     // 2. cada acción lleva await
  await user.type(screen.getByLabelText('Nombre'), 'Guernica');
  await user.type(screen.getByLabelText('Artista'), 'Picasso');
  await user.type(screen.getByLabelText('Año'), '1937');
  await user.click(screen.getByRole('button', { name: 'Guardar' }));

  // Assert
  expect(onSubmit).toHaveBeenCalledWith({ name: 'Guernica', artist: 'Picasso', year: 1937 });
});
```

Acciones frecuentes:

| Acción | Código |
|---|---|
| Escribir | `await user.type(campo, 'texto')` |
| Borrar un campo | `await user.clear(campo)` |
| Clic | `await user.click(boton)` |
| Elegir en un `<select>` | `await user.selectOptions(select, 'valor')` |
| Marcar un checkbox | `await user.click(checkbox)` |
| Tabular | `await user.tab()` |
| Tecla especial | `await user.keyboard('{Enter}')` |

> ❌ Evita `fireEvent` para interacciones de usuario: dispara un solo evento aislado, y los componentes reales a veces dependen de la secuencia completa. Úsalo solo cuando `user-event` no soporte el evento que necesitas.

## Funciones simuladas en las props: `vi.fn()`

Muchos componentes reciben callbacks (`onSubmit`, `onDelete`, `onChange`). En el test, pásales una función simulada y verifica **con qué** la llamó el componente:

```jsx
const onSubmit = vi.fn();
// …
expect(onSubmit).toHaveBeenCalledWith({ name: 'Guernica', artist: 'Picasso', year: 1937 });
expect(onSubmit).not.toHaveBeenCalled();   // p. ej., cuando la validación falla
```

`vi.fn()` es un **doble de prueba**. En la semana 5 los estudiarás a fondo; por ahora basta con saber que registra sus llamadas y que puedes decidir qué devuelve:

```jsx
const onSubmit = vi.fn().mockRejectedValue(new Error('year cannot be in the future'));
```

## Contenido que aparece después

Casi todo componente real carga datos: primero muestra "Cargando…", luego la lista o un error. Los tests deben **esperar** sin usar tiempos fijos:

| Herramienta | Úsala cuando… |
|---|---|
| `await screen.findBy…()` | Esperas que un elemento **aparezca** |
| `await waitForElementToBeRemoved(() => screen.queryBy…())` | Esperas que algo **desaparezca** (un "Cargando…") |
| `await waitFor(() => expect(…))` | Esperas que se cumpla una aserción que no es sobre un elemento, por ejemplo que se llamó una función |

```jsx
it('should show a loading message while pieces are loading', async () => {
  fetchPieces.mockResolvedValue([]);

  render(<App />);

  expect(screen.getByText('Cargando piezas…')).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.queryByText('Cargando piezas…'));
});
```

## Cuando el componente llama al API

Un componente como `App` llama a `fetchPieces()` al montarse. En un test de componente **no** quieres un backend real: quieres controlar la respuesta. La referencia reemplaza todo el módulo del cliente HTTP:

```jsx
import { fetchPieces } from '../src/api.js';

vi.mock('../src/api.js');                    // todas sus funciones pasan a ser vi.fn()

fetchPieces.mockResolvedValue([{ id: 1, name: 'Guernica', artist: 'Picasso', year: 1937 }]);
fetchPieces.mockRejectedValue(new Error('No se pudieron cargar las piezas'));
```

Así pruebas en milisegundos los tres caminos: datos, lista vacía y error. En la semana 5 verás una alternativa más realista: MSW, que intercepta las peticiones HTTP.

> 💡 Esta es una buena razón para concentrar las llamadas HTTP en un módulo (`api.js`, `services/`) en lugar de escribir `fetch` o `axios` dentro de cada componente: es mucho más fácil reemplazarlo en los tests.

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Aviso `not wrapped in act(...)` | El componente siguió actualizándose después de que terminó el test | Espera el estado final con `findBy` o `waitFor` |
| `Unable to find an element` con un elemento asíncrono | Usaste `getBy` para algo que aparece después | Cambia a `await findBy…` |
| La acción no tiene efecto | Olvidaste el `await` delante de `user.click` | Todas las acciones de `user-event` son asíncronas |
| El test pasa solo, falla con los demás | Estado compartido entre tests, por ejemplo mocks sin reiniciar | `vi.resetAllMocks()` en un `beforeEach` |

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Probar como la persona usuaria: render y queries](01-render-y-queries.md) | [Semana 3](../README.md) | [Qué probar en un componente (y qué no)](03-que-probar.md) |
