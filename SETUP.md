# DMMeTheVIN - Setup Quick Start

## Architecture Diagram

```
┌─────────────────────────────────────┐
│      Browser (React SPA)            │
│  - VIN input (validated)            │
│  - Note & Email fields (optional)   │
│  - Honeypot field (spam prevention) │
└──────────────┬──────────────────────┘
               │ POST JSON
               │ { vin, note?, email?, hp }
               ▼
┌─────────────────────────────────────┐
│  Netlify Function                   │
│  /.netlify/functions/sendVin        │
│  - Server validates VIN             │
│  - Rate limit check (per IP)        │
│  - CORS origin check                │
│  - Honeypot bot detection           │
└──────────────┬──────────────────────┘
               │ Authenticated email request
               ▼
┌─────────────────────────────────────┐
│     SendGrid Email API              │
│  (Uses API key from env vars)       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Waheed.webdev@gmail.com Inbox     │
│   "DMMeTheVIN - New VIN submission"  │
└─────────────────────────────────────┘
```

## Files Created

### Frontend (React + Vite)
- **src/main.jsx** - Entry point
- **src/App.jsx** - Main form component (VIN validation, submission logic)
- **src/App.css** - Component styles
- **src/index.css** - Global styles
- **index.html** - HTML template
- **vite.config.js** - Bundler config

### Backend (Netlify Functions)
- **netlify/functions/sendVin.js** - Serverless function
  - Validates VIN format: `^[A-HJ-NPR-Z0-9]{17}$`
  - Checks honeypot field
  - Enforces rate limit (5 requests per minute per IP)
  - Validates CORS origin
  - Sends email via SendGrid
  - Returns appropriate JSON responses

### Configuration
- **netlify.toml** - Netlify build & deployment config
- **package.json** - Dependencies & scripts
- **.gitignore** - Files to exclude from git

## Installation & Local Testing

### 1. Install Dependencies
```bash
cd /Users/abdulwaheed/code/projects/DMMeTheVin
npm install
npm install --save-dev @sendgrid/mail
```

### 2. Create .env.local
Create a file named `.env.local` in the project root with:
```
SENDGRID_API_KEY=SG.your_actual_key_here
TO_EMAIL=Waheed.webdev@gmail.com
FROM_EMAIL=noreply@dmmethevin.com
ALLOWED_ORIGINS=http://localhost:5173,https://dmmethevin.com,https://www.dmmethevin.com
```

Get the SendGrid API key by:
1. Sign up at sendgrid.com
2. Go to Settings → Sender authentication
3. Verify a single sender email
4. Go to Settings → API Keys and create a key with Mail Send permissions

### 3. Start Local Dev Server
```bash
npm install -g netlify-cli  # If not already installed
netlify dev
```

Then visit `http://localhost:8888` and test the form.

## Deployment to Netlify

### Quick Deploy via Git
1. Push to GitHub
2. Go to netlify.com → "New site from Git"
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click Deploy

### Set Environment Variables on Netlify
1. Go to your site's **Settings → Environment variables**
2. Add:
   - `SENDGRID_API_KEY` = your SendGrid API key
   - `TO_EMAIL` = Waheed.webdev@gmail.com
   - `FROM_EMAIL` = your verified sender email
   - `ALLOWED_ORIGINS` = https://dmmethevin.com,https://www.dmmethevin.com

3. Trigger a redeploy: **Deployments → Trigger deploy**

## Domain Setup (GoDaddy → Netlify)

### Using Nameservers (Easiest)
1. In Netlify: Settings → Domain management → Add custom domain
2. Netlify shows 4 nameservers
3. In GoDaddy: Domains → Your domain → Nameservers → Change
4. Paste Netlify's nameservers
5. Wait 24-48 hours for DNS to propagate

### HTTPS
Netlify automatically provisions free SSL/TLS certificates. Check:
- Settings → Domain management → HTTPS → "SSL/TLS certificate: Valid"

## Testing Checklist

- [ ] Local dev: `netlify dev` → submit form → email arrives
- [ ] Live site: Submit test VIN → email arrives
- [ ] Invalid VIN: Shows error "Invalid VIN format"
- [ ] Rate limit: Submit 6+ times quickly → 6th shows "Rate limit exceeded"
- [ ] Honeypot: Bot fills form with honeypot field → silently fails
- [ ] CORS: Different origin → 403 Forbidden
- [ ] Domain: https://dmmethevin.com works with HTTPS lock

## File Reference

### App.jsx - Client-Side Validation
- VIN regex: `^[A-HJ-NPR-Z0-9]{17}$` (excludes I, O, Q)
- Trims and uppercases VIN
- Disables submit button while sending
- Shows error message for invalid format

### sendVin.js - Server-Side Security
- Re-validates VIN server-side (never trust client)
- Honeypot check: if `hp` field is non-empty, reject
- Rate limiting: 5 requests per minute per IP (x-forwarded-for header)
- CORS: checks `ALLOWED_ORIGINS` env var
- Email: sends via SendGrid with metadata (timestamp, IP, user agent)

### Response Codes
- **200** - Success: `{ ok: true }`
- **400** - Bad request: `{ ok: false, error: "Invalid VIN format" }`
- **403** - CORS denied: `{ ok: false, error: "Forbidden origin" }`
- **429** - Rate limited: `{ ok: false, error: "Rate limit exceeded" }`
- **500** - Server error: `{ ok: false, error: "Server error" }`

## Environment Variables

| Name | Example | Where to Set |
|------|---------|-------------|
| `SENDGRID_API_KEY` | `SG.abc123...` | `.env.local` (local) / Netlify Settings (prod) |
| `TO_EMAIL` | `Waheed.webdev@gmail.com` | `.env.local` / Netlify Settings |
| `FROM_EMAIL` | `noreply@dmmethevin.com` | `.env.local` / Netlify Settings |
| `ALLOWED_ORIGINS` | `https://dmmethevin.com,http://localhost:5173` | `.env.local` / Netlify Settings |

**Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

## Troubleshooting

**Functions not deploying?**
- Check `netlify.toml` has `functions = "netlify/functions"`
- Ensure `netlify/functions/sendVin.js` exists
- Try: Deployments → Trigger deploy → Deploy site

**SendGrid emails not sending?**
- Verify sender email is verified in SendGrid
- Check API key is correct in env vars
- Check Netlify function logs (Netlify dashboard)

**CORS errors?**
- Add your domain to `ALLOWED_ORIGINS`
- Rebuild after changing env vars
- Format: `https://example.com,https://www.example.com` (no spaces)

**Rate limit too aggressive?**
- Edit `RATE_LIMIT_MAX` in `netlify/functions/sendVin.js` (currently 5)
- Restart `netlify dev` to apply changes locally
- Redeploy to apply changes on Netlify

## Next Steps

1. ✅ Install dependencies: `npm install && npm install -dev @sendgrid/mail`
2. ✅ Get SendGrid API key
3. ✅ Create `.env.local` with credentials
4. ✅ Test locally: `netlify dev`
5. ✅ Push to GitHub
6. ✅ Deploy via Netlify (Git-based)
7. ✅ Set environment variables on Netlify
8. ✅ Point GoDaddy domain to Netlify
9. ✅ Verify HTTPS works
10. ✅ Test live form

All code is ready to go. Just follow the steps above!
