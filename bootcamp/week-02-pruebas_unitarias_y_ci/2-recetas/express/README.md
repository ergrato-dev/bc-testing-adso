# Receta — Pruebas unitarias en Express con Vitest

> Capas API y BD de grupos Express · Tiempo estimado: 1.5 h

Código: [`referencia/api-express/`](../../../../referencia/api-express/). No necesitas Docker ni la BD: las pruebas unitarias no tocan infraestructura.

```bash
cd referencia/api-express
pnpm install
```

---

## Paso 1: Correr la suite y ubicar la unidad

```bash
pnpm test
```

Verás los tests en verde y la tabla de cobertura. Abre [`src/pieces-service.js`](../../../../referencia/api-express/src/pieces-service.js) y ubica la unidad de esta receta: `validatePiece(data, currentYear)`.

Fíjate en que:

- No importa nada de Express ni de Knex: es JavaScript puro.
- Recibe `currentYear` como parámetro con un valor por defecto. Así el test fija el año y es **repetible** (la "R" de FIRST).

## Paso 2: Leer los tests existentes

Abre [`tests/pieces-service.test.js`](../../../../referencia/api-express/tests/pieces-service.test.js):

- El primer test sigue AAA con comentarios explícitos.
- El segundo usa `it.each`: cuatro casos inválidos, cada uno reportado como un test aparte.

Corre solo este archivo en modo observador mientras trabajas:

```bash
pnpm test:watch tests/pieces-service.test.js
```

## Paso 3: El bug que nadie ve

En `src/pieces-service.js`, cambia la regla del año:

```diff
-  if (data.year > currentYear) {
+  if (data.year >= currentYear) {
```

Guarda. Con el modo observador, los tests corren solos: **todos pasan**. Sin embargo, ahora una pieza de este año es rechazada. Ese es el mutante que sobrevive por falta de un caso en el **valor límite**.

## Paso 4: Escribir el test del valor límite

Sin deshacer el cambio, agrega este test dentro del `describe('validatePiece', …)`:

```javascript
  it('should accept a piece from the current year', () => {
    // Arrange: el borde exacto de la regla
    const data = { name: 'Recent', artist: 'Someone', year: 2026 };

    // Act
    const piece = validatePiece(data, 2026);

    // Assert
    expect(piece.year).toBe(2026);
  });
```

El test falla, con un mensaje parecido a `ValidationError: year cannot be in the future`. **Acabas de matar al mutante.** Deshaz el cambio del Paso 3 y confirma que todo vuelve a verde.

## Paso 5: Ampliar el test parametrizado

Agrega una fila al `it.each` para un nombre que solo contiene un tabulador:

```javascript
    [{ name: '\t', artist: 'Picasso', year: 1937 }, 'name is required'],
```

¿Pasa? ¿Por qué? Pista: mira qué hace `trim()` con `\t`.

## Paso 6: Tu propia mutación

Elige otra línea de `validatePiece` y mútala. Ideas:

- Borra el `.trim()` de la validación de `artist`.
- Cambia `Number.isInteger(data.year)` por `typeof data.year === 'number'`.

Corre los tests. Si ningún test falla, escribe el caso que lo detecta. Deshaz la mutación.

## Paso 7: Leer el reporte de cobertura

```bash
pnpm test
```

Abre `coverage/index.html` en el navegador y entra a `pieces-service.js`. Las líneas en rojo no se ejecutaron. Recuerda lo que aprendiste en el Paso 3: el verde en el reporte no garantiza que la lógica esté verificada.

---

## Checklist

- [ ] Ubiqué la unidad y entendí por qué recibe `currentYear`
- [ ] Vi sobrevivir el mutante `>=` con la suite en verde
- [ ] Escribí el test del valor límite y vi cómo lo mata
- [ ] Agregué un caso al test parametrizado
- [ ] Hice mi propia mutación y, si sobrevivió, escribí el test que la detecta
