# Activos, amenazas y vulnerabilidades

## Activos principales

| Activo | Valor para SecureDesk | Consecuencia de compromiso |
| --- | --- | --- |
| Código fuente | Implementa reglas y controles de seguridad | Introducción de fallos o puertas traseras |
| Credenciales y JWT secret | Permiten autenticar y firmar tokens | Suplantación de usuarios y sesiones |
| Base de datos | Contiene usuarios e incidentes | Pérdida, alteración o exposición de información |
| Backups | Copia recuperable de la base de datos | Exposición masiva o imposibilidad de recuperar |
| Logs | Permiten trazabilidad e investigación | Pérdida de evidencia o filtración de datos |
| Configuración de despliegue | Define puertos, CORS y variables | Superficie de ataque o acceso indebido |
| Cuentas ADMIN | Pueden gestionar usuarios y ver datos sensibles | Mayor impacto por privilegios elevados |
| Disponibilidad de la API | Soporta operación del sistema | Interrupción del servicio |

## Amenazas consideradas

- Robo de credenciales o secretos.
- Fuerza bruta contra login.
- Uso de un JWT inválido, expirado o robado.
- Escalación horizontal/vertical por falta de RBAC.
- Payloads maliciosos o datos fuera de contrato.
- Abuso de solicitudes para degradar el servicio.
- Exposición accidental de correo del reportero.
- Divulgación de trazas internas en errores.
- Pérdida/corrupción de la base de datos.
- Uso persistente de una cuenta comprometida.
- Modificación no controlada durante un despliegue.

## Vulnerabilidades que se evitan

- Secretos embebidos en el repositorio.
- Contraseñas en texto plano.
- Rutas que confían solo en el frontend.
- SQL construido manualmente con texto recibido del cliente.
- Inputs sin límites de longitud o valores permitidos.
- Respuestas idénticas para roles con distinto nivel de acceso.
- Backups no verificados.
- Ausencia de un procedimiento de reversa.

La matriz cuantitativa/cualitativa se encuentra en `docs/matriz-riesgos.md`.
