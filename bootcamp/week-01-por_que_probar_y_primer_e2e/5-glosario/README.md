# Glosario — Semana 1

**AAA (Arrange, Act, Assert)**: estructura de un test en tres partes: preparar, actuar y verificar. Aplica a cualquier nivel y lenguaje.

**Aserción**: instrucción que verifica un resultado. Si no se cumple, el test falla. Playwright: `await expect(locator).toHaveText('…')`; pytest: `assert x == y`; JUnit: `assertThat(x).isEqualTo(y)`.

**Auto-waiting (espera automática)**: Playwright espera a que un elemento esté listo antes de actuar sobre él, y reintenta las aserciones hasta que se cumplen o se agota el tiempo.

**baseURL**: dirección base de la app en `playwright.config.js`. Permite escribir `page.goto('/')` en lugar de la URL completa.

**Codegen**: herramienta de Playwright (`playwright codegen`) que genera código mientras usas la app. Produce un borrador al que le faltan aserciones.

**Cono de helado**: antipatrón en el que casi todo se prueba a mano o con E2E, y casi nada con pruebas unitarias.

**Defecto (bug)**: resultado en el código de un error humano. Puede causar una falla.

**E2E (end-to-end, extremo a extremo)**: prueba de la app completa (frontend, backend y BD) desde la perspectiva de la persona usuaria.

**Error**: equivocación humana al escribir código o requisitos.

**Falla**: comportamiento incorrecto que observa la persona usuaria.

**Flaky test (test inestable)**: test que a veces pasa y a veces falla sin cambios en el código. Suele deberse a esperas fijas o a datos compartidos.

**Headless**: modo en que el navegador corre sin ventana visible. Es el modo por defecto de Playwright. Lo contrario es `--headed`.

**Locator**: forma de encontrar un elemento en la página. Se prefieren `getByRole` y `getByLabel`.

**Pirámide de pruebas**: modelo que recomienda muchas pruebas unitarias, algunas de integración y pocas E2E.

**Playwright**: herramienta de Microsoft para automatizar navegadores (Chromium, Firefox, WebKit) y escribir pruebas E2E.

**Prueba de integración**: verifica que varias piezas funcionan juntas, por ejemplo la API con la base de datos.

**Prueba unitaria**: verifica una unidad pequeña (función, clase o componente) aislada del resto.

**Reporte HTML**: informe de Playwright con el resultado de cada test, capturas y trazas. Se abre con `playwright show-report`.

**Suite**: conjunto de tests de un proyecto o módulo.

**webServer**: opción de `playwright.config.js` que levanta la app antes de correr los tests.
