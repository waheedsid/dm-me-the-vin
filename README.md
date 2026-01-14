# DMMeTheVIN - VIN Submission Form

A simple, secure VIN submission form with serverless backend. Users enter a VIN number, and the submission is sent to your email via SendGrid.

## Architecture

```
┌─────────────────────────────────────┐
│      Browser (React SPA)            │
│  - VIN input (validated)            │
│  - Note & Email fields (optional)   │
│  - Honeypot field (spam prevention) │
└──────────────┬──────────────────────┘
               │ POST JSON
               ▼
┌─────────────────────────────────────┐
│  Netlify Function /.netlify/functions
│            /sendVin                 │
│  - Server validates VIN             │
│  - Rate limit check (per IP)        │
│  - CORS check                       │
│  - Honeypot check                   │
└──────────────┬──────────────────────┘
               │ Sends email
               ▼
┌─────────────────────────────────────┐
│     SendGrid Email Service          │
│  - Sends to: your-email@example.com │
│  - Includes VIN, note, metadata     │
└─────────────────────────────────────┘
```

---

## Project Structure

```
DMMeTheVin/
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main form component
│   ├── App.css               # Component styles
│   └── index.css             # Global styles
├── netlify/
│   └── functions/
│       └── sendVin.js        # Serverless function (Node.js)
├── netlify.toml              # Netlify deployment config
├── vite.config.js            # Vite bundler config
├── package.json              # Dependencies & scripts
└── index.html                # HTML entry point
```

---

## Setup & Deployment Guide

### Step 1: Create SendGrid Account & Verify Sender

