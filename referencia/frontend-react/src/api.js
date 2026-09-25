// Cliente HTTP del API de piezas. En los tests se reemplaza con vi.mock o MSW (semana 5).
export async function fetchPieces() {
  const res = await fetch('/api/pieces');
  if (!res.ok) throw new Error('No se pudieron cargar las piezas');
  return res.json();
}

export async function createPiece(piece) {
  const res = await fetch('/api/pieces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(piece),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.detail ?? 'No se pudo guardar la pieza');
  return body;
}
