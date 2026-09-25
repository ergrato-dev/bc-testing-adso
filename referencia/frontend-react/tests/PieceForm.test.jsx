import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PieceForm from '../src/PieceForm.jsx';

describe('PieceForm', () => {
  it('should call onSubmit with the piece when form is valid', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PieceForm onSubmit={onSubmit} />);

    // Act
    await user.type(screen.getByLabelText('Nombre'), 'Guernica');
    await user.type(screen.getByLabelText('Artista'), 'Picasso');
    await user.type(screen.getByLabelText('Año'), '1937');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Guernica', artist: 'Picasso', year: 1937 });
  });

  it('should show an error when name is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PieceForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Artista'), 'Picasso');
    await user.type(screen.getByLabelText('Año'), '1937');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('El nombre es obligatorio');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
