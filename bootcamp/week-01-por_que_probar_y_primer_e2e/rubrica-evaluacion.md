# Rúbrica de evaluación — Semana 1

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | Pirámide de pruebas, AAA y anatomía de un test Playwright |
| Desempeño 💪 | 40% | Individual | Test E2E propio sobre un flujo del proyecto formativo |
| Producto 📦 | 30% | Grupal | Playwright configurado en el repo del grupo, suite en verde y matriz iniciada |

---

## Conocimiento 🧠 (30%, individual)

Se evalúa con el vocero aleatorio y con preguntas cortas.

### Criterios

1. Distingue error, defecto y falla con un ejemplo de su proyecto.
2. Ubica pruebas unitarias, de integración y E2E en la pirámide y explica por qué hay pocas E2E.
3. Señala Arrange, Act y Assert en el test de **otro** integrante.
4. Explica por qué se prefieren `getByRole` y `getByLabel` y por qué se evita `waitForTimeout`.

### Niveles

- **Alto (27–30)**: responde los cuatro criterios con ejemplos del proyecto propio.
- **Medio (21–26)**: responde con apoyo o con imprecisiones menores.
- **Bajo (0–20)**: no logra explicar el test de otro integrante.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Tiene un test E2E propio (commit con su usuario) sobre un flujo distinto al del resto del grupo.
2. El test tiene al menos una aserción sobre lo que ve la persona usuaria.
3. Usa locators por rol o etiqueta, sin selectores CSS frágiles ni esperas fijas.
4. El test pasa y está estructurado en AAA con un nombre descriptivo.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios y demuestra que el test falla cuando se rompe la app.
- **Medio (28–35)**: el test pasa, pero tiene aserciones débiles, locators frágiles o le falta estructura.
- **Bajo (0–27)**: no tiene test propio, o el test no tiene aserciones.

---

## Producto 📦 (30%, grupal)

### Criterios

1. `e2e/` con Playwright en versión exacta y `playwright.config.js` que levanta el frontend.
2. Suite completa en verde en el equipo de al menos dos integrantes.
3. `docs/matriz-rotacion.md` y `.github/pull_request_template.md` en el repo.
4. PR revisado por un integrante distinto al autor.

### Niveles

- **Alto (27–30)**: cumple los cuatro criterios.
- **Medio (21–26)**: suite parcial o falta alguna plantilla.
- **Bajo (0–20)**: Playwright no está configurado o la suite no corre.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio** esta semana.
