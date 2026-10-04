# Consolidación de clases 1 a 8

| Clase | Enfoque consolidado | Evidencia principal |
| --- | --- | --- |
| 1 | Base técnica, arquitectura, activos y configuración | estructura, `/health`, `.env.example` |
| 2 | Amenazas, vulnerabilidades y matriz de riesgos | `docs/matriz-riesgos.md` |
| 3 | Autenticación, Bcrypt, JWT y RBAC | auth middleware, roles, 401/403/200 |
| 4 | Controles preventivos/detectivos/correctivos | Zod, sanitización, rate limit, Helmet, logs, error handler |
| 5 | Protección integral del módulo de incidentes | rutas por rol, Prisma, masking, sanitización |
| 6 | Usuarios, backup, restore y reversa | gestión ADMIN, scripts y plan de contingencia |
| 7 | Continuidad y criterios de implantación | RTO/RPO, plan de implantación y rollback |
| 8 | Verificación preproducción y mejora | checklist, hallazgos/correcciones, pruebas reproducibles |

La práctica integradora reúne estos controles en SecureDesk ADSO y busca demostrar no solo que el código existe, sino que cada control responde a un riesgo identificado y puede verificarse mediante prueba o inspección reproducible.
