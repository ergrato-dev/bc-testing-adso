// Estrés: sube por escalones hasta romper. No tiene umbrales que aprueben o
// reprueben: se mira en qué escalón la latencia o los errores se disparan.
//   k6 run carga/estres.js
import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL ?? 'http://localhost:8000';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 200 },
    { duration: '30s', target: 400 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  // Sin sleep: cada usuario pide tan rápido como el API responde.
  const res = http.get(`${BASE_URL}/api/pieces`);
  check(res, { 'status 200': (r) => r.status === 200 });
}
