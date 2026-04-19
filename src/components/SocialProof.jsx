import React from 'react'

export default function SocialProof() {
  const stats = [
    { number: '500+', label: 'Car Sellers This Month' },
    { number: '4.8/5', label: 'From Verified Sellers' },
    { number: '2,100+', label: 'Cars Valued' },
    { number: '45 min', label: 'Avg Response Time' }
  ]

  return (
    <section className="social-proof section">
      <div className="container">
        <div className="proof-header">
          <h2>Trusted by Car Sellers</h2>
          <p>Real people getting real offers, fast.</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="proof-testimonial">
          <p className="testimonial-text">
            "I sold my car in less than a week. The whole process was straightforward and the offer was fair. Highly recommend!"
          </p>
          <p className="testimonial-author">— Sarah M., Chicago</p>
        </div>
      </div>
    </section>
  )
}
