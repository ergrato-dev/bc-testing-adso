# Receta — Playwright: flujos estables y dos defectos que solo ve el navegador

> Todo el grupo, con el backend de su stack · Tiempo estimado: 2.5 h

Código: [`referencia/e2e/`](../../../../referencia/e2e/) y [`referencia/frontend-react/`](../../../../referencia/frontend-react/). Necesitas Docker, un backend y el navegador de Playwright.

---

## Paso 1: Levantar la app completa

En tres terminales, desde `referencia/`:

```bash
# Terminal 1: BD de pruebas recién creada
docker compose down -v
docker compose up -d --wait postgres
```

```bash
# Terminal 2: el backend de tu stack (elige uno), en el puerto 8000
cd api-express && pnpm install && DATABASE_URL=postgres://museo:museo@localhost:5433/museo_test pnpm start
cd api-fastapi && uv sync && DATABASE_URL=postgresql+psycopg://museo:museo@localhost:5433/museo_test uv run uvicorn app.main:app --port 8000
cd api-springboot && DATABASE_URL=jdbc:postgresql://localhost:5433/museo_test ./mvnw spring-boot:run
```

```bash
# Terminal 3: los E2E (Playwright levanta el frontend solo)
cd e2e
pnpm install
pnpm exec playwright install chromium
pnpm test
```

Los dos tests de la semana 1 pasan. Si el puerto 5173 lo usa otro proyecto tuyo, los tests abren **ese** proyecto y fallan buscando el formulario: usa otro puerto con `FRONT_PORT=5199 pnpm test`.

## Paso 2: Un objeto de página

Los dos tests de [`tests/create-piece.spec.js`](../../../../referencia/e2e/tests/create-piece.spec.js) repiten los mismos locators, y los tests de esta receta también los van a necesitar. Crea `tests/museum-page.js`:

```javascript
// Objeto de página: locators y acciones repetidas de la pantalla del museo.
// Las aserciones se quedan en los tests.
export class MuseumPage {
  constructor(page) {
    this.page = page;
    this.pieces = page.getByRole('list', { name: 'Piezas' });
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillPiece({ name, artist, year }) {
    await this.page.getByLabel('Nombre').fill(name);
    await this.page.getByLabel('Artista').fill(artist);
    await this.page.getByLabel('Año').fill(String(year));
  }
}
```

Y reescribe `tests/create-piece.spec.js` con él:

```javascript
import { expect, test } from '@playwright/test';
import { MuseumPage } from './museum-page.js';

test('should show the new piece in the list after saving the form', async ({ page }) => {
  const museum = new MuseumPage(page);
  const name = `Pieza E2E ${Date.now()}`;
  await museum.goto();

  await museum.fillPiece({ name, artist: 'Anónimo', year: 1990 });
  await museum.saveButton.click();

  await expect(museum.pieces).toContainText(name);
});

test('should show an error when name is empty', async ({ page }) => {
  const museum = new MuseumPage(page);
  await museum.goto();

  await museum.fillPiece({ name: '', artist: 'Anónimo', year: 1990 });
  await museum.saveButton.click();

  await expect(page.getByRole('alert')).toHaveText('El nombre es obligatorio');
});
```

Corre `pnpm test`: siguen en verde. Fíjate que las aserciones siguen en el test: al leerlo sabes qué verifica sin abrir el objeto de página.

## Paso 3: Datos por API y estados por `page.route`

Crea `tests/pieces-list.spec.js`:

```javascript
import { expect, test } from '@playwright/test';

test('should show a piece created by the API', async ({ page, request }) => {
  // Arrange: la pieza se crea por API; el test prueba solo la lista
  const name = `Pieza API ${Date.now()}`;
  const response = await request.post('/api/pieces', {
    data: { name, artist: 'Anónimo', year: 1990 },
  });
  expect(response.ok()).toBe(true);

  // Act
  await page.goto('/');

  // Assert
  await expect(page.getByRole('list', { name: 'Piezas' })).toContainText(name);
});

test('should show the empty state when the API returns no pieces', async ({ page }) => {
  // Con una BD compartida en paralelo no hay forma segura de tener la lista vacía:
  // page.route responde en lugar del backend (semana 5)
  await page.route('**/api/pieces', (route) => route.fulfill({ json: [] }));

  await page.goto('/');

  await expect(page.getByText('Aún no hay piezas registradas.')).toBeVisible();
});
```

`request.post('/api/pieces')` usa el `baseURL` del frontend, y Vite reenvía `/api` al puerto 8000 ([`vite.config.js`](../../../../referencia/frontend-react/vite.config.js)). El Arrange llega al backend por el mismo camino que el navegador, con cualquiera de los tres backends.

## Paso 4: ¿Es estable la suite?

```bash
pnpm exec playwright test --repeat-each=10
```

Cada test corre 10 veces, en paralelo. Los 40 pasan: la suite es estable. Pero eso no quiere decir que la **app** no tenga defectos de tiempos. Con el backend local todo responde en milisegundos, y así hay cosas que nunca vas a ver.

## Paso 5: El doble clic

Crea `tests/network.js`, una ayuda para simular una red lenta:

```javascript
// Simula una red lenta: la petición llega al servidor de inmediato,
// pero su respuesta se entrega al navegador "ms" milisegundos después.
export async function delayResponses(page, method, ms) {
  await page.route('**/api/pieces', async (route) => {
    if (route.request().method() !== method) return route.continue();
    const response = await route.fetch();
    await new Promise((resolve) => setTimeout(resolve, ms));
    await route.fulfill({ response });
  });
}
```

Y `tests/timing.spec.js` con el primer test:

