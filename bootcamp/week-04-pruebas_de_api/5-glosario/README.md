# Glosario — Semana 4

**`@MockitoBean`**: anotación de Spring que reemplaza un bean del contexto por un mock de Mockito durante el test. En Spring Boot 3.3 o anterior se usa `@MockBean`.

**`@WebMvcTest`**: anotación de Spring Boot que levanta solo la capa web (controladores, manejo de errores, JSON) sin servicios ni base de datos.

**`@WithMockUser`**: anotación de `spring-security-test` que simula un usuario autenticado con los roles indicados.

**Código de estado**: número de tres dígitos de una respuesta HTTP. 2xx éxito, 4xx error del cliente, 5xx error del servidor.

**`Content-Type`**: encabezado que indica el formato del cuerpo. Un API JSON responde `application/json`, también en los errores.

**Contrato HTTP**: acuerdo entre frontend y backend sobre rutas, datos de entrada y respuestas (código, cuerpo y encabezados) de cada endpoint, incluidos los errores.

**`dependency_overrides`**: diccionario de FastAPI para reemplazar dependencias durante los tests, por ejemplo el repositorio o el usuario actual.

**Hallazgo**: defecto descubierto por un test. En esta semana, respuestas que rompen el contrato o exponen información interna.

**JSON mal formado**: cuerpo que no es JSON válido, como `{"name":`. El API debe responder `400` con su formato de error.

**MockMvc**: cliente de pruebas de Spring que ejecuta peticiones contra la capa web sin abrir un puerto.

**Prueba de API**: prueba que envía peticiones HTTP a la app y verifica el contrato, con la base de datos reemplazada por un doble.

**Stack trace**: lista de llamadas que llevó a un error. Útil en los logs del servidor; **nunca** debe llegar al cliente.

**supertest**: librería que envía peticiones HTTP a una app de Express sin llamar a `listen()`.

**`TestClient`**: cliente de pruebas de FastAPI (basado en Starlette) que envía peticiones a la app sin servidor.

**`401 Unauthorized`**: la petición no está autenticada: falta el token o es inválido.

**`403 Forbidden`**: la petición está autenticada, pero el usuario no tiene permiso para esa acción.

**`422 Unprocessable Content`**: el JSON es válido, pero sus datos no cumplen las reglas.
