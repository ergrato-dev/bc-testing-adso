package dev.ergrato.museo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Notificador de ejemplo. En un proyecto real enviaría un correo o llamaría a un servicio externo.
 */
@Component
public class LogNotifier implements Notifier {

    private static final Logger log = LoggerFactory.getLogger(LogNotifier.class);

    @Override
    public void pieceCreated(Piece piece) {
        log.info("Nueva pieza registrada: {}", piece.getName());
    }
}
