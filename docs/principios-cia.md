# Principios de confidencialidad, integridad y disponibilidad

## Confidencialidad

SecureDesk limita quién puede ver o ejecutar operaciones sensibles. La API verifica JWT y rol en el servidor; el correo del reportero se enmascara para `ANALISTA` y `CONSULTA`; las contraseñas se almacenan como hashes Bcrypt; los secretos viven en variables de entorno y `.env` está excluido de Git; y los backups se crean con `umask 077` para restringir permisos por defecto.

**Riesgos relacionados:** exposición de credenciales, fuga de datos personales, acceso administrativo no autorizado.

## Integridad

Zod valida estructura, longitudes y enumeraciones; la sanitización elimina etiquetas/controles antes de persistir; Prisma impone el modelo de datos; la restauración puede verificar un checksum SHA-256 del backup; y el flujo de CI ejecuta pruebas antes de considerar la evidencia correcta.

**Riesgos relacionados:** payloads malformados, alteración de datos, restauración desde un archivo dañado.

## Disponibilidad

Se usa rate limiting general y específico para login, existe `GET /health` para comprobación rápida, el servidor implementa cierre controlado de conexiones, y el plan de continuidad define backup, restauración, RTO/RPO y reversa.

**Riesgos relacionados:** abuso de peticiones, fallos de despliegue, pérdida/corrupción de datos.

## Relación entre los tres principios

Un control puede favorecer más de un objetivo. Por ejemplo, desactivar una cuenta comprometida protege confidencialidad e integridad; un backup mejora disponibilidad, pero debe mantenerse confidencial; y los logs apoyan integridad y trazabilidad sin convertirse en una fuente de exposición. Por eso se usa defensa en profundidad y no un único mecanismo.
