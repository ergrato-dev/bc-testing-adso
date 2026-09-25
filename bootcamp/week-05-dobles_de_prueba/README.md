# Semana 5 — Dobles de prueba

> Semana 5 de 9 (+1 opcional) · **Rotación de capas** · Piso de cobertura: **60%**

Ya usaste dobles sin llamarlos por su nombre: el repositorio en memoria, `vi.fn()` en `onSubmit`, `vi.mock('../src/api.js')`, `@MockitoBean`. Esta semana los estudias a fondo: qué tipos existen, cuándo usar cada uno y cuándo un mock es **mala señal**. El caso central es uno que todo proyecto ADSO tiene: una dependencia externa (correo, pagos, un API de terceros) que **puede fallar**, y la app debe seguir funcionando.

---

## Objetivos

Al finalizar esta semana serás capaz de:

1. Distinguir dummy, stub, spy, mock y fake, y elegir el adecuado para cada test.
2. Reemplazar dependencias externas con los dobles de tu stack: `vi.fn`/`vi.mock`, `pytest-mock`, Mockito.
3. Verificar **con qué** se llamó una dependencia, y que **no** se llamó cuando no debía.
4. Probar que la app resiste cuando una dependencia externa falla.
5. Interceptar peticiones HTTP en el frontend con MSW y en el navegador con `page.route`.
6. Reconocer el exceso de mocks y cuándo conviene un fake o una prueba de integración.

---

## Distribución del tiempo (8 h)

| Actividad | Contenido | Tiempo |
|---|---|---|
| Teoría | Tipos de dobles, dobles por stack, cuándo no usarlos | 1.5 h |
| Recetas | Dobles en tu stack: backend (mesas por stack) o frontend con MSW | 2.5 h |
| Reto | Dependencias del proyecto desde cuatro ángulos + umbral del 60% | 3 h |
| Revisión | Vocero aleatorio y retro | 1 h |

---

## Contenido

### Teoría

1. [Los cinco dobles de prueba](1-teoria/01-tipos-de-dobles.md)
2. [Dobles en cada stack](1-teoria/02-dobles-por-stack.md)
3. [Cuándo un doble ayuda y cuándo estorba](1-teoria/03-cuando-usar-dobles.md)

### Recetas

Cada integrante hace la receta de **su capa** de esta semana:

| Receta | Para quién |
|---|---|
| [React: MSW para el cliente HTTP](2-recetas/react/README.md) | Capa Front |
| [FastAPI: pytest-mock y el notificador](2-recetas/fastapi/README.md) | Capas API y BD (grupos FastAPI) |
| [Express: `vi.fn` y el notificador](2-recetas/express/README.md) | Capas API y BD (grupos Express) |
| [Spring Boot: Mockito y el notificador](2-recetas/springboot/README.md) | Capas API y BD (grupos Spring Boot) |

La capa E2E hace la receta de su backend y además la parte de `page.route` del [reto](3-reto/README.md).

### Reto

- [Las dependencias del proyecto formativo desde cuatro ángulos](3-reto/README.md)

### Recursos

- [Ebooks gratuitos](4-recursos/ebooks-free/README.md)
- [Videografía](4-recursos/videografia/README.md)
- [Webgrafía](4-recursos/webgrafia/README.md)

### Glosario

- [Términos de la semana](5-glosario/README.md)

### Evaluación

- [Rúbrica de la semana](rubrica-evaluacion.md)

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Semana 4 — Pruebas de API](../week-04-pruebas_de_api/README.md) | [README del bootcamp](../../README.md) | [Los cinco dobles de prueba](1-teoria/01-tipos-de-dobles.md) |

Siguiente semana: [Semana 6 — Integración con BD real](../week-06-integracion_con_bd/README.md)
