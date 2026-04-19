import React from 'react'

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Enter Your VIN',
      description: 'Takes 30 seconds. We instantly identify your car.',
      icon: '🔍'
    },
    {
      number: '2',
      title: 'Get Instant Offer',
      description: 'Real-time valuation based on current market data.',
      icon: '💻'
    },
    {
      number: '3',
      title: 'Confirm & Schedule',
      description: 'Review details, pick a convenient time to meet.',
      icon: '📅'
    },
    {
      number: '4',
      title: 'Get Paid',
      description: 'Cash in hand at pickup or direct transfer.',
      icon: '💵'
    }
  ]

  return (
    <section id="how-it-works" className="how-it-works section">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Simple. Fast. Fair.</p>
        </div>

        <div className="steps-container">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="step">
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.number}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="step-connector">
                  <span>→</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
