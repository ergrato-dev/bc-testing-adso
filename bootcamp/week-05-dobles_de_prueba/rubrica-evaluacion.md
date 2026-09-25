# Rúbrica de evaluación — Semana 5

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | Tipos de dobles, estado frente a comportamiento, exceso de mocks |
| Desempeño 💪 | 40% | Individual | Tests propios con dobles desde su ángulo, con un mutante documentado |
| Producto 📦 | 30% | Grupal | Dependencias inventariadas y probadas, resiliencia verificada y umbral ≥ 60% |

---

## Conocimiento 🧠 (30%, individual)

### Criterios

1. Identifica el tipo de doble de un test del grupo y justifica por qué es el adecuado.
2. Explica cuándo verificar estado y cuándo comportamiento.
3. Explica por qué conviene envolver una librería externa en una interfaz propia antes de reemplazarla.
4. Explica qué detecta MSW que `vi.mock` no, o qué detecta `page.route` que un test de componente no.

### Niveles

- **Alto (27–30)**: responde los cuatro criterios sobre un test que no escribió.
- **Medio (21–26)**: responde con apoyo o solo sobre sus propios tests.
- **Bajo (0–20)**: no distingue los tipos de dobles ni su propósito.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Al menos 3 tests propios con dobles desde el ángulo de su capa (commits con su usuario).
2. Tipo de doble anotado en cada test; al menos uno verifica comportamiento y uno estado.
3. Reemplaza interfaces propias, no librerías de terceros ni la unidad bajo prueba.
4. PR con un mutante documentado, revisado por alguien de otra capa.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios.
- **Medio (28–35)**: tests correctos pero solo de comportamiento, o que mockean librerías de terceros directamente.
- **Bajo (0–27)**: menos de 3 tests propios, o tests que solo verifican el mock.

---

## Producto 📦 (30%, grupal)

### Criterios

1. Inventario de dependencias externas en el PR de la semana.
2. Al menos una dependencia externa (o el reloj) probada: se llama bien, no se llama cuando no debe y la app resiste si falla.
3. Cliente HTTP del frontend probado con MSW y al menos 2 E2E con `page.route`.
4. Revisión grupal de exceso de mocks anotada.
5. Umbral ≥ 60% (o la cobertura real si es mayor) en frontend y backend, con CI en verde.

### Niveles

- **Alto (27–30)**: cumple los cinco criterios.
- **Medio (21–26)**: resiliencia sin probar, o faltan los E2E con `page.route`.
- **Bajo (0–20)**: CI en rojo o umbral por debajo del 60%.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio** esta semana.
