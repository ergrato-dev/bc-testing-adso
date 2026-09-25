# Glosario — Semana 9

**Deuda de pruebas**: comportamientos importantes que la suite todavía no verifica. Se registran como incidencias para que no se olviden.

**Ensayo cruzado**: práctica en parejas de capas distintas en la que cada persona responde por un test que no escribió.

**Estrategia de pruebas**: decisión documentada de qué se prueba en cada capa, qué queda fuera y por qué, según los riesgos del proyecto.

**Evidencia verificable**: afirmación del informe que se puede comprobar en el repo con un comando o un enlace, como el número de tests o un run del CI.

**Fallo esperado**: test marcado para que su fallo no rompa la suite mientras el defecto sigue abierto (`test.fail()`, `it.fails`, `xfail(strict=True)`). Si el test empieza a pasar, la suite falla: así te enteras de que el defecto se corrigió.

**Forma de la suite**: cantidad de tests en cada capa. La pirámide y el trofeo son dos formas de referencia.

**Hallazgo**: defecto que una prueba encontró. Es la mejor evidencia de que la suite sirve.

**Incidencia (issue)**: registro de un defecto o una tarea pendiente en el repo, con su número para enlazarla desde un test o un informe.

**Pirámide de pruebas**: forma de suite con muchas pruebas unitarias, menos de integración y pocas E2E.

**Riesgo**: algo que le pasaría a la persona usuaria si una parte de la app falla. Guía qué se prueba primero.

**Sustentación**: presentación final en la que el grupo explica su suite y cada integrante responde por cualquier capa.

**Trofeo de pruebas (testing trophy)**: forma de suite propuesta por Kent C. Dodds que da el mayor peso a las pruebas de integración.
