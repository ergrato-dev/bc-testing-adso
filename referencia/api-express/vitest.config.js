import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      // Se mide la lógica de negocio. Quedan fuera el arranque (server.js), el
      // adaptador de BD, que se prueba con integración contra la BD real (semana 6),
      // y el notificador, que representa un servicio externo.
      include: ['src/**'],
      exclude: ['src/server.js', 'src/knex-repository.js', 'src/notifier.js'],
      // Umbral mínimo: si la cobertura baja de aquí, "pnpm test:coverage" falla
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
