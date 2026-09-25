# La lista de pruebas y los pasos pequeños

> Transversal: aplica a todos los stacks.

## Antes de programar: la lista

Antes del primer Red, escribe una **lista de pruebas**: los casos que la historia debe cumplir, en lenguaje simple. No es código ni se implementa toda de una vez. Es la hoja de ruta, y crece mientras trabajas.

Para la historia de la semana, "filtrar la lista por artista":

```text
[ ] filtra por el nombre exacto del artista
[ ] no importan las mayúsculas ("picasso")
[ ] no importan los espacios alrededor ("  Picasso ")
[ ] si el artista viene vacío o en blanco, devuelve todo
[ ] el API recibe el filtro como ?artist=
[ ] ?artist=a&artist=b (¿qué debería pasar?)
```

El último caso apareció **mientras** se hacía el ejercicio. En Express, ese parámetro repetido llega como un arreglo, y el servicio responde `500` con `text.trim is not a function`. No se resuelve en el ciclo en curso: se anota en la lista y se decide después.

## Elegir el siguiente caso

De la lista, elige el caso que:

1. Te enseñe algo nuevo del problema.
2. Puedas llevar a verde en pocos minutos.

Casi siempre es el más simple que todavía no funciona. Los casos borde (vacío, en blanco, repetido) vienen después del caso feliz, pero **vienen**: son los que en las semanas 2 y 6 encontraron defectos.

## Tres formas de llegar a Green

| Técnica | Qué es | Cuándo |
|---|---|---|
| **Implementación obvia** | Escribes directamente el código que sabes que funciona | Cuando el paso es pequeño y lo tienes claro |
| **Falsificar** (*fake it*) | Devuelves un valor fijo para pasar el test; el siguiente test obliga a generalizar | Cuando no sabes cómo generalizar todavía |
| **Triangular** | Escribes un segundo ejemplo con otro dato; solo entonces generalizas | Cuando dudas de cuál es la regla general |

En la receta de Spring Boot hay un ejemplo de falsificar: en el primer ciclo, el controlador llama `service.list(null)` en vez de leer el parámetro de la URL. Ningún test pide leerlo todavía. El test del controlador del último ciclo es el que obliga a agregar `@RequestParam`.

## Qué tan pequeño es "pequeño"

| Señal | Qué hacer |
|---|---|
| Llevas más de 10 minutos en rojo | Deshaz, divide el caso en dos más simples |
| El Green toca más de dos archivos | Probablemente estás implementando dos casos a la vez |
| Escribes código que ningún test ejercita | Bórralo o escribe primero el test que lo pide |
| No sabes qué test escribir | Vuelve a la lista; si está vacía, la historia terminó |

## Desde afuera o desde adentro

Puedes empezar por el test del **servicio** (desde adentro) o por el del **API** (desde afuera):

- **Desde adentro** (las recetas): los ciclos del servicio son rápidos y precisos; el test del API cierra la historia y verifica que el parámetro llega.
- **Desde afuera**: el primer test es el del API, queda en rojo mientras haces ciclos más pequeños en el servicio, y se pone en verde al final. Útil cuando no sabes aún qué forma tendrá el servicio.

Las dos son TDD. Lo que no es TDD es escribir todo el código y después los tests.

## Al terminar

La historia termina cuando la lista está completa y la suite está en verde. Antes del PR:

1. Corre la suite completa con el umbral de cobertura.
2. Haz una mutación a mano sobre el código nuevo (semana 2). Con TDD, debería fallar algún test.
3. Revisa la lista: los casos que quedaron sin resolver van al PR como incidencias.
