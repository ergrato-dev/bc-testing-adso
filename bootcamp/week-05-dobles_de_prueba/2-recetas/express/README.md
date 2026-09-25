# Receta — Dobles en Express con `vi.fn` y `vi.spyOn`

> Capas API y BD de grupos Express · Tiempo estimado: 2.5 h

Código: [`referencia/api-express/`](../../../../referencia/api-express/). No necesitas Docker.

```bash
cd referencia/api-express
pnpm install
pnpm test
```

---

## Paso 1: La dependencia externa

Abre y sigue el camino del notificador:

1. [`src/pieces-service.js`](../../../../referencia/api-express/src/pieces-service.js): `createPiecesService(repository, notifier)`. En `create`, después de guardar llama a `notifier.pieceCreated(piece)` dentro de un `try/catch`: si falla, registra el error con `console.error` y devuelve la pieza igual.
2. [`src/notifier.js`](../../../../referencia/api-express/src/notifier.js): la implementación real (en un proyecto sería un correo). Está excluida de la cobertura: representa un servicio externo.
3. [`src/app.js`](../../../../referencia/api-express/src/app.js): `createApp(repository, notifier = silentNotifier)`. El valor por defecto es un **dummy** para que los tests de la semana 4 no necesiten notificador.
4. [`src/server.js`](../../../../referencia/api-express/src/server.js): en producción se pasa `createLogNotifier()`.

Corre `pnpm test` y mira la cobertura de `pieces-service.js`: la línea del `console.error` está sin cubrir. Ningún test prueba qué pasa cuando el notificador falla.

## Paso 2: Spy, se notifica una vez con la pieza guardada

Crea `tests/pieces-notifier.test.js`:

```javascript
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { createPiecesService, ValidationError } from '../src/pieces-service.js';
import { createMemoryRepository } from './memory-repository.js';

const guernica = { name: 'Guernica', artist: 'Picasso', year: 1937 };

describe('createPiecesService create with notifier', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should notify the created piece once', async () => {
    // Arrange: un objeto literal con un vi.fn() cumple el contrato del notificador
    const notifier = { pieceCreated: vi.fn() };
    const service = createPiecesService(createMemoryRepository(), notifier);

    // Act
    const piece = await service.create(guernica);

    // Assert: se notificó una vez, con la pieza ya guardada (con su id)
    expect(notifier.pieceCreated).toHaveBeenCalledOnce();
    expect(notifier.pieceCreated).toHaveBeenCalledWith(piece);
  });
});
```

## Paso 3: Spy, no se notifica si la pieza es inválida

Agrega:

```javascript
  it('should not notify when the piece is invalid', async () => {
    const notifier = { pieceCreated: vi.fn() };
    const service = createPiecesService(createMemoryRepository(), notifier);

    await expect(service.create({ ...guernica, name: '' })).rejects.toThrow(ValidationError);
    expect(notifier.pieceCreated).not.toHaveBeenCalled();
  });
```

## Paso 4: Stub que falla, la pieza se crea igual

```javascript
  it('should still create the piece when the notifier fails', async () => {
    // Stub: el notificador siempre falla
    const notifier = { pieceCreated: vi.fn().mockRejectedValue(new Error('smtp down')) };
    // Spy sobre console.error: verifica el registro y evita ruido en la salida del test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const service = createPiecesService(createMemoryRepository(), notifier);

    const piece = await service.create(guernica);

    expect(piece.id).toBe(1);
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('smtp down'));
  });
```

`vi.restoreAllMocks()` en el `afterEach` devuelve `console.error` a la normalidad para los tests siguientes.

## Paso 5: La misma regla vista desde el API

```javascript
  it('should respond 201 when the notifier fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const failing = { pieceCreated: vi.fn().mockRejectedValue(new Error('smtp down')) };
    const app = createApp(createMemoryRepository(), failing);

    const res = await request(app).post('/api/pieces').send(guernica);

    expect(res.status).toBe(201);
  });
```

## Paso 6: Mutaciones

Haz cada una, corre `pnpm test` y deshazla:

1. Quita el `try/catch` y deja solo `await notifier.pieceCreated(piece);`. ¿Qué tests fallan?
2. Comenta la línea `await notifier.pieceCreated(piece);`. ¿Qué tests fallan?
3. Mueve la notificación **antes** de `repository.create(...)`, pasándole `data`. ¿Qué test lo detecta y por qué?

## Paso 7: Reflexión sobre el exceso de mocks

El test del Paso 2 usa un **fake** (el repositorio en memoria) y un **spy** (el notificador). Imagina que también reemplazas el repositorio con `{ create: vi.fn().mockResolvedValue({ id: 1, ...guernica }) }`.

- ¿Qué verifica entonces el test que no verificaba antes?
- ¿Qué deja de verificar?
- Si mañana el repositorio cambia su método `create` por `insert`, ¿cuál de las dos versiones del test te avisa?

---

## Checklist

- [ ] Seguí el camino del notificador desde `server.js` hasta el servicio
- [ ] Verifiqué con un spy que se notifica una vez con la pieza guardada
- [ ] Verifiqué que no se notifica cuando la pieza es inválida
- [ ] Probé con un stub que falla que la pieza se crea igual, desde el servicio y desde el API
- [ ] Hice las tres mutaciones y vi qué test detecta cada una

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — Dobles en FastAPI con pytest-mock](../fastapi/README.md) | [Semana 5](../../README.md) | [Receta — Dobles en Spring Boot con Mockito](../springboot/README.md) |
