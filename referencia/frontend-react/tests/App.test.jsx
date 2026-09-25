import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App.jsx';
import { createPiece, fetchPieces } from '../src/api.js';

// Reemplaza el cliente HTTP: App se prueba sin backend (más en la semana 5)
vi.mock('../src/api.js');

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should list the pieces returned by the API', async () => {
    fetchPieces.mockResolvedValue([{ id: 1, name: 'Guernica', artist: 'Picasso', year: 1937 }]);

    render(<App />);

    expect(await screen.findByText('Guernica — Picasso (1937)')).toBeInTheDocument();
  });

  it('should show an error when pieces cannot be loaded', async () => {
    fetchPieces.mockRejectedValue(new Error('No se pudieron cargar las piezas'));

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar las piezas');
  });

  it('should add the created piece to the list after saving the form', async () => {
    const user = userEvent.setup();
    fetchPieces.mockResolvedValue([]);
    createPiece.mockResolvedValue({ id: 2, name: 'Las meninas', artist: 'Velázquez', year: 1656 });
    render(<App />);

    await user.type(screen.getByLabelText('Nombre'), 'Las meninas');
    await user.type(screen.getByLabelText('Artista'), 'Velázquez');
    await user.type(screen.getByLabelText('Año'), '1656');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Las meninas — Velázquez (1656)')).toBeInTheDocument();
  });
});
