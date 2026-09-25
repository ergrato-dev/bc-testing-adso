# Estrategia de pruebas — _nombre del proyecto_

> Copia este archivo en tu repo como `docs/estrategia-pruebas.md`. Máximo dos páginas: se lee en la sustentación. Mira el ejemplo sobre la app de referencia en [`referencia/ESTRATEGIA.md`](../referencia/ESTRATEGIA.md).

**Grupo**: _integrantes_ · **Ficha**: _número_ · **Stack**: React + _backend_ + _BD_ · **Fecha**: _AAAA-MM-DD_

## 1. Qué hace la app y qué no puede fallar

Una o dos frases sobre el proyecto. Después, los riesgos: qué le pasaría a la persona usuaria si algo falla.

| Riesgo | Por qué importa |
|---|---|
| | |

## 2. Qué prueba cada capa y por qué

| Capa | Qué verifica | Herramienta | Cantidad de tests |
|---|---|---|---|
| Unitarias | | | |
| Componentes React | | | |
| API | | | |
| Integración con BD | | | |
| E2E (flujos críticos) | | | |

**Por qué esta forma**: explica en 3 a 5 líneas por qué la suite tiene esta distribución en **tu** proyecto. No copies la pirámide genérica: di dónde vive la lógica y qué riesgo cubre cada capa.

## 3. Qué no se prueba y por qué

| Fuera de la suite o de la cobertura | Motivo |
|---|---|
| | |

## 4. Datos y entornos

- Dónde corre la BD de pruebas y cómo se limpia entre tests.
- Qué dependencias externas se reemplazan con dobles y cuáles se prueban reales.
- Cómo preparan sus datos los E2E.

## 5. CI y umbrales

- Enlace al workflow y al último run en verde de `main`.
- Jobs obligatorios en el ruleset.

| Parte | Cobertura actual | Umbral configurado |
|---|---|---|
| Frontend | | |
| Backend | | |

## 6. Hallazgos y riesgos conocidos

Los defectos que encontraron las pruebas durante el trimestre, y los que siguen abiertos.

| Defecto | Capa que lo encontró | Estado (corregido / incidencia #) |
|---|---|---|
| | | |

## 7. Evidencia individual

| Integrante | Capas trabajadas (matriz) | Commits de test (`git shortlog`) |
|---|---|---|
| | | |
