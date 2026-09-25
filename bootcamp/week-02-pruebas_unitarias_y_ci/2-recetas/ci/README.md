# Receta — CI con GitHub Actions en tu proyecto

> Capa E2E de la semana, acompañada por todo el grupo · Tiempo estimado: 1 h

Vas a crear el workflow que corre los tests de frontend y backend en cada PR y exige el umbral de cobertura. El modelo es el CI de este repo: [`.github/workflows/referencia.yml`](../../../../.github/workflows/referencia.yml), que está en verde en la pestaña **Actions** del bootcamp.

---

## Paso 1: Confirmar que todo pasa en local

El CI ejecuta **los mismos comandos** que tú. Antes de escribir YAML, confirma que pasan en tu equipo, con el umbral de la línea base que fijaste la semana pasada:

| Stack | Comando |
|---|---|
| React / Express | `pnpm test` |
| FastAPI | `uv run pytest` |
| Spring Boot | `./mvnw verify` |

> Si tu frontend usa `npm` (tiene `package-lock.json`), mígralo a pnpm: `pnpm import` genera el `pnpm-lock.yaml` a partir del lockfile de npm. Agrega también `"packageManager": "pnpm@12.6.0"` al `package.json`.

## Paso 2: Crear el workflow

Crea `.github/workflows/tests.yml` en la raíz del repo. Usa **un job por cada parte** de tu proyecto. Esta plantilla supone un repo con las carpetas `frontend/` y `backend/`: ajusta los `working-directory` a tu estructura y deja solo el job de tu backend.

```yaml
name: tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v7.0.1
      - uses: pnpm/action-setup@v6.1.0
        with:
          package_json_file: frontend/package.json
      - uses: actions/setup-node@v7.0.0
        with:
          node-version: "22"
      - run: pnpm install
      - run: pnpm test

  # ── Deja SOLO el job de tu backend ─────────────────────────

  backend-express:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v7.0.1
      - uses: pnpm/action-setup@v6.1.0
        with:
          package_json_file: backend/package.json
      - uses: actions/setup-node@v7.0.0
        with:
          node-version: "22"
      - run: pnpm install
      - run: pnpm test

  backend-fastapi:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v7.0.1
      - uses: astral-sh/setup-uv@v10.2.0
      - run: uv sync
      - run: uv run pytest

  backend-springboot:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v7.0.1
      - uses: actions/setup-java@v6.0.1
        with:
          distribution: temurin
          java-version: "21"
      - run: ./mvnw -B verify
```

**Si frontend y backend están en repos separados**, crea el workflow en cada repo, con su job y sin `working-directory` (o con `.`).

## Paso 3: Probarlo con un PR

1. Crea una rama, agrega el workflow, haz commit y push.
2. Abre un PR hacia `main`.
3. Al final del PR aparecen los checks. Espera a que terminen (1 a 3 minutos).
4. Si alguno queda en ❌, entra a **Details**, lee el error y corrígelo en la misma rama.

## Paso 4: Comprobar que el rojo aparece

Un CI que nunca falla no protege nada. En la rama del PR:

1. Sube el umbral de cobertura a 99 en la configuración de tu backend.
2. Haz push y confirma que el job queda en ❌ con el mensaje del umbral.
3. Devuelve el umbral a su valor y confirma que vuelve a ✅.

## Paso 5: Bloquear el merge en rojo

En GitHub: **Settings → Rules → Rulesets → New ruleset → New branch ruleset**.

1. Nombre: `main protegida`. **Enforcement status**: *Active*.
2. **Target branches** → *Add target* → *Include default branch*.
3. Marca **Require a pull request before merging**.
4. Marca **Require status checks to pass** → *Add checks* → agrega `frontend` y el job de tu backend.
5. Guarda.

Desde ahora, el botón de merge queda deshabilitado mientras un check esté en rojo.

> ⚠️ En cuentas gratuitas las reglas solo se aplican en repos **públicos**. Si el repo es privado y no pueden activarlas, la regla del grupo sigue vigente: **nadie fusiona un PR en rojo**. El instructor lo verifica en la pestaña Actions.

---

## Errores frecuentes en proyectos ADSO

| Síntoma en el CI | Causa probable | Solución |
|---|---|---|
| Spring Boot: `contextLoads` falla con error de conexión a la BD | El test que genera Spring Initializr levanta toda la app, y en el CI no hay BD | Márcalo con `@Disabled("Requiere BD: se habilita en la semana 6")`. Vuelve en la semana 6 |
| FastAPI: error de conexión al **importar** la app | El engine de SQLAlchemy se conecta al importar `main.py` | Crea el engine dentro de una dependencia (mira `get_engine()` en la referencia) o usa `dependency_overrides` en los tests |
| Un paquete se comporta distinto en CI y en local | El CI resolvió otras versiones de las dependencias transitivas | Versiona `pnpm-lock.yaml` **en tu proyecto** (en el bootcamp no se versionan; en tu proyecto sí) |
| `Permission denied: ./mvnw` | El wrapper perdió el permiso de ejecución al pasar por Windows | `git update-index --chmod=+x mvnw` y commit |
| Pasa en local, falla en CI | El test depende de un archivo `.env`, de la hora local o de datos de tu BD | Las pruebas unitarias no deben depender de nada de eso: revisa FIRST |

---

## Checklist

- [ ] `.github/workflows/tests.yml` con un job de frontend y uno de backend
- [ ] El workflow está en verde en un PR
- [ ] Comprobé que un umbral incumplido pone el job en rojo
- [ ] La regla de rama bloquea el merge en rojo (o el grupo acordó la regla manual si el repo es privado)
