# Reto — Las dependencias del proyecto formativo desde cuatro ángulos

> Entregable grupal con evidencia individual · Tiempo estimado: 3 h · Piso de cobertura al cerrar la semana: **60%** en frontend y backend

## Parte 1: Rotar de capa e inventariar dependencias (20 min)

Cada integrante anota en la columna **S5** de la matriz una capa distinta a la de S4.

Antes de escribir tests, el grupo hace un inventario rápido: **¿de qué depende el proyecto que no controla?** Anótenlo en el PR de la semana. Ejemplos frecuentes en proyectos ADSO:

- Envío de correos (confirmación de registro, recuperación de contraseña)
- Pasarela de pagos, API de mapas, API de clima u otros servicios de terceros
- Subida de archivos (almacenamiento local o en la nube)
- La hora actual: vencimiento de reservas, tokens, promociones
- El backend, visto desde el frontend

| Capa | Ángulo |
|---|---|
| **Front** | El cliente HTTP con MSW: caso feliz, `500`, `422` y respuesta no JSON. Quita el cliente de la exclusión de cobertura si estaba |
| **API** | Una dependencia externa del backend (correo, pagos, archivos): se llama con los datos correctos, no se llama cuando no debe, y la app resiste si falla |
| **BD** | El repositorio visto como dependencia: con un fake o un mock, verifica que el servicio **no guarda** ante datos inválidos y que guarda lo correcto. Usa `verifyNoInteractions`, `assert_not_called` o `not.toHaveBeenCalled` |
| **E2E** | Estados difíciles de provocar con el backend real, usando `page.route` de Playwright: API caído, lista vacía, error de validación. Mínimo 2 tests |

Si el proyecto **no** tiene una dependencia externa en el backend, quien tiene la capa API trabaja la dependencia del reloj: extrae la hora actual a un parámetro (como `currentYear` en la semana 2) y prueba los valores límite de una regla con fechas.

## Parte 2: Tests con dobles (2 h)

Cada integrante escribe **al menos 3 tests** con dobles desde su ángulo:

1. Anota en un comentario qué **tipo** de doble usa cada test y por qué (dummy, stub, spy, mock o fake).
2. Si la dependencia es una librería de terceros usada directamente en el servicio, primero créale una **interfaz propia** pequeña, como `Notifier` en la referencia, y reemplaza esa interfaz en los tests, no la librería.
3. Al menos un test verifica **comportamiento** (con qué se llamó o que no se llamó) y al menos uno verifica **estado**.
4. **Mutación**: quita el manejo de error, la llamada a la dependencia o cambia el orden. Documenta en el PR qué test la detectó, o por qué se escapó y qué agregaste.
5. Commit con tu usuario y PR revisado por alguien de otra capa.

## Parte 3: Revisión de exceso de mocks (20 min, en grupo)

Revisen juntos **un** test de cada integrante con la tabla de señales de la teoría ("Cuándo un doble ayuda y cuándo estorba"). Si encuentran un test que solo verifica el mock, reescríbanlo. Anoten el resultado en el PR.

## Parte 4: Cierre de semana, umbral del 60% (20 min)

1. Con los PR fusionados, anota en la matriz la cobertura real de frontend y backend.
2. Abre un PR que suba el umbral de **cada** parte al mayor entre **60** y su cobertura real, redondeada hacia abajo.
3. El CI debe quedar en verde.

## Entregables

- [ ] Columna S5 de la matriz con una capa distinta a la de S4 para cada integrante
- [ ] Inventario de dependencias externas en el PR de la semana
- [ ] Al menos 3 tests con dobles por integrante, con el tipo de doble anotado
- [ ] Un mutante documentado por integrante
- [ ] Al menos 2 tests E2E con `page.route`
- [ ] Revisión grupal de exceso de mocks anotada
- [ ] Umbral ≥ 60% en frontend y backend, fijado por PR y en verde en CI

## Preparación para el vocero aleatorio

El instructor escoge a alguien al azar y le pide, sobre un test que **no** escribió:

- Decir qué tipo de doble usa y qué pasaría si se usara la dependencia real.
- Explicar la diferencia entre verificar estado y comportamiento con ese test.
- Proponer una mutación que el test **no** detectaría.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Receta — Dobles en Spring Boot con Mockito](../2-recetas/springboot/README.md) | [Semana 5](../README.md) | [Ebooks gratuitos — Semana 5](../4-recursos/ebooks-free/README.md) |
