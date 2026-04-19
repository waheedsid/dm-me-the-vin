import React from 'react'

export default function TrustBar() {
  const indicators = [
    { icon: '⚡', label: 'Fast Responses', description: 'Average reply in 45 minutes' },
    { icon: '🔒', label: '100% Secure', description: 'Your data is encrypted & private' },
    { icon: '✓', label: 'No Hassle', description: 'Skip the dealership process' },
    { icon: '📍', label: 'Local Buyers', description: 'Real people, fair offers' },
    { icon: '💰', label: 'Fair Pricing', description: 'Market-based, transparent' },
    { icon: '⏱️', label: 'Quick Process', description: 'From VIN to cash in days' }
  ]

  return (
    <section className="trust-bar">
      <div className="container">
        <div className="trust-grid">
          {indicators.map((item, idx) => (
            <div key={idx} className="trust-item">
              <div className="trust-icon">{item.icon}</div>
              <div className="trust-text">
                <h6>{item.label}</h6>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
