package dev.ergrato.museo;

/**
 * Avisa que se registró una pieza. En los tests se reemplaza por un doble de prueba (semana 5).
 */
public interface Notifier {

    void pieceCreated(Piece piece);
}
