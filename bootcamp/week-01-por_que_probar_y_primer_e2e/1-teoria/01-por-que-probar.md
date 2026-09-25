# Por qué probar

> Transversal: aplica a todos los stacks.

## El problema que ya conoces

Seguramente te ha pasado: arreglas algo en el backend, haces commit, y dos días después un compañero descubre que el registro de usuarios dejó de funcionar. Nadie lo notó porque nadie volvió a registrar un usuario a mano.

En un proyecto formativo con 3 a 5 personas tocando el mismo código, esto pasa todo el tiempo:

- Cada quien prueba "su parte" a mano, una vez, cuando la termina.
- Nadie repite esas pruebas después de cada cambio, porque toma tiempo.
- Los errores aparecen en la peor fecha posible: el día de la sustentación.

Una **prueba automatizada** es código que ejecuta tu aplicación y verifica que se comporta como esperas. Se repite sola, en segundos, cada vez que la corres.

## Error, defecto y falla

Tres palabras que el mundo del testing distingue:

| Término | Qué es | Ejemplo en un proyecto ADSO |
|---|---|---|
| **Error** | Una equivocación humana | Escribiste `>` en lugar de `>=` al validar la edad |
| **Defecto** (bug) | El resultado del error en el código | La validación rechaza a quien tiene exactamente 18 años |
| **Falla** | Lo que ve la persona usuaria | "No puedo registrarme y tengo 18 años" |

Las pruebas buscan **defectos** antes de que se conviertan en **fallas** frente al usuario (o frente al jurado).

## El costo de encontrar tarde un defecto

Mientras más tarde aparece un defecto, más caro es corregirlo:

| Momento en que se detecta | Qué implica corregirlo |
|---|---|
| Mientras escribes el código | Segundos: el test falla y lo corriges |
| En la revisión del PR | Minutos: un compañero lo señala |
| Integrando con el resto del grupo | Horas: hay que averiguar qué cambio lo rompió |
| En la sustentación o en producción | Mucho más: reputación, datos dañados, re-trabajo |

Por eso la meta no es "probar al final", sino **probar continuamente**.

## Lo que una prueba automatizada te da

1. **Confianza para cambiar código.** Si los tests pasan después de un refactor, no rompiste lo que ya funcionaba.
2. **Documentación viva.** Un test llamado `should reject registration when email already exists` explica una regla de negocio mejor que un comentario.
3. **Menos trabajo repetido.** Lo que hoy pruebas a mano cada vez, el test lo hace en segundos.
4. **Evidencia.** Una suite en verde demuestra que el sistema cumple sus requisitos, algo que tu proyecto formativo necesita mostrar.

## Lo que una prueba NO te da

- **No demuestra que no hay defectos.** Solo demuestra que los casos probados funcionan. Por eso importa *qué* casos eliges.
- **No reemplaza pensar.** Un test que nunca puede fallar no sirve de nada.
- **No es gratis.** Cada test es código que se mantiene. Unos pocos tests bien elegidos valen más que muchos tests frágiles.

## Prueba manual vs. prueba automatizada

| | Manual | Automatizada |
|---|---|---|
| Quién la ejecuta | Una persona | Una máquina |
| Velocidad | Minutos por caso | Milisegundos a segundos |
| Repetible | Depende de la persona | Siempre igual |
| Sirve para | Explorar, descubrir lo inesperado | Verificar lo esperado una y otra vez |

No compiten: exploras a mano y automatizas lo que ya sabes que debe funcionar.

## Tu grupo y las pruebas

En este bootcamp **todo el grupo** aprende a probar **todas las capas** del proyecto: frontend, API, base de datos y E2E. No hay "el que hace los tests". Cada semana rotas de capa (ver la [matriz de rotación](../../../plantillas/matriz-rotacion.md)), y en la revisión cualquiera puede ser escogido para explicar cualquier test del grupo.

## Para pensar

1. Piensa en el último defecto que encontraron en tu proyecto. ¿En qué momento se detectó? ¿Cuánto costó corregirlo?
2. ¿Qué flujo de tu proyecto, si falla el día de la sustentación, sería el más grave?

Esa segunda respuesta es el candidato para tu primer test E2E.
