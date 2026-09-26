# Semana 4 — Pruebas de API

> Semana 4 de 9 (+1 opcional) · Vuelve la **rotación de capas** · Piso de cobertura: **50%**

Tu frontend depende de un acuerdo con el backend: qué ruta llamar, qué JSON enviar y qué respuesta recibir, **también cuando algo sale mal**. Ese acuerdo es el **contrato HTTP**. Esta semana lo pruebas en el backend de tu grupo, sin levantar servidor ni base de datos, y descubres algo incómodo: casi todas las APIs rompen su contrato en los casos de error.

---

## Objetivos

Al finalizar esta semana serás capaz de:

1. Explicar qué verifica una prueba de API y en qué se diferencia de una unitaria y de una E2E.
2. Elegir el código de estado correcto para cada escenario (2xx, 4xx, 5xx).
3. Probar endpoints con `TestClient` (FastAPI), supertest (Express) o MockMvc (Spring Boot), aislando la base de datos.
4. Verificar estado, cuerpo y encabezados de la respuesta.
5. Detectar y corregir respuestas de error que rompen el contrato o filtran información interna.
6. Probar endpoints protegidos: sin token, con token y con un rol insuficiente.

---

## Distribución del tiempo (8 h)

| Actividad | Contenido | Tiempo |
|---|---|---|
| Teoría | Contrato HTTP, herramientas por stack, autenticación | 1.5 h |
| Receta | Pruebas de API en tu stack (mesas por backend) | 2.5 h |
| Reto | API del proyecto formativo desde cuatro ángulos + umbral del 50% | 3 h |
| Revisión | Vocero aleatorio y retro | 1 h |

---

## Contenido

### Teoría

1. [El contrato HTTP](1-teoria/01-contrato-http.md)
2. [Pruebas de API en cada stack](1-teoria/02-pruebas-de-api-por-stack.md)
3. [Endpoints protegidos: autenticación y roles](1-teoria/03-autenticacion-en-tests.md)

### Recetas

Agrupa la ficha en mesas por backend. Todos los integrantes de un grupo hacen la receta de **su** backend.

- [FastAPI con `TestClient`](2-recetas/fastapi/README.md)
- [Express con supertest](2-recetas/express/README.md)
- [Spring Boot con MockMvc](2-recetas/springboot/README.md)

### Reto

- [El API del proyecto formativo desde cuatro ángulos](3-reto/README.md)

### Recursos

- [Ebooks gratuitos](4-recursos/ebooks-free/README.md)
- [Videografía](4-recursos/videografia/README.md)
- [Webgrafía](4-recursos/webgrafia/README.md)

### Glosario

- [Términos de la semana](5-glosario/README.md)

### Evaluación

- [Rúbrica de la semana](rubrica-evaluacion.md)

---

## Demostración en proyecto real

Los proyectos NN Auth son apps reales (registro, verificación de email por correo, login y dashboard) con los tres backends del bootcamp, React y PostgreSQL. Tienen aplicado lo que enseña cada semana y **defectos reales documentados a propósito** para descubrirlos en clase. Muéstralos en vivo después de la receta.

| Stack | Qué mostrar | Cómo verlo |
|---|---|---|
| FastAPI | Tests de API con `TestClient` ([`test_auth.py`](https://github.com/ergrato-dev/proyecto-be_fastapi-fe_react/blob/main/be/app/tests/test_auth.py)). Hallazgos: el CORS bloquea el `PATCH` del idioma en el navegador, pero los tests pasan porque `TestClient` no aplica CORS; el JSON mal formado responde 422 con otro formato de `detail` ([hallazgos](https://github.com/ergrato-dev/proyecto-be_fastapi-fe_react/blob/main/docs/testing/hallazgos.md)) | `curl -X OPTIONS` con `Access-Control-Request-Method: PATCH` (ver hallazgos) |
| Express | Tests con supertest ([`auth.test.ts`](https://github.com/ergrato-dev/proyecto-be_express-fe_react/blob/main/be/src/tests/auth.test.ts)). Hallazgo: JSON mal formado → **500** ([hallazgos](https://github.com/ergrato-dev/proyecto-be_express-fe_react/blob/main/docs/testing/hallazgos.md)) | `curl -d '{"email":' …/auth/login` |
| Spring Boot | Tests con MockMvc ([`AuthControllerTest.java`](https://github.com/ergrato-dev/proyecto-be_springboot_java-fe_react/blob/main/be/src/test/java/com/nn/auth/controller/AuthControllerTest.java)). Hallazgos: JSON mal formado → **500**; 401 sin cuerpo, fuera del contrato ProblemDetail ([hallazgos](https://github.com/ergrato-dev/proyecto-be_springboot_java-fe_react/blob/main/docs/testing/hallazgos.md)) | `curl -i …/api/v1/users/me` |

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Semana 3 — Componentes React con React Testing Library](../week-03-componentes_react/README.md) | [README del bootcamp](../../README.md) | [El contrato HTTP](1-teoria/01-contrato-http.md) |

Siguiente semana: [Semana 5 — Dobles de prueba](../week-05-dobles_de_prueba/README.md)
