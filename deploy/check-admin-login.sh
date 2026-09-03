#!/usr/bin/env bash
set -euo pipefail

app_dir=/opt/phongkhamnhivita/app
check_dir="$(mktemp -d)"
trap 'rm -rf "$check_dir"' EXIT
chmod 700 "$check_dir"

python3 - "$app_dir/backend.env" "$check_dir/login.json" <<'PY'
import json
import os
import sys

values = {}
with open(sys.argv[1], encoding="utf-8-sig") as source:
    for raw_line in source:
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()

with open(sys.argv[2], "w", encoding="utf-8") as target:
    json.dump({"username": values["ADMIN_USERNAME"], "password": values["ADMIN_PASSWORD"]}, target)
os.chmod(sys.argv[2], 0o600)
PY

login_status="$(curl -sS \
  -D "$check_dir/headers" \
  -c "$check_dir/cookies" \
  -o "$check_dir/login-response" \
  -w '%{http_code}' \
  -H 'Content-Type: application/json' \
  --data-binary "@$check_dir/login.json" \
  https://phongkhamnhivita.com/backend-api/api/admin/auth/login)"

cookie_secure=no
if grep -qi '^set-cookie: .*doctor_admin_session=.*;.*secure' "$check_dir/headers"; then
  cookie_secure=yes
fi

admin_status="$(curl -sS \
  -b "$check_dir/cookies" \
  -o /dev/null \
  -w '%{http_code}' \
  'https://phongkhamnhivita.com/backend-api/api/admin/blogs?size=1')"

printf 'login_status=%s cookie_secure=%s authenticated_request=%s\n' \
  "$login_status" "$cookie_secure" "$admin_status"
