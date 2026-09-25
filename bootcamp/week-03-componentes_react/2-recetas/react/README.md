# Receta — React Testing Library contra la app de referencia

> Común a toda la ficha · Tiempo estimado: 2.5 h

Código: [`referencia/frontend-react/`](../../../../referencia/frontend-react/). No necesitas backend: el API se reemplaza en los tests.

```bash
cd referencia/frontend-react
pnpm install
pnpm test
```

---

## Paso 1: Leer los tests existentes

Abre [`tests/PieceForm.test.jsx`](../../../../referencia/frontend-react/tests/PieceForm.test.jsx) y [`tests/App.test.jsx`](../../../../referencia/frontend-react/tests/App.test.jsx). Para cada test identifica:

- Qué **query** usa y en qué lugar de la tabla de prioridad está.
- Qué variante usa (`getBy`, `findBy`) y por qué.
- Dónde está el `await` de cada acción de `user-event`.
- En `App.test.jsx`: cómo `vi.mock('../src/api.js')` evita llamar al backend.

Deja la suite en modo observador mientras trabajas:

```bash
pnpm test:watch
```

## Paso 2: 100% de cobertura, comportamiento sin verificar

Corre `pnpm test` y mira la cobertura de `App.jsx`: **100%**. Ahora abre [`src/App.jsx`](../../../../referencia/frontend-react/src/App.jsx) y borra la línea del mensaje de carga:

```diff
-      {loading && <p>Cargando piezas…</p>}
```

Corre `pnpm test`: todos los tests siguen en verde y la cobertura **sigue en 100%**, porque borraste código junto con su única línea. Ningún test verifica ese mensaje: lo mismo que pasó con el valor límite en la semana 2. Deshaz el cambio.

## Paso 3: Probar el estado de carga

Crea `tests/App-states.test.jsx`:

```jsx
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App.jsx';
import { fetchPieces } from '../src/api.js';

vi.mock('../src/api.js');

describe('App states', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should show a loading message while pieces are loading', async () => {
    // Arrange
    fetchPieces.mockResolvedValue([]);

    // Act
    render(<App />);

    // Assert: aparece al montar y desaparece cuando el API responde
    expect(screen.getByText('Cargando piezas…')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByText('Cargando piezas…'));
  });
});
```

Repite el Paso 2 (borra el mensaje de carga): ahora este test **falla**. Deshaz el cambio.

## Paso 4: Estado vacío y estado con datos

Agrega dos tests al mismo `describe`. Complétalos tú:

```jsx
  it('should show an empty message when there are no pieces', async () => {
    fetchPieces.mockResolvedValue([]);

    render(<App />);

    // 1. Espera a que aparezca "Aún no hay piezas registradas." (¿qué variante de query?)
    // 2. Verifica que NO existe la lista con nombre "Piezas" (¿qué variante de query?)
  });

  it('should render one list item per piece', async () => {
    fetchPieces.mockResolvedValue([
      { id: 1, name: 'Guernica', artist: 'Picasso', year: 1937 },
      { id: 2, name: 'Las meninas', artist: 'Velázquez', year: 1656 },
    ]);

    render(<App />);

    // 1. Espera a que aparezca la lista con nombre "Piezas"
    // 2. Con within(lista), verifica que tiene 2 elementos listitem
    // 3. Verifica que NO aparece el mensaje de lista vacía
  });
```

<details>
<summary>Ver una solución</summary>

```jsx
    expect(await screen.findByText('Aún no hay piezas registradas.')).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Piezas' })).not.toBeInTheDocument();
```

```jsx
    const list = await screen.findByRole('list', { name: 'Piezas' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText('Aún no hay piezas registradas.')).not.toBeInTheDocument();
```

Recuerda importar `within` desde `@testing-library/react`.

</details>

Mutación para comprobarlos: en `App.jsx` cambia `pieces.length === 0` por `pieces.length === 1`. Tu test de lista vacía debe fallar después de esperar un segundo, que es el tiempo máximo de `findBy`.

## Paso 5: El formulario se limpia después de guardar

`PieceForm` llama a `event.target.reset()` cuando el envío sale bien. Ningún test lo verifica. Agrega en `tests/PieceForm.test.jsx`:

```jsx
  it('should clear the fields after a successful submit', async () => {
    const user = userEvent.setup();
    render(<PieceForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText('Nombre'), 'Guernica');
    await user.type(screen.getByLabelText('Artista'), 'Picasso');
    await user.type(screen.getByLabelText('Año'), '1937');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(screen.getByLabelText('Nombre')).toHaveValue('');
    expect(screen.getByLabelText('Año')).toHaveValue(null);   // input numérico vacío
  });
```

Comprueba que detecta el defecto: comenta la línea `event.target.reset();` y mira cómo falla. Deshaz el cambio.

**Reto extra**: escribe el test contrario. Si `onSubmit` falla, los campos **no** deben borrarse, para que la persona no pierda lo que escribió.

## Paso 6: La accesibilidad también es testabilidad

En `src/PieceForm.jsx`, separa la etiqueta del campo Nombre:

```diff
-      <label>
-        Nombre
-        <input name="name" />
-      </label>
+      <label>Nombre</label>
+      <input name="name" />
```

Corre los tests: **fallan varios**, todos con `Unable to find a label with the text of: Nombre`. La etiqueta ya no está asociada al campo: un lector de pantalla tampoco sabría cómo se llama. Hay dos formas correctas de asociarla: envolver el `<input>` (como estaba) o usar `htmlFor` con un `id`:

```jsx
<label htmlFor="piece-name">Nombre</label>
<input id="piece-name" name="name" />
```

Aplica la segunda forma y confirma que los tests vuelven a verde **sin cambiar ningún test**. Así se ve un test que no depende de la implementación.

## Paso 7: Encontrar la mejor query

Agrega `screen.logTestingPlaygroundURL();` al final de cualquier test, córrelo y abre la URL que aparece en la terminal. Haz clic sobre los elementos: el sitio sugiere la query de mayor prioridad para cada uno. Quita la línea al terminar.

---

## Checklist

- [ ] Leí los tests existentes identificando queries, variantes y `await`
- [ ] Vi que borrar el mensaje de carga no rompía nada con 100% de cobertura
- [ ] Escribí los tests de los estados de carga, vacío y con datos
- [ ] Escribí el test del formulario que se limpia y vi cómo detecta el defecto
- [ ] Vi fallar los tests por una etiqueta desasociada y los arreglé cambiando solo el componente
