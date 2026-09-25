// Reglas de negocio de las piezas del museo.
// No sabe nada de HTTP ni de la BD: recibe un repositorio por parámetro,
// así se puede probar con un repositorio en memoria (semanas 2 y 5).

export class ValidationError extends Error {}
export class NotFoundError extends Error {}

export function validatePiece(data, currentYear = new Date().getFullYear()) {
  if (typeof data?.name !== 'string' || data.name.trim() === '') {
    throw new ValidationError('name is required');
  }
  if (typeof data.artist !== 'string' || data.artist.trim() === '') {
    throw new ValidationError('artist is required');
  }
  if (!Number.isInteger(data.year)) {
    throw new ValidationError('year must be an integer');
  }
  if (data.year > currentYear) {
    throw new ValidationError('year cannot be in the future');
  }
  return { name: data.name.trim(), artist: data.artist.trim(), year: data.year };
}

export function createPiecesService(repository) {
  return {
    list: () => repository.findAll(),

    async get(id) {
      const piece = await repository.findById(id);
      if (!piece) throw new NotFoundError('piece not found');
      return piece;
    },

    create: (data) => repository.create(validatePiece(data)),

    async remove(id) {
      const deleted = await repository.delete(id);
      if (!deleted) throw new NotFoundError('piece not found');
    },
  };
}
