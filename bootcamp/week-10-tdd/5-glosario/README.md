# Glosario — Semana 10

**Criterio de aceptación**: condición concreta que una historia de usuario debe cumplir para darse por terminada. Cada uno se convierte en al menos un test.

**Desde adentro (inside-out)**: forma de hacer TDD que empieza por las piezas internas (el servicio) y termina en la interfaz (el API).

**Desde afuera (outside-in)**: forma de hacer TDD que empieza por un test del borde del sistema (API o E2E) y lo deja en rojo mientras se construyen las piezas internas.

**Falsificar (fake it)**: llegar a Green con un valor fijo o una implementación incompleta, y dejar que el siguiente test obligue a generalizar.

**Green**: fase del ciclo en la que se escribe el código mínimo para que el test nuevo pase.

**Historia de usuario**: descripción corta de una funcionalidad desde el punto de vista de quien la usa: "como … quiero … para …".

**Implementación obvia**: llegar a Green escribiendo directamente la solución, cuando el paso es pequeño y claro.

**Lista de pruebas**: casos que una historia debe cumplir, escritos antes de programar. Guía el orden de los ciclos y crece mientras se trabaja.

**Modo observador (watch)**: modo del runner que vuelve a correr los tests cada vez que guardas un archivo.

**Red**: fase del ciclo en la que se escribe un test para el siguiente comportamiento y se ve fallar por la razón correcta.

**Refactor**: fase del ciclo en la que se mejora el diseño del código o de los tests sin cambiar su comportamiento, con la suite en verde.

**TDD (Test-Driven Development)**: práctica de escribir el test antes del código, en ciclos cortos de Red, Green y Refactor.

**Triangular**: escribir un segundo ejemplo con otro dato antes de generalizar, cuando la regla general no es obvia.
