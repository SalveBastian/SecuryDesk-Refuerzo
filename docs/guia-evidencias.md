# Guía de evidencias reales

Este archivo define qué debe capturarse para el dossier. La evidencia debe proceder de una ejecución real del proyecto o de GitHub Actions; no se deben presentar imágenes simuladas como si fueran ejecuciones reales.

## Práctica 1

- Árbol del repositorio mostrando `backend/`, `frontend/`, `docs/` y `.env.example`.
- `backend/src/server.js` y `backend/src/app.js`.
- Salida real de `GET /health` con `200`.

## Práctica 2

- `docs/matriz-riesgos.md`.
- `.gitignore` demostrando que `.env` no se versiona.
- `.env.example` sin secretos reales.

## Práctica 3

- `authenticate.js` y `authorizeRoles.js`.
- Evidencias reales: 401 sin JWT, 403 con CONSULTA en ruta ADMIN, 200 con ADMIN.
- Frontend mostrando opciones por rol.

## Práctica 4

- `validate.js`, `errorHandler.js` y configuración del rate limit.
- 400 con body inválido.
- 429 por exceso de solicitudes.
- 404 para ruta inexistente.
- Línea real de Morgan en logs.

## Práctica 5

- `incidents.routes.js`, `incidents.controller.js` y `schema.prisma`.
- 403 cuando CONSULTA intenta crear.
- 201 cuando ANALISTA crea un incidente válido.
- Texto con etiquetas sanitizado antes de persistir.
- GET con CONSULTA mostrando correo enmascarado.
- GET con ADMIN mostrando correo completo.

## Práctica 6

- Endpoints de activación/desactivación de usuarios.
- Backup `.dump` real y no vacío.
- Restauración real con `pg_restore`.
- Validación posterior de registros.
- `docs/plan-contingencia.md`.
