# Rúbrica de evaluación — Semana 11 (opcional)

Aplica la [rúbrica base](../../plantillas/rubrica-grupal.md) con estos criterios específicos.

| Evidencia | Peso | Tipo | Descripción |
|---|---:|---|---|
| Conocimiento 🧠 | 30% | Individual | Tipos de prueba, percentiles, umbrales y punto de quiebre |
| Desempeño 💪 | 40% | Individual | Su script de k6 corre, verifica la respuesta y tiene umbrales justificados |
| Producto 📦 | 30% | Grupal | Endpoints del proyecto medidos, punto de quiebre explicado y smoke en el CI |

---

## Conocimiento 🧠 (30%, individual)

### Criterios

1. Explica qué pregunta responde cada tipo de prueba (smoke, carga, estrés) y por qué se corren en ese orden.
2. Lee el resumen de una corrida y explica por qué el p95 dice más que el promedio.
3. Explica por qué la misma prueba da otros números con otra cantidad de datos, y por qué cada corrida empieza con la BD limpia.
4. Explica por qué una prueba de estrés nunca se corre contra producción ni contra un servidor ajeno.

### Niveles

- **Alto (27–30)**: responde los cuatro criterios sobre un script que no escribió.
- **Medio (21–26)**: responde con apoyo o solo sobre su propio script.
- **Bajo (0–20)**: confunde los tipos de prueba o juzga el resultado por el promedio.

---

## Desempeño 💪 (40%, individual)

### Criterios

1. Su script corre con `k6 run` y lee la URL de `__ENV.BASE_URL`.
2. Tiene `check` sobre el estado **y** el contenido de la respuesta.
3. Tiene umbrales de latencia (p95 o p99) y de errores, con su justificación en el PR.
4. PR revisado por otro integrante, con el resumen de una corrida.

### Niveles

- **Alto (36–40)**: cumple los cuatro criterios.
- **Medio (28–35)**: el script corre pero sin umbrales justificados, o solo verifica el estado.
- **Bajo (0–27)**: el script no corre o no tiene umbrales.

---

## Producto 📦 (30%, grupal)

### Criterios

1. Cuenta de la carga esperada y cantidad de datos escritas en el PR antes de medir.
2. La prueba de carga pasa sus umbrales con la carga esperada.
3. Tabla del estrés con el punto de quiebre marcado y su causa explicada (con incidencia si es un defecto).
4. Smoke en el CI que pone el job en rojo cuando se rompe un umbral, y CI completo en verde con cobertura ≥ 80%.

### Niveles

- **Alto (27–30)**: cumple los cuatro criterios.
- **Medio (21–26)**: punto de quiebre encontrado pero sin causa, o sin smoke en el CI.
- **Bajo (0–20)**: sin prueba de estrés o CI en rojo.

> Si el vocero obtiene **Bajo** en Conocimiento, el Producto del grupo se limita a **Medio** esta semana.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Glosario — Semana 11](5-glosario/README.md) | [Semana 11 (opcional)](README.md) | — |
