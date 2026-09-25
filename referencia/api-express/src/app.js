import express from 'express';
import { createPiecesService, NotFoundError, ValidationError } from './pieces-service.js';

// La app recibe el repositorio: en producción el de BD, en los tests uno en memoria.
export function createApp(repository) {
  const service = createPiecesService(repository);
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
