# Videografía — Semana 6

- [Canal oficial de Docker en YouTube](https://www.youtube.com/@DockerInc) (en inglés): busca "Docker Compose" para ver cómo se levantan servicios como la BD de pruebas. Puedes activar los subtítulos automáticos en español.

> 💡 Práctica guiada: con la BD de pruebas levantada, conéctate a ella después de correr un test que falla (`docker compose exec postgres psql -U museo -d museo_test`, o `docker compose exec mysql mysql -umuseo -pmuseo museo_test`) y revisa con `select * from pieces` qué dejó. Con truncado verás los datos del último test; con rollback, la tabla vacía.
