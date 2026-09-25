import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createMemoryRepository } from '../src/memory-repository.js';

const guernica = { id: 1, name: 'Guernica', artist: 'Picasso', year: 1937 };

describe('POST /api/pieces', () => {
  it('should respond 201 with the created piece when body is valid', async () => {
    const app = createApp(createMemoryRepository());

    const res = await request(app)
      .post('/api/pieces')
      .send({ name: 'La persistencia de la memoria', artist: 'Dalí', year: 1931 });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, artist: 'Dalí' });
  });

  it('should respond 422 when name is missing', async () => {
    const app = createApp(createMemoryRepository());

    const res = await request(app).post('/api/pieces').send({ artist: 'Dalí', year: 1931 });

    expect(res.status).toBe(422);
    expect(res.body.detail).toBe('name is required');
  });
});

describe('GET /api/pieces/:id', () => {
  it('should respond 404 when piece does not exist', async () => {
    const app = createApp(createMemoryRepository([guernica]));

    const res = await request(app).get('/api/pieces/99');

    expect(res.status).toBe(404);
  });
});
