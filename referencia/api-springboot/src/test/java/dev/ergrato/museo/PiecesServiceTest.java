package dev.ergrato.museo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PiecesServiceTest {

    @Mock
    private PieceRepository repository;

    @InjectMocks
    private PiecesService service;

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

    @ParameterizedTest(name = "{3}")
    @DisplayName("should throw ValidationException when data is invalid")
    @CsvSource(nullValues = "null", value = {
        "' ', Picasso, 1937, name is required",
        "Guernica, null, 1937, artist is required",
        "Guernica, Picasso, null, year must be an integer",
    })
    void shouldThrowWhenDataIsInvalid(String name, String artist, Integer year, String message) {
        var request = new PieceRequest(name, artist, year);

        assertThatThrownBy(() -> PiecesService.validate(request, 2026))
                .isInstanceOf(PiecesService.ValidationException.class)
                .hasMessage(message);
    }

    @Test
    @DisplayName("should return the piece when it exists")
    void shouldReturnThePieceWhenItExists() {
        var guernica = new Piece("Guernica", "Picasso", 1937);
        when(repository.findById(1L)).thenReturn(Optional.of(guernica));

        assertThat(service.get(1L)).isSameAs(guernica);
    }

    @Test
    @DisplayName("should throw NotFoundException when getting a missing piece")
    void shouldThrowWhenGettingAMissingPiece() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.get(99L)).isInstanceOf(PiecesService.NotFoundException.class);
    }

    @Test
    @DisplayName("should delete the piece when it exists")
    void shouldDeleteThePieceWhenItExists() {
        when(repository.existsById(1L)).thenReturn(true);

        service.remove(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    @DisplayName("should throw NotFoundException when removing a missing piece")
    void shouldThrowWhenRemovingAMissingPiece() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.remove(99L)).isInstanceOf(PiecesService.NotFoundException.class);
    }
}
