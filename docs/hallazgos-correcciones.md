# Hallazgos y correcciones del plan de mejoramiento

## H-01 - Evidencias anteriores no eran suficientes para acreditar ejecución real

**Riesgo:** presentar una captura de estructura o texto como si demostrara una prueba ejecutada.  
**Corrección:** se añadió una suite local que produce salida real y un workflow que genera JSON de respuestas HTTP, logs y backup/restauración como artefactos.  
**Verificación:** `npm test`, `npm run preproduction` y `.github/workflows/security-evidence.yml`.

## H-02 - El dossier anterior cubría clases 1 a 6 y no todo el plan 1 a 8

**Riesgo:** producto integrador incompleto.  
**Corrección:** se amplió la documentación con arquitectura, CIA, secretos, continuidad RTO/RPO, checklist preproducción, hallazgos, pruebas y referencias para consolidar clases 1 a 8 y la práctica integradora.

## H-03 - El cliente podía enviar `reporterEmail` al crear un incidente

**Riesgo:** suplantación del reportero o datos inconsistentes.  
**Corrección:** el correo ahora se deriva de `req.user.email`, obtenido después de validar el JWT y consultar al usuario en base de datos. El schema ya no acepta `reporterEmail`.

## H-04 - JWT verificaba la firma sin restringir explícitamente el algoritmo

**Riesgo:** configuración menos estricta de lo necesario.  
**Corrección:** firma y verificación restringidas a HS256; `JWT_SECRET` mínimo de 32 caracteres.

## H-05 - Logging solo dependía de accesos HTTP

**Riesgo:** menor claridad al investigar autenticaciones/denegaciones/cambios administrativos.  
**Corrección:** se añadió un logger estructurado de eventos de seguridad que excluye claves conocidas como `password`, `token` y `authorization`.

## H-06 - Backup sin comprobación de integridad del archivo

**Riesgo:** intentar restaurar un dump corrupto sin detectarlo previamente.  
**Corrección:** el backup genera checksum SHA-256, aplica permisos 600 y `restore.sh` verifica el checksum cuando está disponible.

## H-07 - Credenciales de laboratorio aparecían precargadas en el formulario

**Riesgo:** normalizar una práctica insegura y confundir credenciales de ejemplo con credenciales reales.  
**Corrección:** se eliminaron los valores precargados del frontend. Las cuentas de laboratorio se documentan explícitamente en README.

## Riesgos residuales

- El proyecto académico no implementa MFA.
- La revocación de tokens se basa en desactivar al usuario; no existe denylist por token individual.
- El backup no se cifra dentro del script porque el mecanismo de cifrado depende del entorno de almacenamiento; en producción debe cifrarse y almacenarse fuera del host.
- No se realizó pentest externo. Las pruebas cubren los controles definidos en el alcance académico.
- El workflow completo HTTP/PostgreSQL solo puede ejecutarse cuando el contenido esté publicado en GitHub o en otro runner con PostgreSQL y dependencias disponibles.
