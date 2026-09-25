<p align="center">
  <a href="https://github.com/ergrato-dev/bc-testing-adso/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-CC_BY--NC--SA_4.0-green.svg" alt="License CC BY-NC-SA 4.0"></a>
  <a href="#"><img src="https://img.shields.io/badge/semanas-9%2B1-6366f1.svg" alt="9+1 Semanas"></a>
  <a href="#"><img src="https://img.shields.io/badge/horas-72-6366f1.svg" alt="72 Horas"></a>
  <a href="#"><img src="https://img.shields.io/badge/React-Vitest-61DAFB?logo=react&logoColor=black" alt="React Vitest"></a>
  <a href="#"><img src="https://img.shields.io/badge/FastAPI-pytest-009688?logo=fastapi&logoColor=white" alt="FastAPI pytest"></a>
  <a href="#"><img src="https://img.shields.io/badge/Express-Vitest-000000?logo=express&logoColor=white" alt="Express Vitest"></a>
  <a href="#"><img src="https://img.shields.io/badge/Spring_Boot-JUnit5-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot JUnit 5"></a>
  <a href="#"><img src="https://img.shields.io/badge/E2E-Playwright-2EAD33?logo=playwright&logoColor=white" alt="Playwright"></a>
</p>

<p align="center">
  <a href="README_EN.md"><img src="https://img.shields.io/badge/🇺🇸_English-0969DA?style=for-the-badge&logoColor=white" alt="English Version"></a>
</p>

---

# Bootcamp Testing ADSO

Bootcamp de **testing de software aplicado al proyecto formativo** del programa **Análisis y Desarrollo de Software (ADSO) del SENA**. Está pensado para aprendices de VI trimestre que ya tienen un proyecto en curso y cuentan con **un trimestre (9–10 semanas, 8 h/semana)** para darle una suite de pruebas real.

No es un curso de un lenguaje: cada semana trata **un tema común** y ofrece **recetas por stack**, para que cada grupo lo aplique a su propio proyecto.

| Capa | Stacks soportados | Herramientas de prueba |
|---|---|---|
| Frontend | React (Vite) | Vitest + React Testing Library |
| Backend | FastAPI | pytest + `TestClient` |
| Backend | Express | Vitest + supertest |
| Backend | Spring Boot | JUnit 5 + MockMvc + AssertJ |
| Base de datos | PostgreSQL o MySQL | Docker Compose |
| E2E | Cualquier combinación | Playwright |

> 📚 ¿Buscas los fundamentos del testing por lenguaje (Jest, pytest, JUnit 5)? Están en [bc-testing](https://github.com/ergrato-dev/bc-testing). Es lectura opcional; este bootcamp es autocontenido.

---

## 🎯 Objetivos

Al finalizar, cada integrante del grupo, **no solo el grupo**, es capaz de:

- ✅ Explicar la pirámide de pruebas y ubicar cada test de su proyecto en ella
- ✅ Automatizar un flujo E2E del proyecto con Playwright
- ✅ Escribir pruebas unitarias con AAA en el lenguaje de su backend y en React
- ✅ Probar componentes React desde la perspectiva del usuario
- ✅ Probar los endpoints de su API: estados HTTP, validación y errores
- ✅ Aislar dependencias con dobles de prueba
- ✅ Ejecutar pruebas de integración contra PostgreSQL o MySQL reales en Docker
- ✅ Mantener una cobertura mínima del 80% en la lógica de negocio, exigida por CI en cada pull request

---

## 🗓️ Temario

| Sem | Tema | Recetas |
|:---:|---|---|
| 1 | [Por qué probar + **primer E2E con Playwright** sobre tu proyecto](bootcamp/week-01-por_que_probar_y_primer_e2e/README.md) | Playwright |
| 2 | Pruebas unitarias con AAA + **umbral de cobertura en CI** | React · FastAPI · Express · Spring Boot |
| 3 | Componentes React con React Testing Library | React |
| 4 | Pruebas de API: estados, validación y errores | FastAPI · Express · Spring Boot |
| 5 | Dobles de prueba: mocks y stubs | React · FastAPI · Express · Spring Boot |
| 6 | Integración con BD real (Docker Compose) | PostgreSQL · MySQL × 3 backends |
| 7 | Playwright a fondo: flujos críticos y datos de prueba | Playwright |
| 8 | CI completo (BD, integración y E2E) y calidad de la suite | Todos |
| 9 | **Integrador**: suite completa y sustentación | — |
| 10 | *(Opcional)* TDD sobre una historia de usuario nueva | Todos |

Detalle en [docs/plan-estudios.md](docs/plan-estudios.md).

> 📏 **La calidad es una exigencia.** La cobertura se mide desde la semana 1 y, desde la semana 2, GitHub Actions rechaza cualquier PR que no cumpla el umbral. El umbral sube cada semana hasta el **80%** y nunca baja. Ver [umbral de cobertura](docs/plan-estudios.md#umbral-de-cobertura).

---

## 👥 Trabajo en grupo: todos aprenden todo

Los proyectos formativos se hacen en grupos de 3 a 5 aprendices, y es común que cada uno se quede con "su parte". Este bootcamp lo evita con cuatro mecanismos:

1. **Rotación de capas**: cada semana cambias de capa (front, API, BD, E2E). Ver [plantillas/matriz-rotacion.md](plantillas/matriz-rotacion.md).
2. **Evidencia por commits**: cada integrante hace como mínimo un commit de test por semana.
3. **Vocero aleatorio**: en la revisión semanal el instructor escoge al azar quién explica o escribe un test, y eso cuenta para la nota del grupo.
4. **Revisión cruzada de PR**: tus tests los revisa alguien que trabajó en otra capa.

Guía completa para instructores: [docs/guia-instructor.md](docs/guia-instructor.md).

---

## 🗂️ Estructura

```
bc-testing-adso/
├── docs/          # Plan de estudios y guía del instructor
├── plantillas/    # Matriz de rotación, plantilla de PR, rúbrica grupal
├── referencia/    # App de referencia mínima (React + 3 APIs + docker-compose)
└── bootcamp/
    └── week-XX-slug/
        ├── README.md
        ├── rubrica-evaluacion.md
        ├── 0-assets/
        ├── 1-teoria/
        ├── 2-recetas/{react,fastapi,express,springboot}/
        ├── 3-reto/README.md      # Se resuelve sobre TU proyecto formativo
        ├── 4-recursos/
        └── 5-glosario/
```

---

## 🛠️ Requisitos

- Git y una cuenta de GitHub
- Docker Desktop (o Docker Engine) con Docker Compose
- Node.js 22 + pnpm (frontend React y backend Express)
- Python 3.14 + uv (backend FastAPI)
- JDK 21 (backend Spring Boot; el proyecto trae Maven Wrapper)

Solo necesitas el runtime del backend de tu grupo, además de Node.js para React y Playwright.

---

## 📄 Licencia

[CC BY-NC-SA 4.0](LICENSE) © 2026 ergrato-dev
