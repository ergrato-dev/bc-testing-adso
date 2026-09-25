# Glosario — Semana 8

**Artefacto**: archivo o carpeta que un job de GitHub Actions guarda para descargarlo después desde la pestaña Actions, como un reporte de cobertura o de Playwright.

**Caché de dependencias**: copia de los paquetes descargados que se reutiliza entre corridas del CI. Se identifica con una clave calculada a partir de los archivos de dependencias.

**Check obligatorio**: job del CI que debe estar en verde para que el ruleset permita fusionar un PR.

**Cobertura de funciones**: porcentaje de funciones o métodos que se llamaron al menos una vez durante los tests.

**Cobertura de líneas**: porcentaje de líneas de código que se ejecutaron durante los tests.

**Cobertura de ramas**: porcentaje de caminos de cada decisión (`if`, `?:`, `&&`, `catch`) que tomaron los tests. Es más exigente que la de líneas.

**`--fail-on-flaky-tests`**: opción de Playwright que hace fallar la corrida si algún test pasó solo al reintentar.

**Healthcheck de un servicio**: comando que GitHub Actions ejecuta en el contenedor del servicio hasta que responde bien; recién entonces arranca el primer paso del job.

**Job**: conjunto de pasos que corre en una máquina propia. Los jobs de un workflow corren en paralelo salvo que se indique lo contrario.

**Matriz (`strategy.matrix`)**: forma de correr el mismo job con distintos valores, por ejemplo una vez por backend.

**Proceso en segundo plano**: comando que se lanza con `&` y sigue corriendo mientras el job ejecuta los pasos siguientes, como el backend del job de E2E.

**Prueba de mutación**: técnica que introduce cambios pequeños en el código y comprueba si algún test los detecta. Mide la calidad de los tests, no solo si el código se ejecutó.

**`retention-days`**: días que GitHub conserva un artefacto antes de borrarlo.

**Ruleset**: conjunto de reglas de GitHub que protege una rama, por ejemplo exigir PR y checks en verde para fusionar en `main`.

**Servicio (`services`)**: contenedor que GitHub Actions levanta junto a un job, como la BD de pruebas.

**Test saltado (skipped)**: test que no se ejecutó porque no se cumplió una condición. No falla, pero tampoco verifica nada.

**Trinquete (umbral)**: regla según la cual el umbral de cobertura solo puede subir, nunca bajar.

**Workflow**: archivo YAML en `.github/workflows/` que define cuándo y qué jobs corre GitHub Actions.
