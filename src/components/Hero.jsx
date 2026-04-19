import React from 'react'
import VINForm from './VINForm'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Sell Your Car in 3 Minutes</h1>
          <p className="hero-subtitle">Enter your VIN. Get an instant offer. No dealers. No pressure.</p>
          
          <div className="trust-line">
            <span>✓ Takes 30 seconds</span>
            <span>✓ Secure & private</span>
            <span>✓ No obligation</span>
          </div>
        </div>

        <div className="hero-form">
          <VINForm showNote={false} showEmail={false} />
        </div>
      </div>

      <div className="hero-background"></div>
    </section>
  )
}
