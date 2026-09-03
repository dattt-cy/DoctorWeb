#!/usr/bin/env bash
set -euo pipefail
cd /opt/phongkhamnhivita/app

docker compose exec -T mysql sh -c \
  'mysql -N -uroot -p"$MYSQL_ROOT_PASSWORD" doctorweb -e "SELECT (SELECT COUNT(*) FROM appointment), (SELECT COUNT(*) FROM patient), (SELECT COUNT(*) FROM appointment_slot);"'
