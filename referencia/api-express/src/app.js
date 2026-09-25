import express from 'express';
import { createPiecesService, NotFoundError, ValidationError } from './pieces-service.js';

// Dummy: los tests que no tratan de notificaciones no necesitan un notificador real
const silentNotifier = { pieceCreated: async () => {} };

// La app recibe sus dependencias: en producción las reales, en los tests dobles de prueba.
export function createApp(repository, notifier = silentNotifier) {
  const service = createPiecesService(repository, notifier);
  const app = express();
  app.use(express.json());

  app.get('/api/pieces', async (req, res) => {
    res.json(await service.list());
  });

  app.get('/api/pieces/:id', async (req, res) => {
    res.json(await service.get(Number(req.params.id)));
  });

  app.post('/api/pieces', async (req, res) => {
    res.status(201).json(await service.create(req.body));
  });

  app.delete('/api/pieces/:id', async (req, res) => {
    await service.remove(Number(req.params.id));
    res.status(204).end();
  });

  // Traduce los errores del servicio a códigos HTTP
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) return res.status(422).json({ detail: err.message });
    if (err instanceof NotFoundError) return res.status(404).json({ detail: err.message });
    next(err);
  });

  return app;
}
