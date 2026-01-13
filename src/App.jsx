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
      <h1 className="title">DMMeTheVIN</h1>

      {status && (
        <div className={`banner ${status.ok ? 'success' : 'error'}`}>
          {status.ok ? '✓ Submitted' : `✗ ${status.error}`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="vin">VIN Number *</label>
          <input
            id="vin"
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="e.g., 1HGBH41JXMN109186"
            disabled={sending}
          />
          {vinError && <p className="error-text">VIN must be 17 characters (A-Z 0-9, excluding I, O, Q)</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email (optional)</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={sending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (optional)</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Additional info..."
            disabled={sending}
            rows={4}
          />
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
        />

        <button type="submit" disabled={sending || !vin || vinError} className="submit-btn">
          {sending ? 'Sending...' : 'Submit VIN'}
        </button>
      </form>
    </div>
  )
}