```javascript
import { expect, test } from '@playwright/test';
import { MuseumPage } from './museum-page.js';
import { delayResponses } from './network.js';

test('should send a single POST when the user double-clicks save', async ({ page }) => {
  // Arrange: el POST tarda en responder, como con una red lenta
  await delayResponses(page, 'POST', 500);
  const posts = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') posts.push(request);
  });
  const museum = new MuseumPage(page);
  const name = `Doble clic ${Date.now()}`;
  await museum.goto();
  await museum.fillPiece({ name, artist: 'Anónimo', year: 1990 });

  // Act
  await museum.saveButton.dblclick();

  // Assert
  await expect(museum.pieces).toContainText(name);
  expect(posts).toHaveLength(1);
});
```

Córrelo con `pnpm test`. **Falla**: `Expected length: 1, Received length: 2`. Recarga la app en el navegador: la pieza está **dos veces** en la lista, porque quedó dos veces en la BD.

El retraso de 500 ms hace que el test sea determinista. Sin él, el primer `POST` podría responder antes del segundo clic, y el test pasaría o fallaría según la velocidad del equipo.

Corrige en [`src/PieceForm.jsx`](../../../../referencia/frontend-react/src/PieceForm.jsx). Agrega un estado debajo del de `error`:

```javascript
  const [saving, setSaving] = useState(false);
```

Envuelve el envío para deshabilitar el botón mientras guarda:

```javascript
    // Deshabilita el botón mientras guarda: un doble clic no envía dos veces
    setSaving(true);
    try {
      await onSubmit(piece);
      event.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
```

Y conecta el estado al botón:

```javascript
      <button type="submit" disabled={saving}>
        Guardar
      </button>
```

Corre `pnpm test` en `e2e/`: el test pasa. Corre también `pnpm test` en `frontend-react/`: los tests de componentes siguen en verde, con el umbral cumplido.

## Paso 6: La pieza que desaparece

Agrega a `tests/timing.spec.js`:

```javascript
test('should keep a piece saved while the list is loading', async ({ page }) => {
  // Arrange: la lista tarda en llegar, así la persona guarda mientras carga
  await delayResponses(page, 'GET', 1500);
  const museum = new MuseumPage(page);
  const name = `Mientras carga ${Date.now()}`;
  await museum.goto();

  // Act
  await museum.fillPiece({ name, artist: 'Anónimo', year: 1990 });
  await museum.saveButton.click();

  // Assert: cuando termina de cargar, la pieza sigue en la lista
  await expect(page.getByText('Cargando piezas…')).toBeHidden();
  await expect(museum.pieces).toContainText(name);
});
```

Córrelo. **Falla**: el texto recibido tiene las piezas anteriores, pero no la tuya. La pieza **sí** está en la BD (recarga y la verás). La perdió la pantalla: la respuesta del `GET`, calculada antes de guardar, reemplazó la lista (teoría 2).

Corrige en [`src/App.jsx`](../../../../referencia/frontend-react/src/App.jsx). Cambia el `.then(setPieces, ...)` del `useEffect` por:

```javascript
      // Combina en lugar de reemplazar: conserva las piezas creadas mientras la lista cargaba
      .then(
        (loaded) =>
          setPieces((current) => [
            ...loaded,
            ...current.filter((piece) => !loaded.some((item) => item.id === piece.id)),
          ]),
        (err) => setError(err.message),
      )
```

El filtro evita duplicados: si el `GET` ya incluía la pieza nueva, no se agrega dos veces. Corre los E2E y los tests de `frontend-react/`: todo en verde. Termina con `pnpm exec playwright test --repeat-each=10`: los 60 deben pasar.

> El doble clic también se puede probar en `frontend-react` con Testing Library: `user.dblClick` sobre el botón, con un `onSubmit = vi.fn(() => new Promise(() => {}))` que nunca termina, y `toHaveBeenCalledTimes(1)`. Hazlo como ejercicio: es más rápido y no necesita backend, pero solo lo escribes si ya sospechas del defecto. El E2E con red lenta es donde aparece primero.

## Paso 7: Leer una traza

Haz que un test falle (por ejemplo, cambia el texto esperado en el último `toContainText`) y córrelo con la traza activa:

```bash
pnpm exec playwright test tests/timing.spec.js --trace on
pnpm report
```

En el reporte, abre el test fallido y luego su **Trace**. Recorre las acciones: fíjate en la pestaña **Network**, donde el `GET /api/pieces` tarda 1.5 s, y en las capturas antes y después de cada paso. Deshaz el cambio.

## Paso 8: Mutaciones

Haz cada una, corre `pnpm test` en `e2e/` y deshazla:

1. En `PieceForm.jsx`, quita `disabled={saving}` del botón. ¿Qué test falla y con qué mensaje?
2. En `App.jsx`, vuelve a `.then(setPieces, (err) => setError(err.message))`. ¿Qué test falla?
3. Con la mutación 2 aplicada, comenta la línea `await delayResponses(page, 'GET', 1500);` del segundo test y córrelo 20 veces con `pnpm exec playwright test tests/timing.spec.js -g "loading" --repeat-each=20`. Pasan las 20, **con el defecto presente**. ¿Qué te dice esto sobre un test E2E que "nunca falla"?

---

## Checklist

- [ ] Levanté BD, backend y E2E, y usé `FRONT_PORT` si el 5173 estaba ocupado
- [ ] Reescribí los tests con un objeto de página que no tiene aserciones
- [ ] Preparé datos por API con `request` y probé el estado vacío con `page.route`
- [ ] Medí la estabilidad con `--repeat-each`
- [ ] Reproduje el doble envío y la pieza que desaparece con una red lenta simulada, y los corregí en la app
- [ ] Leí la traza de un test fallido
- [ ] Hice las tres mutaciones y expliqué por qué la tercera pasa con el defecto presente
