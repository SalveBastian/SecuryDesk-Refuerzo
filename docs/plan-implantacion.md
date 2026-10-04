# Plan de implantación segura

## Precondiciones

- Código revisado y pruebas locales aprobadas.
- Variables de entorno configuradas fuera del repositorio.
- PostgreSQL accesible solo desde la red autorizada.
- Backup previo al despliegue relevante.
- Commit/tag de la versión a desplegar identificado.

## Secuencia

1. Crear backup y checksum.
2. Registrar commit y hora de inicio.
3. Instalar dependencias desde el repositorio.
4. Generar Prisma Client y aplicar esquema/migraciones.
5. Iniciar API con variables del ambiente.
6. Ejecutar `/health`.
7. Probar login y RBAC: 401, 403, 200.
8. Probar creación válida e inválida de incidente.
9. Revisar logs y ausencia de trazas sensibles.
10. Validar masking para roles no ADMIN.
11. Confirmar que los usuarios administrativos funcionan.
12. Registrar resultado del checklist.

## Criterios de rollback

Se revierte si falla alguno de estos criterios: API no inicia; `/health` no responde 200; autenticación/RBAC deja pasar operaciones no autorizadas; existe pérdida/corrupción de datos; errores 500 repetitivos; secretos aparecen en salida; o la migración rompe datos indispensables.

## Post-despliegue

- Monitorear logs iniciales.
- Conservar evidencia del commit y pruebas.
- Confirmar backup posterior cuando corresponda.
- Registrar hallazgos y acciones correctivas.
