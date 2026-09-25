# Glosario — Semana 5

**`ArgumentCaptor`**: herramienta de Mockito que captura el argumento con el que se llamó a un mock para revisarlo después con AssertJ.

**`caplog`**: fixture de pytest que captura lo registrado con `logging` durante un test.

**Doble de prueba**: objeto que reemplaza una dependencia real durante un test.

**Dummy**: doble que no hace nada; solo ocupa un parámetro que el test no usa.

**Fake**: implementación funcional pero simplificada de una dependencia, por ejemplo un repositorio en memoria.

**`mocker`**: fixture de pytest-mock que crea dobles (`mocker.Mock()`) y parches (`mocker.patch`) que se deshacen al terminar el test.

**Mock**: doble que combina respuestas preparadas y verificación de llamadas.

**MSW (Mock Service Worker)**: librería que intercepta peticiones HTTP y responde con datos preparados. En los tests corre en Node con `setupServer`.

**`page.route`**: método de Playwright que intercepta peticiones del navegador y responde en lugar del servidor.

**`patch`**: reemplazo temporal de un nombre dentro de un módulo de Python. Se aplica donde el nombre **se usa**, no donde se define.

**Resiliencia**: capacidad de la app de seguir funcionando cuando falla una dependencia externa.

**`side_effect`**: atributo de un `Mock` de Python para que lance una excepción o devuelva valores distintos en cada llamada.

**Spy**: doble que registra cómo fue llamado para verificarlo después.

**Stub**: doble que devuelve respuestas preparadas para controlar lo que entra a la unidad.

**`UnnecessaryStubbingException`**: error de Mockito estricto cuando un test prepara un stub que nunca se usa.

**Verificación de comportamiento**: comprobar cómo la unidad usó sus dependencias (con qué, cuántas veces).

**Verificación de estado**: comprobar el resultado o lo que quedó guardado después de la acción.

**`vi.spyOn`**: función de Vitest que espía un método existente y, opcionalmente, reemplaza su implementación.
