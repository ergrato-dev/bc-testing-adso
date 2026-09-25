# Receta — Lógica pura del frontend React con Vitest

> Capa Front · Tiempo estimado: 1.5 h

Código: [`referencia/frontend-react/`](../../../../referencia/frontend-react/). No necesitas el backend ni el navegador: pruebas funciones de JavaScript.

```bash
cd referencia/frontend-react
pnpm install
```

La semana 3 prueba componentes con React Testing Library. Esta semana pruebas la **lógica que vive fuera de los componentes**, que es la más rápida y barata de probar.

---

## Paso 1: Encontrar la lógica escondida en un componente

Abre [`src/PieceForm.jsx`](../../../../referencia/frontend-react/src/PieceForm.jsx). La validación **no** está escrita dentro de `handleSubmit`: el componente llama a `validatePieceForm(piece)`, definida en [`src/validate-piece-form.js`](../../../../referencia/frontend-react/src/validate-piece-form.js):

```javascript
export function validatePieceForm({ name, artist }) {
  if (!name.trim()) return 'El nombre es obligatorio';
  if (!artist.trim()) return 'El artista es obligatorio';
  return '';
}
```

Es una función pura: mismos datos de entrada, mismo resultado, sin React ni DOM. Por eso se puede probar como unidad.

> 💡 En tu proyecto busca lógica metida dentro de componentes: validaciones en `onSubmit`, cálculos de totales en el JSX, formateo de fechas o de precios. **Extráela a un archivo `.js`** y pruébala aquí. Es el cambio que más facilita probar un frontend.

## Paso 2: Escribir el primer test

Crea `tests/validate-piece-form.test.js`:

```javascript
import { describe, expect, it } from 'vitest';
import { validatePieceForm } from '../src/validate-piece-form.js';

describe('validatePieceForm', () => {
  it('should return an empty string when name and artist are filled', () => {
    // Arrange
    const values = { name: 'Guernica', artist: 'Picasso' };

    // Act
    const error = validatePieceForm(values);

    // Assert
    expect(error).toBe('');
  });
});
```

Córrelo en modo observador:

```bash
pnpm test:watch tests/validate-piece-form.test.js
```

## Paso 3: Particiones y casos borde con `it.each`

Agrega dentro del `describe` un test parametrizado con los casos inválidos: vacío, solo espacios y un tabulador.

```javascript
  it.each([
    [{ name: '', artist: 'Picasso' }, 'El nombre es obligatorio'],
    [{ name: '   ', artist: 'Picasso' }, 'El nombre es obligatorio'],
    [{ name: 'Guernica', artist: '\t' }, 'El artista es obligatorio'],
  ])('should return an error message when values are %o', (values, message) => {
    expect(validatePieceForm(values)).toBe(message);
  });
```

Cada fila aparece como un test aparte en la salida.

## Paso 4: El mutante que solo la prueba unitaria ve

En `src/validate-piece-form.js`, borra el `.trim()` de la validación del nombre:

```diff
-  if (!name.trim()) return 'El nombre es obligatorio';
+  if (!name) return 'El nombre es obligatorio';
```

Corre **toda** la suite con `pnpm test`:

- Los tests de `PieceForm.test.jsx` siguen pasando, porque el componente ya recorta los valores antes de llamar a la función.
- Tu test unitario con `'   '` **falla**.

La función promete rechazar nombres en blanco. Si mañana otro componente la usa sin recortar antes, el defecto aparecería ahí. El test unitario protege **el contrato de la función**, no solo el uso de hoy. Deshaz el cambio.

## Paso 5: Tu propia regla

Agrega a `validatePieceForm` una regla nueva y pruébala **con valores límite**. Por ejemplo, que el nombre tenga como máximo 100 caracteres:

- 99 caracteres: válido.
- 100 caracteres: válido (el borde).
- 101 caracteres: `'El nombre admite máximo 100 caracteres'`.

Pista: `'a'.repeat(100)` crea un texto de 100 caracteres.

Luego muta la regla (`>` por `>=`) y confirma que tu test de 100 caracteres la detecta.

## Paso 6: Ver la cobertura

```bash
pnpm test
```

Abre `coverage/index.html` y entra a `validate-piece-form.js`. Comprueba que tu regla nueva quedó cubierta en todas sus ramas.

---

## Checklist

- [ ] Entendí por qué la validación vive fuera del componente
- [ ] Escribí tests unitarios de `validatePieceForm` con AAA y `it.each`
- [ ] Vi un mutante que los tests del componente no detectan y el test unitario sí
- [ ] Agregué una regla con valores límite y su test
- [ ] Identifiqué lógica en los componentes de mi proyecto que puedo extraer

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Integración continua con GitHub Actions](../../1-teoria/03-integracion-continua.md) | [Semana 2](../../README.md) | [Receta — Pruebas unitarias en FastAPI con pytest](../fastapi/README.md) |
