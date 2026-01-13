const sgMail = require('@sendgrid/mail')

// Initialize SendGrid (API key from environment variables)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Simple in-memory rate limiter per IP
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 5 // max requests per window

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
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' })
    }
  }

  // CORS check
  if (!validateOrigin(event)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ ok: false, error: 'Forbidden origin' })
    }
  }

  // Rate limiting
  const clientIp = getClientIp(event)
  if (!checkRateLimit(clientIp)) {
    return {
      statusCode: 429,
      body: JSON.stringify({ ok: false, error: 'Rate limit exceeded' })
    }
  }

  let data
  try {
    data = JSON.parse(event.body)
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: 'Invalid JSON' })
    }
  }

  // Honeypot check
  if (data.hp && data.hp.length > 0) {
    // Bot detected, silently fail or rate limit
    return {
      statusCode: 429,
      body: JSON.stringify({ ok: false, error: 'Rate limit exceeded' })
    }
  }

  // Validate VIN
  if (!data.vin || !validateVin(data.vin)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: 'Invalid VIN format' })
    }
  }

  // Build email
  const userAgent = event.headers['user-agent'] || 'unknown'
  const emailBody = buildEmailBody(data, clientIp, userAgent)

  try {
    await sgMail.send({
      to: process.env.TO_EMAIL || 'Waheed.webdev@gmail.com',
      from: process.env.FROM_EMAIL,
      subject: 'DMMeTheVIN - New VIN submission',
      text: emailBody
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    }
  } catch (error) {
    console.error('SendGrid error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: 'Server error' })
    }
  }
}
