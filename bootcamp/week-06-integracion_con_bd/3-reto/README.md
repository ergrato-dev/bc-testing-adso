# Reto — La base de datos del proyecto formativo desde cuatro ángulos

> Entregable grupal con evidencia individual · Tiempo estimado: 3 h · Piso de cobertura al cerrar la semana: **70%** en frontend y backend

## Parte 1: Rotar de capa y montar la BD de pruebas (30 min)

Cada integrante anota en la columna **S6** de la matriz una capa distinta a la de S5.

Antes de escribir tests, el grupo monta la BD de pruebas del proyecto (una sola persona, el resto revisa el PR):

1. Un `docker-compose.yml` con el motor y la versión mayor del proyecto, en un puerto distinto al de desarrollo (5433 o 3307) y con un nombre de BD que termine en `_test`. Toma de modelo el de [`referencia/`](../../../referencia/docker-compose.yml).
2. El esquema se crea igual que en producción: con las migraciones del proyecto si las tiene, o con el arranque de la app si no.
3. Los tests de integración leen `DATABASE_URL` y se **saltan** si no está definida, así el CI actual sigue en verde (la BD llega al CI en la semana 8).
4. En el README del repo, los tres comandos para correr la integración: levantar la BD, correr los tests y apagarla con `down -v`.

| Capa | Ángulo |
|---|---|
| **BD** | El repositorio o DAO de la entidad principal contra la BD real: cada método al menos una vez, las consultas propias (filtros, orden, `JOIN`) y cada restricción de la tabla (`NOT NULL`, longitud, `UNIQUE`, llave foránea) documentada con un test |
| **API** | Uno o dos endpoints completos contra la BD real: el caso feliz verificado **en la BD** (no solo en la respuesta), y qué responde el API cuando se viola cada restricción de la tabla. Todo lo que responda `500` es un hallazgo |
| **Front** | ¿Mienten los handlers de MSW de la semana 5? Con el backend corriendo contra la BD de pruebas, captura las respuestas reales (lista, `404`, `422`, y los errores nuevos que encuentre la capa API) y compáralas con los handlers. Corrige los que no coinciden y agrega un test por cada caso nuevo |
| **E2E** | La suite E2E corre contra el backend con la BD de pruebas y no depende de datos previos: cada test crea lo que necesita (por la UI o por el API) y la suite pasa dos veces seguidas y después de un `down -v`. Mínimo 2 tests |

## Parte 2: Tests de integración (2 h)

Cada integrante escribe **al menos 3 tests** desde su ángulo:

1. Cada test prepara sus propios datos. Ningún test usa ids fijos que no haya insertado él mismo, ni depende de lo que dejó otro test.
2. La limpieza es explícita: transacción con rollback o truncado antes de cada test. Anota en el PR cuál usa el grupo y por qué.
3. Ninguna credencial en los archivos de test: la conexión llega por `DATABASE_URL`.
4. **Hallazgo**: cada restricción que el API responde con `500` se corrige con una regla en el servicio (4xx con el formato del contrato) y un test **unitario** en su valor límite. El test de integración queda como red.
5. **Mutación**: quita un `ORDER BY`, un filtro de una consulta, la limpieza entre tests o la regla que corregiste. Documenta en el PR qué test la detectó, o por qué se escapó y qué agregaste.
6. Commit con tu usuario y PR revisado por alguien de otra capa.

Si el proyecto usa PostgreSQL, prueba al menos un caso que en MySQL se comportaría distinto (orden sin `ORDER BY`, un valor fuera de rango), y al revés. Anota en el PR qué encontraron.

## Parte 3: La prueba de fuego (15 min, en grupo)

Con todos los PR fusionados, en el computador de alguien que **no** montó la BD:

```bash
docker compose down -v
docker compose up -d --wait
# comando de test del proyecto con DATABASE_URL, dos veces seguidas
```

Las dos corridas deben pasar sin tocar nada. Si falla la segunda, busquen el test que deja datos o que depende de ellos. Anoten el resultado en el PR.

## Parte 4: Cierre de semana, umbral del 70% (15 min)

1. Con los PR fusionados, anota en la matriz la cobertura real de frontend y backend **sin** `DATABASE_URL`, que es lo que mide el CI hoy.
2. Abre un PR que suba el umbral de **cada** parte al mayor entre **70** y su cobertura real, redondeada hacia abajo.
3. El CI debe quedar en verde.

> Las reglas nuevas del servicio suben la cobertura porque tienen test unitario. El adaptador de BD sigue fuera de la medición: se prueba con integración.

## Entregables

- [ ] Columna S6 de la matriz con una capa distinta a la de S5 para cada integrante
- [ ] `docker-compose.yml` con la BD de pruebas en un puerto distinto al de desarrollo, y comandos en el README
- [ ] Al menos 3 tests de integración por integrante, sin credenciales y con limpieza entre tests
- [ ] Al menos un hallazgo (un `500` o un handler de MSW que mentía) documentado y corregido con su test
- [ ] Un mutante documentado por integrante
- [ ] Prueba de fuego: dos corridas seguidas en verde después de `down -v`, anotada en el PR
- [ ] Umbral ≥ 70% en frontend y backend, fijado por PR y en verde en CI

## Preparación para el vocero aleatorio

El instructor escoge a alguien al azar y le pide, sobre un test de integración que **no** escribió:

- Decir qué defecto encontraría ese test que un test con el repositorio falso no encuentra.
- Explicar cómo se limpia la BD antes o después de ese test, y qué pasaría si se quitara la limpieza.
- Mostrar de dónde saca el test la conexión a la BD y por qué no es la BD de desarrollo.
