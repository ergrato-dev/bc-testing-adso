# Receta — Pruebas de API en Express con supertest

> Grupos Express · Tiempo estimado: 2.5 h

Código: [`referencia/api-express/`](../../../../referencia/api-express/). No necesitas Docker: la app se prueba con un repositorio en memoria.

```bash
cd referencia/api-express
pnpm install
pnpm test
```

---

## Paso 1: Cómo se aísla la base de datos

Abre estos tres archivos y sigue el camino:

1. [`src/app.js`](../../../../referencia/api-express/src/app.js): `createApp(repository)` arma la app **sin** llamar a `listen()` y **sin** conectarse a la BD.
2. [`src/server.js`](../../../../referencia/api-express/src/server.js): el único lugar que crea la conexión real y escucha en el puerto 8000.
3. [`tests/pieces-api.test.js`](../../../../referencia/api-express/tests/pieces-api.test.js): cada test crea su app con `createMemoryRepository([...])`, un repositorio falso que cumple el mismo contrato que el real.

## Paso 2: Revisar la cobertura de escenarios

Compara los tests existentes con la lista mínima de la teoría (caso feliz, validación, inexistente, mal formado). Llena esta tabla:

| Endpoint | Feliz | Validación | Inexistente | Mal formado |
|---|:---:|:---:|:---:|:---:|
| `GET /api/pieces` | ? | — | — | — |
| `GET /api/pieces/:id` | ? | — | ? | — |
| `POST /api/pieces` | ? | ? | — | ? |
| `DELETE /api/pieces/:id` | ? | — | ? | — |

Vas a encontrar un hueco en `POST`.

## Paso 3: Un escenario con varias peticiones

Algunos comportamientos necesitan más de una petición. Agrega en `tests/pieces-api.test.js`:

```javascript
describe('DELETE then GET', () => {
  it('should respond 404 when getting a piece after deleting it', async () => {
    // Arrange
    const app = createApp(createMemoryRepository([guernica]));

    // Act
    await request(app).delete('/api/pieces/1').expect(204);
    const res = await request(app).get('/api/pieces/1');

    // Assert
    expect(res.status).toBe(404);
  });
});
```

`.expect(204)` de supertest verifica el código en la misma línea: úsalo para los pasos intermedios del Arrange y deja las aserciones principales con `expect`.

## Paso 4: ¿Qué responde tu API a un JSON mal formado?

Agrega este test al `describe('POST /api/pieces', …)`:

```javascript
  it('should respond 400 with JSON detail when body is malformed JSON', async () => {
    const app = createApp(createMemoryRepository());

    const res = await request(app)
      .post('/api/pieces')
      .set('Content-Type', 'application/json')
      .send('{"name":');

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ detail: 'malformed request body' });
  });
```

Córrelo. **Falla.** Para ver qué responde de verdad la API, agrega temporalmente `console.log(res.text)` antes de las aserciones: es una página **HTML** con el stack trace del servidor. Rompe el contrato y además filtra información interna.

## Paso 5: Corregir el contrato

`express.json()` le pasa al manejador de errores un error con `type: 'entity.parse.failed'` cuando el cuerpo no es JSON válido. Tradúcelo en [`src/app.js`](../../../../referencia/api-express/src/app.js), dentro del manejador de errores:

```javascript
    if (err instanceof NotFoundError) return res.status(404).json({ detail: err.message });
    // express.json() marca así el cuerpo que no es JSON válido
    if (err.type === 'entity.parse.failed') return res.status(400).json({ detail: 'malformed request body' });
    next(err);
```

Corre los tests: el nuevo pasa y los demás siguen en verde. Quita el `console.log`.

**Mutación**: comenta la línea que agregaste. El test debe volver a fallar. Deshaz el comentario.

## Paso 6: Tipos incorrectos

¿Qué pasa si `year` llega como texto? Escribe el test y descúbrelo:

```javascript
  it('should respond 422 when year is not a number', async () => {
    const app = createApp(createMemoryRepository());

    const res = await request(app).post('/api/pieces').send({ name: 'G', artist: 'P', year: 'abc' });

    // Completa: ¿qué código y qué detail esperas? Mira validatePiece en src/pieces-service.js
  });
```

Aquí el contrato ya se cumple: la validación del servicio responde `422` con `year must be an integer`. El test lo deja **fijado** para que nadie lo rompa.

> 🔎 **Adelanto de la semana 6**: prueba `GET /api/pieces/abc`. Con el repositorio falso responde `404`, porque no encuentra ningún id `NaN`. Contra PostgreSQL real, la misma petición responde **500 con la consulta SQL en el cuerpo**. Los dobles de prueba no ven todo: por eso existen las pruebas de integración.

## Paso 7: Cobertura

```bash
pnpm test
```

Revisa `app.js` en el reporte. ¿Queda alguna rama del manejador de errores sin cubrir? Pista: la línea `next(err)` solo se ejecuta con un error que no es de validación, ni de "no encontrado", ni de JSON.

---

## Checklist

- [ ] Entendí cómo `createApp(repository)` aísla la base de datos
- [ ] Llené la tabla de escenarios y encontré el hueco
- [ ] Escribí un test con varias peticiones
- [ ] Descubrí la respuesta HTML ante un JSON mal formado y la corregí
- [ ] Hice la mutación del manejador y vi fallar el test
- [ ] Fijé con un test el comportamiento ante tipos incorrectos

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — Pruebas de API en FastAPI con `TestClient`](../fastapi/README.md) | [Semana 4](../../README.md) | [Receta — Pruebas de API en Spring Boot con MockMvc](../springboot/README.md) |
