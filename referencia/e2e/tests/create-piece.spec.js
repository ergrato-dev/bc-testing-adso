import { expect, test } from '@playwright/test';

test('should show the new piece in the list after saving the form', async ({ page }) => {
  // Arrange: nombre único para no chocar con datos de ejecuciones anteriores
  const name = `Pieza E2E ${Date.now()}`;
  await page.goto('/');

  // Act: la persona llena el formulario y guarda
  await page.getByLabel('Nombre').fill(name);
  await page.getByLabel('Artista').fill('Anónimo');
  await page.getByLabel('Año').fill('1990');
  await page.getByRole('button', { name: 'Guardar' }).click();

  // Assert: la pieza aparece en la lista (Playwright espera solo, sin sleeps)
  await expect(page.getByRole('list', { name: 'Piezas' })).toContainText(name);
});

test('should show an error when name is empty', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Artista').fill('Anónimo');
  await page.getByLabel('Año').fill('1990');
  await page.getByRole('button', { name: 'Guardar' }).click();

  await expect(page.getByRole('alert')).toHaveText('El nombre es obligatorio');
});
