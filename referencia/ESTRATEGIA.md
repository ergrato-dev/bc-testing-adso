# Estrategia de pruebas — App de referencia Museo

> Ejemplo del informe que cada grupo entrega en la semana 9, escrito sobre la app de referencia. Sigue la [plantilla](../plantillas/estrategia-pruebas.md). Cifras del 25 de septiembre de 2026.

## 1. Qué hace la app y qué no puede fallar

Registro de piezas de un museo: listar, ver, crear y borrar, con un frontend React y el mismo API en tres backends.

| Riesgo | Por qué importa |
|---|---|
| Guardar una pieza inválida (sin nombre, año futuro) | Datos basura que nadie corrige después |
| Responder fuera del contrato (HTML o `500` donde el front espera `{"detail": ...}`) | El frontend muestra errores ilegibles |
| Perder o duplicar una pieza al guardar | La persona usuaria pierde trabajo o ve registros repetidos |
| Que falle el aviso de pieza nueva y se pierda la pieza | Una dependencia externa tumba el flujo principal |

## 2. Qué prueba cada capa y por qué

| Capa | Qué verifica | Herramienta | Cantidad (Express · FastAPI · Spring Boot) |
|---|---|---|---|
| Unitarias del servicio | Reglas de negocio y sus límites; el notificador con dobles | Vitest · pytest · JUnit 5 + Mockito | 7 · 6 · 9 |
| API | Contrato HTTP: estados, forma del JSON, errores | supertest · `TestClient` · MockMvc | 7 · 7 · 6 |
| Componentes React | Lo que ve y hace la persona usuaria en el formulario y la lista | Testing Library | 7 (común) |
| Integración con BD | Repositorio y endpoints contra PostgreSQL y MySQL reales | Los mismos runners con `DATABASE_URL` | Receta de la semana 6 |
| E2E | El flujo de registrar una pieza en un navegador real | Playwright | 2 (contra cada backend en el CI) |

**Por qué esta forma**: la mayoría de las reglas vive en el servicio, que no conoce HTTP ni BD, así que la mayor parte de los tests son unitarios y rápidos. El contrato HTTP se prueba aparte porque es lo que consume el frontend. Los E2E son pocos: cubren el flujo que justifica la app, no cada regla.

## 3. Qué no se prueba y por qué

| Fuera de la suite | Motivo |
|---|---|
| Arranque (`server.js`, `main`, `*Application`) | Solo conecta piezas; si falla, la app no arranca y los E2E lo muestran |
| Notificador real (`LogNotifier`) | Representa un servicio externo; se reemplaza por dobles |
| Adaptadores de BD en la medición de cobertura | Se prueban con integración, no con unitarias |
| Rendimiento y seguridad | Fuera del alcance de este bootcamp |

## 4. Datos y entornos

- BD de pruebas en Docker Compose (`museo_test`, puertos 5433 y 3307), nunca la de desarrollo.
- Unitarias, API y componentes no necesitan Docker: el repositorio se reemplaza por un fake en memoria.
- Los E2E crean sus datos con nombres únicos y corren contra la BD de pruebas.

## 5. CI y umbrales

- Workflow [`referencia.yml`](../.github/workflows/referencia.yml): frontend, los tres backends y E2E contra cada backend con PostgreSQL como servicio.
- Umbral del **80%** en cada parte, exigido por el comando de test habitual.

| Parte | Cobertura actual |
|---|---|
| Frontend | 100% líneas · 100% ramas |
| Express | 94.87% líneas · 95.45% ramas |
| FastAPI | 95% líneas |
| Spring Boot | 82% líneas · 85.7% ramas |

## 6. Riesgos conocidos

La referencia deja defectos **a propósito** para que las recetas los descubran. Un proyecto real los listaría aquí como deuda, con su incidencia:

| Defecto | Capa que lo encuentra | Semana |
|---|---|---|
| JSON mal formado responde fuera del contrato | API | 4 |
| `name` de más de 255 caracteres responde `500` contra la BD real | Integración | 6 |
| `GET /api/pieces/abc` responde `500` con el SQL (Express) | Integración | 6 |
| La lista no sale ordenada por id en PostgreSQL (Spring Boot) | Integración | 6 |
| Doble clic en **Guardar** registra la pieza dos veces | E2E | 7 |
| Una pieza guardada mientras la lista carga desaparece de la pantalla | E2E | 7 |

Todos viven en código con cobertura: la cobertura del frontend es 100% y aun así contiene los dos últimos.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [App de referencia — Museo](README.md) | [README del bootcamp](../README.md) | — |
