import Header from './Header';
import Hero from './Hero';
import TrustBar from './TrustBar';
import HowItWorks from './HowItWorks';
import Features from './Features';
import VINExplainer from './VINExplainer';
import SocialProof from './SocialProof';
import FAQ from './FAQ';
import FinalCTA from './FinalCTA';
import Footer from './Footer';

export default function CityPage({ city, state, region }) {
  // City-specific copy (customize per city)
  const cityContent = {
    headline: `Sell Your Car for Cash in ${city}, ${state}`,
    subheadline: `Get a fair offer for your vehicle in ${city} in just 3 minutes. No hassle, no dealership required.`,
    stats: [
      { number: '500+', label: `${city} Car Sellers` },
      { number: '4.8/5', label: 'Average Rating' },
      { number: '2,100+', label: `Cars Sold in ${region}` },
      { number: '45 min', label: 'Average Response' }
    ],
    testimonial: {
      text: `I sold my car in ${city} in less than an hour. Super easy process and fair price!`,
      author: 'Sarah M., ' + city
    },
    faqItems: [
      {
        q: `Do you buy cars in ${city}?`,
        a: `Yes! We buy vehicles throughout ${city} and the ${region} area. We handle all the paperwork for you.`
      },
      {
        q: `How quickly can I sell my car in ${city}?`,
        a: `You can get an offer in under 3 minutes. Payment is typically processed within 24-48 hours of inspection.`
      },
      {
        q: `Do I need to drive to your office in ${city}?`,
        a: `No, we come to you! We offer mobile inspection throughout the ${city} area at your convenience.`
      },
      {
        q: `What areas of ${region} do you service?`,
        a: `We service ${city} and surrounding areas including all of ${region}. Contact us to confirm your specific location.`
      },
      {
        q: `Is there a local ${city} showroom?`,
        a: `We primarily offer mobile evaluation throughout ${region}. Call us to discuss your specific needs.`
      },
      {
        q: `Do you accept financed cars in ${city}?`,
        a: `Yes! We handle payoff of existing loans. We'll coordinate with your lender to simplify the process.`
      },
      {
        q: `How is the inspection done in ${city}?`,
        a: `Our certified inspectors evaluate your vehicle's condition, mileage, service history, and market value.`
      },
      {
        q: `What if I need multiple cars appraised in ${city}?`,
        a: `Great! We handle fleet and bulk purchases. Contact us for volume pricing on multiple vehicles.`
      }
    ]
  };

  return (
    <div className="city-page">
      <Header />
      
      <section className="hero city-hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>{cityContent.headline}</h1>
            </div>
            <p className="hero-subtitle">{cityContent.subheadline}</p>
            <div className="hero-form">
              {/* VINForm component would be imported and used here */}
              <p style={{ color: 'var(--color-accent)', fontSize: 'var(--font-size-sm)' }}>
                Enter your VIN to get started →
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />
      <HowItWorks />
      <Features />
      <VINExplainer />

      {/* City-specific social proof */}
      <section className="social-proof section">
        <div className="container">
          <div className="proof-header">
            <h2>Why {city} Residents Choose Us</h2>
            <p>Real results from real customers</p>
          </div>

          <div className="stats-grid">
            {cityContent.stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="proof-testimonial">
            <p className="testimonial-text">"{cityContent.testimonial.text}"</p>
            <p className="testimonial-author">— {cityContent.testimonial.author}</p>
          </div>
        </div>
      </section>

      {/* City-specific FAQ */}
      <section className="faq section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about selling in {city}</p>
          </div>

          <div className="faq-accordion">
            {cityContent.faqItems.map((item, idx) => (
              <div key={idx} className="faq-item">
                <button className="faq-question">
                  <span>{item.q}</span>
                  <span className="faq-toggle">+</span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </div>
  );
}
