import { defineConfig, devices } from '@playwright/test';

// Puerto del frontend. Cámbialo con FRONT_PORT si el 5173 ya está ocupado.
const port = Number(process.env.FRONT_PORT ?? 5173);

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: `http://localhost:${port}`,
    // Guarda la traza solo cuando un test falla y se reintenta: se abre con "pnpm report"
    trace: 'on-first-retry',
  },
  // Lista en la terminal + reporte HTML que abres cuando quieras con "pnpm report"
  reporter: [['list'], ['html', { open: 'never' }]],
  retries: process.env.CI ? 1 : 0,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Playwright levanta el frontend. El backend y la BD los levantas tú antes (ver README).
  // Se lanza vite con node, sin pnpm de por medio, para que Playwright pueda
  // detenerlo al terminar (con "pnpm exec" el proceso a veces queda vivo).
  webServer: {
    command: `node node_modules/vite/bin/vite.js --port ${port} --strictPort`,
    cwd: '../frontend-react',
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
});
