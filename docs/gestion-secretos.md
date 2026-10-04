# Gestión de secretos y credenciales

## Reglas aplicadas

1. `backend/.env` contiene la configuración local real y está ignorado por Git.
2. `backend/.env.example` solo documenta nombres y valores de laboratorio/reemplazo.
3. `JWT_SECRET` es obligatorio y debe tener al menos 32 caracteres.
4. Los JWT expiran y se verifican restringiendo el algoritmo a HS256.
5. Las contraseñas se almacenan como Bcrypt, nunca en texto plano en PostgreSQL.
6. Los tokens no se escriben en `securityLogger`.
7. Las credenciales del README son exclusivamente de laboratorio creadas por el seed y deben cambiarse/eliminarse en producción.
8. En CI, las credenciales son de una base efímera del job y no corresponden a un servicio real.

## Rotación propuesta

Ante sospecha de filtración del JWT secret se debe: detener el despliegue, generar un secreto nuevo mediante un generador criptográficamente seguro, actualizar la variable en el entorno, reiniciar la API, verificar que los tokens antiguos queden inválidos y documentar el incidente. Para credenciales de base de datos se rota usuario/contraseña y se actualiza `DATABASE_URL` sin escribir el valor en commits o tickets.
