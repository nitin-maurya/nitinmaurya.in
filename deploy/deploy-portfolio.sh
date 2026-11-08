#!/usr/bin/env bash
# Deploy to https://portfolio.nitinmaurya.in on the Hostinger VPS (Dokploy + Traefik).
#   Usage:  ./deploy/deploy-portfolio.sh [user@host]   (default root@72.61.231.181)
# Safe to re-run: syncs files, (re)creates the container only if missing, reloads nginx.
set -euo pipefail
TARGET="${1:-root@72.61.231.181}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRV=/srv/portfolio-site

ssh "$TARGET" "mkdir -p $SRV/html"
rsync -avz --delete \
  --exclude 'deploy/' --exclude '.hallmark/' --exclude 'assets/js/' --exclude 'README.md' \
  --exclude '.git' --exclude '.gitignore' --exclude '.DS_Store' \
  "$ROOT"/ "$TARGET":$SRV/html/
rsync -avz "$ROOT/deploy/portfolio/nginx.conf" "$TARGET":$SRV/nginx.conf
rsync -avz "$ROOT/deploy/portfolio/traefik-portfolio.yml" "$TARGET":/etc/dokploy/traefik/dynamic/portfolio.yml

ssh "$TARGET" bash -s <<REMOTE
set -euo pipefail
if ! docker ps -a --format '{{.Names}}' | grep -qx portfolio-site; then
  docker run -d --name portfolio-site --restart unless-stopped --network dokploy-network \
    -v $SRV/html:/usr/share/nginx/html:ro \
    -v $SRV/nginx.conf:/etc/nginx/conf.d/default.conf:ro \
    nginx:1.27-alpine
fi
docker exec portfolio-site nginx -t
docker exec portfolio-site nginx -s reload
REMOTE
echo "✓ Deployed → https://portfolio.nitinmaurya.in"
