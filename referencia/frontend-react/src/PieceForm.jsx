import { useState } from 'react';

// Formulario de registro de piezas. Valida en el cliente y delega el envío en onSubmit.
export default function PieceForm({ onSubmit }) {
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const piece = {
      name: form.get('name').trim(),
      artist: form.get('artist').trim(),
      year: Number(form.get('year')),
    };

    if (!piece.name) return setError('El nombre es obligatorio');
    if (!piece.artist) return setError('El artista es obligatorio');

    setError('');
    try {
      await onSubmit(piece);
      event.target.reset();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Nueva pieza">
      <label>
        Nombre
        <input name="name" />
      </label>
      <label>
        Artista
        <input name="artist" />
      </label>
      <label>
        Año
        <input name="year" type="number" required />
      </label>
      <button type="submit">Guardar</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
