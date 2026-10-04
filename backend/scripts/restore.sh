#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL no está definida" >&2
  exit 1
fi

FILE="${1:-}"
if [[ -z "$FILE" || ! -s "$FILE" ]]; then
  echo "Uso: bash scripts/restore.sh <backup.dump>" >&2
  exit 1
fi

if [[ -s "$FILE.sha256" ]]; then
  (cd "$(dirname "$FILE")" && sha256sum --check "$(basename "$FILE").sha256")
else
  echo "ADVERTENCIA: no se encontró checksum; continúe solo si confía en el origen del backup" >&2
fi

pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  --dbname="$DATABASE_URL" \
  "$FILE"

echo "Restauración finalizada: $FILE"
