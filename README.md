# nitinmaurya.in — portfolio

Static site (HTML + CSS + JS, no build step). Open `index.html` locally to preview.

## Deploy to the Hostinger VPS
1. In your DNS settings (Hostinger hPanel → Domains → DNS), point **A** records for `@` and `www` to the VPS IP.
2. Copy the `deploy/` folder to the VPS and run the one-time setup (nginx, firewall, Let's Encrypt TLS, hardened headers):
   ```
   scp -r deploy root@VPS_IP:/root/
   ssh root@VPS_IP "bash /root/deploy/server-setup.sh"
   ```
3. Upload the site (and again after any change):
   ```
   ./deploy/deploy.sh root@VPS_IP
   ```

## Customise
- Contact messages: set `CONTACT_ENDPOINT` at the top of `assets/js/main.js` (e.g. a free Formspree URL). Empty means the terminal opens the visitor's mail client.
- Resume: replace `Nitin_Maurya_Resume.pdf`.
- If you edit the JSON-LD block in `index.html`, regenerate its sha256 hash in the CSP in `deploy/nginx-nitinmaurya.in.conf`.
