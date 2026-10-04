# SecureDesk ADSO - Plan de Mejoramiento de Seguridad Informática

Proyecto integrador para la competencia **Seguridad informática** de la ficha **3229209**.

- **Aprendiz:** Maicol Andres Ospina
- **Identificación:** 1032180362
- **Instructor:** Gustavo Bolaños
- **Fecha de asignación:** 21 de septiembre de 2026
- **Fecha límite:** 1 de octubre de 2026, 11:59 p. m. (Colombia)
- **Repositorio:** https://github.com/MaicolIR33/SecureDesk-ADSO-3229209
- **Rama de entrega:** `plan-mejoramiento`
- **Video técnico:** pendiente de grabación/publicación por el aprendiz
- **Sustentación:** pendiente de programación con el instructor

## 1. Qué es SecureDesk

SecureDesk ADSO es una aplicación web académica para registrar y consultar incidentes de seguridad. El proyecto integra controles de implantación segura y evidencia reproducible: autenticación, autorización RBAC, hash de contraseñas, JWT, gestión de secretos, validación y sanitización de entradas, rate limiting, trazabilidad, manejo seguro de errores, protección de datos sensibles, administración de usuarios, backup/restauración, continuidad y reversa.

## 2. Arquitectura

```text
Navegador / Frontend
        |
        | HTTP JSON
        v
Node.js + Express API
  |-- Helmet / CORS / body limit / rate limit
  |-- Zod + sanitización
  |-- JWT authenticate
  |-- RBAC authorizeRoles
  |-- Morgan + securityLogger
        |
        | Prisma ORM
        v
PostgreSQL
        |
        | pg_dump / pg_restore + SHA-256
        v
Backups controlados
```

Más detalle: [`docs/arquitectura.md`](docs/arquitectura.md).

## 3. Tecnologías

- Node.js 18+
- Express 5
- PostgreSQL 16 recomendado
- Prisma ORM
- JSON Web Token (`jsonwebtoken`)
- Bcrypt (`bcryptjs`)
- Zod
- Helmet
- express-rate-limit
- Morgan
- HTML/CSS/JavaScript para frontend
- GitHub Actions para evidencia reproducible

## 4. Roles y permisos

| Rol | Permisos principales |
| --- | --- |
| `ADMIN` | Acceso administrativo, gestionar usuarios, crear/listar incidentes y ver correo completo |
| `ANALISTA` | Crear/listar incidentes; correo del reportero enmascarado en listados |
| `CONSULTA` | Solo listar incidentes; correo enmascarado |

La seguridad real se aplica en el backend. El menú del frontend es solo una ayuda de experiencia de usuario.

## 5. Endpoints

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/health` | Público |
| POST | `/auth/login` | Público + rate limit específico |
| GET | `/admin/ping` | ADMIN |
| GET | `/users` | ADMIN |
| PATCH | `/users/:id/activate` | ADMIN |
| PATCH | `/users/:id/deactivate` | ADMIN |
| POST | `/incidents` | ADMIN, ANALISTA |
| GET | `/incidents` | ADMIN, ANALISTA, CONSULTA |

## 6. Instalación local

### Requisitos

- Node.js 18 o superior.
- PostgreSQL en ejecución.
- `pg_dump`, `pg_restore` y `psql` para pruebas de continuidad.

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita `.env` localmente. Usa una base de datos propia y genera un `JWT_SECRET` aleatorio de **al menos 32 caracteres**. El archivo `.env` está ignorado por Git.

Después:

```bash
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

La API quedará disponible en `http://localhost:4000`.

### Frontend

Sirve la carpeta `frontend/` con un servidor HTTP estático. Por ejemplo, desde VS Code puede utilizarse Live Server. El frontend espera la API en `http://localhost:4000`.

## 7. Usuarios de laboratorio

El seed crea únicamente cuentas de prueba:

| Correo | Contraseña de laboratorio | Rol |
| --- | --- | --- |
| `admin@securedesk.local` | `Sena2026!` | ADMIN |
| `analista@securedesk.local` | `Sena2026!` | ANALISTA |
| `consulta@securedesk.local` | `Sena2026!` | CONSULTA |

Estas credenciales **no son apropiadas para producción** y existen solo para reproducir la actividad académica.

## 8. Pruebas locales

```bash
cd backend
npm test
npm run preproduction
```

