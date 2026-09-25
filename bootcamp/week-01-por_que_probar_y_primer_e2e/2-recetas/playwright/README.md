# Receta — Playwright contra la app de referencia

> Común a toda la ficha · Tiempo estimado: 1.5 h

Vas a correr los tests E2E de la app de referencia Museo, grabar un flujo nuevo con `codegen` y convertirlo en un test limpio. Lo que aprendas aquí lo repites en el [reto](../../3-reto/README.md) sobre tu proyecto.

Código de esta receta: [`referencia/e2e/`](../../../../referencia/e2e/)

---

## Paso 1: Levantar la app de referencia

Playwright prueba la app completa, así que necesitas BD, backend y frontend. Desde la carpeta `referencia/`:

```bash
# 1. Base de datos de prueba
docker compose up -d --wait postgres
```

```bash
# 2. Un backend (elige el de tu grupo; queda en el puerto 8000)

# Express
cd api-express && pnpm install
DB_CLIENT=pg DATABASE_URL=postgres://museo:museo@localhost:5433/museo_test pnpm start

# FastAPI
cd api-fastapi && uv sync
DATABASE_URL=postgresql+psycopg://museo:museo@localhost:5433/museo_test uv run uvicorn app.main:app --port 8000

# Spring Boot
cd api-springboot
DATABASE_URL=jdbc:postgresql://localhost:5433/museo_test ./mvnw spring-boot:run
```

Deja esa terminal abierta. El frontend no lo levantas tú: lo hace Playwright (ver `webServer` en `playwright.config.js`). Solo instala sus dependencias una vez:

```bash
cd referencia/frontend-react && pnpm install
```

> En Windows (PowerShell) define las variables antes del comando: `$env:DATABASE_URL="..."`.

## Paso 2: Instalar Playwright

En otra terminal:

```bash
cd referencia/e2e
pnpm install
pnpm exec playwright install chromium
```

El segundo comando descarga el navegador (unos 110 MB). Solo se hace una vez por equipo.

## Paso 3: Correr los tests existentes

```bash
pnpm test
```

Deberías ver:

```text
  ✓  1 [chromium] › tests/create-piece.spec.js:3:1 › should show the new piece in the list after saving the form
  ✓  2 [chromium] › tests/create-piece.spec.js:18:1 › should show an error when name is empty

  2 passed
```

Ahora míralos en acción:

```bash
pnpm exec playwright test --headed    # ves el navegador
pnpm test:ui                          # modo interactivo, paso a paso
```

> Si el puerto 5173 está ocupado: `FRONT_PORT=5199 pnpm test`.

## Paso 4: Leer el test con los ojos de AAA

Abre [`tests/create-piece.spec.js`](../../../../referencia/e2e/tests/create-piece.spec.js) e identifica:

- **Arrange**: el nombre único con `Date.now()` y `page.goto('/')`. ¿Por qué el nombre debe ser único? Pista: la BD conserva los datos entre ejecuciones.
- **Act**: los `fill` y el `click`.
- **Assert**: el `expect(...).toContainText(name)`.

## Paso 5: Hacerlo fallar

Un test que no puede fallar no sirve. Cambia la aserción del primer test:

```javascript
await expect(page.getByRole('list', { name: 'Piezas' })).toContainText('Otra cosa');
```

Corre `pnpm test`. Fíjate en que:

- Playwright **esperó 5 segundos** reintentando antes de declarar la falla.
- El mensaje muestra lo que esperaba y lo que encontró.
- `pnpm report` abre el reporte HTML con el detalle.

Deshaz el cambio y confirma que vuelve a pasar.

## Paso 6: Grabar un flujo nuevo con codegen

Con el backend corriendo, levanta el frontend a mano y abre codegen:

```bash
cd referencia/frontend-react && pnpm dev          # terminal 3
cd referencia/e2e && pnpm codegen                 # terminal 4
```

En el navegador que se abre, registra una pieza con **año futuro** (por ejemplo 2999) y haz clic en Guardar. Codegen escribe algo parecido a esto en su ventana:

```javascript
await page.goto('http://localhost:5173/');
await page.getByRole('textbox', { name: 'Nombre' }).click();
await page.getByRole('textbox', { name: 'Nombre' }).fill('Pieza del futuro');
await page.getByRole('textbox', { name: 'Artista' }).click();
await page.getByRole('textbox', { name: 'Artista' }).fill('Anónimo');
await page.getByRole('spinbutton', { name: 'Año' }).fill('2999');
await page.getByRole('button', { name: 'Guardar' }).click();
```

## Paso 7: Convertir el borrador en un test

Crea `tests/future-year.spec.js` y limpia lo grabado:

1. Quita los `click()` innecesarios antes de cada `fill()`.
2. Usa la ruta relativa `page.goto('/')`: la `baseURL` ya está configurada.
3. Organiza en AAA.
4. **Agrega la aserción**: codegen no la escribe por ti. El backend rechaza el año futuro con un 422 y el formulario muestra su mensaje en un `alert`.

```javascript
import { expect, test } from '@playwright/test';

test('should show an error when year is in the future', async ({ page }) => {
  // Arrange
  await page.goto('/');

  // Act
  await page.getByLabel('Nombre').fill('Pieza del futuro');
  await page.getByLabel('Artista').fill('Anónimo');
  await page.getByLabel('Año').fill('2999');
  await page.getByRole('button', { name: 'Guardar' }).click();

  // Assert
  await expect(page.getByRole('alert')).toHaveText('year cannot be in the future');
});
```

Corre `pnpm test`: deben pasar 3 tests. Después haz el Paso 5 con este test nuevo.

> 💡 Fíjate en que el mensaje de error está en inglés porque lo envía el backend tal cual. En un proyecto real conviene que el frontend lo traduzca. Los E2E son buenos para descubrir estos detalles de experiencia de usuario.

---

## Checklist de la receta

- [ ] Corrí los 2 tests de la referencia en verde
- [ ] Vi los tests con `--headed` o `--ui`
- [ ] Hice fallar un test a propósito y leí el reporte
- [ ] Grabé un flujo con codegen y lo convertí en un test con aserción
- [ ] Mi test nuevo pasa, y falla cuando rompo la aserción
