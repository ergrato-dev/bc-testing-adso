# Guía del instructor

Esta guía resuelve el problema clásico del proyecto en grupo: los integrantes se reparten los roles y algunos terminan sin saber lo que todos deben saber. Los cuatro mecanismos siguientes cuestan poco tiempo al instructor y dejan evidencia individual.

## Antes de la semana 1

1. Confirma el stack de cada grupo (backend y BD) y regístralo en una tabla de la ficha.
2. Verifica que los equipos del ambiente de formación tengan Docker y los runtimes del stack (ver requisitos en el [README](../README.md)).
3. Pide a cada grupo que copie en su repo:
   - [`plantillas/matriz-rotacion.md`](../plantillas/matriz-rotacion.md) como `docs/matriz-rotacion.md`
   - [`plantillas/pull_request_template.md`](../plantillas/pull_request_template.md) como `.github/pull_request_template.md`
   - [`plantillas/estrategia-pruebas.md`](../plantillas/estrategia-pruebas.md) como `docs/estrategia-pruebas.md` (se llena en la semana 9)

## Mecanismo 1: rotación de capas

- Hay 4 capas: **Front** (React), **API** (backend), **BD** (integración) y **E2E** (Playwright).
- Cada semana, cada integrante trabaja en una capa distinta a la de la semana anterior. Nadie repite capa hasta haber pasado por todas.
- El grupo llena la matriz al inicio de la semana. Tú solo la revisas.
- En grupos de 5, dos integrantes pueden compartir capa esa semana.
- Las semanas de tema común (1: E2E, 3: Front, 7: E2E) **no cuentan para la rotación**: todo el grupo trabaja esa capa, cada integrante sobre un flujo o componente distinto. Se registran en la matriz igual.
- El umbral de cobertura aplica a frontend y backend todas las semanas. En la semana 3, que es solo de frontend, una persona del grupo se encarga además de llevar el backend al piso (ver el reto de la semana).

## Mecanismo 2: evidencia por commits

Regla: **mínimo 1 commit de test por aprendiz por semana** en el repo del grupo, con su propio usuario de Git.

Verificación en segundos, desde el repo del grupo:

```bash
# Commits por autor que tocaron tests desde el inicio de la semana
git shortlog -sn --since="2026-10-05" HEAD -- '*tests/*' '*.test.*' '*Test.java' '*e2e/*'
```

Quien no aparece en la lista no cumplió la evidencia individual de esa semana. Ajusta las rutas a la estructura del proyecto.

> ⚠️ Un commit hecho por otro compañero con el nombre de quien no trabajó se detecta en el vocero aleatorio: quien no escribió el test no sabe explicarlo.

## Mecanismo 3: vocero aleatorio

Revisión semanal de unos 10 minutos por grupo:

1. Escoge a un integrante **al azar** (sorteo, dado, lista aleatoria). El grupo no sabe de antemano quién será.
2. Pídele una de estas tres cosas, siempre sobre una capa que **no** trabajó esa semana:
   - Explicar qué verifica un test del grupo y por qué fallaría.
   - Romper el código a propósito y mostrar qué test falla.
   - Escribir en vivo un test pequeño, con ayuda de la receta.
3. El resultado cuenta para la **nota grupal** de la semana.

Efecto buscado: al grupo le conviene enseñarse entre sí, porque cualquiera puede responder por todos.

## Mecanismo 4: revisión cruzada de PR

- Todo cambio de tests entra por pull request.
- La persona que revisa debe haber trabajado **en otra capa** esa semana.
- La plantilla de PR obliga a indicar la capa del autor y la del revisor.
- No hace falta que revises los PR: basta con abrir uno al azar en la revisión semanal.

## Umbral de cobertura: la calidad no se negocia

El umbral se exige desde la semana 2 y sube cada semana según la tabla del [plan de estudios](plan-estudios.md#umbral-de-cobertura), hasta el 80%.

- **Semana 1**: cada grupo configura la herramienta de cobertura y anota su **línea base** de frontend y backend en `docs/matriz-rotacion.md`.
- **Desde la semana 2**: el umbral vive en el archivo de configuración del proyecto (`vite.config.js` o `vitest.config.js`, `pyproject.toml`, `pom.xml`) y el CI de GitHub Actions lo exige en cada PR. Un PR que no lo cumple **no se fusiona**.
- **Cada semana**: el grupo sube el número en la configuración con un PR. El nuevo valor es el mayor entre el piso de la semana y la cobertura real de la semana anterior, redondeada hacia abajo. **Nunca baja.**

Verificación en la revisión semanal (menos de un minuto):

1. Abre la pestaña **Actions** del repo del grupo: el último workflow de `main` debe estar en verde.
2. Abre el archivo de configuración: el umbral debe ser al menos el piso de la semana.

> ⚠️ Cuidado con los atajos para inflar el número: tests sin aserciones, o `exclude` de archivos con lógica de negocio. Pídele al vocero que muestre qué falla si rompes el código cubierto. Si nada falla, esa cobertura no cuenta.

## Evaluación semanal

| Evidencia | Peso | Tipo | Cómo se verifica |
|---|---:|---|---|
| Conocimiento | 30% | Individual | Vocero aleatorio + preguntas cortas de la teoría |
| Desempeño | 40% | Individual | Commits de test propios + capa cumplida en la matriz |
| Producto | 30% | Grupal | Reto de la semana en el repo del grupo, CI en verde y umbral de cobertura de la semana |

Detalle y niveles en [`plantillas/rubrica-grupal.md`](../plantillas/rubrica-grupal.md). Cada semana trae además su `rubrica-evaluacion.md` con los criterios del tema.

## Grupos con stacks distintos en la misma ficha

- La teoría es común: dala a toda la ficha a la vez.
- En las recetas, agrupa a los aprendices por backend (mesas FastAPI, Express y Spring Boot) para que se ayuden entre grupos.
- React y Playwright son comunes a todos: en las semanas 3 y 7 la ficha trabaja junta.
