import React from 'react'

export default function VINExplainer() {
  return (
    <section className="vin-explainer section">
      <div className="container">
        <div className="explainer-grid">
          <div className="explainer-text">
            <h2>What's Your VIN & Why Does It Matter?</h2>
            <p>Your Vehicle Identification Number (VIN) is like your car's fingerprint. It contains everything about your vehicle — make, model, year, engine type, and more.</p>
            
            <p>By entering your VIN, we instantly pull accurate data about your car, which means we can give you the most accurate offer possible — faster than any dealer could.</p>

            <h4>Where to find your VIN:</h4>
            <ul className="vin-locations">
              <li>Bottom left corner of your windshield</li>
              <li>Door frame on the driver's side</li>
              <li>Vehicle title or registration document</li>
            </ul>

            <p className="help-text">
              It's always 17 characters and never includes I, O, or Q to avoid confusion with numbers.
            </p>
          </div>

          <div className="explainer-visual">
            <div className="placeholder-image">
              <div className="placeholder-content">
                <span className="icon">🪟</span>
                <p>VIN Windshield Location</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
