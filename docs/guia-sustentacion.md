# Preparación para la sustentación individual

La sustentación debe hacerla personalmente el aprendiz. Esta guía solo prepara las respuestas y demostraciones.

## Preguntas probables

### ¿Por qué ocultar botones en frontend no es autorización?
Porque un cliente puede llamar directamente a la API. La autorización efectiva está en `authorizeRoles()` del backend.

### ¿Qué diferencia hay entre 401 y 403?
401 significa que no hay una autenticación válida. 403 significa que la identidad está autenticada pero no posee el permiso requerido.

### ¿Por qué Bcrypt y no guardar el password cifrado reversible?
Para autenticación no se necesita recuperar la contraseña. Se compara contra un hash costoso y salteado, reduciendo impacto de una fuga de base de datos.

### ¿Qué ocurre si se desactiva un usuario con un JWT aún vigente?
`authenticate` verifica el JWT y después consulta al usuario; si está inactivo responde 401. Por eso la cuenta puede bloquearse sin esperar a la expiración del token.

### ¿Cómo se evita suplantar el correo del reportero?
El endpoint de creación no acepta `reporterEmail`; usa `req.user.email` después de autenticar.

### ¿Qué demuestra un 429?
Que el limitador está rechazando exceso de solicitudes dentro de la ventana configurada, reduciendo abuso básico y fuerza bruta.

### ¿Cómo se restaura un backup?
Se valida que el archivo exista, se verifica SHA-256 si está presente y se ejecuta `pg_restore --clean --if-exists --no-owner --no-acl --dbname=... backup.dump`. Después se verifican conteos y pruebas funcionales.

### ¿Qué son RTO y RPO en este proyecto?
RTO es el tiempo objetivo para recuperar servicio: 30 minutos. RPO es la máxima ventana de datos que se acepta perder: 24 horas con backup diario, menor si se hace backup predespliegue.

### Si te piden cambiar una ruta para que CONSULTA pueda crear incidentes, ¿qué cambiarías?
Técnicamente se añadiría `CONSULTA` a `authorizeRoles` de POST, pero primero se justificaría el cambio de política y se actualizarían matriz, pruebas y documentación. No basta modificar el frontend.

## Demostraciones que debes poder repetir

- Login por cada rol.
- 401/403/200.
- 400 de Zod.
- Sanitización.
- Masking por rol.
- 429.
- Activar/desactivar usuario.
- Ejecutar backup/restore y explicar checksum.
- Ubicar cada control en el código.
