"""Notificador de ejemplo: avisa que se registró una pieza.

En un proyecto real enviaría un correo o llamaría a un servicio externo.
En los tests se reemplaza por un doble de prueba (semana 5).
"""


class LogNotifier:
    def piece_created(self, piece: dict) -> None:
        print(f"Nueva pieza registrada: {piece['name']}")
