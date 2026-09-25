# Datos por API y objeto de página

> Común a todos los stacks.

## Preparar datos por la UI es caro

Para probar que la lista muestra una pieza, el test de la semana 1 **llena el formulario**. Funciona, pero si tienes diez tests que necesitan una pieza, los diez pasan por el formulario: lentos, y si el formulario se rompe, fallan todos aunque prueben otra cosa.

La regla: **por la UI solo lo que el test está probando. El resto, por API.**

## El fixture `request`

Playwright trae un cliente HTTP en el fixture `request`. Usa el mismo `baseURL` de la configuración, así que llega al backend por el mismo camino que el navegador:

```javascript
// Playwright: el Arrange crea la pieza por API; el test prueba solo la lista
test('should show a piece created by the API', async ({ page, request }) => {
  const name = `Pieza API ${Date.now()}`;
  const response = await request.post('/api/pieces', {
    data: { name, artist: 'Anónimo', year: 1990 },
  });
  expect(response.ok()).toBe(true);

  await page.goto('/');

  await expect(page.getByRole('list', { name: 'Piezas' })).toContainText(name);
});
```

Si el `POST` falla, el test falla en el Arrange con un mensaje claro, y no en una aserción de la UI que no tiene nada que ver.

## Valores únicos y limpieza

Los E2E corren **en paralelo** (varios *workers*; por defecto, la mitad de los núcleos del equipo) y contra una BD que conserva los datos entre corridas. Dos reglas:

1. **Valores únicos**: `Pieza API ${Date.now()}`, o `crypto.randomUUID()` si necesitas que sea único incluso entre workers que empiezan en el mismo milisegundo.
2. **Aserciones sobre lo tuyo**: verifica que **tu** pieza aparece, no que la lista tiene 3 elementos. Otro test puede estar creando piezas al mismo tiempo.

Si el test crea datos que molestan a otros (por ejemplo, un usuario con un correo que debe ser único), bórralos al final por API:

```javascript
// Playwright: el id sale del POST; el afterEach lo borra aunque el test falle
let createdId;

test.afterEach(async ({ request }) => {
  if (createdId) await request.delete(`/api/pieces/${createdId}`);
});
```

> ⚠️ El estado "Aún no hay piezas registradas" no se puede probar contra una BD compartida en paralelo: otro test puede crear una pieza en cualquier momento. Para estados de la UI como la lista vacía o el API caído, usa `page.route` (semana 5).

## Objeto de página: solo lo necesario

Cuando varios tests repiten los mismos pasos (llenar el formulario, buscar una pieza en la lista), un **objeto de página** los agrupa en un solo lugar. Si mañana la etiqueta "Nombre" cambia a "Título", corriges una línea y no veinte tests.

```javascript
// Playwright: tests/museum-page.js
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

El test queda corto y **conserva sus aserciones**:

```javascript
test('should show the new piece in the list after saving the form', async ({ page }) => {
  const museum = new MuseumPage(page);
  const name = `Pieza E2E ${Date.now()}`;
  await museum.goto();

  await museum.fillPiece({ name, artist: 'Anónimo', year: 1990 });
  await museum.saveButton.click();

  await expect(museum.pieces).toContainText(name);
});
```

| Hazlo | Evítalo |
|---|---|
| Locators y acciones repetidas en el objeto de página | Aserciones dentro del objeto de página: el test deja de decir qué verifica |
| Nombres del dominio (`fillPiece`, `pieces`) | Nombres técnicos (`fillInput3`, `ulElement`) |
| Un objeto por pantalla | Una clase "base" con herencia para dos pantallas |

Con 2 o 3 tests por pantalla no lo necesitas todavía: créalo cuando empieces a copiar y pegar pasos.

## Cuando falla: el reporte y la traza

La configuración de la referencia guarda una **traza** (`trace: 'on-first-retry'`) cuando un test falla y se reintenta. La traza es una grabación paso a paso: cada acción, una captura de la página antes y después, la consola y las peticiones de red.

```bash
pnpm exec playwright test --trace on    # fuerza la traza en esta corrida
pnpm report                             # abre el reporte HTML; cada test fallido enlaza su traza
```

En la traza busca el primer paso en rojo y abre su pestaña **Network**: casi siempre la causa está en una petición que respondió distinto de lo que esperabas.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Flaky o defecto: los tiempos importan](02-flakiness.md) | [Semana 7](../README.md) | [Receta — Playwright: flujos estables y dos defectos que solo ve el navegador](../2-recetas/playwright/README.md) |
