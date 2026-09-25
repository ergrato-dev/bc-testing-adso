# Glosario — Semana 2

**Acción (GitHub Actions)**: paso reutilizable de un workflow, publicado en GitHub. Ejemplos: `actions/checkout`, `actions/setup-node`. Se usa con `uses:` y una versión fija.

**Check (status check)**: resultado de un job de CI que aparece en el PR con ✅ o ❌.

**CI (integración continua)**: práctica de integrar cambios con frecuencia y verificarlos automáticamente en cada push o pull request.

**Determinista**: que produce siempre el mismo resultado con los mismos datos de entrada. Un test que usa la fecha real o números aleatorios no lo es.

**FIRST**: principios de una buena prueba unitaria: Fast, Isolated, Repeatable, Self-validating, Timely.

**Función pura**: función cuyo resultado depende solo de sus parámetros y que no modifica nada externo. Es la unidad más fácil de probar.

**Job**: conjunto de pasos de un workflow que corre en una máquina virtual limpia. Los jobs de un workflow corren en paralelo.

**Mutante**: versión del código con un defecto introducido a propósito, por ejemplo `>=` en lugar de `>`. Si ningún test falla, el mutante **sobrevive** y falta un caso.

**Partición de equivalencia**: grupo de valores de entrada que el código trata igual. Basta un representante por partición.

**Prueba de mutación**: técnica que evalúa la calidad de una suite introduciendo mutantes y comprobando que los tests los detectan.

**Regla de rama (ruleset)**: configuración de GitHub que impide fusionar en una rama sin cumplir condiciones, por ejemplo checks en verde.

**Test parametrizado**: un test que se ejecuta con varios conjuntos de datos. Vitest: `it.each`; pytest: `@pytest.mark.parametrize`; JUnit: `@ParameterizedTest`.

**Trinquete (umbral de)**: regla por la que el umbral de cobertura solo puede subir: cada semana es el mayor entre el piso y la cobertura real anterior.

**Unidad bajo prueba**: la pieza de lógica que un test unitario ejecuta de forma aislada: una función, un método o una clase.

**Valor límite**: valor en el borde entre dos particiones, por ejemplo el año actual en la regla "el año no puede ser futuro". Es donde se esconden los defectos de `>` frente a `>=`.

**Workflow**: archivo YAML en `.github/workflows/` que define cuándo y cómo se ejecutan los jobs de CI.

---

## Navegación

| ← Anterior | Inicio | Siguiente → |
|---|---|---|
| [Webgrafía — Semana 2](../4-recursos/webgrafia/README.md) | [Semana 2](../README.md) | [Rúbrica de evaluación — Semana 2](../rubrica-evaluacion.md) |
