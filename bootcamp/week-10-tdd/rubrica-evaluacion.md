# Rúbrica de evaluación — Semana 10 (opcional)

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | El ciclo, la lista de pruebas, Red por la razón correcta, refactor en verde |
| Desempeño 💪 | 40% | Individual | Ciclos propios visibles en el historial: test que falla, código mínimo, refactor |
| Producto 📦 | 30% | Grupal | Historia nueva del proyecto terminada por TDD, con CI en verde y cobertura ≥ 80% |

---

## Conocimiento 🧠 (30%, individual)

### Criterios

1. Explica las tres fases del ciclo y qué **no** se hace en cada una.
2. Muestra la lista de pruebas de su parte y explica por qué eligió ese orden.
3. Ante un test en rojo, explica si falla por la razón correcta (el comportamiento falta) o por otra (un error de sintaxis, un import).
4. Explica un refactor que hizo con la suite en verde y cómo supo que no cambió el comportamiento.

### Niveles

- **Alto (27–30)**: responde los cuatro criterios sobre una parte de la historia que no escribió.
- **Medio (21–26)**: responde con apoyo o solo sobre su propia parte.
- **Bajo (0–20)**: no distingue el orden del ciclo o escribió el código antes del test.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Al menos 3 ciclos completos propios, visibles en el historial: un commit con el test en rojo y otro con el código que lo pone en verde.
2. Cada Green es el cambio mínimo: no agrega comportamiento que ningún test pide.
3. Al menos un refactor del código o de los tests con la suite en verde, en su propio commit.
4. PR revisado por otro integrante, con la lista de pruebas en la descripción.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios.
- **Medio (28–35)**: ciclos correctos pero con Greens que adelantan comportamiento, o sin refactor.
- **Bajo (0–27)**: menos de 3 ciclos, o tests escritos después del código.

---

## Producto 📦 (30%, grupal)

### Criterios

1. Historia de usuario nueva del proyecto terminada, con criterios de aceptación escritos antes de empezar.
2. Cada criterio de aceptación tiene al menos un test.
3. Lista de pruebas del grupo en el PR, con cada caso marcado como hecho.
4. CI completo en verde y cobertura ≥ 80% en frontend y backend.

### Niveles

- **Alto (27–30)**: cumple los cuatro criterios.
- **Medio (21–26)**: historia terminada pero con criterios sin test.
- **Bajo (0–20)**: historia sin terminar o CI en rojo.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio** esta semana.
