import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    // Cualquiera de los 3 backends de referencia escucha en el puerto 8000
    proxy: { '/api': 'http://localhost:8000' },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      // Se mide la lógica de la interfaz. Quedan fuera el arranque (main.jsx) y el
      // cliente HTTP (api.js), que se prueba con MSW en la semana 5.
      include: ['src/**'],
      exclude: ['src/main.jsx', 'src/api.js'],
      // Umbral mínimo: si la cobertura baja de aquí, "pnpm test" falla
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
