package dev.ergrato.museo;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pieces")
public class PiecesController {

    private final PiecesService service;

    public PiecesController(PiecesService service) {
        this.service = service;
    }

    @GetMapping
    public List<Piece> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Piece get(@PathVariable long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Piece create(@RequestBody PieceRequest request) {
        return service.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        service.remove(id);
    }

    // Traduce los errores del servicio a códigos HTTP
    @ExceptionHandler(PiecesService.ValidationException.class)
    ResponseEntity<Map<String, String>> handleValidation(RuntimeException ex) {
        return ResponseEntity.unprocessableContent().body(Map.of("detail", ex.getMessage()));
    }

    @ExceptionHandler(PiecesService.NotFoundException.class)
    ResponseEntity<Map<String, String>> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("detail", ex.getMessage()));
    }
}
