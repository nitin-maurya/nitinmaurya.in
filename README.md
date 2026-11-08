# nitinmaurya.in — portfolio

Static site (HTML + CSS + JS, no build step). Open `index.html` locally to preview.

## Deploy to portfolio.nitinmaurya.in (current)
The VPS runs Dokploy, whose Traefik owns ports 80/443, so the site runs as an `nginx:1.27-alpine` container (`portfolio-site`) on `dokploy-network`. Traefik routes to it via `/etc/dokploy/traefik/dynamic/portfolio.yml` and gets the TLS certificate from Let's Encrypt. Files on the server live in `/srv/portfolio-site/`.
```
./deploy/deploy-portfolio.sh            # defaults to root@72.61.231.181; re-run after any change
```
DNS: an **A** record for `portfolio` pointing to `72.61.231.181`.

## Deploy to the Hostinger VPS (bare nginx; not usable while Dokploy is installed)
1. In your DNS settings (Hostinger hPanel → Domains → DNS), point **A** records for `@` and `www` to the VPS IP.
2. Copy the `deploy/` folder to the VPS and run the one-time setup (nginx, firewall, Let's Encrypt TLS, hardened headers):
   ```
   scp -r deploy root@VPS_IP:/root/
   ssh root@VPS_IP "LE_EMAIL=you@example.com bash /root/deploy/server-setup.sh"
   ```
3. Upload the site (and again after any change):
   ```
   ./deploy/deploy.sh root@VPS_IP
   ```

## Customise
- Resume: replace `Nitin_Maurya_Resume.pdf`.
- Email and phone: stored encoded in `assets/contact.js` (not in the HTML) so scrapers cannot harvest them; see the comment there to change them.
- If you edit the JSON-LD block in `index.html`, regenerate its sha256 hash in the CSP in `deploy/nginx-nitinmaurya.in.conf`.

## Versions
- `v1-blueprint`: prussian-blue drawing sheet
- `v2-slate`: slate sheet, cyan for automation, amber for detections (current `main`)

Switch the working copy to a version, then deploy as usual:
```
git checkout v1-blueprint   # or v2-slate, or main
./deploy/deploy.sh root@VPS_IP
git checkout main
```
