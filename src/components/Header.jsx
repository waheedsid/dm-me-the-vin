import React, { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="brand">
            <h2>🚗 DM Me The VIN</h2>
          </div>

          <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            <a href="mailto:contact@dmmethevin.com">Contact</a>
          </nav>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}
