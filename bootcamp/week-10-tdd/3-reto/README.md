# Reto — Una historia de usuario del proyecto formativo, guiada por pruebas

> Entregable grupal con evidencia individual · Tiempo estimado: 3 h · Cobertura: se mantiene **≥ 80%** en frontend y backend

## Parte 1: Elegir la historia y escribir la lista (30 min, en grupo)

Semana de tema común: anoten **TDD** en la columna **S10** de la matriz.

1. Elijan una historia **nueva** del backlog del proyecto, que se pueda terminar en una tarde. Buenas candidatas: un filtro o una búsqueda, una regla de negocio nueva (un descuento, un cupo máximo, un estado que cambia), una validación que falta.
2. Escriban sus **criterios de aceptación** en el PR, antes de tocar código. Por ejemplo: "Dado un cupo de 30, cuando se inscribe la persona 31, entonces responde 422 con el mensaje …".
3. Conviertan los criterios en una **lista de pruebas** (teoría 2) y repártanla por capa:

| Capa | Parte de la historia |
|---|---|
| **API / servicio** | La regla de negocio, ciclo por ciclo sobre el servicio con un fake o un mock |
| **Endpoint** | El parámetro o el cuerpo que llega por HTTP y el código de respuesta |
| **Front** | El componente que usa la historia: primero el test con Testing Library, después el componente |
| **E2E** | Un test del flujo completo, escrito **al inicio** y en rojo hasta que las demás capas terminen (desde afuera, teoría 2) |

En grupos de 3, una persona hace servicio y endpoint.

## Parte 2: Ciclos (2 h)

Cada integrante trabaja su parte con el ciclo Red-Green-Refactor, en una rama:

1. **Al menos 3 ciclos completos** propios. Cada ciclo deja dos commits: el test en rojo (`test: … (red)`) y el código que lo pone en verde.
2. Cada Red se ve fallar **por la razón correcta** antes del Green. Anota en el PR el mensaje de al menos un Red.
3. Cada Green es el cambio mínimo. Si escribes algo que ningún test pide, bórralo o escribe primero el test.
4. Al menos un **refactor** con la suite en verde, en su propio commit (`refactor: …`).
5. Casos que aparezcan en el camino van a la lista, no al código del ciclo en curso.
6. Haz push cuando el ciclo esté en verde: el CI no debe ver tus commits en rojo, pero el historial sí.

## Parte 3: Cierre (30 min, en grupo)

1. El test E2E escrito al inicio pasa.
2. **Mutación**: cada integrante hace una sobre el código nuevo de otra persona. Con TDD, algún test debería fallar. Si ninguno falla, es código que ningún test pidió: anótenlo.
3. Revisen la lista: lo que quedó sin resolver va al PR como incidencia.
4. CI completo en verde y cobertura ≥ 80%.

## Entregables

- [ ] Columna S10 de la matriz
- [ ] Criterios de aceptación y lista de pruebas en el PR, escritos antes del primer commit de código
- [ ] Al menos 3 ciclos por integrante visibles en el historial (test en rojo, luego código)
- [ ] Al menos un commit de refactor por integrante
- [ ] Test E2E de la historia escrito al inicio y en verde al final
- [ ] Mutaciones cruzadas anotadas en el PR
- [ ] CI completo en verde y cobertura ≥ 80%

## Preparación para el vocero aleatorio

El instructor escoge a alguien al azar y le pide, sobre una parte que **no** escribió:

- Mostrar en el historial un ciclo completo y decir por qué falló el Red.
- Explicar un Green: ¿era el cambio mínimo? ¿Qué test pidió cada línea?
- Proponer el siguiente caso de la lista y escribir su Red en vivo.
