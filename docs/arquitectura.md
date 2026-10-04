# Arquitectura de SecureDesk ADSO

## Vista general

SecureDesk ADSO es una aplicación web académica para registrar y consultar incidentes de seguridad. Está separada en tres componentes principales:

1. **Frontend estático**: HTML, CSS y JavaScript. Presenta login, menú condicionado por rol y consulta de incidentes.
2. **API REST**: Node.js + Express. Aplica autenticación JWT, autorización RBAC, validación, sanitización, rate limit, logging y manejo de errores.
3. **Base de datos**: PostgreSQL administrado mediante Prisma ORM. Persiste usuarios e incidentes.

## Flujo de autenticación

1. El usuario envía correo y contraseña a `POST /auth/login`.
2. Zod valida formato y longitud antes del controlador.
3. El controlador busca el usuario activo y compara la contraseña contra `passwordHash` usando Bcrypt.
4. Si la comparación es válida se firma un JWT HS256 con vida útil limitada.
5. En cada ruta protegida, `authenticate` verifica la firma y vuelve a consultar el usuario en la base de datos. Así, desactivar un usuario invalida su acceso aunque aún conserve un token no expirado.
6. `authorizeRoles()` aplica la política RBAC según la ruta.

## Fronteras de confianza

- **Navegador -> API**: entrada no confiable. Se valida, limita y autentica.
- **API -> PostgreSQL**: Prisma reduce la necesidad de construir SQL manual y mantiene tipado de modelo.
- **Variables de entorno -> aplicación**: contienen configuración sensible; `.env` nunca debe versionarse.
- **Backup -> almacenamiento**: contiene una copia completa de datos; se crea con permisos restrictivos y checksum.

## Puertos previstos

- Frontend de desarrollo: depende del servidor estático, por ejemplo 5500.
- API: 4000.
- PostgreSQL: 5432, solo accesible desde la red necesaria; no debe exponerse públicamente.

## Principio de defensa en profundidad

La seguridad no depende de un único control. Un usuario debe superar autenticación y autorización; los cuerpos se validan y sanitizan; se limita la tasa; los eventos quedan registrados; los errores internos no se devuelven al cliente; los datos sensibles se enmascaran por rol; y existe un procedimiento de recuperación si el sistema falla.
