package dev.ergrato.museo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class PiecesServiceTest {

    @Test
    @DisplayName("should return trimmed piece when request is valid")
    void shouldReturnTrimmedPieceWhenRequestIsValid() {
        // Arrange
        var request = new PieceRequest("  Guernica ", "Picasso", 1937);

        // Act
        Piece piece = PiecesService.validate(request, 2026);

        // Assert
        assertThat(piece.getName()).isEqualTo("Guernica");
        assertThat(piece.getYear()).isEqualTo(1937);
    }

    @Test
    @DisplayName("should throw ValidationException when year is in the future")
    void shouldThrowWhenYearIsInTheFuture() {
        var request = new PieceRequest("Future", "Nobody", 2027);

        assertThatThrownBy(() -> PiecesService.validate(request, 2026))
                .isInstanceOf(PiecesService.ValidationException.class)
                .hasMessageContaining("future");
    }
}
