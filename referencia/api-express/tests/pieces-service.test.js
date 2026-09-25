import { describe, expect, it } from 'vitest';
import { validatePiece, ValidationError } from '../src/pieces-service.js';

describe('validatePiece', () => {
  it('should return trimmed data when piece is valid', () => {
    // Arrange
    const data = { name: '  Guernica ', artist: 'Picasso', year: 1937 };

    // Act
    const piece = validatePiece(data, 2026);

    // Assert
    expect(piece).toEqual({ name: 'Guernica', artist: 'Picasso', year: 1937 });
  });

  it('should throw ValidationError when year is in the future', () => {
    const data = { name: 'Future', artist: 'Nobody', year: 2027 };

    expect(() => validatePiece(data, 2026)).toThrow(ValidationError);
  });
});
