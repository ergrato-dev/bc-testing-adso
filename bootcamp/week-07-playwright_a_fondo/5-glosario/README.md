# Glosario — Semana 7

**Actionability (comprobaciones de acción)**: lo que Playwright verifica antes de actuar sobre un elemento: que esté visible, estable, habilitado y sin nada encima.

**Aserción web-first**: aserción sobre un locator que reintenta hasta cumplirse o agotar el tiempo, como `toBeVisible()` o `toContainText()`.

**Auto-waiting**: espera automática de Playwright antes de cada acción, sin pausas escritas en el test.

**Condición de carrera**: defecto que depende del orden en que terminan dos operaciones, como una respuesta vieja que llega después de una nueva.

**`dblclick`**: acción de Playwright que hace doble clic sobre un elemento, como una persona impaciente.

**Doble envío**: defecto en el que un formulario envía la misma petición dos veces y el registro queda duplicado.

**Flujo crítico**: recorrido de la app que, si falla, la deja sin servir para lo que existe: registrarse, pagar, reservar.

**Idempotencia**: propiedad de una operación que produce el mismo resultado aunque se repita. Protege contra el doble envío en el backend.

**Locator**: descripción de cómo encontrar un elemento. Se resuelve cada vez que se usa.

**Objeto de página (page object)**: clase que agrupa los locators y las acciones de una pantalla para que los tests no los repitan.

**`--repeat-each`**: opción de Playwright que corre cada test varias veces para detectar inestabilidad.

**`request` (fixture)**: cliente HTTP de Playwright para preparar datos por API dentro de un test.

**`route.fetch`**: dentro de `page.route`, envía la petición al servidor real y devuelve su respuesta para entregarla, modificarla o retrasarla.

**Strictness (locator estricto)**: regla de Playwright según la cual una acción falla si el locator encuentra más de un elemento.

**Test flaky (inestable)**: test que pasa y falla sin que cambie el código.

**`test.fail()`**: marca un test que se espera que falle, por ejemplo mientras se corrige un defecto registrado. Si empieza a pasar, el test falla: así te enteras de que el defecto ya se corrigió.

**Traza (trace)**: grabación de un test con cada acción, capturas, consola y red. Se abre desde el reporte HTML.

**Worker**: proceso que ejecuta tests. Playwright usa varios en paralelo.
