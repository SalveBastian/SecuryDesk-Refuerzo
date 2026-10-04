# Continuidad, RTO y RPO

## Objetivos

Para el entorno académico de SecureDesk se definen los siguientes objetivos, no como garantía contractual sino como meta de recuperación verificable:

- **RTO (Recovery Time Objective): 30 minutos.** El servicio debería volver a estar disponible dentro de 30 minutos desde la decisión de recuperación. La secuencia prevista es detener el cambio, seleccionar versión estable, restaurar datos si aplica, iniciar API y ejecutar health/security checks.
- **RPO (Recovery Point Objective): 24 horas.** La pérdida máxima aceptada es de un día de información cuando se usa un backup diario. Antes de un despliegue relevante se recomienda un backup adicional, reduciendo el RPO práctico al momento inmediatamente anterior al cambio.

## Estrategia de backup

- Formato `pg_dump --format=custom`.
- `--no-owner --no-acl` para facilitar restauración controlada en otro entorno.
- `umask 077` y `chmod 600` para reducir exposición local.
- SHA-256 adjunto para detectar corrupción accidental.
- Retención configurable mediante `BACKUP_RETENTION_DAYS`.
- En producción, el backup debe almacenarse cifrado, fuera del host principal y con permisos mínimos.

## Prueba de restauración

El workflow de evidencia crea un backup, obtiene el conteo de incidentes, elimina los incidentes de forma controlada, restaura el dump y compara el conteo posterior con el original. La prueba falla si el backup está vacío o si el conteo no se recupera.

## Métricas a registrar

- Hora de inicio del incidente.
- Hora de decisión de reversa/restauración.
- Hora en que `/health` vuelve a 200.
- Hora en que finalizan 401/403/200/201 de comprobación.
- Timestamp del último backup válido.

Estas métricas permiten comprobar si RTO y RPO se cumplen en una demostración futura.
