// Lógica pura del formulario: sin React, sin DOM. Se prueba con tests unitarios (semana 2).
// Devuelve el mensaje de error, o una cadena vacía si los datos son válidos.
export function validatePieceForm({ name, artist }) {
  if (!name.trim()) return 'El nombre es obligatorio';
  if (!artist.trim()) return 'El artista es obligatorio';
  return '';
}
