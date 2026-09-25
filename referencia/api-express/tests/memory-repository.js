// Repositorio falso (fake) en memoria: mismo contrato que el de BD,
// sin necesidad de Docker. Se usa en los tests unitarios y de API.
export function createMemoryRepository(initial = []) {
  const pieces = new Map(initial.map((piece) => [piece.id, piece]));
  let nextId = Math.max(0, ...pieces.keys()) + 1;

  return {
    findAll: async () => [...pieces.values()],
    findById: async (id) => pieces.get(id) ?? null,
    async create(data) {
      const piece = { id: nextId++, ...data };
      pieces.set(piece.id, piece);
      return piece;
    },
    delete: async (id) => pieces.delete(id),
  };
}
