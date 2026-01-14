import React, { useState } from 'react'
import './App.css'

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/

export default function App() {
  const [vin, setVin] = useState('')
  const [note, setNote] = useState('')
  const [email, setEmail] = useState('')
  const [hp, setHp] = useState('') // honeypot field
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState(null) // { ok: true/false, error?: string }

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
        setStatus({ ok: true })
        setVin('')
        setNote('')
        setEmail('')
        setHp('')
      } else {
        setStatus({ ok: false, error: data.error || 'Server error' })
      }
    } catch (err) {
      setStatus({ ok: false, error: err.message || 'Network error' })
    } finally {
      setSending(false)
    }
  }

  const normalizedVin = normalizeVin(vin)
  const vinError = vin && !validateVin(normalizedVin)

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">DMMeTheVIN</h1>

        {status && (
          <div className={`banner ${status.ok ? 'success' : 'error'}`}>
            {status.ok ? '✓ Submitted successfully!' : `✗ ${status.error}`}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="vin" className="required">VIN Number</label>
            <input
              id="vin"
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="e.g., 1HGBH41JXMN109186"
              disabled={sending}
              maxLength="17"
            />
            <p className="helper-text">17 characters (A-Z, 0-9, no I, O, Q)</p>
            {vinError && <p className="error-text">Invalid VIN format</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={sending}
            />
            <p className="helper-text">Optional — for your reference only</p>
          </div>

          <div className="form-group">
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional info about this VIN..."
              disabled={sending}
              rows={3}
            />
            <p className="helper-text">Optional</p>
          </div>

          {/* Honeypot field (hidden from user) */}
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

          <button type="submit" disabled={sending || !vin || vinError} className="submit-btn">
            {sending ? 'Submitting...' : 'Submit VIN'}
          </button>
        </form>
      </div>
    </div>
  )
}
