# Evidencias de SecureDesk ADSO

Esta carpeta contiene o referencia evidencia **reproducible**. No se presentan capturas simuladas como si fueran ejecuciones reales.

## Evidencia local incluida

Los archivos `local-*.txt` son salidas reales producidas en el entorno de trabajo al ejecutar pruebas, revisiones de Git y controles de preproducción. Pueden repetirse con los comandos indicados en el README.

## Evidencia de integración

Las pruebas que requieren dependencias npm y PostgreSQL se automatizan en `.github/workflows/security-evidence.yml`. El job guarda como artefactos:

- JSON por cada petición HTTP.
- resumen de la suite HTTP.
- salida de pruebas unitarias.
- logs de Morgan y eventos de seguridad.
- backup PostgreSQL `.dump` y checksum.
- verificación del conteo antes del daño, después del borrado y después de restaurar.

## Resultados que el workflow exige

- 200 health.
- 401 sin autenticación.
- 403 por rol insuficiente.
- 200 ADMIN autorizado.
- 400 por payload inválido.
- 201 creación válida.
- sanitización efectiva.
- masking por rol.
- 404 controlado.
- 429 por rate limit.
- cuenta desactivada deja de utilizar un token previamente emitido.
- backup no vacío.
- restauración recupera el conteo previo.

Si una aserción no se cumple, el workflow falla y la evidencia no se considera aprobada.
