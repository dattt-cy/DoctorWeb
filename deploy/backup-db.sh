#!/usr/bin/env bash
set -euo pipefail

app_dir=/opt/phongkhamnhivita/app
backup_dir=/opt/phongkhamnhivita/backups
timestamp="$(date +%Y%m%d-%H%M%S)"

install -d -m 700 "$backup_dir"
cd "$app_dir"

docker compose exec -T mysql sh -c \
  'exec mysqldump --single-transaction --routines --triggers -uroot -p"$MYSQL_ROOT_PASSWORD" doctorweb' \
  | gzip -9 > "$backup_dir/doctorweb-$timestamp.sql.gz"

chmod 600 "$backup_dir/doctorweb-$timestamp.sql.gz"
find "$backup_dir" -type f -name 'doctorweb-*.sql.gz' -mtime +7 -delete
