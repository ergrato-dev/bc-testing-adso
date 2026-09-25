// Notificador de ejemplo: avisa que se registró una pieza. En un proyecto real
// enviaría un correo o llamaría a un servicio externo. En los tests se reemplaza
// por un doble de prueba (semana 5).
export function createLogNotifier() {
  return {
    async pieceCreated(piece) {
      console.log(`Nueva pieza registrada: ${piece.name}`);
    },
  };
}
