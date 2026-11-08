#!/usr/bin/env bash
# One-time setup on the Hostinger VPS (Ubuntu/Debian). Run as root:  sudo bash server-setup.sh
set -euo pipefail
DOMAIN="nitinmaurya.in"
WEBROOT="/var/www/${DOMAIN}"
EMAIL="${LE_EMAIL:?set LE_EMAIL to your email for Lets Encrypt expiry notices}"

apt-get update
apt-get install -y nginx certbot python3-certbot-nginx ufw rsync

mkdir -p "$WEBROOT"
chown -R "${SUDO_USER:-root}":www-data "$WEBROOT"
chmod -R 755 "$WEBROOT"

# Firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Temporary HTTP-only vhost so certbot can validate
cat > /etc/nginx/sites-available/${DOMAIN} <<NGX
server {
    listen 80; listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    root ${WEBROOT};
    location / { try_files \$uri \$uri/ =404; }
}
NGX
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/${DOMAIN}
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# TLS certificate (DNS A records for @ and www must already point to this VPS)
certbot certonly --webroot -w "$WEBROOT" -d "$DOMAIN" -d "www.${DOMAIN}" \
  --agree-tos -m "$EMAIL" --non-interactive

# Install the hardened config (uploaded next to this script)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp "${SCRIPT_DIR}/nginx-${DOMAIN}.conf" /etc/nginx/sites-available/${DOMAIN}
nginx -t && systemctl reload nginx

# Auto-renew hook to reload nginx
mkdir -p /etc/letsencrypt/renewal-hooks/deploy
printf '#!/bin/sh\nsystemctl reload nginx\n' > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

echo "✓ Server ready. Now run deploy.sh from your machine to upload the site."
