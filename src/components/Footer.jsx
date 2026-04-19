import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h6>DM Me The VIN</h6>
            <p>Sell your car fast. Fair offers. No dealership hassle.</p>
          </div>

          <div className="footer-section">
            <h6>Quick Links</h6>
            <ul>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="mailto:contact@dmmethevin.com">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h6>Legal</h6>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/contact">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} DM Me The VIN. All rights reserved.</p>
          <div className="footer-meta">
            <span>Made with ❤️ by car sellers, for car sellers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
