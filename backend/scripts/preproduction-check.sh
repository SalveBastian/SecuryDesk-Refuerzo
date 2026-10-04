#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BACKEND="$ROOT/backend"

ok() { printf '[OK] %s\n' "$1"; }
fail() { printf '[ERROR] %s\n' "$1" >&2; exit 1; }

printf 'SecureDesk ADSO - verificación preproducción estática/local\n'
printf 'Fecha UTC: %s\n\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"

node --version | sed 's/^/Node: /'

# 1. Sintaxis JavaScript sin requerir dependencias instaladas.
while IFS= read -r -d '' file; do
  node --check "$file" >/dev/null
 done < <(find "$BACKEND/src" "$BACKEND/tests" "$BACKEND/prisma" -type f -name '*.js' -print0)
ok 'Sintaxis JavaScript válida'

# 2. Scripts de continuidad.
bash -n "$BACKEND/scripts/backup.sh"
bash -n "$BACKEND/scripts/restore.sh"
ok 'Scripts backup/restore válidos para Bash'

# 3. Pruebas unitarias que no dependen de base de datos.
(cd "$BACKEND" && npm test)
ok 'Pruebas unitarias aprobadas'

# 4. Secretos: .env debe estar ignorado y no versionado.
if ! git -C "$ROOT" check-ignore -q backend/.env; then
  fail 'backend/.env no está ignorado por Git'
fi
if git -C "$ROOT" ls-files --error-unmatch backend/.env >/dev/null 2>&1; then
  fail 'backend/.env está versionado'
fi
ok '.env ignorado y no versionado'

# 5. Plantilla requerida sin valores de producción.
grep -q '^JWT_SECRET=replace-with-' "$BACKEND/.env.example" || fail '.env.example debe usar un valor de reemplazo'
ok '.env.example usa valores de laboratorio/reemplazo'

# 6. Controles críticos presentes.
grep -q 'helmet()' "$BACKEND/src/app.js" || fail 'Helmet no encontrado'
grep -q 'rateLimit' "$BACKEND/src/app.js" || fail 'Rate limit no encontrado'
grep -q "authorizeRoles('ADMIN'" "$BACKEND/src/routes/admin.routes.js" || fail 'RBAC ADMIN no encontrado'
grep -q 'sanitizeBody' "$BACKEND/src/routes/incidents.routes.js" || fail 'Sanitización no encontrada'
grep -q 'morgan' "$BACKEND/src/app.js" || fail 'Morgan no encontrado'
ok 'Controles preventivos/detectivos críticos presentes'

# 7. Documentación obligatoria para el plan de mejoramiento.
for file in \
  docs/arquitectura.md \
  docs/matriz-riesgos.md \
  docs/principios-cia.md \
  docs/continuidad-rto-rpo.md \
  docs/checklist-preproduccion.md \
  docs/hallazgos-correcciones.md \
  docs/pruebas-seguridad.md; do
  [[ -s "$ROOT/$file" ]] || fail "Falta $file"
done
ok 'Documentación técnica obligatoria presente'

printf '\nRESULTADO: controles locales verificables APROBADOS.\n'
printf 'Nota: las pruebas HTTP + PostgreSQL completas se ejecutan con GitHub Actions.\n'
