# Reto — El API del proyecto formativo desde cuatro ángulos

> Entregable grupal con evidencia individual · Tiempo estimado: 3 h · Piso de cobertura al cerrar la semana: **50%** en frontend y backend

## Parte 1: Rotar de capa (10 min)

Vuelve la rotación. Cada integrante anota en la columna **S4** de la matriz una capa **distinta** a la de S2. Todos escriben pruebas de API, pero cada capa las mira desde un ángulo diferente:

| Capa | Ángulo | Qué endpoints prueba |
|---|---|---|
| **API** | El recurso principal | El CRUD del recurso central del proyecto (productos, citas, pedidos…): caso feliz, validación e inexistente |
| **BD** | Lo que depende de los datos | Endpoints cuya respuesta cambia según lo que hay guardado: duplicados (`409`), relaciones (no borrar un registro con dependientes), búsquedas y filtros. Todo con el repositorio o servicio simulado |
| **Front** | El contrato que consume el frontend | Los endpoints que llama el frontend, verificando **exactamente** los campos del JSON que usa la interfaz y el formato de error que muestra |
| **E2E** | Transversal: seguridad y errores | Endpoints protegidos (`401`, `403`, autorizado) y el contrato de errores de **todo** el API: JSON mal formado, tipos incorrectos, sin stack traces ni SQL en las respuestas |

- Grupo de 3: API, Front y E2E.
- Grupo de 5: dos integrantes comparten una capa, sobre **endpoints distintos**.

## Parte 2: Tests de API (2 h)

Cada integrante escribe **al menos 4 tests de API** sobre endpoints reales de su ángulo:

1. Aísla la base de datos como en la receta de tu stack. Si tu proyecto no lo permite (la app se conecta a la BD al importarse, o `listen()` está junto a las rutas), el **primer aporte** es refactorizarlo. Ese cambio lo hace quien tiene la capa API y cuenta como parte de su evidencia.
2. Verifica **código, cuerpo y `Content-Type`** en al menos un test.
3. **Mutación**: rompe un manejador de errores, un código de estado o un chequeo de permisos y confirma que un test falla. Documéntalo en el PR.
4. Commit con tu usuario y PR revisado por alguien de otra capa.

### Hallazgos que se corrigen

Si un test descubre que el API rompe el contrato (respuestas HTML, stack traces, SQL en el cuerpo, formatos de error distintos), **se corrige en el backend en la misma semana**. Anota cada hallazgo en la descripción del PR:

> 🔎 *Hallazgo: `POST /api/products` con JSON mal formado respondía HTML con el stack trace. Corregido en el manejador de errores. Test: `should respond 400 with JSON detail when body is malformed JSON`.*

Los hallazgos de seguridad (información interna expuesta, un endpoint sin protección, un `403` que no existía) son la mejor evidencia de la semana.

## Parte 3: Cierre de semana, umbral del 50% (20 min)

1. Con los PR fusionados, anota en la matriz la cobertura real de frontend y backend.
2. Abre un PR que suba el umbral de **cada** parte al mayor entre **50** y su cobertura real, redondeada hacia abajo.
3. El CI debe quedar en verde.

> El frontend no tuvo tareas nuevas esta semana. Si todavía no llega al 50%, el grupo decide quién lo completa con tests de componentes (técnicas de la semana 3) y lo anota en la matriz.

## Entregables

- [ ] Columna S4 de la matriz con una capa distinta a la de S2 para cada integrante
- [ ] Al menos 4 tests de API por integrante, desde su ángulo
- [ ] Un mutante documentado por integrante
- [ ] Hallazgos de contrato o seguridad anotados en los PR y corregidos
- [ ] Endpoints protegidos con los casos `401`, `403` y autorizado (si el proyecto tiene autenticación)
- [ ] Umbral ≥ 50% en frontend y backend, fijado por PR y en verde en CI

## Preparación para el vocero aleatorio

El instructor escoge a alguien al azar y le pide, sobre un endpoint que **no** probó:

- Explicar qué código de estado responde en cada escenario y por qué.
- Mostrar cómo el test aísla la base de datos.
- Enviar en vivo una petición mal formada (con el test o con `curl`) y explicar la respuesta.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — Pruebas de API en Spring Boot con MockMvc](../2-recetas/springboot/README.md) | [Semana 4](../README.md) | [Ebooks gratuitos — Semana 4](../4-recursos/ebooks-free/README.md) |
