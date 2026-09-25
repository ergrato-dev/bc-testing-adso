# La sustentación: responder por todas las capas

> Transversal: aplica a todos los stacks.

## Cómo es

La sustentación sigue el mismo mecanismo del vocero aleatorio que usaste cada semana, ahora sobre el proyecto completo:

1. El grupo presenta su informe de estrategia en **5 minutos**, con el CI en verde abierto en pantalla.
2. El instructor escoge **al azar** a un integrante y una **capa que esa persona no trabajó** en la semana más reciente.
3. La persona resuelve una de tres pruebas sobre esa capa. Se repite con otros integrantes mientras haya tiempo.

El grupo no sabe de antemano quién responde ni sobre qué capa. Por eso todo el trimestre se trabajó con rotación y revisión cruzada.

## Las tres pruebas

| Prueba | Qué pide el instructor | Qué demuestra |
|---|---|---|
| **Explicar** | "¿Qué verifica este test y cuándo fallaría?" | Que entiendes el test, no solo que existe |
| **Romper** | "Cambia esta línea del código. ¿Qué test falla?" | Que la suite detecta defectos, y que sabes predecir cuál |
| **Escribir** | "Agrega un test para este caso", con la receta abierta | Que sabes probar en esa capa, no solo leer |

En **Romper**, "ningún test falla" es una respuesta válida si la explicas: es un mutante que sobrevive, y la siguiente pregunta será qué test lo mataría.

## Preguntas frecuentes por capa

| Capa | Preguntas típicas |
|---|---|
| Unitarias | ¿Cuál es el valor límite de esta regla? ¿Qué mutante sobrevive si quitas este test? ¿Por qué el servicio recibe el repositorio por parámetro? |
| Componentes | ¿Por qué `getByRole` y no `getByTestId`? ¿Qué ve la persona usuaria cuando el API falla? ¿Por qué `findBy` aquí? |
| API | ¿Qué código responde este endpoint si el recurso no existe? ¿Qué pasa con un JSON mal formado? ¿Cómo se aísla la BD en este test? |
| Dobles | ¿Qué tipo de doble es este? ¿Qué pasa si el correo falla? ¿Este mock verifica algo o solo se verifica a sí mismo? |
| Integración | ¿Qué encuentra este test que el fake no? ¿Cómo se limpia la BD entre tests? ¿De dónde sale `DATABASE_URL`? |
| E2E | ¿Qué espera Playwright antes de este clic? ¿Cómo prepara el test sus datos? ¿Qué pasa si corre dos veces en paralelo? |
| CI | ¿Qué job falla si rompes esto? ¿Cuántos tests se saltan en el CI? ¿Dónde está el reporte de este fallo? |

## Cómo prepararse: el ensayo cruzado

La semana del integrador incluye un ensayo. En parejas de capas distintas:

1. Cada persona escoge un test de **su** capa y le hace a la otra las tres pruebas.
2. Quien responde no puede mirar el código mientras el otro lo cambia: solo el test.
3. Cambian de pareja hasta que cada integrante haya respondido por las cuatro capas.

Si alguien no logra responder por una capa, el grupo tiene un problema, no esa persona: repasen juntos la receta de esa semana.

## Qué no hacer

| En la sustentación | Por qué resta |
|---|---|
| "Eso lo hizo mi compañero" | La regla del bootcamp es que cualquiera responde por todo |
| Leer el test en voz alta sin explicarlo | Explicar es decir qué comportamiento protege |
| Correr la suite completa para ver qué falla | Primero predice qué test falla, después córrelo para confirmarlo |
| Mostrar el porcentaje de cobertura como prueba de calidad | La semana 8 mostró por qué no basta: muestra los hallazgos |
