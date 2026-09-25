# Instrucciones para asistentes de IA

## Contexto

**Bootcamp Testing ADSO**: testing de software aplicado al proyecto formativo del programa ADSO del SENA.

- **Público**: aprendices de VI trimestre (de 7), con proyecto formativo en curso, en grupos de 3 a 5.
- **Duración**: 9 semanas núcleo + 1 opcional, 8 h/semana.
- **Stacks**: frontend React (Vite) común; backend FastAPI, Express o Spring Boot; BD PostgreSQL o MySQL.
- **Enfoque**: un tema común por semana con recetas por stack. El producto es el proyecto real del grupo.
- Plan completo: [docs/plan-estudios.md](../docs/plan-estudios.md). Mecanismos de grupo: [docs/guia-instructor.md](../docs/guia-instructor.md).
- Base conceptual por lenguaje (opcional): repo hermano `bc-testing`.

## Estructura de cada semana

```
bootcamp/week-XX-slug/
├── README.md                 # Objetivos, distribución del tiempo, navegación
├── rubrica-evaluacion.md     # Criterios del tema sobre la rúbrica base (plantillas/rubrica-grupal.md)
├── 0-assets/                 # Diagramas SVG
├── 1-teoria/                 # 2–3 archivos .md, teoría común a todos los stacks
├── 2-recetas/
│   ├── react/README.md
│   ├── fastapi/README.md
│   ├── express/README.md
│   └── springboot/README.md
├── 3-reto/README.md          # Reto sobre el proyecto formativo del grupo (sin starter)
├── 4-recursos/{ebooks-free,videografia,webgrafia}/
└── 5-glosario/README.md
```

- Solo se crean las recetas que aplican al tema (semana 3: solo `react`; semanas 1 y 7: `playwright`).
- Las recetas **no copian código** entre semanas: apuntan a la app de referencia en `referencia/` e indican qué archivo abrir y qué test añadir o descomentar.
- Orden de creación: README → rúbrica → teoría → assets → recetas → reto → recursos → glosario.

## App de referencia (`referencia/`)

- Dominio genérico **Museo**, recurso `pieces` (`/api/pieces`, puerto 8000): CRUD mínimo idéntico en los 3 backends.
- `frontend-react/` (Vite + React), `api-fastapi/`, `api-express/`, `api-springboot/`, `docker-compose.yml` (postgres y mysql de prueba).
- Todo su código debe ejecutarse y sus tests deben pasar. Es el código que usan las recetas.
- Deja **huecos a propósito** (defectos o comportamientos sin test) cuando una receta los descubre. Antes de escribir la receta, verifica que el test nuevo falla sin la corrección y pasa con ella; después devuelve la referencia al estado con el hueco.

## Retos (`3-reto/`)

- Se resuelven en el repo del grupo, sobre su proyecto formativo. No llevan starter ni solución.
- Indican **qué** debe quedar probado (comportamientos, cantidad mínima, capa), nunca el código.
- Siempre recuerdan la regla de grupo: matriz de rotación, un commit de test por integrante y PR con revisión cruzada.

## Idioma y estilo

- Documentación y comentarios en **español neutro con tuteo** ("ejecuta", "puedes", "fíjate"). ❌ NUNCA voseo ("ejecutá", "podés", "vos").
- Nomenclatura técnica en **inglés**: variables, funciones, clases, archivos y nombres de test.
- Teoría: ~100 líneas por archivo en promedio. Ejemplos cortos, con el equivalente por stack cuando aplique.
- En teoría común, indica el stack de cada bloque de código.

## Herramientas por stack

| Stack | Herramientas | Gestor |
|---|---|---|
| React | Vitest, React Testing Library, `@testing-library/user-event`, jsdom, MSW | pnpm |
| Express | Vitest, supertest | pnpm |
| FastAPI | pytest, `fastapi.testclient.TestClient` (httpx2), pytest-mock, pytest-cov | uv |
| Spring Boot | JUnit 5, AssertJ, Mockito, MockMvc, JaCoCo (vía `spring-boot-starter-test`) | Maven Wrapper (`./mvnw`) |
| E2E | Playwright (`@playwright/test`) | pnpm |
| BD | PostgreSQL y MySQL con Docker Compose | docker compose |

