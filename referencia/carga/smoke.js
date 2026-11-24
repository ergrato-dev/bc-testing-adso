// Smoke: 1 usuario durante 30 s. ¿El API responde bien con carga mínima?
//   k6 run carga/smoke.js
//   BASE_URL=http://localhost:3000 k6 run carga/smoke.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL ?? 'http://localhost:8000';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // menos del 1% de errores
    http_req_duration: ['p(95)<200'], // el 95% responde en menos de 200 ms
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/pieces`);
  check(res, {
    'status 200': (r) => r.status === 200,
    'devuelve una lista': (r) => Array.isArray(r.json()),
  });
  sleep(1);
}
