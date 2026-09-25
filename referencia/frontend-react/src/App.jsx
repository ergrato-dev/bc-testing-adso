import { useEffect, useState } from 'react';
import { createPiece, fetchPieces } from './api.js';
import PieceForm from './PieceForm.jsx';

export default function App() {
  const [pieces, setPieces] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPieces().then(setPieces, (err) => setError(err.message));
  }, []);

  async function handleCreate(piece) {
    const created = await createPiece(piece);
    setPieces((current) => [...current, created]);
  }

  return (
    <main>
      <h1>Museo</h1>
      {error && <p role="alert">{error}</p>}
      <ul aria-label="Piezas">
        {pieces.map((piece) => (
          <li key={piece.id}>
            {piece.name} — {piece.artist} ({piece.year})
          </li>
        ))}
      </ul>
      <PieceForm onSubmit={handleCreate} />
    </main>
  );
}
