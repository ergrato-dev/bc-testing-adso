# Reto — Primer E2E de tu proyecto formativo

> Entregable grupal con evidencia individual · Tiempo estimado: 3 h

## Contexto

Ya viste Playwright funcionando con la app de referencia. Ahora lo llevas a **tu proyecto formativo**: el mismo frontend React y el backend que escogió tu grupo.

## Parte 1: Preparar el repo del grupo (dos personas, 40 min)

1. Crea una rama `test/semana-01`.
2. Copia estas plantillas del bootcamp a tu repo:
   - [`plantillas/matriz-rotacion.md`](../../../plantillas/matriz-rotacion.md) → `docs/matriz-rotacion.md`
   - [`plantillas/pull_request_template.md`](../../../plantillas/pull_request_template.md) → `.github/pull_request_template.md`
3. Crea una carpeta `e2e/` en la raíz del repo e instala Playwright ahí, igual que en [`referencia/e2e/`](../../../referencia/e2e/):
   - `package.json` con `@playwright/test` en versión exacta y `"packageManager"` de pnpm.
   - `playwright.config.js` con la `baseURL` y el `webServer` que levanta **tu** frontend.
4. Llena la matriz: esta semana la columna **S1** dice **E2E** para todos.
5. Configura la cobertura en el frontend y en el backend y registra la **línea base** siguiendo la [receta de cobertura](../2-recetas/cobertura/README.md). La línea base queda como umbral en la configuración: desde hoy no puede bajar.

> ⚠️ **No reutilices la BD de desarrollo para los tests** si tiene datos que te importan. Si puedes, crea una BD aparte para pruebas. En la semana 6 la montarás en Docker.

## Parte 2: Un flujo crítico por integrante (2 h)

Cada integrante escoge **un flujo distinto** del proyecto y escribe su test E2E. Ideas:

- Registro de usuario
- Inicio de sesión con credenciales válidas
- Inicio de sesión con contraseña incorrecta (se muestra un error)
- Crear el recurso principal del proyecto (producto, cita, pedido…)
- Validación visible de un formulario (campo obligatorio vacío)
- Búsqueda o filtro que muestra resultados

Para cada test:

1. Graba el flujo con `pnpm exec playwright codegen <url-de-tu-front>`.
2. Limpia el borrador: locators por rol o etiqueta, ruta relativa y estructura AAA.
3. **Agrega al menos una aserción** sobre lo que ve la persona usuaria.
4. Usa datos únicos si el flujo crea registros (por ejemplo, un correo con `Date.now()`).
5. Hazlo fallar a propósito una vez y confírmalo.
6. Haz commit **con tu propio usuario de Git**.

> 💡 Si no logras encontrar un elemento con `getByRole` o `getByLabel`, revisa el componente React: quizás al `<input>` le falta su `<label>`. Corrígelo en el frontend; ese cambio también cuenta como aporte.

## Parte 3: PR con revisión cruzada (40 min)

1. Cada integrante abre un PR con su test hacia la rama `test/semana-01`, o todos agregan commits a un único PR del grupo.
2. Otra persona del grupo revisa el PR: debe **correr el test en su equipo**, no solo leerlo.
3. Esta semana todos están en la capa E2E, así que la revisión cruzada consiste en revisar el flujo de **otro** integrante.

## Entregables

- [ ] Carpeta `e2e/` con Playwright configurado en el repo del grupo
- [ ] Un test E2E por integrante, cada uno sobre un flujo distinto, todos en verde
- [ ] Cada test con al menos una aserción y estructura AAA
- [ ] `docs/matriz-rotacion.md` con la columna S1 llena
- [ ] `.github/pull_request_template.md` en el repo
- [ ] Cobertura configurada en frontend y backend, con la línea base anotada en la matriz y fijada como umbral
- [ ] Al menos un commit de test por integrante (se verifica con `git shortlog`)

## Preparación para el vocero aleatorio

En la revisión, el instructor escoge a una persona al azar y le pide explicar **el test de otro integrante**:

- ¿Qué flujo prueba y por qué es crítico?
- ¿Dónde están el Arrange, el Act y el Assert?
- ¿Qué cambio en la app haría fallar ese test?

Antes de la revisión, explíquense los tests entre ustedes. Cualquiera puede ser el vocero.
