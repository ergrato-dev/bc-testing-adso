# Rúbrica de evaluación — Semana 2

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | FIRST, diseño de casos, mutación y CI |
| Desempeño 💪 | 40% | Individual | Tests unitarios propios, en su capa, con un mutante documentado |
| Producto 📦 | 30% | Grupal | CI en verde, merge bloqueado en rojo y umbral ≥ 30% |

---

## Conocimiento 🧠 (30%, individual)

### Criterios

1. Explica por qué una unidad que depende de la fecha actual rompe FIRST y cómo se resuelve.
2. Identifica particiones y valores límite de una regla del proyecto que no escribió.
3. Explica por qué una cobertura alta no garantiza tests buenos, con el ejemplo del mutante `>=`.
4. Explica qué hace el workflow de CI del grupo y qué pasa si la cobertura baja del umbral.

### Niveles

- **Alto (27–30)**: responde los cuatro criterios y hace una mutación en vivo sobre una capa que no trabajó.
- **Medio (21–26)**: responde con apoyo o sin demostrarlo en vivo.
- **Bajo (0–20)**: no logra explicar los tests ni el CI del grupo.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Al menos 3 tests unitarios propios (commits con su usuario) en la capa asignada en la matriz.
2. Los tests verifican reglas de negocio reales e incluyen al menos un valor límite.
3. Tests deterministas: no dependen de la fecha real, del azar, de la BD ni de la red.
4. PR con un mutante documentado y el test que lo detecta, revisado por alguien de otra capa.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios.
- **Medio (28–35)**: tests correctos pero sin valores límite, sin mutante documentado o sin revisión cruzada.
- **Bajo (0–27)**: menos de 3 tests propios, tests sin aserciones o fuera de la capa asignada.

---

## Producto 📦 (30%, grupal)

### Criterios

1. `.github/workflows/tests.yml` corre frontend y backend, y el último run de `main` está en verde.
2. Regla de rama activa, o regla manual registrada si el repo es privado.
3. Umbral ≥ 30% (o la cobertura real, si es mayor) en frontend y backend, fijado por PR.
4. Exclusiones de cobertura justificadas con un comentario y sin lógica de negocio excluida.
5. Matriz con la columna S2 y la cobertura de la semana.

### Niveles

- **Alto (27–30)**: cumple los cinco criterios.
- **Medio (21–26)**: CI en verde pero sin regla de rama ni regla manual, o el umbral solo está en una parte.
- **Bajo (0–20)**: sin CI, CI en rojo o umbral por debajo del 30%.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio** esta semana.