1. Go to [sendgrid.com](https://sendgrid.com) and sign up for a free account
2. After login, go to **Settings → Sender authentication**
3. Click **Verify a Single Sender**
4. Fill in:
   - **From Email**: Choose any email address you want to appear as the sender (e.g., `noreply@dmmethevin.com` or your personal email)
   - **From Name**: `DMMeTheVIN`
   - Click the verification link sent to that email
5. Once verified, copy the **API Key**:
   - Go to **Settings → API Keys**
   - Click **Create API Key**
   - Name it `DMMeTheVIN` and give it **Mail Send** permissions
   - Copy the key (you'll need it in the next step)

### Step 2: Install Dependencies

```bash
cd /Users/abdulwaheed/code/projects/DMMeTheVin
npm install
npm install --save-dev @sendgrid/mail
```

### Step 3: Set Up Local Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
SENDGRID_API_KEY=SG.your_actual_api_key_here
TO_EMAIL=your-email@example.com
FROM_EMAIL=noreply@yourdomain.com
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com,https://www.yourdomain.com
```

**Note:** Netlify CLI will automatically load `.env.local` during local development.

### Step 4: Test Locally

```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Start development server with Netlify Functions support
netlify dev

# Should output something like:
# ◈ Netlify Dev server running at: http://localhost:8888
# ◈ Functions server is listening on 54113
```

Go to `http://localhost:8888` and test the form:
- Enter a valid VIN (e.g., `1HGBH41JXMN109186`)
- Add an optional note
- Submit and check your inbox for the email

**Troubleshooting local dev:**
- If SendGrid API key fails, check that `.env.local` is in the project root
- If functions don't load, restart `netlify dev`
- Check the terminal output for error messages

### Step 5: Deploy to Netlify

#### Option A: Git-based Deploy (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial DMMeTheVIN deployment"
   git push origin main
   ```

2. Go to [netlify.com](https://netlify.com) and sign in
3. Click **"New site from Git"**
4. Select GitHub and authorize
5. Choose your `DMMeTheVin` repo
6. **Build command**: `npm run build`
7. **Publish directory**: `dist`
8. Click **"Deploy site"**

#### Option B: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Step 6: Set Environment Variables on Netlify

Once the site is created on Netlify:

1. Go to your site's **Settings → Environment variables**
2. Click **Add an environment variable**
3. Add these (with your actual values):

   | Variable | Value |
   |----------|-------|
   | `SENDGRID_API_KEY` | `SG.your_actual_api_key_here` |
   | `TO_EMAIL` | `your-email@example.com` |
   | `FROM_EMAIL` | `noreply@yourdomain.com` (or your verified sender email) |
   | `ALLOWED_ORIGINS` | `https://yourdomain.com,https://www.yourdomain.com` |

4. Click **Save**
5. Go to **Deployments → Trigger deploy → Deploy site** to rebuild with the new env vars

Your site is now live! You can find the URL in your Netlify dashboard.

### Step 7: Point Your Domain to Netlify

**Using GoDaddy nameservers (easiest):**

1. Go to your Netlify site's **Settings → Domain management**
2. Click **Add a custom domain** and enter `yourdomain.com`
3. Netlify will show you 4 nameservers to add to your registrar
4. Log in to your domain registrar (e.g., GoDaddy, Namecheap)
5. Go to **Domains → Your Domain → Nameservers**
6. Click **Change nameservers** and paste Netlify's nameservers
7. Save and wait 24-48 hours for DNS propagation

**Using GoDaddy DNS records (if you want to keep other DNS configs):**

1. In Netlify, note your site's IP address (or use DNS records provided)
2. In your registrar's DNS settings, add these records:
   - **Type**: A | **Name**: @ | **Value**: [Netlify IP]
   - **Type**: A | **Name**: www | **Value**: [Netlify IP]
3. Wait for DNS propagation (15 minutes to 48 hours)

### Step 8: Enable HTTPS

Netlify automatically provisions a free SSL certificate via Let's Encrypt. It should be enabled by default, but verify:

1. Go to your site's **Settings → Domain management**
2. Under **HTTPS**, you should see **"SSL/TLS certificate: Valid"**
3. If not, click **Verify DNS configuration** and wait a few minutes

---

## Quick Test Checklist

After deploying:

- [ ] **Local test**: Run `netlify dev`, fill form, confirm email arrives
- [ ] **After deploy**: Visit your live site and submit a test VIN
- [ ] **Email arrives**: Check inbox for "DMMeTheVIN - New VIN submission"
- [ ] **Error handling**: Try invalid VIN to see error message
- [ ] **Rate limiting**: Rapidly submit 6+ times, 6th should show error
- [ ] **Honeypot**: Inspect HTML to verify `hp` field is hidden
- [ ] **CORS**: Open DevTools, check Network tab for successful POST
- [ ] **Domain**: Visit `https://yourdomain.com` and verify HTTPS lock icon

---

## Environment Variables Reference

| Variable | Example | Notes |
|----------|---------|-------|
| `SENDGRID_API_KEY` | `SG.abc123...` | Get from SendGrid Settings → API Keys |
| `TO_EMAIL` | `your-email@example.com` | Where submissions are sent |
| `FROM_EMAIL` | `noreply@yourdomain.com` | Must be verified in SendGrid |
| `ALLOWED_ORIGINS` | `https://yourdomain.com,http://localhost:5173` | Comma-separated, no spaces |

---

## Features Implemented

✅ **Frontend**
- React SPA with Vite bundler
- Controlled VIN input with client-side validation
- Regex validation: `^[A-HJ-NPR-Z0-9]{17}$` (excludes I, O, Q)
- Optional note textarea
- Optional email field
- Honeypot field for bot prevention
- Status banner (success/error)
- Disabled submit button while sending

✅ **Backend**
- Netlify Function at `/.netlify/functions/sendVin`
- Server-side VIN validation
- Honeypot bot detection
- Rate limiting per IP (5 requests/minute)
- CORS origin validation
- SendGrid email integration
- Detailed email body with metadata (timestamp, IP, user agent)

✅ **Security**
- No API keys exposed to client
- Server-side validation (even if client bypassed)
- Honeypot field for spam/bot prevention
- Rate limiting
- CORS enforcement
- Input sanitization

✅ **Deployment**
- `netlify.toml` configured for builds and functions
- Git-based continuous deployment ready
- Free SSL/HTTPS
- Environment variables for secrets

---

## Troubleshooting

### Functions not deploying
- Ensure `netlify.toml` has `functions = "netlify/functions"`
- Check that `netlify/functions/sendVin.js` exists
- Rebuild: **Deployments → Trigger deploy**

### SendGrid emails not sending
- Verify the API key is correct in Netlify env vars
- Check that sender email is verified in SendGrid
- Look at function logs in Netlify dashboard

### CORS errors in browser
- Ensure `ALLOWED_ORIGINS` includes your domain
- Format: comma-separated, no spaces, include `https://`
- Rebuild after changing env vars

### Rate limit blocking legitimate users
- Adjust `RATE_LIMIT_MAX` in `netlify/functions/sendVin.js` (currently 5/minute)
- Restart `netlify dev` to see changes locally
- Note: In-memory limiter resets on function instance reload

---

## Next Steps (Future Enhancements)

- Database storage for submissions
- Admin dashboard to view submissions
- Email templates (HTML)
- ReCAPTCHA integration
- Persistent rate limiting (Redis/database)
- Submission analytics
- SMS notifications

---

## License

MIT
