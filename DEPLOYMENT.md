# Production Deployment Checklist

## Pre-Deployment (Local Development)

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in your SendGrid API key
- [ ] Fill in your GA4 Measurement ID
- [ ] Fill in admin email address
- [ ] Test locally with `npm run dev`

### 2. Build Verification
```bash
npm run build
# Should complete without errors, output to ./dist/
```

### 3. Local Testing
```bash
# Test the built version locally
netlify dev -p 3000
# Visit http://localhost:3000
# Test VIN form submission
# Check GA4 in real-time (wait 30 sec for event)
```

---

## Deployment to Netlify

### 1. Connect Git Repository
- [ ] Push code to GitHub: `git push`
- [ ] Go to [Netlify](https://app.netlify.com/)
- [ ] Click "New site from Git"
- [ ] Connect your GitHub repo
- [ ] Select main branch

### 2. Configure Build Settings
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Functions directory: `netlify/functions`

### 3. Set Environment Variables
In Netlify Dashboard → Site settings → Environment:
```
SENDGRID_API_KEY=your_api_key
GA4_ID=G-XXXXXXXXXX
ADMIN_EMAIL=your@email.com
```

### 4. Trigger Deploy
- [ ] Netlify auto-deploys on git push
- [ ] Or manually: Site settings → Trigger deploy

---

## Post-Deployment Verification

### 1. Website Accessibility
- [ ] Site is live at custom domain
- [ ] HTTPS is active (green lock icon)
- [ ] All pages load without 404 errors
- [ ] Mobile responsive on iPhone/Android

### 2. Form Functionality
- [ ] VIN form submits successfully
- [ ] Get success message on valid VIN
- [ ] Get error message on invalid VIN
- [ ] Check admin email for test submission
- [ ] Verify in Netlify function logs (no errors)

### 3. Google Analytics 4
- [ ] Replace placeholder GA4 ID in `index.html`
- [ ] Visit your site from new browser session
- [ ] Go to GA4 > Real-time > Overview
- [ ] Should see "1 user" and form events appear
- [ ] Wait 24 hours for full data collection

### 4. SEO & Search Engines
- [ ] robots.txt accessible: `https://yoursite.com/robots.txt`
- [ ] sitemap.xml accessible: `https://yoursite.com/sitemap.xml`
- [ ] Submit sitemap to Google Search Console:
  - Go to [Google Search Console](https://search.google.com/search-console/)
  - Add property: `https://yoursite.com`
  - Submit sitemap: `/sitemap.xml`
- [ ] Verify domain ownership (via DNS or meta tag)
- [ ] Wait 1-2 weeks for first crawl

### 5. Performance
- [ ] Lighthouse score: Target 90+ for Performance
  - Test at: https://pagespeed.web.dev/
- [ ] Core Web Vitals (good):
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### 6. Security Headers
- [ ] HTTPS redirects configured (automated via Netlify)
- [ ] Security headers in netlify.toml (already set)
- [ ] Test at: [securityheaders.com](https://securityheaders.com/)

---

## Post-Deployment Monitoring

### Weekly Checklist
- [ ] Check GA4 for form submissions
- [ ] Monitor function logs for errors: Netlify → Functions
- [ ] Test form submission monthly
- [ ] Check uptime: Netlify > Monitors

### Monthly Checklist
- [ ] Review GA4 analytics
- [ ] Check Search Console for crawl errors
- [ ] Update sitemap.xml if adding/removing cities
- [ ] Review Netlify build logs for warnings

---

## Troubleshooting

### Form not submitting
1. Check `.env` has SENDGRID_API_KEY
2. Verify SendGrid API key is still valid
3. Check Netlify function logs for errors
4. Test locally first

### GA4 not tracking
1. Verify GA4 ID is correct (starts with `G-`)
2. Check GA4 property is live (Analytics > Admin)
3. Clear browser cache
4. Disable ad blockers
5. Wait 30+ seconds for real-time event

### 404 errors on city pages
1. Ensure all routes are configured in DNS/Netlify
2. City pages redirect through SPA router
3. Check React Router configuration

### Slow performance
1. Run Lighthouse: https://pagespeed.web.dev/
2. Optimize images (use WebP format)
3. Check cache headers: inspect → Network tab
4. Consider CDN node location if users are global

---

## Helpful Links

- **Netlify Dashboard:** https://app.netlify.com
- **Google Analytics:** https://analytics.google.com
- **Google Search Console:** https://search.google.com/search-console
- **SendGrid Dashboard:** https://app.sendgrid.com
- **Domain Settings:** GoDaddy > Nameservers (should point to Netlify)

---

## Success Metrics

✅ **Form Submissions**: Track in GA4 Events > form_submission  
✅ **Conversion Rate**: Monitor ratio of form starts to submissions  
✅ **Performance**: Lighthouse score 90+  
✅ **Uptime**: Monitor Netlify functions (should be 99.9%+)  
✅ **SEO**: Indexed pages in Google Search Console  

---

## Questions?

- SendGrid Issues: https://sendgrid.com/docs/
- Netlify Docs: https://docs.netlify.com/
- GA4 Support: https://support.google.com/analytics
