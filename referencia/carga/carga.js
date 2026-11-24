// Carga: sube a 20 usuarios, se mantiene y baja. Cada usuario registra una
// pieza, la consulta y lista todas, como haría alguien usando la app.
//   k6 run carga/carga.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL ?? 'http://localhost:8000';
const JSON_HEADERS = { headers: { 'Content-Type': 'application/json' } };

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // rampa de subida
    { duration: '1m', target: 20 }, // carga sostenida
    { duration: '30s', target: 0 }, // rampa de bajada
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    'http_req_duration{name:listar}': ['p(95)<300'],
    'http_req_duration{name:crear}': ['p(95)<300'],
  },
};

export default function () {
  const piece = { name: `Pieza ${__VU}-${__ITER}`, artist: 'k6', year: 2000 };
  const created = http.post(`${BASE_URL}/api/pieces`, JSON.stringify(piece), {
    ...JSON_HEADERS,
    tags: { name: 'crear' },
  });
  check(created, { 'crear: 201': (r) => r.status === 201 });

  if (created.status === 201) {
    const id = created.json('id');
    const one = http.get(`${BASE_URL}/api/pieces/${id}`, { tags: { name: 'consultar' } });
    check(one, { 'consultar: 200': (r) => r.status === 200 });
  }

  const list = http.get(`${BASE_URL}/api/pieces`, { tags: { name: 'listar' } });
  check(list, { 'listar: 200': (r) => r.status === 200 });

  sleep(1);
}
