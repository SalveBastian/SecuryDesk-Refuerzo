# Checklist de preproducción

Estado preparado para la versión 1.0 del plan de mejoramiento.

| # | Verificación | Criterio de aprobación | Estado |
| --- | --- | --- | --- |
| 1 | Estructura frontend/backend separada | Carpetas y responsabilidades diferenciadas | APROBADO |
| 2 | `.env` fuera del repositorio | `git check-ignore backend/.env` | APROBADO |
| 3 | `.env.example` sin secretos reales | Solo plantilla/laboratorio | APROBADO |
| 4 | JWT secret mínimo | La aplicación exige >= 32 caracteres | APROBADO |
| 5 | Hash de contraseña | Seed usa Bcrypt costo 12 | APROBADO |
| 6 | Autenticación | Rutas protegidas usan `authenticate` | APROBADO |
| 7 | RBAC | Backend valida roles por endpoint | APROBADO |
| 8 | Validación | Zod limita formato/longitud/enumeraciones | APROBADO |
| 9 | Sanitización | Strings pasan por `sanitizeBody` al crear incidente | APROBADO |
| 10 | Rate limit | General + login | APROBADO |
| 11 | Cabeceras | Helmet habilitado | APROBADO |
| 12 | Errores | 404 controlado y 500 genérico | APROBADO |
| 13 | Logging | Morgan + eventos estructurados de seguridad | APROBADO |
| 14 | Datos sensibles | Masking de correo según rol | APROBADO |
| 15 | Gestión de cuenta | ADMIN puede activar/desactivar | APROBADO |
| 16 | Backup | Script custom-format, no vacío, checksum | IMPLEMENTADO / CI REPRODUCIBLE |
| 17 | Restore | Verifica checksum y restaura con pg_restore | IMPLEMENTADO / CI REPRODUCIBLE |
| 18 | RTO/RPO | Objetivos y procedimiento documentados | APROBADO |
| 19 | Reversa | Plan paso a paso | APROBADO |
| 20 | Pruebas unitarias | Suite local aprobada | APROBADO |
| 21 | Pruebas HTTP/DB | Workflow automatizado | LISTO PARA EJECUTAR EN GITHUB |
| 22 | Rama `plan-mejoramiento` | Rama local creada en el commit final | APROBADO LOCAL / PENDIENTE PUSH |
| 23 | Repositorio público | URL creada por el aprendiz | CREADO; CARGA PENDIENTE DE PERMISO DE ESCRITURA |
| 24 | Video 15-20 min | Grabación del aprendiz + YouTube | REQUIERE PARTICIPACIÓN DEL APRENDIZ |
| 25 | Sustentación | Demostración individual | REQUIERE PARTICIPACIÓN DEL APRENDIZ |

## Decisión técnica

El código y la documentación están preparados para una verificación reproducible. No se declara la entrega institucional completamente cerrada hasta que el código se publique en el repositorio creado, el workflow de integración se ejecute y el aprendiz agregue el enlace del video. Esos puntos dependen de permisos o participación personal externa al código.
