# Glosario — Semana 3

**Accesibilidad (a11y)**: que la interfaz pueda usarse con tecnologías de asistencia, como lectores de pantalla. Las queries accesibles de Testing Library dependen de ella.

**`findBy…`**: variante de query que espera a que el elemento aparezca (1 segundo por defecto). Devuelve una promesa: se usa con `await`.

**`getBy…`**: variante de query que devuelve el elemento o lanza un error si no existe. Para elementos que deben estar ya en pantalla.

**jest-dom**: librería de matchers para el DOM (`toBeInTheDocument`, `toHaveValue`…). Funciona con Vitest a través de `@testing-library/jest-dom/vitest`.

**jsdom**: implementación del DOM en JavaScript que permite renderizar componentes sin navegador.

**`MemoryRouter`**: router de React Router que guarda la ruta en memoria. Se usa en tests de componentes con navegación.

**Nombre accesible**: el nombre con el que una tecnología de asistencia anuncia un elemento: el texto de un botón, la etiqueta de un campo o un `aria-label`.

**Proveedor (provider)**: componente que entrega un contexto a sus hijos (`AuthContext.Provider`). En los tests se envuelve el componente con un valor controlado.

**Query**: función de Testing Library para encontrar elementos: `getByRole`, `getByLabelText`, `getByText`…

**`queryBy…`**: variante de query que devuelve `null` si el elemento no existe. Para verificar ausencias.

**React Testing Library (RTL)**: librería para probar componentes React desde la perspectiva de la persona usuaria.

**Renderizado condicional**: mostrar u ocultar partes de la interfaz según el estado (cargando, vacío, error).

**Rol (ARIA)**: tipo de elemento según las tecnologías de asistencia: `button`, `textbox`, `list`, `alert`… Es el criterio principal de `getByRole`.

**Snapshot**: copia guardada de la salida de un componente que se compara en cada ejecución. Frágil si es grande.

**user-event**: librería que simula interacciones de una persona real (escribir, hacer clic, tabular) con la secuencia completa de eventos.

**`vi.fn()`**: función simulada de Vitest que registra sus llamadas. Se usa para callbacks como `onSubmit`.

**`within`**: función que limita las queries a una parte de la pantalla, por ejemplo una lista o una fila.
