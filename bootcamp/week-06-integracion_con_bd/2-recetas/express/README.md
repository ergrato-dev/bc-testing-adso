# Receta — Integración en Express con Knex y truncado

> Grupos Express · Tiempo estimado: 2.5 h

Código: [`referencia/api-express/`](../../../../referencia/api-express/). Esta semana **sí** necesitas Docker.

---

## Paso 1: Una BD de pruebas recién creada

```bash
cd referencia
docker compose down -v                        # borra lo que haya dejado otra receta
docker compose up -d --wait postgres mysql
cd api-express
pnpm install
pnpm test
```

Mira el resumen de `pnpm test`: todo pasa. Sin `DATABASE_URL` no hay nada que probar contra la BD.

> Empieza con `down -v`: cada backend crea la tabla `pieces` a su manera. Knex crea `id` como `integer`, y si antes corriste la referencia de Spring Boot, Hibernate la dejó en `bigint`. Con la BD recién creada, la tabla es la que crea tu backend.

## Paso 2: El repositorio contra la BD real

Abre [`src/knex-repository.js`](../../../../referencia/api-express/src/knex-repository.js). Está excluido de la cobertura desde la semana 1 ([`vitest.config.js`](../../../../referencia/api-express/vitest.config.js)): es el adaptador de BD, y ningún test lo ha ejecutado nunca.

Crea `tests/integration/knex-repository.test.js`:

```javascript
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createDb, createKnexRepository, ensureSchema } from '../../src/knex-repository.js';

const guernica = { name: 'Guernica', artist: 'Picasso', year: 1937 };

// Sin DATABASE_URL (sin Docker) estos tests se saltan
describe.skipIf(!process.env.DATABASE_URL)('knex repository', () => {
  let db;
  let repository;

  beforeAll(async () => {
    db = createDb();
    await ensureSchema(db);
    repository = createKnexRepository(db);
  });

  afterAll(async () => {
    await db.destroy();
  });

  // Truncado: cada test empieza con la tabla vacía
  beforeEach(async () => {
    await db('pieces').truncate();
  });

  it('should find the piece by id when it was created', async () => {
    // Arrange
    const created = await repository.create(guernica);

    // Act
    const found = await repository.findById(created.id);

    // Assert: el id lo decide la BD, por eso se usa el que devolvió create
    expect(found).toEqual({ id: created.id, ...guernica });
  });

  it('should return null when the piece does not exist', async () => {
    expect(await repository.findById(999)).toBeNull();
  });

  it('should list pieces ordered by id', async () => {
    // Arrange: se insertan directo en la BD, con los ids en desorden
    await db('pieces').insert([
      { id: 2, name: 'Las meninas', artist: 'Velázquez', year: 1656 },
      { id: 1, ...guernica },
    ]);

    // Act
    const pieces = await repository.findAll();

    // Assert
    expect(pieces.map((piece) => piece.id)).toEqual([1, 2]);
  });

  it('should return false when deleting a missing piece', async () => {
    expect(await repository.delete(999)).toBe(false);
  });
});
```

Córrelo sin BD y con cada motor:

```bash
pnpm test                                                                            # 4 skipped
DATABASE_URL=postgres://museo:museo@localhost:5433/museo_test pnpm test              # DB_CLIENT es pg por defecto
DB_CLIENT=mysql2 DATABASE_URL=mysql://museo:museo@localhost:3307/museo_test pnpm test
```

Los cuatro pasan con los dos motores. Fíjate en tres decisiones:

- `afterAll` cierra el pool de conexiones con `db.destroy()`. Vitest termina igual sin esa línea porque apaga sus procesos, pero las conexiones quedan abiertas en la BD hasta ese momento. Quien abre, cierra.
- El test de orden inserta **directo en la BD** con ids en desorden. Si creara las piezas con `repository.create`, llegarían en orden y el test no probaría el `orderBy`.
- Ningún test depende de otro: cualquiera puede correr solo (`pnpm test -t "ordered by id"`).

## Paso 3: Un archivo a la vez

En el siguiente paso vas a tener dos archivos que truncan la misma tabla. Vitest corre los archivos en paralelo, y uno podría vaciar la tabla mientras el otro la usa. Agrega esto al inicio de `test` en `vitest.config.js`:

```javascript
  test: {
    // Los tests de integración comparten una sola BD: un archivo a la vez
    fileParallelism: false,
```

## Paso 4: El endpoint contra la BD real

Crea `tests/integration/pieces-api.test.js`. Es el mismo supertest de la semana 4, pero con el repositorio real:

