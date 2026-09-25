// Repositorio real sobre PostgreSQL o MySQL. Knex genera el SQL de cada motor,
// así el mismo código sirve para las dos bases de datos.
import knex from 'knex';
import pg from 'pg';

// pg entrega los BIGINT como texto; los ids de la app caben de sobra en un Number
pg.types.setTypeParser(pg.types.builtins.INT8, Number);

export function createDb() {
  // DB_CLIENT: "pg" o "mysql2". DATABASE_URL: cadena de conexión del motor.
  return knex({ client: process.env.DB_CLIENT ?? 'pg', connection: process.env.DATABASE_URL });
}

export async function ensureSchema(db) {
  if (await db.schema.hasTable('pieces')) return;
  await db.schema.createTable('pieces', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('artist').notNullable();
    table.integer('year').notNullable();
  });
}

export function createKnexRepository(db) {
  return {
    findAll: () => db('pieces').select().orderBy('id'),
    findById: async (id) => (await db('pieces').where({ id }).first()) ?? null,
    async create(data) {
      // PostgreSQL devuelve el id con RETURNING; MySQL no lo soporta y devuelve el id insertado
      const returning = db.client.config.client === 'pg' ? ['id'] : undefined;
      const [inserted] = await db('pieces').insert(data, returning);
      const id = inserted?.id ?? inserted;
      return db('pieces').where({ id }).first();
    },
    delete: async (id) => (await db('pieces').where({ id }).del()) > 0,
  };
}
