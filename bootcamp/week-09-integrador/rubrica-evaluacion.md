# Rúbrica de evaluación — Semana 9 (integrador)

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

> **Condición para sustentar**: el workflow completo (frontend, backend, integración y E2E) en verde en `main`, con cobertura **≥ 80%** en frontend y backend. Sin ella el grupo no sustenta y el Producto es Bajo.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | Sustentación: responde por cualquier capa del proyecto |
| Desempeño 💪 | 40% | Individual | Trayectoria del trimestre: capas trabajadas, commits de test y revisiones |
| Producto 📦 | 30% | Grupal | Suite completa en CI, informe de estrategia y hallazgos documentados |

---

## Conocimiento 🧠 (30%, individual)

En la sustentación, sobre una capa que el instructor escoge y que la persona **no** trabajó en la semana más reciente:

### Criterios

1. Explica qué verifica un test escogido por el instructor y por qué fallaría.
2. Rompe el código a propósito y muestra qué test falla, o explica por qué ninguno lo detecta.
3. Escribe en vivo un test pequeño, con ayuda de la receta de esa capa.
4. Explica por qué la suite del proyecto tiene la forma que describe el informe.

### Niveles

- **Alto (27–30)**: resuelve los cuatro criterios sin ayuda del grupo.
- **Medio (21–26)**: resuelve con pistas del instructor, o solo tres criterios.
- **Bajo (0–20)**: no logra explicar ni romper un test de otra capa.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Matriz de rotación completa: pasó por las cuatro capas (Front, API, BD, E2E) durante el trimestre.
2. Commits de test propios en al menos 7 de las 9 semanas (`git shortlog`).
3. Al menos 5 PR revisados a compañeros de otra capa.
4. Un mutante documentado en al menos 5 PR propios.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios.
- **Medio (28–35)**: cumple tres, o pasó por solo tres capas.
- **Bajo (0–27)**: commits de test en menos de 5 semanas, o no pasó por más de dos capas.

---

## Producto 📦 (30%, grupal)

### Criterios

1. Condición para sustentar cumplida (CI completo en verde, ≥ 80%).
2. Informe de estrategia en `docs/estrategia-pruebas.md`, de máximo dos páginas, con las siete secciones de la plantilla.
3. Hallazgos del trimestre listados en el informe, cada uno corregido o con su incidencia abierta.
4. Suite estable: el workflow pasa dos veces seguidas sin reintentos manuales.

### Niveles

- **Alto (27–30)**: cumple los cuatro criterios.
- **Medio (21–26)**: informe incompleto o sin hallazgos documentados.
- **Bajo (0–20)**: condición para sustentar incumplida.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio**.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Glosario — Semana 9](5-glosario/README.md) | [Semana 9](README.md) | [Semana 10 (opcional) — TDD](../week-10-tdd/README.md) |