- **JavaScript**: Node.js 22 (`.nvmrc`), ESM (`"type": "module"`, porque Vite y Vitest lo usan por defecto). Solo `pnpm` (❌ NUNCA `npm` ni `yarn`). `package.json` con `"private": true`, `"packageManager"` y `"engines"`.
- **Python**: 3.14 (`.python-version`), solo `uv` (`uv sync`, `uv run pytest`). `pyproject.toml` con `[dependency-groups] dev` y la tabla nativa `[tool.pytest]`. Sin `requirements.txt` ni `uv.lock` versionados.
- **Java**: JDK 21, Maven con Maven Wrapper. `@DisplayName` en cada test, aserciones con AssertJ.

## ⛔ Pinning de dependencias (sin excepciones)

- Versión **exacta** siempre: `"vitest": "X.Y.Z"`, `pytest==X.Y.Z`, `<version>X.Y.Z</version>`.
- ❌ Prohibido `^`, `~`, `>=`, `*`, `LATEST`, `RELEASE` o rangos.
- Consulta la última versión estable en npmjs.com, pypi.org o mvnrepository.com antes de fijarla.
- La misma versión de cada paquete en todo el repo.
- Auditoría antes de commit: `pnpm audit --audit-level moderate`, `uvx pip-audit`.

## Buenas prácticas que el contenido debe modelar

- Patrón **AAA** y principios **FIRST** en todo test.
- Nombres: `it('should [expected] when [condition]')`, `test_[context]_[expected]_when_[condition]`, `@DisplayName("should [expected] when [condition]")`.
- React: queries accesibles (`getByRole`, `getByLabelText`) antes que `getByTestId`; probar lo que ve el usuario, no el estado interno.
- BD: base de datos de pruebas desechable en Docker, datos semilla por test, limpieza entre tests. ❌ NUNCA la BD de desarrollo ni la de producción.
- Credenciales por variables de entorno; nunca en archivos de test.
- E2E: locators accesibles, sin `waitForTimeout` fijo, datos preparados por API.

## Cobertura (exigencia desde el día 1)

- Umbral progresivo hasta el **80%** (tabla en `docs/plan-estudios.md`), exigido por CI desde la semana 2.
- Se mide la lógica de negocio. Se excluyen el arranque, la configuración y los adaptadores de BD o HTTP, siempre con un comentario que explique por qué.
- El comando de test habitual ya aplica el umbral: `pnpm test` (`vitest run --coverage` con `thresholds`), `uv run pytest` (`--cov` en `addopts` + `fail_under`) y `./mvnw verify` (regla `check` de JaCoCo).
- Toda la app de referencia cumple el 80%, y su CI está en `.github/workflows/referencia.yml`.
- Los fakes en memoria viven en `tests/`, no en `src/` ni en `app/`.

## Límites de respuesta

- Genera una semana por partes (README y rúbrica → teoría → recetas → reto y recursos) y espera confirmación entre partes.

## Checklist de semana

- [ ] README con objetivos, distribución del tiempo y navegación anterior/siguiente
- [ ] Rúbrica sobre la base de `plantillas/rubrica-grupal.md`
- [ ] Teoría común con stack indicado en cada bloque de código
- [ ] Un SVG por archivo de teoría cuando el concepto es un proceso, un flujo o una relación espacial (no por cuota). Sin emojis dentro del SVG: usa ✓ y ✗
- [ ] Recetas que corren contra `referencia/` (comandos verificados)
- [ ] Referencia con cobertura ≥ 80% tras los cambios de la semana
- [ ] Reto sobre el proyecto formativo, con la regla de grupo
- [ ] Recursos y glosario A–Z
- [ ] Tuteo, versiones exactas, pnpm/uv/mvnw
- [ ] Estado actualizado en `docs/plan-estudios.md`
