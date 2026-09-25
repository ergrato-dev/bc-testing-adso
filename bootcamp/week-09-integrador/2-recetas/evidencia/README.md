# Receta — Del repo al informe: reunir la evidencia

> Todo el grupo, con los comandos de su stack · Tiempo estimado: 1.5 h

Todo lo que afirma el informe de estrategia debe poder comprobarse en el repo. Esta receta reúne esa evidencia con comandos. Practícala primero sobre la app de referencia: los resultados deben coincidir con los de [`referencia/ESTRATEGIA.md`](../../../../referencia/ESTRATEGIA.md). Después repítela sobre tu proyecto.

---

## Paso 1: Cuántos tests hay en cada capa

Corre cada archivo de tests por separado y anota el total. En la referencia, cada archivo corresponde a una capa.

**Express y React (Vitest)**

```bash
cd referencia/api-express
pnpm exec vitest run tests/pieces-service.test.js     # Tests 7 passed: unitarias
pnpm exec vitest run tests/pieces-api.test.js         # Tests 7 passed: API
```

> `pnpm exec vitest list` también muestra los tests, pero cuenta **una vez** cada `it.each`: en `pieces-service.test.js` lista 4 y la corrida ejecuta 7. Para el informe, cuenta lo que se ejecuta.

**FastAPI (pytest)**

```bash
cd referencia/api-fastapi
uv run pytest tests/test_service.py --no-cov -q      # 6 passed: unitarias
uv run pytest tests/test_api.py --no-cov -q          # 7 passed: API
```

`--no-cov` evita que un archivo solo falle por el umbral de cobertura, que se mide sobre toda la suite.

**Spring Boot (JUnit 5)**

```bash
cd referencia/api-springboot
./mvnw verify
grep -h "Tests run" target/surefire-reports/*.txt
```

```text
Tests run: 9, ... -- in dev.ergrato.museo.PiecesServiceTest       # unitarias
Tests run: 6, ... -- in dev.ergrato.museo.PiecesControllerTest    # API
```

**E2E (Playwright)**

```bash
cd referencia/e2e
pnpm exec playwright test --list                     # Total: 2 tests in 1 file
```

En tu proyecto, si un archivo mezcla capas, clasifícalos por lo que reemplazan: sin dobles ni BD es unitario; con el cliente HTTP de prueba es de API; con `DATABASE_URL` es de integración.

## Paso 2: La cobertura de cada parte

Corre el comando habitual de cada parte (el que aplica el umbral) y copia la fila del total:

| Parte | Comando | Dónde leer |
|---|---|---|
| React / Express | `pnpm test` | Fila `All files` |
| FastAPI | `uv run pytest` | Fila `TOTAL` |
| Spring Boot | `./mvnw verify` | `target/site/jacoco/index.html`, fila `Total` |

En la referencia: frontend 100%, Express 94.87% de líneas, FastAPI 95%, Spring Boot 82% de líneas.

## Paso 3: El CI en verde

1. Abre la pestaña **Actions** del repo y entra al último run de `main`.
2. Copia su enlace: es la prueba de la condición para sustentar.
3. En **Settings → Rules → Rulesets**, anota qué checks son obligatorios.

Cada afirmación del informe sobre el CI lleva el enlace a un run, no una captura de pantalla.

## Paso 4: Los hallazgos del trimestre

Busquen los defectos que encontraron las pruebas. Si el grupo usa commits convencionales, los arreglos empiezan con `fix`:

```bash
git log --oneline --grep="^fix" -- '*tests/*' '*.test.*' '*Test.java' '*e2e/*' 'src/*' 'app/*'
```

Revisen también la descripción de los PR fusionados: cada semana, los retos pidieron documentar ahí el mutante y los hallazgos. Anoten en la tabla del informe: el defecto, la capa que lo encontró y su estado.

## Paso 5: La evidencia individual

El mismo comando de la [guía del instructor](../../../../docs/guia-instructor.md), desde la primera semana del bootcamp:

```bash
git shortlog -sn --since="AAAA-MM-DD" HEAD -- '*tests/*' '*.test.*' '*Test.java' '*e2e/*'
```

Cambia la fecha por el inicio de la semana 1 y ajusta las rutas a tu repo. Cruza el resultado con la matriz de rotación: cada integrante debe aparecer y haber pasado por las cuatro capas.

## Paso 6: Escribir el informe

1. Copia [`plantillas/estrategia-pruebas.md`](../../../../plantillas/estrategia-pruebas.md) en tu repo como `docs/estrategia-pruebas.md`.
2. Llena las tablas con lo que reuniste en los pasos 1 a 5.
3. Escribe la sección "Por qué esta forma" con la teoría 1: dónde vive la lógica de **tu** proyecto.
4. Compara con el ejemplo de la referencia: ¿cada número de tu informe se puede comprobar con un comando o un enlace?

---

## Checklist

- [ ] Conté los tests de cada capa de la referencia y coinciden con `ESTRATEGIA.md`
- [ ] Conté los tests de cada capa de mi proyecto, por lo que ejecuta la corrida
- [ ] Anoté la cobertura de frontend y backend con el comando habitual
- [ ] Tengo el enlace al último run en verde de `main` y la lista de checks obligatorios
- [ ] Listé los hallazgos del trimestre con su estado
- [ ] Crucé `git shortlog` con la matriz de rotación

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [La sustentación: responder por todas las capas](../../1-teoria/02-sustentacion.md) | [Semana 9](../../README.md) | [Reto — Cierre y sustentación del proyecto formativo](../../3-reto/README.md) |
