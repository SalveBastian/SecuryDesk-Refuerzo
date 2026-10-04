# Controles preventivos, detectivos y correctivos

## Preventivos

- JWT firmado con HS256 y expiración limitada.
- Reconsulta del usuario en cada petición protegida para comprobar que siga activo.
- RBAC en backend (`ADMIN`, `ANALISTA`, `CONSULTA`).
- Bcrypt con factor de costo 12 en el seed de laboratorio.
- Zod para validar login, incidentes e IDs.
- Sanitización recursiva de strings.
- Helmet para cabeceras HTTP defensivas.
- CORS configurable por ambiente.
- Límite de tamaño del cuerpo JSON a 32 KB.
- Rate limit global y límite más estricto en login.
- `.env` excluido de control de versiones.
- El correo del reportero se obtiene del usuario autenticado y no del body del cliente.

## Detectivos

- Morgan registra método, ruta, código de estado, agente y datos de acceso del formato `combined`.
- `securityLogger` registra eventos de autenticación, autorización, creación de incidentes y cambios de estado de usuarios sin incluir password/token.
- Health check permite detectar indisponibilidad.
- GitHub Actions conserva resultados de pruebas como artefactos reproducibles.

## Correctivos

- Endpoints ADMIN para activar/desactivar cuentas.
- Backup PostgreSQL con checksum SHA-256 y permisos restrictivos.
- Restauración con `pg_restore --clean --if-exists`.
- Plan de reversa al último commit/tag verificado.
- Manejador centralizado de errores devuelve mensajes seguros al cliente y conserva información operativa en logs.

Cada control está asociado a un riesgo de la matriz y tiene una prueba o mecanismo reproducible descrito en `docs/pruebas-seguridad.md`.
