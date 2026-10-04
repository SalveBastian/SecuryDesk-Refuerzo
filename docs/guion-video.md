# Guion técnico para video obligatorio (15 a 20 minutos)

> Este guion prepara todo el contenido. La grabación y narración deben realizarlas personalmente Maicol Andres Ospina, porque la actividad exige que el aprendiz explique el proyecto.

## 0:00 - 1:00 | Presentación y problema

- Nombre, identificación 1032180362, ficha 3229209.
- Competencia: Seguridad informática.
- Explicar que SecureDesk registra incidentes y se usa para demostrar una implantación segura.
- Mostrar el README y la URL del repositorio.

## 1:00 - 3:00 | Arquitectura y superficie de ataque

- Mostrar `frontend/`, `backend/`, `docs/` y `evidencia/`.
- Abrir `docs/arquitectura.md`.
- Explicar navegador -> API -> PostgreSQL y las fronteras de confianza.
- Mencionar activos: código, secretos, BD, backups, logs y cuentas ADMIN.

## 3:00 - 6:00 | Autenticación y autorización

- Abrir `auth.controller.js`, `authenticate.js` y `authorizeRoles.js`.
- Explicar Bcrypt y JWT.
- Señalar expiración, HS256 y reconsulta de usuario activo.
- Mostrar rutas ADMIN e incidents.
- Ejecutar/demostrar 401 sin token, 403 con CONSULTA y 200 con ADMIN.

## 6:00 - 9:00 | Validación, sanitización y datos sensibles

- Abrir validators y `sanitize.js`.
- Explicar Zod, límites de longitud y enum de severidad.
- Mostrar que el email del reportero sale de `req.user.email`.
- Ejecutar body inválido -> 400.
- Crear incidente con etiquetas -> 201; demostrar que se almacenó sanitizado.
- Listar como CONSULTA y ADMIN para comparar masking.

## 9:00 - 11:30 | Controles de plataforma y trazabilidad

- Abrir `app.js`.
- Mostrar Helmet, CORS, body limit, rate limit, Morgan.
- Abrir `securityLogger.js` y explicar qué registra y qué evita registrar.
- Mostrar 404 seguro y 429.
- Revisar una línea de log.

## 11:30 - 14:00 | Usuarios, backup y restore

- Mostrar endpoints de usuarios y autorización ADMIN.
- Abrir `backup.sh` y `restore.sh`.
- Explicar formato custom, permisos 600 y checksum SHA-256.
- Mostrar evidencia de backup no vacío y la prueba daño/restauración del workflow.

## 14:00 - 16:00 | Continuidad, RTO/RPO y reversa

- Abrir `docs/continuidad-rto-rpo.md`.
- Explicar RTO 30 min y RPO 24 h como objetivos académicos.
- Abrir `docs/plan-contingencia.md` y explicar rollback al último commit verificado.

## 16:00 - 18:00 | Pruebas, checklist y hallazgos

- Ejecutar `cd backend && npm test` o mostrar el job de GitHub Actions.
- Mostrar `docs/checklist-preproduccion.md`.
- Mostrar `docs/hallazgos-correcciones.md` y explicar al menos tres correcciones: email derivado del usuario, JWT estricto y checksum de backup.

## 18:00 - 19:30 | Riesgos pendientes y cierre

- MFA no implementado.
- No hay denylist individual de JWT.
- Backups deben cifrarse externamente en producción.
- No se realizó pentest externo.
- Concluir cómo los controles se relacionan con confidencialidad, integridad y disponibilidad.

## Reglas para la grabación

- Mostrar código y terminal; no leer diapositivas durante 15 minutos.
- Mantener visibles los resultados de cada prueba unos segundos.
- No mostrar `.env`, JWT reales, contraseñas personales ni tokens.
- Si una prueba falla, explicar el error y corregirlo antes de publicar.
- YouTube: público u oculto; comprobar el enlace en ventana privada antes de entregar.
