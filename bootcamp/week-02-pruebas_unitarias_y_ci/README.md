# Semana 2 — Pruebas unitarias con AAA y umbral en CI

> Semana 2 de 9 (+1 opcional) · Primera semana con **rotación de capas** · Piso de cobertura: **30%**

La semana pasada probaste tu proyecto desde afuera, con E2E. Ahora bajas a la base de la pirámide: pruebas unitarias sobre la lógica de negocio, rápidas y precisas. Además, desde esta semana **la máquina vigila la calidad**: GitHub Actions corre los tests en cada PR y rechaza los que incumplen el umbral de cobertura.

---

## Objetivos

Al finalizar esta semana serás capaz de:

1. Identificar la unidad bajo prueba y aislarla de HTTP, BD y reloj.
2. Aplicar los principios FIRST y escribir tests deterministas.
3. Diseñar casos con particiones de equivalencia y valores límite.
4. Escribir tests parametrizados en el stack de tu grupo.
5. Explicar por qué una cobertura alta no garantiza tests buenos.
6. Montar un workflow de GitHub Actions que exija los tests y el umbral de cobertura en cada PR.

---

## Distribución del tiempo (8 h)

| Actividad | Contenido | Tiempo |
|---|---|---|
| Teoría | Unidad y FIRST, diseño de casos, CI | 1.5 h |
| Recetas | Unitarias en tu stack (1.5 h) + CI con GitHub Actions (1 h) | 2.5 h |
| Reto | Tests unitarios del proyecto, CI y umbral del 30% | 3 h |
| Revisión | Vocero aleatorio y retro | 1 h |

---

## Contenido

### Teoría

1. [La unidad bajo prueba y los principios FIRST](1-teoria/01-unidad-y-first.md)
2. [Diseño de casos: particiones, valores límite y tests parametrizados](1-teoria/02-diseno-de-casos.md)
3. [Integración continua con GitHub Actions](1-teoria/03-integracion-continua.md)

### Recetas

Cada integrante hace la receta de **su capa de esta semana** (ver la matriz de rotación). La receta de CI la hace quien tenga la capa E2E, acompañado del grupo.

| Receta | Para quién |
|---|---|
| [React: lógica pura del frontend](2-recetas/react/README.md) | Capa Front |
| [FastAPI: servicio con pytest](2-recetas/fastapi/README.md) | Capas API y BD (grupos FastAPI) |
| [Express: servicio con Vitest](2-recetas/express/README.md) | Capas API y BD (grupos Express) |
| [Spring Boot: servicio con JUnit 5](2-recetas/springboot/README.md) | Capas API y BD (grupos Spring Boot) |
| [CI con GitHub Actions](2-recetas/ci/README.md) | Capa E2E + todo el grupo |

### Reto

- [Tests unitarios del proyecto formativo y CI con umbral](3-reto/README.md)

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
| FastAPI | Tests unitarios AAA de hashing y JWT, con el token vencido creado por parámetro ([`test_security.py`](https://github.com/ergrato-dev/proyecto-be_fastapi-fe_react/blob/main/be/app/tests/test_security.py)); umbral `fail_under` en [`pyproject.toml`](https://github.com/ergrato-dev/proyecto-be_fastapi-fe_react/blob/main/be/pyproject.toml) | `uv run pytest app/tests/test_security.py --no-cov` |
| Express | Tests unitarios de `utils/security.ts` ([`security.test.ts`](https://github.com/ergrato-dev/proyecto-be_express-fe_react/blob/main/be/src/tests/security.test.ts)); thresholds con la regla de trinquete en ramas (72%) en [`vitest.config.ts`](https://github.com/ergrato-dev/proyecto-be_express-fe_react/blob/main/be/vitest.config.ts) | `pnpm exec vitest run src/tests/security.test.ts` |
| Spring Boot | `JwtService` creado con `new`, sin levantar Spring ([`JwtServiceTest.java`](https://github.com/ergrato-dev/proyecto-be_springboot_java-fe_react/blob/main/be/src/test/java/com/nn/auth/security/JwtServiceTest.java)); `jacoco:check` en [`pom.xml`](https://github.com/ergrato-dev/proyecto-be_springboot_java-fe_react/blob/main/be/pom.xml) | `./mvnw test -Dtest=JwtServiceTest` |

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Semana 1 — Por qué probar y primer E2E con Playwright](../week-01-por_que_probar_y_primer_e2e/README.md) | [README del bootcamp](../../README.md) | [La unidad bajo prueba y los principios FIRST](1-teoria/01-unidad-y-first.md) |

Siguiente semana: [Semana 3 — Componentes React con React Testing Library](../week-03-componentes_react/README.md)
