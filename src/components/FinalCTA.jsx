import React from 'react'
import VINForm from './VINForm'

export default function FinalCTA() {
  return (
    <section className="final-cta section">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Sell?</h2>
          <p>Get your VIN offer now. Takes 30 seconds.</p>
          
          <div className="cta-form-wrapper">
            <VINForm showNote={true} showEmail={true} />
          </div>

          <p className="cta-subtext">
            ✓ No obligation  •  ✓ No pressure  •  ✓ Just a fair price for your car
          </p>
        </div>
      </div>
    </section>
  )
}
