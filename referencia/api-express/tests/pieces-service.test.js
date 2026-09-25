import { describe, expect, it } from 'vitest';
import { createPiecesService, NotFoundError, validatePiece, ValidationError } from '../src/pieces-service.js';
import { createMemoryRepository } from './memory-repository.js';

describe('validatePiece', () => {
  it('should return trimmed data when piece is valid', () => {
    // Arrange
    const data = { name: '  Guernica ', artist: 'Picasso', year: 1937 };

    // Act
    const piece = validatePiece(data, 2026);

    // Assert
    expect(piece).toEqual({ name: 'Guernica', artist: 'Picasso', year: 1937 });
  });

  it.each([
    [{ artist: 'Picasso', year: 1937 }, 'name is required'],
    [{ name: 'Guernica', artist: '  ', year: 1937 }, 'artist is required'],
    [{ name: 'Guernica', artist: 'Picasso', year: '1937' }, 'year must be an integer'],
    [{ name: 'Future', artist: 'Nobody', year: 2027 }, 'year cannot be in the future'],
  ])('should throw ValidationError when data is %o', (data, message) => {
    expect(() => validatePiece(data, 2026)).toThrow(new ValidationError(message));
  });
});

describe('createPiecesService', () => {
  it('should throw NotFoundError when getting a missing piece', async () => {
    const service = createPiecesService(createMemoryRepository(), null); // dummy: este test no crea piezas

    await expect(service.get(99)).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when removing a missing piece', async () => {
    const service = createPiecesService(createMemoryRepository(), null); // dummy: este test no crea piezas

    await expect(service.remove(99)).rejects.toThrow(NotFoundError);
  });
});
