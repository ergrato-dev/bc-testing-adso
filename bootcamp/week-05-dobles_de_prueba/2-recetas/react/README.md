# Receta — MSW para el cliente HTTP del frontend

> Capa Front · Tiempo estimado: 2.5 h

Código: [`referencia/frontend-react/`](../../../../referencia/frontend-react/). No necesitas el backend: MSW responde en su lugar.

```bash
cd referencia/frontend-react
pnpm install
```

---

## Paso 1: El archivo que nadie prueba

Abre [`vite.config.js`](../../../../referencia/frontend-react/vite.config.js) y mira la exclusión de cobertura:

```javascript
      // … el cliente HTTP (api.js), que se prueba con MSW en la semana 5.
      exclude: ['src/main.jsx', 'src/api.js'],
```

Los tests de `App` usan `vi.mock('../src/api.js')`: el módulo completo se reemplaza y el código de [`src/api.js`](../../../../referencia/frontend-react/src/api.js) **nunca se ejecuta**. Nadie verifica cómo reacciona el cliente HTTP a un `500`, a un `422` o a una respuesta rara del backend. Esta semana lo haces.

## Paso 2: Instalar MSW

```bash
pnpm add -D msw@2.15.0
```

pnpm puede crear un `pnpm-workspace.yaml` pidiendo aprobación para el script de instalación de MSW. Ese script solo prepara el modo navegador, y los tests corren en Node, así que responde `false`:

```yaml
allowBuilds:
  msw: false
```

## Paso 3: Un servidor falso para los tests

Crea `tests/api.test.js`:

```javascript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createPiece, fetchPieces } from '../src/api.js';

const guernica = { id: 1, name: 'Guernica', artist: 'Picasso', year: 1937 };

// Respuestas por defecto: el "backend feliz"
const server = setupServer(http.get('/api/pieces', () => HttpResponse.json([guernica])));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('fetchPieces', () => {
  it('should return the pieces from the API', async () => {
    const pieces = await fetchPieces();

    expect(pieces).toEqual([guernica]);
  });
});
```

Fíjate en tres detalles:

- `onUnhandledRequest: 'error'`: si el código hace una petición que no está en los handlers, el test falla. Así ninguna petición se escapa a la red real.
- `resetHandlers()` después de cada test: los cambios hechos con `server.use(...)` en un test no afectan al siguiente (FIRST: Isolated).
- `fetchPieces` usa `fetch` de verdad: MSW intercepta la petición HTTP, no el módulo.

## Paso 4: Stubs de error por test

Agrega dentro del archivo:

```javascript
  it('should throw a readable error when the API fails', async () => {
    server.use(http.get('/api/pieces', () => new HttpResponse(null, { status: 500 })));

    await expect(fetchPieces()).rejects.toThrow('No se pudieron cargar las piezas');
  });
```

```javascript
describe('createPiece', () => {
  it('should throw the detail sent by the API when validation fails', async () => {
    server.use(
      http.post('/api/pieces', () =>
        HttpResponse.json({ detail: 'year cannot be in the future' }, { status: 422 }),
      ),
    );

    await expect(createPiece({ name: 'Futuro', artist: 'X', year: 2999 })).rejects.toThrow(
      'year cannot be in the future',
    );
  });
});
```

`server.use(...)` es un **stub** que vale solo para ese test.

## Paso 5: ¿Qué ve la persona si el backend responde HTML?

En la semana 4 descubriste que un backend sin pruebas puede responder una página HTML ante un error. ¿Qué pasa en el frontend? Agrega al `describe('createPiece', …)`:

```javascript
  it('should throw a readable error when the API responds HTML', async () => {
    server.use(
      http.post('/api/pieces', () =>
        new HttpResponse('<!DOCTYPE html><html><body>Error</body></html>', {
          status: 400,
          headers: { 'Content-Type': 'text/html' },
        }),
      ),
    );

    await expect(createPiece({ name: 'G', artist: 'P', year: 1937 })).rejects.toThrow(
      'No se pudo guardar la pieza',
    );
  });
```

**Falla.** El error real es:

```text
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

Ese mensaje llega hasta el `role="alert"` del formulario: es lo que vería la persona usuaria. `res.json()` explota antes de llegar al mensaje por defecto.

## Paso 6: Corregir el cliente

En [`src/api.js`](../../../../referencia/frontend-react/src/api.js), dentro de `createPiece`, tolera un cuerpo que no sea JSON:

```diff
-  const body = await res.json();
+  const body = await res.json().catch(() => ({}));
```

Si el cuerpo no es JSON, `body` queda vacío y se usa el mensaje por defecto `'No se pudo guardar la pieza'`. Corre `pnpm test`: todo en verde.

**Mutación**: deshaz el cambio y confirma que el test del Paso 5 falla. Vuelve a aplicarlo.

## Paso 7: Medir `api.js`

Ahora que `api.js` tiene tests, quítalo de la exclusión en `vite.config.js`:

```diff
-      exclude: ['src/main.jsx', 'src/api.js'],
+      exclude: ['src/main.jsx'],
```

Actualiza también el comentario. Corre `pnpm test` y revisa `api.js` en el reporte: ¿qué línea falta? Escribe el test del caso feliz de `createPiece` para cubrirla.

## Paso 8 (opcional): `vi.mock` o MSW en `App.test.jsx`

`App.test.jsx` usa `vi.mock`. Reescribe **un** test con MSW (sin `vi.mock` en ese archivo) y compara: ¿qué código real ejecuta cada versión? ¿Cuál preferirías si `api.js` tuviera lógica de reintentos o de tokens?

---

## Checklist

- [ ] Entendí por qué `vi.mock` deja sin probar `api.js`
- [ ] Configuré MSW con `onUnhandledRequest: 'error'` y `resetHandlers`
- [ ] Probé el caso feliz, un `500` y un `422` con `server.use`
- [ ] Descubrí el mensaje de error ilegible ante una respuesta HTML y lo corregí
- [ ] Quité `api.js` de la exclusión de cobertura y cubrí la línea que faltaba
