# Receta — TDD en Express con Vitest

> Grupos Express · Tiempo estimado: 2.5 h

Código: [`referencia/api-express/`](../../../../referencia/api-express/). No necesitas Docker: el filtro se construye sobre el servicio con el repositorio falso.

```bash
cd referencia/api-express
pnpm install
pnpm exec vitest
```

Deja Vitest en **modo observador** (`vitest` sin `run`) en una terminal: cada vez que guardes, verás el rojo o el verde al instante. Es el ritmo del ciclo.

**La historia**: como visitante del museo, quiero filtrar la lista por artista (`GET /api/pieces?artist=picasso`), sin importar mayúsculas ni espacios, para encontrar sus obras.

Lista de pruebas (teoría 2):

```text
[ ] filtra por el nombre exacto del artista
[ ] no importan las mayúsculas
[ ] no importan los espacios alrededor
[ ] si el artista viene en blanco, devuelve todo
[ ] el API recibe el filtro como ?artist=
```

---

## Ciclo 1: filtra por el nombre exacto

**Red**. Agrega al final de [`tests/pieces-service.test.js`](../../../../referencia/api-express/tests/pieces-service.test.js):

```javascript
describe('list filtered by artist', () => {
  const guernica = { id: 1, name: 'Guernica', artist: 'Picasso', year: 1937 };
  const meninas = { id: 2, name: 'Las meninas', artist: 'Velázquez', year: 1656 };

  it('should return only the pieces of the given artist', async () => {
    // Arrange
    const service = createPiecesService(createMemoryRepository([guernica, meninas]), null);

    // Act
    const pieces = await service.list('Picasso');

    // Assert
    expect(pieces).toEqual([guernica]);
  });
});
```

Falla con `expected [ …(2) ] to deeply equal [ { id: 1, name: 'Guernica', …(2) } ]`: `list` ignora el argumento y devuelve las dos piezas. Es el Red correcto.

**Green**. En [`src/pieces-service.js`](../../../../referencia/api-express/src/pieces-service.js), cambia `list: () => repository.findAll(),` por:

```javascript
    async list(artist) {
      const pieces = await repository.findAll();
      if (!artist) return pieces;
      return pieces.filter((piece) => piece.artist === artist);
    },
```

Compara con `===`: ningún test pide más todavía. La suite queda en verde, incluidos los tests del API de la semana 4 (sin `artist`, devuelve todo).

## Ciclo 2: no importan las mayúsculas

**Red**. Dentro del mismo `describe`:

```javascript
  it('should ignore case when filtering by artist', async () => {
    const service = createPiecesService(createMemoryRepository([guernica, meninas]), null);

    expect(await service.list('picasso')).toEqual([guernica]);
  });
```

**Green**:

```javascript
      return pieces.filter((piece) => piece.artist.toLowerCase() === artist.toLowerCase());
```

## Ciclo 3: no importan los espacios

**Red**:

```javascript
  it('should ignore surrounding spaces when filtering by artist', async () => {
    const service = createPiecesService(createMemoryRepository([guernica, meninas]), null);

    expect(await service.list('  Picasso ')).toEqual([guernica]);
  });
```

**Green**:

```javascript
      return pieces.filter((piece) => piece.artist.toLowerCase() === artist.trim().toLowerCase());
```

## Ciclo 4: en blanco devuelve todo

**Red**:

```javascript
  it('should return all pieces when artist is blank', async () => {
    const service = createPiecesService(createMemoryRepository([guernica, meninas]), null);

    expect(await service.list('   ')).toEqual([guernica, meninas]);
  });
```

Falla: `'   '` no es vacío para `if (!artist)`, así que filtra por `''` y no encuentra nada.

**Green**. Normaliza **antes** de decidir:

```javascript
      const wanted = artist?.trim().toLowerCase();
      if (!wanted) return pieces;
      return pieces.filter((piece) => piece.artist.toLowerCase() === wanted);
```

## Refactor: el código

La normalización (`trim` + minúsculas) aparece dos veces con formas distintas. Extráela, encima de `validatePiece`:

```javascript
// Compara nombres de artista sin importar mayúsculas ni espacios alrededor
function normalize(text) {
  return text.trim().toLowerCase();
}
```

Y úsala en `list`:

```javascript
      const wanted = normalize(artist ?? '');
      if (!wanted) return pieces;
      return pieces.filter((piece) => normalize(piece.artist) === wanted);
```

La suite sigue en verde: el comportamiento no cambió.

## Refactor: los tests

Los tres primeros tests son el mismo con otro dato. Reemplázalos por uno parametrizado, y deja el de "en blanco" aparte porque espera otro resultado:

```javascript
  it.each(['Picasso', 'picasso', '  Picasso '])('should return only the pieces of artist "%s"', async (artist) => {
    // Arrange
    const service = createPiecesService(createMemoryRepository([guernica, meninas]), null);

    // Act
    const pieces = await service.list(artist);

    // Assert
    expect(pieces).toEqual([guernica]);
  });
```

Sigue en verde, con el mismo número de casos (3 del `it.each` + 1).

## Ciclo 5: el API recibe el filtro

**Red**. Al final de [`tests/pieces-api.test.js`](../../../../referencia/api-express/tests/pieces-api.test.js):

```javascript
describe('GET /api/pieces?artist=', () => {
  it('should respond 200 with only the pieces of the artist', async () => {
    const meninas = { id: 2, name: 'Las meninas', artist: 'Velázquez', year: 1656 };
    const app = createApp(createMemoryRepository([guernica, meninas]));

    const res = await request(app).get('/api/pieces').query({ artist: 'picasso' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([guernica]);
  });
});
```

**Green**. En [`src/app.js`](../../../../referencia/api-express/src/app.js), pasa el parámetro al servicio:

```javascript
    res.json(await service.list(req.query.artist));
```

Corre `pnpm test`: 19 tests en verde y el umbral de cobertura cumplido. La lista de pruebas está completa.

## El caso que apareció en el camino

Prueba `GET /api/pieces?artist=a&artist=b`. Express entrega el parámetro repetido como un arreglo, `normalize` recibe `['a', 'b']` y el API responde `500` con `TypeError: text.trim is not a function`.

Agrégalo a la lista y resuélvelo con **otro ciclo**: primero decide qué debe responder el API (¿`422`? ¿usar el primero?), escribe el test que lo pide, míralo fallar y después corrígelo.

## Mutaciones

Con TDD, cada línea nueva existe porque un test la pidió. Compruébalo:

1. En `list`, cambia `normalize(piece.artist) === wanted` por `piece.artist === wanted`. Fallan los 3 casos del `it.each` y el test del API.
2. Borra la línea `if (!wanted) return pieces;`. Fallan el test "en blanco" y el de la semana 4 `should respond 200 with all pieces`.

---

## Checklist

- [ ] Escribí la lista de pruebas antes del primer test
- [ ] Vi cada Red fallar por la razón correcta antes de escribir el Green
- [ ] Cada Green fue el cambio mínimo
- [ ] Refactoricé el código y los tests con la suite en verde
- [ ] Anoté el caso del parámetro repetido y lo resolví con otro ciclo
- [ ] Hice las dos mutaciones y vi qué tests las detectan
