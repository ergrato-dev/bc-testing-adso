import { createApp } from './app.js';
import { createDb, createKnexRepository, ensureSchema } from './knex-repository.js';
import { createLogNotifier } from './notifier.js';

const db = createDb();
await ensureSchema(db);

const port = Number(process.env.PORT ?? 8000);
createApp(createKnexRepository(db), createLogNotifier()).listen(port, () => {
  console.log(`API Express escuchando en http://localhost:${port}`);
});
