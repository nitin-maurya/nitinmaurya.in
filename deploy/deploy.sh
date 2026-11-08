#!/usr/bin/env bash
# Upload / update the site from your machine.
#   Usage:  ./deploy/deploy.sh user@YOUR_VPS_IP
set -euo pipefail
TARGET="${1:?usage: deploy.sh user@vps-ip}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
rsync -avz --delete \
  --exclude 'deploy/' --exclude '.hallmark/' --exclude 'assets/js/' --exclude 'README.md' --exclude '.git' --exclude '.DS_Store' \
  "$ROOT"/ "$TARGET":/var/www/nitinmaurya.in/
echo "✓ Deployed → https://nitinmaurya.in"
