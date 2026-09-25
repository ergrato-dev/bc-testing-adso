package dev.ergrato.museo;

import java.time.Year;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Reglas de negocio de las piezas del museo.
 * No sabe nada de HTTP: el controlador traduce sus excepciones a códigos de estado.
 */
@Service
public class PiecesService {

    public static class ValidationException extends RuntimeException {
        public ValidationException(String message) { super(message); }
    }

    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String message) { super(message); }
    }

    private static final Logger log = LoggerFactory.getLogger(PiecesService.class);

    private final PieceRepository repository;
    private final Notifier notifier;

    public PiecesService(PieceRepository repository, Notifier notifier) {
        this.repository = repository;
        this.notifier = notifier;
    }

    public static Piece validate(PieceRequest request, int currentYear) {
        if (request.name() == null || request.name().isBlank()) {
            throw new ValidationException("name is required");
        }
        if (request.artist() == null || request.artist().isBlank()) {
            throw new ValidationException("artist is required");
        }
        if (request.year() == null) {
            throw new ValidationException("year must be an integer");
        }
        if (request.year() > currentYear) {
            throw new ValidationException("year cannot be in the future");
        }
        return new Piece(request.name().strip(), request.artist().strip(), request.year());
    }

    public List<Piece> list() {
        return repository.findAll();
    }

    public Piece get(long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("piece not found"));
    }

    public Piece create(PieceRequest request) {
        Piece piece = repository.save(validate(request, Year.now().getValue()));
        // Si la notificación falla, la pieza ya quedó guardada: se registra el error y se sigue
        try {
            notifier.pieceCreated(piece);
        } catch (RuntimeException ex) {
            log.warn("No se pudo notificar la pieza {}: {}", piece.getId(), ex.getMessage());
        }
        return piece;
    }

    public void remove(long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("piece not found");
        }
        repository.deleteById(id);
    }
}
