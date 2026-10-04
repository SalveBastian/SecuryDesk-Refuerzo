# Plan de contingencia y reversa - SecureDesk ADSO

## Objetivo

Recuperar el servicio de forma controlada frente a un despliegue defectuoso, pérdida/corrupción de datos o incidente de seguridad, preservando evidencia y minimizando cambios no controlados.

## Activación

Se activa cuando existe indisponibilidad, errores 500 repetitivos, falla de autenticación/autorización, corrupción de datos, exposición de secretos o una migración que afecte información crítica.

## Procedimiento

1. Detener el despliegue/cambio y registrar hora.
2. Conservar logs, commit, mensajes de error y evidencia disponible.
3. Aislar la versión afectada si puede seguir causando daño.
4. Generar backup del estado actual si la base sigue accesible.
5. Identificar el último commit/tag aprobado.
6. Revertir la aplicación a esa versión.
7. Si hay daño de datos, seleccionar un backup con checksum válido.
8. Ejecutar `scripts/restore.sh <backup.dump>`.
9. Verificar conteos y registros relevantes.
10. Ejecutar `/health` y pruebas mínimas 401, 403, 200/201.
11. Revisar logs de acceso y eventos de seguridad.
12. Registrar tiempos para comparar con RTO 30 min y timestamp del backup para RPO 24 h.
13. Documentar causa raíz, corrección y acción preventiva.

## Reversa de código

La reversa debe apuntar al último commit/tag conocido como estable. No se recomienda corregir directamente en producción sin reproducir el problema y validar pruebas.

## Criterios de cierre

- `/health` devuelve 200.
- Autenticación y RBAC conservan resultados esperados.
- Los datos críticos existen tras restauración.
- No hay secretos ni stacks internos en respuestas.
- No persisten errores críticos repetitivos.
- El incidente y la recuperación quedan documentados.
