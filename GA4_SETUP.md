# Google Analytics 4 Setup Guide

## Quick Start

1. **Get Your GA4 ID:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new property for your website
   - You'll get a Measurement ID (starts with `G-`)

2. **Replace the Placeholder ID:**
   - Open `index.html`
   - Find: `gtag('config', 'G-XXXXXXXXXX');`
   - Replace `G-XXXXXXXXXX` with your actual Measurement ID

3. **Verify It's Working:**
   - Deploy to production
   - Open your website in a new browser
   - Go to Google Analytics > Real-time > Overview
   - You should see your visit appear within 30 seconds

## Events Being Tracked

The app automatically tracks these custom events:

### Form Events
- **`form_start`** — User begins filling out the VIN form
- **`form_submission`** — User submits VIN (success/error)
  - Includes parameters: `success` (true/false), `error_type` (if failed)

### Page Events
- **`page_view`** — Standard GA4 page view
- **`scroll`** — User scrolls (at 25%, 50%, 75%, 100%)

### Button Clicks
- **`click_button`** — CTA button clicks with label

## Custom Events in Code

To add more tracking, use the injected `window` functions:

```javascript
// Track form submission
window.trackFormSubmission(true); // success
window.trackFormSubmission(false, 'invalid_vin'); // error with type

// Track form start
window.trackFormStart();
```

## Testing GA4 Locally

GA4 requires HTTPS or localhost to work. During local development:

1. **Use `netlify dev`** (has HTTPS on localhost):
   ```bash
   netlify dev -p 3000
   ```

2. **Check GA4 Debug Mode:**
   - Go to Google Analytics > Admin > DebugView
   - You should see real-time events from your local machine

3. **Enable Google Analytics Debugger Extension:**
   - Install Chrome extension: "Google Analytics Debugger"
   - Open DevTools console to see GA4 logs

## Environment Variables

No environment variables needed — GA4 ID is hardcoded in `index.html`.

If you prefer environment-based config:

1. Create `.env`:
   ```
   VITE_GA4_ID=G-XXXXXXXXXX
   ```

2. Update `index.html` to read from window config:
   ```html
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', import.meta.env.VITE_GA4_ID);
   </script>
   ```

## Viewing Analytics

1. **Real-time Report:**
   - Analytics > Real-time > Overview
   - See current visitors and events

2. **Custom Events Report:**
   - Analytics > Events
   - Filter by: `form_start`, `form_submission`

3. **Conversion Tracking:**
   - Set up goals based on `form_submission` events
   - Admin > Goals > Create goal from event

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No data in GA4 | Check GA4 ID is correct. Verify HTTPS or localhost. Wait 24 hours for first data. |
| Events not appearing | Open DevTools console, check for gtag errors. Verify `window.trackFormSubmission()` is called. |
| Wrong event names | Check event names match exactly in both code and GA4 config. |

## Next Steps

- [ ] Replace placeholder GA4 ID
- [ ] Deploy to production
- [ ] Verify real-time events appear in GA4
- [ ] Set up email alerts for form submissions
- [ ] Create custom dashboard for KPIs
