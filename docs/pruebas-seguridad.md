# Plan de pruebas de seguridad

## Pruebas locales ejecutables sin infraestructura externa

| ID | Prueba | Resultado esperado | Evidencia |
| --- | --- | --- | --- |
| UT-01 | `authorizeRoles` sin usuario | 401 | `npm test` |
| UT-02 | `CONSULTA` contra rol ADMIN | 403 | `npm test` |
| UT-03 | ADMIN permitido | continúa middleware | `npm test` |
| UT-04 | Sanitización HTML | elimina etiquetas | `npm test` |
| UT-05 | Sanitización caracteres control | elimina controles | `npm test` |
| UT-06 | Sanitización anidada | limpia objetos | `npm test` |
| UT-07 | Masking de email | preserva dominio, oculta local | `npm test` |
| UT-08 | Validación inválida | 400 + detalles seguros | `npm test` |
| UT-09 | Transformación de params | ID numérico | `npm test` |
| UT-10 | 404 controlado | respuesta sin stack | `npm test` |
| UT-11 | 500 seguro | mensaje interno no sale al cliente | `npm test` |
| UT-12 | Logger | no devuelve password/token | `npm test` |

## Pruebas HTTP + PostgreSQL automatizadas

El script `backend/tests/evidence-runner.js` y GitHub Actions cubren:

1. `GET /health` -> 200.
2. `GET /admin/ping` sin token -> 401.
3. Login de los tres roles.
4. `CONSULTA` en `/admin/ping` -> 403.
5. `ADMIN` en `/admin/ping` -> 200.
6. Body de incidente inválido -> 400.
7. `CONSULTA` creando incidente -> 403.
8. `ANALISTA` creando incidente con etiquetas -> 201 y contenido sanitizado.
9. `CONSULTA` listando incidentes -> email enmascarado.
10. `ADMIN` listando incidentes -> email completo.
11. Ruta inexistente -> 404.
12. `CONSULTA` intentando listar usuarios -> 403.
13. ADMIN listando usuarios -> 200.
14. ADMIN desactivando/activando cuenta -> 200.
15. Exceso de peticiones -> 429.
16. Backup PostgreSQL no vacío + checksum.
17. Borrado controlado de incidentes.
18. Restauración del dump.
19. Comparación de conteos antes/después -> iguales.
20. Conservación de logs de Morgan y eventos estructurados.

## Reproducibilidad

Una evidencia se considera reproducible si un tercero puede seguir los pasos desde un clone limpio y obtener la misma clase de resultado. El README indica instalación; `.env.example` define variables; el workflow fija PostgreSQL 16 y Node 22 y crea la base desde cero.
