import React, { useState } from 'react'

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/

export default function VINForm({ onSuccess, inline = false, showNote = true, showEmail = true }) {
  const [vin, setVin] = useState('')
  const [note, setNote] = useState('')
  const [email, setEmail] = useState('')
  const [hp, setHp] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState(null)

  const normalizeVin = (v) => v.trim().toUpperCase()
  const validateVin = (v) => VIN_REGEX.test(v)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const normalizedVin = normalizeVin(vin)

    if (!validateVin(normalizedVin)) {
      setStatus({ ok: false, error: 'Invalid VIN format' })
      return
    }

    setSending(true)
    setStatus(null)

    try {
      const res = await fetch('/.netlify/functions/sendVin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin: normalizedVin,
          note: note.trim() || undefined,
          email: email.trim() || undefined,
          hp: hp
        })
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        // Track successful form submission in GA
        if (window.trackFormSubmission) {
          window.trackFormSubmission(true)
        }
        setStatus({ ok: true })
        setVin('')
        setNote('')
        setEmail('')
        setHp('')
        if (onSuccess) onSuccess()
      } else {
        // Track failed form submission in GA
        if (window.trackFormSubmission) {
          window.trackFormSubmission(false)
        }
        setStatus({ ok: false, error: data.error || 'Server error' })
      }
    } catch (err) {
      if (window.trackFormSubmission) {
        window.trackFormSubmission(false)
      }
      setStatus({ ok: false, error: err.message || 'Network error' })
    } finally {
      setSending(false)
    }
  }

  const normalizedVin = normalizeVin(vin)
  const vinError = vin && !validateVin(normalizedVin)

  return (
    <form onSubmit={handleSubmit} className={`vin-form ${inline ? 'inline' : 'stacked'}`}>
      {status && (
        <div className={`form-status ${status.ok ? 'success' : 'error'}`}>
          {status.ok ? (
            <>
              <span className="icon">✓</span>
              <div>
                <strong>Offer Submitted!</strong>
                <p>Check your email for details and next steps.</p>
              </div>
            </>
          ) : (
            <>
              <span className="icon">✕</span>
              <div>
                <strong>Error</strong>
                <p>{status.error}</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="form-fields">
        <div className="field-group">
          <label htmlFor="vin">VIN Number</label>
          <input
            id="vin"
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            onFocus={() => {
              if (window.trackFormStart) {
                window.trackFormStart()
              }
            }}
            placeholder="e.g., 1HGBH41JXMN109186"
            disabled={sending}
            maxLength="17"
            autoCapitalize="on"
          />
          {!vinError && vin && (
            <p className="helper-text success">✓ Valid VIN format</p>
          )}
          {vinError && (
            <p className="helper-text error">✕ Invalid VIN (17 characters, no I, O, Q)</p>
          )}
          {!vin && (
            <p className="helper-text">17 characters — found on windshield or door jamb</p>
          )}
        </div>

        {showEmail && (
          <div className="field-group">
            <label htmlFor="email">Email (optional)</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={sending}
            />
            <p className="helper-text">We'll send your offer details here</p>
          </div>
        )}

        {showNote && (
          <div className="field-group">
            <label htmlFor="note">Note (optional)</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell us about your car's condition, any issues, or special features..."
              disabled={sending}
              rows={3}
            />
            <p className="helper-text">Helps us give you a more accurate offer</p>
          </div>
        )}

        {/* Honeypot field */}
        <input
          type="text"
          name="hp"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          style={{ display: 'none' }}
          tabIndex="-1"
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      <button 
        type="submit" 
        disabled={sending || !vin || vinError}
        className="btn btn-primary btn-large"
      >
        {sending ? '⏳ Getting your offer...' : '💰 Get My Offer'}
      </button>
    </form>
  )
}
