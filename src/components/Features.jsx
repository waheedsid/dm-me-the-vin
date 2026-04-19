import React from 'react'
import FeatureCard from './FeatureCard'

export default function Features() {
  const features = [
    {
      icon: '🚗',
      title: 'Instant Valuation',
      description: 'We use your VIN to instantly identify your car\'s exact details and market-based pricing.'
    },
    {
      icon: '💻',
      title: 'No Dealership',
      description: 'Skip the haggling and pressure. Direct offers from vetted local buyers.'
    },
    {
      icon: '👥',
      title: 'Real People',
      description: 'Connect with actual buyers, not automated systems. Transparent from start to finish.'
    },
    {
      icon: '⚡',
      title: 'Fast & Flexible',
      description: 'Sell on YOUR schedule. Multiple pickup times available. No rushing.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your personal data is never shared. Encrypted communication throughout.'
    },
    {
      icon: '💰',
      title: 'Fair Pricing',
      description: 'Based on current market trends and condition. No hidden fees or surprises.'
    }
  ]

  return (
    <section className="features section">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose DM Me The VIN</h2>
          <p>We handle the hard part. You get the best deal.</p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
