# Receta — Medir la cobertura desde el día 1

> Cada grupo en su stack · Tiempo estimado: 30 min

En este bootcamp la calidad es una exigencia: desde hoy mides cuánto de tu lógica de negocio ejecutan tus tests, y ese número **nunca puede bajar**. La semana 2 lo pondrá en CI; hoy lo dejas configurado en local.

Toda la [app de referencia](../../../../referencia/) ya está configurada así y cumple el 80%. Úsala como modelo.

---

## Paso 1: Ver la cobertura de la referencia

Corre los tests de un backend y del frontend de la referencia. **El comando de siempre ya mide la cobertura**:

| Stack | Comando | Configuración |
|---|---|---|
| React | `pnpm test` | [`vite.config.js`](../../../../referencia/frontend-react/vite.config.js) |
| Express | `pnpm test` | [`vitest.config.js`](../../../../referencia/api-express/vitest.config.js) |
| FastAPI | `uv run pytest` | [`pyproject.toml`](../../../../referencia/api-fastapi/pyproject.toml) |
| Spring Boot | `./mvnw verify` | [`pom.xml`](../../../../referencia/api-springboot/pom.xml) (plugin `jacoco-maven-plugin`) |

Al final verás una tabla con el porcentaje por archivo y las líneas sin cubrir. En Spring Boot el reporte queda en `target/site/jacoco/index.html`, y en Vitest puedes abrir `coverage/index.html`.

## Paso 2: Configurar tu proyecto

Copia la configuración de tu stack. Fíjate en tres cosas:

1. **Qué se mide**: la lógica de negocio. El arranque (`main.jsx`, `server.js`, `*Application.java`) y los adaptadores de BD o HTTP quedan fuera, **con un comentario que diga por qué**.
2. **El umbral**: por ahora pon **tu línea base** (Paso 3). No uses el 80% de la referencia todavía.
3. **El comando**: `pnpm test` debe ejecutar `vitest run --coverage`; en pytest, `--cov` va en `addopts`. Así nadie puede "olvidar" medir.

**React y Express (Vitest)**: instala el proveedor de cobertura con la misma versión exacta de tu `vitest`:

```bash
pnpm add -D @vitest/coverage-v8@<versión-de-vitest>
```

```javascript
// vite.config.js (React) o vitest.config.js (Express)
test: {
  coverage: {
    include: ['src/**'],
    exclude: ['src/main.jsx'],           // arranque: no tiene lógica de negocio
    thresholds: { lines: 0, branches: 0, functions: 0, statements: 0 }, // tu línea base
  },
},
```

> Si tu proyecto usa Jest en lugar de Vitest, el equivalente es `collectCoverageFrom` y `coverageThreshold` en `jest.config.js`.

**FastAPI (pytest-cov)**:

```bash
uv add --dev pytest-cov==7.1.0
```

```toml
[tool.pytest]
addopts = ["--cov", "--cov-report=term-missing"]

[tool.coverage.run]
source = ["app"]           # la carpeta de tu código
omit = []                  # adaptadores o arranque, con un comentario del porqué

[tool.coverage.report]
fail_under = 0             # tu línea base
```

**Spring Boot (JaCoCo)**: copia el bloque `<plugin>` de `jacoco-maven-plugin` del [`pom.xml` de la referencia](../../../../referencia/api-springboot/pom.xml), cambia la clase excluida por la de tu proyecto y pon tu línea base en los `<minimum>` (por ejemplo, `0.00`). Desde ahora corres las pruebas con `./mvnw verify`.

## Paso 3: Registrar la línea base

1. Corre el comando de tu stack en el frontend y en el backend de **tu proyecto**.
2. Anota el porcentaje de líneas de cada uno en la sección **Cobertura semanal** de `docs/matriz-rotacion.md`.
3. Pon ese número (redondeado hacia abajo) como umbral en la configuración.

Es normal que la línea base sea 0% o muy baja: el proyecto se escribió sin pruebas y los tests E2E de esta semana no cuentan para la cobertura. Lo que importa es que **desde hoy el número solo puede subir**. La meta es el **80% en la semana 8**.

## Paso 4: Comprobar que el umbral muerde

Sube el umbral a 99, corre el comando y confirma que **falla**. Devuélvelo a tu línea base. Un umbral que nunca falla no protege nada, igual que un test.

---

## Checklist

- [ ] Vi el reporte de cobertura de la referencia
- [ ] Mi proyecto mide la cobertura con el comando de test habitual (frontend y backend)
- [ ] Las exclusiones tienen un comentario que explica por qué
- [ ] La línea base quedó en `docs/matriz-rotacion.md` y como umbral en la configuración
- [ ] Comprobé que el umbral hace fallar el comando cuando no se cumple
