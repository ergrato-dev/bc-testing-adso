import { useEffect, useState } from 'react';
import { createPiece, fetchPieces } from './api.js';
import PieceForm from './PieceForm.jsx';

export default function App() {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPieces()
      .then(setPieces, (err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(piece) {
    const created = await createPiece(piece);
    setPieces((current) => [...current, created]);
  }

  return (
    <main>
      <h1>Museo</h1>
      {error && <p role="alert">{error}</p>}
      {loading && <p>Cargando piezas…</p>}
      {!loading && !error && pieces.length === 0 && <p>Aún no hay piezas registradas.</p>}
      {pieces.length > 0 && (
        <ul aria-label="Piezas">
          {pieces.map((piece) => (
            <li key={piece.id}>
              {piece.name} — {piece.artist} ({piece.year})
            </li>
          ))}
        </ul>
      )}
      <PieceForm onSubmit={handleCreate} />
    </main>
  );
}
