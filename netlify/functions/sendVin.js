const sgMail = require('@sendgrid/mail')

// Simple in-memory rate limiter per IP
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 5 // max requests per window

// Generate request ID
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function getRequestId(event) {
  return event.headers['x-nf-request-id'] || generateRequestId()
}

function checkRateLimit(ip) {
  const now = Date.now()
  const key = ip || 'unknown'

  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  const record = rateLimitMap.get(key)

  if (now > record.resetTime) {
    // Window expired, reset
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false // Rate limited
  }

  record.count++
  return true
}

function getClientIp(event) {
  // Check x-forwarded-for header first (set by Netlify)
  const forwarded = event.headers['x-forwarded-for']
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return event.headers['client-ip'] || 'unknown'
}

function validateVin(vin) {
  const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/
  return VIN_REGEX.test(vin)
}

function validateOrigin(event) {
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || ''
  if (!allowedOriginsEnv) {
    // If not set, allow all (for development)
    return true
  }

  const allowedOrigins = allowedOriginsEnv.split(',').map((o) => o.trim())
  const origin = event.headers.origin

  return allowedOrigins.includes(origin)
}

function buildEmailBody(data, clientIp, userAgent) {
  const timestamp = new Date().toISOString()

  let body = `New VIN Submission\n\n`
  body += `VIN: ${data.vin}\n`
  if (data.note) body += `Note: ${data.note}\n`
  if (data.email) body += `User Email: ${data.email}\n`
  body += `\n---\n`
  body += `Timestamp: ${timestamp}\n`
  if (clientIp) body += `IP: ${clientIp}\n`
  if (userAgent) body += `User Agent: ${userAgent}\n`

  return body
}

exports.handler = async (event) => {
  const requestId = getRequestId(event)
  const clientIp = getClientIp(event)

  try {
    // Log incoming request (for debugging)
    console.log(`[${requestId}] Incoming request: method=${event.httpMethod}, origin=${event.headers.origin}`)

    // Only allow POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Method not allowed', requestId })
      }
    }

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': event.headers.origin || '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: ''
      }
    }

    // CORS check
    if (!validateOrigin(event)) {
      console.log(`[${requestId}] CORS denied: origin=${event.headers.origin}`)
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Forbidden origin', requestId })
      }
    }

    // Rate limiting
    if (!checkRateLimit(clientIp)) {
      console.log(`[${requestId}] Rate limit hit for IP: ${clientIp}`)
      return {
        statusCode: 429,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Rate limit exceeded', requestId })
      }
    }

    // Parse JSON body
    if (!event.body) {
      console.log(`[${requestId}] Empty request body`)
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Request body is empty', requestId })
      }
    }

    let data
    try {
      data = JSON.parse(event.body)
      console.log(`[${requestId}] Parsed payload keys: ${Object.keys(data).join(', ')}`)
    } catch (err) {
      console.log(`[${requestId}] JSON parse error: ${err.message}`)
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Invalid JSON', requestId })
      }
    }

    // Honeypot check
    if (data.hp && data.hp.length > 0) {
      console.log(`[${requestId}] Honeypot triggered for IP: ${clientIp}`)
      // Silently fail to confuse bots
      return {
        statusCode: 429,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Rate limit exceeded', requestId })
      }
    }

    // Validate VIN
    if (!data.vin || !validateVin(data.vin)) {
      console.log(`[${requestId}] Invalid VIN: ${data.vin}`)
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Invalid VIN format', requestId })
      }
    }

    // Check env vars
    const apiKey = process.env.SENDGRID_API_KEY
    const toEmail = process.env.TO_EMAIL || 'Waheed.webdev@gmail.com'
    const fromEmail = process.env.FROM_EMAIL

    const hasApiKey = !!apiKey
    const hasFromEmail = !!fromEmail

    console.log(`[${requestId}] Env vars present: apiKey=${hasApiKey}, fromEmail=${hasFromEmail}, toEmail=${!!toEmail}`)

    if (!hasApiKey || !hasFromEmail) {
      console.error(`[${requestId}] Missing critical env vars: apiKey=${hasApiKey}, fromEmail=${hasFromEmail}`)
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ok: false,
          error: 'Server error',
          requestId,
          hint: 'Missing SENDGRID_API_KEY or FROM_EMAIL'
        })
      }
    }

    // Initialize SendGrid with API key
    sgMail.setApiKey(apiKey)

    // Build email
    const userAgent = event.headers['user-agent'] || 'unknown'
    const emailBody = buildEmailBody(data, clientIp, userAgent)

    console.log(`[${requestId}] Sending email via SendGrid to: ${toEmail}`)

    const response = await sgMail.send({
      to: toEmail,
      from: fromEmail,
      subject: 'DMMeTheVIN - New VIN submission',
      text: emailBody
    })

    console.log(`[${requestId}] SendGrid response status: ${response[0].statusCode}`)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, requestId })
    }
  } catch (error) {
    const requestId = getRequestId(event)
    console.error(`[${requestId}] Uncaught error: ${error.message}`)
    console.error(`[${requestId}] Error stack: ${error.stack}`)

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: false,
        error: 'Server error',
        requestId,
        hint: 'Check function logs for details'
      })
    }
  }
}
