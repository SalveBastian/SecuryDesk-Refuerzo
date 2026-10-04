#!/usr/bin/env bash
set -euo pipefail
umask 077

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL no está definida" >&2
  exit 1
fi

BACKUP_DIR="${BACKUP_DIR:-$(cd "$(dirname "$0")/.." && pwd)/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
mkdir -p "$BACKUP_DIR"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="$BACKUP_DIR/securedesk_${STAMP}.dump"
CHECKSUM="$FILE.sha256"

pg_dump --format=custom --no-owner --no-acl --dbname="$DATABASE_URL" --file="$FILE"

if [[ ! -s "$FILE" ]]; then
  echo "ERROR: el backup fue creado vacío" >&2
  exit 1
fi

sha256sum "$FILE" > "$CHECKSUM"
chmod 600 "$FILE" "$CHECKSUM"

if [[ "$RETENTION_DAYS" =~ ^[0-9]+$ ]]; then
  find "$BACKUP_DIR" -type f \( -name 'securedesk_*.dump' -o -name 'securedesk_*.dump.sha256' \) \
    -mtime "+$RETENTION_DAYS" -delete
fi

printf 'Backup: %s\nChecksum: %s\n' "$FILE" "$CHECKSUM"