La suite local valida RBAC, sanitización, masking, middleware de validación, manejo seguro de errores y filtrado de campos sensibles en el logger. `preproduction-check.sh` también verifica sintaxis, scripts de backup/restore, `.env` ignorado, controles críticos y documentación obligatoria.

## 9. Evidencia HTTP + PostgreSQL

El workflow [`.github/workflows/security-evidence.yml`](.github/workflows/security-evidence.yml) levanta PostgreSQL 16 desde cero y ejecuta automáticamente:

- `/health` -> 200.
- ruta ADMIN sin token -> 401.
- CONSULTA en ruta ADMIN -> 403.
- ADMIN en ruta ADMIN -> 200.
- body inválido -> 400.
- creación de incidente por CONSULTA -> 403.
- creación válida por ANALISTA -> 201.
- sanitización de HTML.
- masking de correo para CONSULTA.
- correo completo para ADMIN.
- ruta inexistente -> 404.
- gestión de usuarios solo ADMIN.
- invalidación práctica del acceso al desactivar usuario.
- exceso de peticiones -> 429.
- backup no vacío + SHA-256.
- borrado controlado de datos + restauración + verificación de conteos.
- conservación de logs como artefacto.

Los artefactos de CI se guardan durante 7 días para poder descargarlos y anexarlos como evidencia.

## 10. Backup y restauración

```bash
cd backend
export DATABASE_URL='postgresql://...'
bash scripts/backup.sh
bash scripts/restore.sh backups/securedesk_YYYYMMDDTHHMMSSZ.dump
```

El backup usa formato custom, permisos restrictivos y checksum SHA-256. La restauración verifica el checksum cuando existe.

## 11. RTO, RPO y reversa

- **RTO académico:** 30 minutos.
- **RPO académico:** 24 horas con backup diario; menor si se realiza backup predespliegue.

Documentos:

- [`docs/continuidad-rto-rpo.md`](docs/continuidad-rto-rpo.md)
- [`docs/plan-contingencia.md`](docs/plan-contingencia.md)
- [`docs/plan-implantacion.md`](docs/plan-implantacion.md)

## 12. Evidencia y documentación del plan

- [`docs/clases-1-a-8.md`](docs/clases-1-a-8.md)
- [`docs/activos-amenazas-vulnerabilidades.md`](docs/activos-amenazas-vulnerabilidades.md)
- [`docs/matriz-riesgos.md`](docs/matriz-riesgos.md)
- [`docs/principios-cia.md`](docs/principios-cia.md)
- [`docs/gestion-secretos.md`](docs/gestion-secretos.md)
- [`docs/controles-seguridad.md`](docs/controles-seguridad.md)
- [`docs/pruebas-seguridad.md`](docs/pruebas-seguridad.md)
- [`docs/checklist-preproduccion.md`](docs/checklist-preproduccion.md)
- [`docs/hallazgos-correcciones.md`](docs/hallazgos-correcciones.md)
- [`docs/referencias.md`](docs/referencias.md)
- [`docs/guion-video.md`](docs/guion-video.md)
- [`docs/guia-sustentacion.md`](docs/guia-sustentacion.md)

## 13. Riesgos residuales declarados

El proyecto no afirma seguridad absoluta. Quedan como mejoras futuras MFA, revocación individual de JWT, cifrado de backups integrado con el entorno de almacenamiento, gestión centralizada de secretos y un pentest externo. Estos límites se documentan porque una evaluación técnica debe distinguir controles implementados de capacidades aún pendientes.

## 14. Correspondencia con clases 1 a 8

1. Base técnica, arquitectura, activos y `/health`.
2. Amenazas, vulnerabilidades y matriz de riesgos.
3. Bcrypt, JWT, autenticación y RBAC.
4. Validación, sanitización, Helmet, rate limit, logs y manejo de errores.
5. Módulo de incidentes protegido de extremo a extremo.
6. Gestión de usuarios, backup, restauración y contingencia.
7. Continuidad, RTO/RPO, implantación y reversa.
8. Pruebas, checklist preproducción, hallazgos y correcciones.

## 15. Reglas de seguridad del repositorio

- No subir `.env`.
- No publicar tokens, contraseñas personales ni cadenas de conexión reales.
- No usar credenciales del seed fuera del entorno académico.
- Antes de entregar, ejecutar `npm run preproduction` y el workflow de evidencia.
- Mantener coherencia entre README, documento técnico, video y sustentación.
