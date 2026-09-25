# Reto — Tests unitarios del proyecto formativo y CI con umbral

> Entregable grupal con evidencia individual · Tiempo estimado: 3 h · Piso de cobertura al cerrar la semana: **30%**

## Parte 1: Rotar de capa (10 min)

La semana pasada todo el grupo estuvo en E2E. Esta semana cada integrante toma una capa **distinta** y la anota en la columna **S2** de `docs/matriz-rotacion.md`:

| Capa | Qué hace esta semana |
|---|---|
| **Front** | Tests unitarios de la lógica pura del frontend. Si está dentro de los componentes, primero la extrae a funciones |
| **API** | Tests unitarios de las reglas de negocio de los servicios del backend |
| **BD** | Tests unitarios de la lógica cercana a los datos: validaciones del modelo o entidad, conversiones entre DTO y entidad, cálculos sobre registros. Si no hay, toma reglas de otro servicio distinto al de API |
| **E2E** | Monta el CI y la regla de rama ([receta de CI](../2-recetas/ci/README.md)), y además escribe sus propios tests unitarios en cualquier capa |

- Grupo de 3: Front, API y E2E. La capa BD queda para la próxima semana.
- Grupo de 5: dos integrantes comparten una capa, trabajando sobre **unidades distintas**.

## Parte 2: Tests unitarios (2 h)

Cada integrante escribe **al menos 3 tests unitarios** sobre reglas de negocio **reales** del proyecto, en su capa:

1. Elige una unidad con lógica de verdad: condiciones, cálculos, validaciones. No sirven los getters ni los controladores que solo delegan.
2. Si la regla depende de la fecha, del azar o de la configuración, recíbela por parámetro (FIRST: Repeatable).
3. Diseña los casos con particiones y **valores límite**. Usa un test parametrizado cuando varios casos compartan estructura.
4. **Mutación manual**: muta la regla y confirma que al menos un test tuyo falla. Si ninguno falla, falta un caso.
5. Haz commit con tu propio usuario y abre un PR. En la descripción del PR, anota **qué mutante probaste y qué test lo detectó**.

> 🧪 Ejemplo de evidencia en el PR: *"Mutante: cambié `stock > 0` por `stock >= 0` en `canReserve()`. Lo detectó `should reject reservation when stock is zero`."*

## Parte 3: CI y umbral (en paralelo, 1 h)

Quien tiene la capa E2E, con apoyo del grupo:

1. Crea `.github/workflows/tests.yml` según la [receta](../2-recetas/ci/README.md).
2. Comprueba que un umbral incumplido pone el job en rojo.
3. Activa la regla de rama, o registra en la matriz que el grupo aplica la regla manual si el repo es privado.

Desde que el CI está en `main`, **todos los PR de la semana deben quedar en verde** antes de fusionarse.

## Parte 4: Cierre de semana, subir el umbral (20 min)

Cuando los PR de tests estén fusionados:

1. Corre los tests de frontend y backend en `main` y anota la cobertura real en la tabla **Cobertura semanal** de la matriz.
2. Calcula el nuevo umbral de **cada** parte: el **mayor** entre **30** y la cobertura real, redondeada hacia abajo.
3. Abre un PR que **solo** cambie el umbral en la configuración (`vite.config.js` o `vitest.config.js`, `pyproject.toml` o `pom.xml`).
4. El CI debe quedar en verde con el umbral nuevo. Si no llegan a 30%, faltan tests: vuelvan a la Parte 2.

> ⚠️ No inflen el número excluyendo archivos con lógica de negocio ni con tests sin aserciones. El instructor revisa las exclusiones, y el vocero debe mostrar qué test falla si se rompe el código cubierto.

## Entregables

- [ ] Columna S2 de la matriz con una capa distinta a la de S1 para cada integrante
- [ ] Al menos 3 tests unitarios por integrante, en su capa, sobre reglas reales
- [ ] Un mutante documentado por integrante en su PR
- [ ] `.github/workflows/tests.yml` en `main`, con el último run en verde
- [ ] Regla de rama activa, o regla manual registrada en la matriz
- [ ] Umbral ≥ 30% en frontend y en backend, fijado por PR y en verde en CI
- [ ] Cobertura real de la semana anotada en la matriz

## Preparación para el vocero aleatorio

El instructor escoge a alguien al azar y le pide, sobre una capa que **no** trabajó esta semana:

- Explicar qué regla verifica un test unitario del grupo y cuál es su valor límite.
- Hacer una mutación en vivo y mostrar qué test la detecta.
- Mostrar en la pestaña Actions el último run y explicar qué pasaría si baja la cobertura.
