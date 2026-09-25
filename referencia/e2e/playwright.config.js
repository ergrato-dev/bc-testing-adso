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
  webServer: {
    command: `pnpm --dir ../frontend-react exec vite --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
});