```javascript
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { createDb, createKnexRepository, ensureSchema } from '../../src/knex-repository.js';

const guernica = { name: 'Guernica', artist: 'Picasso', year: 1937 };

describe.skipIf(!process.env.DATABASE_URL)('pieces API with a real database', () => {
  let db;
  let app;

  beforeAll(async () => {
    db = createDb();
    await ensureSchema(db);
    app = createApp(createKnexRepository(db));
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    await db('pieces').truncate();
  });

  it('should save the piece in the database when body is valid', async () => {
    const res = await request(app).post('/api/pieces').send(guernica);

    expect(res.status).toBe(201);
    // Se verifica en la BD, no solo en la respuesta
    const row = await db('pieces').where({ id: res.body.id }).first();
    expect(row).toMatchObject(guernica);
  });

  it('should respond 422 when name is longer than the column', async () => {
    const res = await request(app).post('/api/pieces').send({ ...guernica, name: 'x'.repeat(256) });

    expect(res.status).toBe(422);
    expect(res.body).toEqual({ detail: 'name must be at most 255 characters' });
  });

  it.each(['abc', '2147483648'])('should respond 404 with JSON when id is %s', async (id) => {
    const res = await request(app).get(`/api/pieces/${id}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ detail: 'piece not found' });
  });
});
```

Córrelo con los dos motores. **Fallan**:

| Test | PostgreSQL | MySQL |
|---|---|---|
| `name` de 256 caracteres | `500` (*value too long*) | `500` (*Data too long*) |
| id `abc` | `500` (*invalid input syntax for type integer: "NaN"*) | `500` (*Unknown column 'NaN'*) |
| id `2147483648` | `500` (*out of range for type integer*) | ✓ `404` |

Para ver la respuesta real, agrega temporalmente `console.log(res.text)` en el test del id `abc`: es la página HTML de error de Express con la consulta SQL y el stack trace. Es el adelanto de la semana 4: con el repositorio falso, `Number('abc')` es `NaN`, el `Map` no encuentra esa llave y responde `404`. La BD real no acepta `NaN`.

El id `2147483648` muestra la diferencia entre motores: PostgreSQL rechaza el valor fuera del rango de la columna y MySQL solo compara y no encuentra la fila.

## Paso 5: Corregir en el servicio

Los tres fallos son datos que el API debe rechazar **antes** de llegar a la BD, así que la corrección va en [`src/pieces-service.js`](../../../../referencia/api-express/src/pieces-service.js). Primero los límites, debajo de las clases de error:

```javascript
// Límites de las columnas de la tabla pieces: name VARCHAR(255) e id INTEGER
const MAX_NAME_LENGTH = 255;
const MAX_ID = 2147483647;

function isValidId(id) {
  return Number.isInteger(id) && id > 0 && id <= MAX_ID;
}
```

En `validatePiece`, después de la regla de `name is required`:

```javascript
  if (data.name.trim().length > MAX_NAME_LENGTH) {
    throw new ValidationError(`name must be at most ${MAX_NAME_LENGTH} characters`);
  }
```

Y al inicio de `get` y de `remove`:

```javascript
      // Un id que no cabe en la columna no existe: 404 sin consultar la BD
      if (!isValidId(id)) throw new NotFoundError('piece not found');
```

Las reglas nuevas son lógica de negocio: su prueba principal es **unitaria**, rápida y sin Docker. En [`tests/pieces-service.test.js`](../../../../referencia/api-express/tests/pieces-service.test.js), agrega el valor límite al `it.each` de `validatePiece`:

```javascript
    [{ name: 'x'.repeat(256), artist: 'Picasso', year: 1937 }, 'name must be at most 255 characters'],
```

Dentro del `describe('validatePiece')`, el otro lado del límite:

```javascript
  it('should accept a name of exactly 255 characters', () => {
    const piece = validatePiece({ name: 'x'.repeat(255), artist: 'Picasso', year: 1937 }, 2026);

    expect(piece.name).toHaveLength(255);
  });
```

Y al inicio del `describe('createPiecesService')`:

```javascript
  it.each([Number.NaN, 0, 2147483648])('should throw NotFoundError when id is %s', async (id) => {
    const service = createPiecesService(createMemoryRepository(), null);

    await expect(service.get(id)).rejects.toThrow(NotFoundError);
  });
```

Corre `pnpm test` sin BD y luego con cada motor: todo en verde. Córrelo **dos veces seguidas** con la misma BD: si la segunda falla, algún test deja datos que otro no espera.

> `artist` tiene la misma columna `VARCHAR(255)` y el mismo defecto. Escribe tú el test de integración que lo demuestra y la regla que lo corrige.

## Paso 6: Mutaciones

Haz cada una en `src/knex-repository.js`, corre los tests con PostgreSQL y con MySQL, y deshazla:

1. En `findById`, quita `?? null`. ¿Qué test falla? ¿Lo habría detectado el repositorio falso?
2. En `delete`, quita `> 0`. ¿Qué devuelve ahora el método y qué test lo detecta?
3. En `findAll`, quita `.orderBy('id')`. Con PostgreSQL el test de orden falla; con MySQL **pasa**. ¿Por qué? (Pista: InnoDB guarda las filas ordenadas por la llave primaria.) ¿Qué te dice esto sobre probar contra el mismo motor que usa tu proyecto?

---

## Checklist

- [ ] Empecé con una BD recién creada (`docker compose down -v`)
- [ ] Probé los cuatro métodos del repositorio contra PostgreSQL y MySQL
- [ ] Vi los tests de integración como *skipped* al correr sin `DATABASE_URL`
- [ ] Encontré los tres `500` que el repositorio falso no mostraba y los corregí en el servicio
- [ ] Probé las reglas nuevas con tests unitarios en su valor límite
- [ ] Corrí la suite dos veces seguidas sin reiniciar la BD
- [ ] Hice las tres mutaciones y expliqué por qué la tercera depende del motor

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — Integración en FastAPI con SQLAlchemy y rollback](../fastapi/README.md) | [Semana 6](../../README.md) | [Receta — Integración en Spring Boot con `@DataJpaTest` y `@SpringBootTest`](../springboot/README.md) |
