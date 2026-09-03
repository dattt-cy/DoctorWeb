#!/usr/bin/env bash
set -euo pipefail

app_dir=/opt/phongkhamnhivita/app
cd "$app_dir"

chmod 600 backend.env

read_env() {
  local name="$1"
  sed -n "s/^${name}=//p" backend.env | tail -n 1
}

db_username="$(read_env DB_USERNAME)"
db_password="$(read_env DB_PASSWORD)"

if [[ -z "$db_username" || -z "$db_password" ]]; then
  echo "Database credentials are missing" >&2
  exit 1
fi

sed -i \
  -e '/^SPRING_PROFILES_ACTIVE=/d' \
  -e '/^PORT=/d' \
  -e '/^DB_URL=/d' \
  -e '/^CORS_ALLOWED_ORIGINS=/d' \
  -e '/^AUTH_COOKIE_SECURE=/d' \
  -e '/^AUTH_COOKIE_SAME_SITE=/d' \
  backend.env

cat >> backend.env <<'EOF'
SPRING_PROFILES_ACTIVE=prod
PORT=8080
DB_URL=jdbc:mysql://mysql:3306/doctorweb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh&useUnicode=true&characterEncoding=UTF-8&connectionCollation=utf8mb4_unicode_ci
CORS_ALLOWED_ORIGINS=https://phongkhamnhivita.com,https://www.phongkhamnhivita.com,http://162.4.176.24
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAME_SITE=Lax
EOF

if [[ ! -f mysql.env ]]; then
  if [[ "$db_username" == "root" ]]; then
    {
      printf 'MYSQL_DATABASE=doctorweb\n'
      printf 'MYSQL_ROOT_PASSWORD=%s\n' "$db_password"
      printf 'TZ=Asia/Ho_Chi_Minh\n'
    } > mysql.env
  else
    root_password="$(openssl rand -hex 24)"
    {
      printf 'MYSQL_DATABASE=doctorweb\n'
      printf 'MYSQL_USER=%s\n' "$db_username"
      printf 'MYSQL_PASSWORD=%s\n' "$db_password"
      printf 'MYSQL_ROOT_PASSWORD=%s\n' "$root_password"
      printf 'TZ=Asia/Ho_Chi_Minh\n'
    } > mysql.env
  fi
fi

chmod 600 mysql.env
docker compose config --quiet
docker compose up -d --build
