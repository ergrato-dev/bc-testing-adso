# Rúbrica de evaluación — Semana 8

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | Líneas frente a ramas, límites de la cobertura, servicios y artefactos del CI |
| Desempeño 💪 | 40% | Individual | El job de su capa en el workflow, en verde y sin tests saltados, con un rojo provocado y documentado |
| Producto 📦 | 30% | Grupal | Workflow completo (front, backend, integración y E2E) obligatorio en `main`, con cobertura ≥ 80% |

---

## Conocimiento 🧠 (30%, individual)

### Criterios

1. Muestra en el reporte de cobertura del grupo una rama sin cubrir y explica qué comportamiento queda sin probar.
2. Explica por qué una suite con 100% de cobertura puede tener defectos, con un ejemplo del proyecto o de la referencia.
3. Explica cómo llega la BD a un job de GitHub Actions y cómo sabe el job que ya puede usarla.
4. Descarga un artefacto de un run del grupo (cobertura o reporte de Playwright) y explica qué muestra.

### Niveles

- **Alto (27–30)**: responde los cuatro criterios sobre un job que no escribió.
- **Medio (21–26)**: responde con apoyo o solo sobre su propio job.
- **Bajo (0–20)**: confunde cobertura con calidad, o no sabe dónde ver por qué falló el CI.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Commits propios que agregan o completan el job de su capa en el workflow.
2. El job corre en verde y su log muestra **cero** tests saltados de su capa.
3. PR con un rojo provocado a propósito (umbral, test roto o servicio mal configurado), el log del fallo y la corrección.
4. PR revisado por alguien de otra capa.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios.
- **Medio (28–35)**: job en verde pero con tests saltados, o sin rojo provocado.
- **Bajo (0–27)**: sin commits propios en el workflow, o job en rojo al cerrar la semana.

---

## Producto 📦 (30%, grupal)

### Criterios

1. Workflow con jobs de frontend, backend, integración con la BD como servicio y E2E, en verde en `main`.
2. Todos esos jobs marcados como **obligatorios** en el ruleset de `main`.
3. Caché activa en al menos un job y reportes de cobertura y de Playwright como artefactos.
4. Cobertura ≥ 80% en frontend y backend, con al menos una rama sin cubrir analizada en el PR (cubierta con un test o justificada).
5. Ningún test de integración ni E2E saltado en el CI.

### Niveles

- **Alto (27–30)**: cumple los cinco criterios.
- **Medio (21–26)**: CI completo pero con jobs no obligatorios, o sin artefactos.
- **Bajo (0–20)**: CI en rojo, cobertura por debajo del 80% o integración/E2E fuera del CI.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio** esta semana.
>
> El 80% en CI es condición para sustentar en la semana 9.
