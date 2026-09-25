# Rúbrica de evaluación — Semana 7

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | Locators y auto-waiting, flaky frente a defecto real, datos por API |
| Desempeño 💪 | 40% | Individual | E2E propios de un flujo crítico, estables e independientes, con un mutante documentado |
| Producto 📦 | 30% | Grupal | Los 3 flujos críticos en E2E estables, un defecto de tiempos investigado y umbral ≥ 75% |

---

## Conocimiento 🧠 (30%, individual)

### Criterios

1. Explica por qué `expect(locator).toBeVisible()` no necesita `waitForTimeout`, y qué pasa con `expect(await locator.isVisible()).toBe(true)`.
2. Ante un test que falla a veces, explica cómo decide si el problema está en el test o en la app.
3. Explica por qué los datos de un E2E se preparan por API y no con los datos que ya hay en la BD.
4. Lee una traza de Playwright de un test fallido y señala en qué paso y por qué falló.

### Niveles

- **Alto (27–30)**: responde los cuatro criterios sobre un test que no escribió.
- **Medio (21–26)**: responde con apoyo o solo sobre sus propios tests.
- **Bajo (0–20)**: no distingue una espera automática de una pausa fija.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Al menos 2 E2E propios sobre un flujo crítico distinto al de sus compañeros (commits con su usuario).
2. Locators accesibles (`getByRole`, `getByLabel`), aserciones web-first y ningún `waitForTimeout`.
3. Cada test prepara sus datos por API o con valores únicos, y pasa con `--repeat-each=5`.
4. PR con un mutante documentado, revisado por otro integrante.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios.
- **Medio (28–35)**: tests correctos pero con selectores CSS frágiles, o que dependen de datos que ya estaban en la BD.
- **Bajo (0–27)**: menos de 2 tests propios, o tests con pausas fijas.

---

## Producto 📦 (30%, grupal)

### Criterios

1. Los 3 flujos críticos del proyecto cubiertos por E2E, anotados en el PR con el porqué de cada uno.
2. La suite completa pasa con `--repeat-each=5` en paralelo (los workers por defecto), contra la BD de pruebas en Docker.
3. Al menos un defecto de tiempos investigado (doble envío, red lenta o carga en curso): reproducido a propósito, corregido o registrado como incidencia.
4. Reporte HTML y trazas configurados para diagnosticar fallos.
5. Umbral ≥ 75% (o la cobertura real si es mayor) en frontend y backend, con CI en verde.

### Niveles

- **Alto (27–30)**: cumple los cinco criterios.
- **Medio (21–26)**: flujos cubiertos pero con tests inestables, o sin defecto de tiempos investigado.
- **Bajo (0–20)**: CI en rojo, umbral por debajo del 75% o menos de 2 flujos críticos cubiertos.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio** esta semana.
