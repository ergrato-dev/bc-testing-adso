# Reto — Cierre y sustentación del proyecto formativo

> Entregable grupal con evidencia individual · Tiempo estimado: 4 h · Condición para sustentar: **CI completo en verde y cobertura ≥ 80%** en frontend y backend

## Parte 1: Cerrar la suite (1 h 30 min)

Semana de tema común: anoten **Todas** en la columna **S9** de la matriz.

1. Corran el workflow completo en `main` **dos veces seguidas**, sin reintentos manuales. Si falla la segunda, busquen la causa (teoría 3 de la semana 8) antes de seguir.
2. Revisen los tests *skipped* de cada job: deben ser cero, o estar justificados en el informe.
3. Revisen los hallazgos abiertos del trimestre. Cada uno queda **corregido** con su test, o registrado como **incidencia** en el repo con su test marcado como fallo esperado: `test.fail()` en Playwright, `it.fails` en Vitest, `@pytest.mark.xfail(strict=True)` en pytest. JUnit no tiene fallo esperado: usa `@Disabled("incidencia #N")` y cuéntalo entre los saltos justificados.
4. Confirmen que el umbral configurado es **≥ 80%** en frontend y backend.

## Parte 2: El informe de estrategia (1 h 30 min)

Con la [receta](../2-recetas/evidencia/README.md), reúnan la evidencia y escriban `docs/estrategia-pruebas.md` a partir de la [plantilla](../../../plantillas/estrategia-pruebas.md).

Repartan las secciones, pero **no** por capas: cada integrante escribe una sección sobre capas que no trabajó en la semana 8. Así el informe también es un repaso.

| Sección | Quién |
|---|---|
| 1. Qué no puede fallar · 2. Qué prueba cada capa | |
| 3. Qué no se prueba · 4. Datos y entornos | |
| 5. CI y umbrales · 6. Hallazgos | |
| 7. Evidencia individual · revisión final | |

El informe entra por PR, revisado por **todo** el grupo: cada integrante debe poder defender cualquier línea.

## Parte 3: Ensayo cruzado (1 h)

Sigan el ensayo de la [teoría 2](../1-teoria/02-sustentacion.md):

1. Parejas de capas distintas. Cada persona hace a la otra las tres pruebas (explicar, romper, escribir) sobre un test de su capa.
2. Roten hasta que cada integrante haya respondido por las **cuatro** capas.
3. Anoten en el PR del informe qué capa le costó más a cada uno y qué repasaron.

## Parte 4: Sustentación (según el horario del instructor)

- Informe abierto y el último run de `main` en verde en pantalla.
- 5 minutos de presentación del informe.
- Vocero aleatorio por capa: explicar, romper o escribir, sobre una capa que la persona no trabajó en la semana 8.

## Entregables

- [ ] Columna S9 de la matriz y matriz completa del trimestre
- [ ] Workflow completo en verde dos veces seguidas en `main`, con el enlace a los runs
- [ ] Cero tests saltados en el CI, o cada salto justificado
- [ ] Hallazgos del trimestre corregidos o registrados como incidencia con su test
- [ ] `docs/estrategia-pruebas.md` con las siete secciones, máximo dos páginas
- [ ] Ensayo cruzado anotado en el PR del informe
- [ ] Umbral ≥ 80% en frontend y backend

## Después del bootcamp

La semana 10 (opcional) trata TDD sobre una historia de usuario nueva del proyecto. Si la ficha no llega, el cierre está completo: la suite y el CI quedan como parte del proyecto formativo, y cada PR futuro los mantiene en verde.
