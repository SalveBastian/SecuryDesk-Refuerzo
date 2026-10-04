# Matriz de riesgos - SecureDesk ADSO

Escala usada: impacto y probabilidad cualitativos. Riesgo = combinación razonada de ambas variables para priorizar controles.

| ID | Activo | Amenaza | Vulnerabilidad | Impacto | Prob. | Riesgo inicial | Control | Riesgo residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | JWT / secretos | Robo de credenciales | Secreto débil o versionado | Alto | Media | Alto | Variables de entorno, mínimo 32 caracteres, `.gitignore`, rotación | Bajo/Medio |
| R-02 | API | Acceso no autorizado | Rutas sin control por rol | Alto | Alta | Crítico | JWT + RBAC backend + reconsulta de usuario activo | Bajo |
| R-03 | Entradas API | Datos maliciosos | Body sin validar/sanear | Alto | Media | Alto | Zod + sanitización + límite de body | Bajo |
| R-04 | Disponibilidad | Abuso/fuerza bruta | Sin límite de tasa | Medio | Alta | Alto | Rate limit general + login | Medio |
| R-05 | Logs | Falta de trazabilidad | Eventos relevantes no registrados | Medio | Media | Medio | Morgan + logger de seguridad estructurado | Bajo |
| R-06 | Base de datos | Pérdida/corrupción | Backup inexistente/no probado | Crítico | Media | Crítico | pg_dump + checksum + restore automatizado | Medio |
| R-07 | Datos sensibles | Exposición de correo | Misma respuesta para todos los roles | Medio | Media | Medio | Enmascaramiento para no-ADMIN | Bajo |
| R-08 | Usuarios | Cuenta comprometida | Sin mecanismo de desactivación | Alto | Media | Alto | Activar/desactivar por ADMIN + comprobación de `active` por request | Bajo |
| R-09 | Errores | Fuga de información | Stack/error interno al cliente | Medio | Media | Medio | Error handler genérico 500 | Bajo |
| R-10 | Backup | Exposición/corrupción | Permisos débiles / sin integridad | Alto | Media | Alto | umask 077, chmod 600, SHA-256; cifrado externo recomendado | Medio |
| R-11 | Reporte de incidente | Suplantación de reportero | Cliente controla `reporterEmail` | Medio | Media | Medio | Correo derivado de usuario autenticado | Bajo |
| R-12 | Despliegue | Versión defectuosa | Sin criterio de reversa | Alto | Media | Alto | Checklist, tag/commit verificado y plan de rollback | Bajo/Medio |

## Priorización

Primero se atienden R-02 y R-06 por su combinación de impacto y probabilidad. Luego R-01, R-03, R-04, R-08, R-10 y R-12. Los controles de logging, masking y errores reducen exposición y facilitan investigación. El riesgo residual nunca se asume cero: se documentan MFA, denylist de JWT, cifrado externo de backup y pentest como mejoras futuras.
