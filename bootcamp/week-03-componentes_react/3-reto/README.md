# Reto — Tests de componentes del proyecto formativo

> Entregable grupal con evidencia individual · Tiempo estimado: 3 h · Piso de cobertura al cerrar la semana: **40%** en frontend **y** backend

## Parte 1: Repartir el trabajo (10 min)

Esta es una semana de **tema común**: todo el grupo trabaja la capa Front y en la columna **S3** de la matriz todos escriben **Front**. La rotación sigue la próxima semana.

Cada integrante escoge **un componente distinto** y lo anota junto a su nombre en la matriz, por ejemplo `Front: LoginForm`. Prioricen:

1. Formularios: login, registro, creación del recurso principal.
2. Listas que cargan datos: con estados de carga, vacío, datos y error.
3. Rutas protegidas o componentes que cambian según el usuario o su rol.
4. Componentes con lógica condicional: botones que se deshabilitan, secciones visibles solo para un rol.

**Responsable del backend**: el umbral también aplica al backend, y esta semana nadie trabaja ahí. La persona que tuvo la capa **Front en S2** (la que más practicó el frontend) se encarga además de llevar el backend al 40% con tests unitarios, usando las técnicas de la semana 2. Así también rota.

## Parte 2: Tests de componentes (2 h)

Cada integrante escribe **al menos 3 tests** de su componente:

- Al menos uno con **interacción** mediante `user-event` (escribir, hacer clic, enviar).
- Al menos uno de un **estado** distinto del caso feliz: validación, carga, vacío, error o sin permisos.
- Queries según la prioridad: `getByRole` y `getByLabelText` primero. `getByTestId` solo si lo justificas en un comentario.
- Si el componente usa rutas o contexto, envuélvelo con `MemoryRouter` o con el proveedor. Si varios integrantes lo necesitan, creen **un solo** `renderWithProviders` compartido.
- Si el componente llama al API, reemplaza el módulo del cliente HTTP con `vi.mock`.

Para cada componente:

1. **Mutación**: rompe a propósito un comportamiento (borra un mensaje, invierte una condición, quita un `reset()`) y confirma que un test tuyo falla. Documenta el mutante en el PR.
2. **Accesibilidad**: si una query accesible no encuentra un elemento, corrige el componente (etiqueta asociada, texto en el botón, `role="alert"` en los errores). Los arreglos de accesibilidad cuentan como aporte.
3. Commit con tu propio usuario y PR revisado por otro integrante, que debe **correr** los tests.

> 🧩 Si en tu componente la lógica y la interfaz están muy mezcladas, extrae la lógica a una función (como `validatePieceForm` en la semana 2) y prueba cada parte por separado.

## Parte 3: Cierre de semana, umbral del 40% (20 min)

1. Con todos los PR fusionados, anota en la matriz la cobertura real de frontend y backend.
2. Abre un PR que suba el umbral de **cada** parte al mayor entre **40** y su cobertura real, redondeada hacia abajo.
3. El CI debe quedar en verde con los umbrales nuevos.

## Entregables

- [ ] Columna S3 de la matriz: `Front: <componente>` para cada integrante, sin componentes repetidos
- [ ] Al menos 3 tests de componente por integrante, con interacción y con un estado no feliz
- [ ] Un mutante documentado por integrante en su PR
- [ ] Backend al 40% o más, trabajado por el responsable de la semana
- [ ] Umbral ≥ 40% en frontend y backend, fijado por PR y en verde en CI
- [ ] Cobertura real de la semana anotada en la matriz

## Preparación para el vocero aleatorio

El instructor escoge a alguien al azar y le pide, sobre el componente de **otro** integrante:

- Explicar qué query usa cada test y por qué esa y no otra.
- Explicar por qué un elemento se busca con `findBy` y otro con `queryBy`.
- Romper el componente en vivo y mostrar qué test falla.
