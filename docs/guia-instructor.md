# Guía del instructor

Esta guía resuelve el problema clásico del proyecto en grupo: los integrantes se reparten los roles y algunos terminan sin saber lo que todos deben saber. Los cuatro mecanismos siguientes cuestan poco tiempo al instructor y dejan evidencia individual.

## Antes de la semana 1

1. Confirma el stack de cada grupo (backend y BD) y regístralo en una tabla de la ficha.
2. Verifica que los equipos del ambiente de formación tengan Docker y los runtimes del stack (ver requisitos en el [README](../README.md)).
3. Pide a cada grupo que copie en su repo:
   - [`plantillas/matriz-rotacion.md`](../plantillas/matriz-rotacion.md) como `docs/matriz-rotacion.md`
   - [`plantillas/pull_request_template.md`](../plantillas/pull_request_template.md) como `.github/pull_request_template.md`

## Mecanismo 1: rotación de capas

- Hay 4 capas: **Front** (React), **API** (backend), **BD** (integración) y **E2E** (Playwright).
- Cada semana, cada integrante trabaja en una capa distinta a la de la semana anterior. Nadie repite capa hasta haber pasado por todas.
- El grupo llena la matriz al inicio de la semana. Tú solo la revisas.
- En grupos de 5, dos integrantes pueden compartir capa esa semana.
- Las semanas de un solo tema (1, 3 y 7) también se registran: en la 3 quien no tiene la capa Front hace de revisor, y en la 7 cada integrante cubre un flujo distinto.

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

## Evaluación semanal

| Evidencia | Peso | Tipo | Cómo se verifica |
|---|---:|---|---|
| Conocimiento | 30% | Individual | Vocero aleatorio + preguntas cortas de la teoría |
| Desempeño | 40% | Individual | Commits de test propios + capa cumplida en la matriz |
| Producto | 30% | Grupal | Reto de la semana en el repo del grupo, tests en verde |

Detalle y niveles en [`plantillas/rubrica-grupal.md`](../plantillas/rubrica-grupal.md). Cada semana trae además su `rubrica-evaluacion.md` con los criterios del tema.

## Grupos con stacks distintos en la misma ficha

- La teoría es común: dala a toda la ficha a la vez.
- En las recetas, agrupa a los aprendices por backend (mesas FastAPI, Express y Spring Boot) para que se ayuden entre grupos.
- React y Playwright son comunes a todos: en las semanas 3 y 7 la ficha trabaja junta.
