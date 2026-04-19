import React, { useState } from 'react'

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)

  const faqs = [
    {
      question: 'Where do I find my VIN?',
      answer: 'Your VIN is located on the bottom left of your windshield, the driver\'s side door frame, or on your vehicle title and registration. It\'s always 17 characters long.'
    },
    {
      question: 'How accurate is your instant offer?',
      answer: 'Our offers are based on current market data and your car\'s details extracted from the VIN. The final offer may adjust after an in-person inspection to account for condition and mileage.'
    },
    {
      question: 'Can I sell a car with a loan on it?',
      answer: 'Yes! We can work with financed vehicles. We\'ll coordinate with your lender to pay off the loan from the sale proceeds.'
    },
    {
      question: 'How fast will I hear back?',
      answer: 'Most offers come back within 45 minutes. You\'ll receive a detailed offer via email with next steps.'
    },
    {
      question: 'Do I need to provide photos?',
      answer: 'Photos are optional but helpful. If you want, you can upload photos to get an even more accurate offer before we meet.'
    },
    {
      question: 'Is there any obligation to sell?',
      answer: 'No. Our offer is a starting point. Youre under no obligation to accept or sell. We\'re here when you\'re ready.'
    },
    {
      question: 'How is payment handled?',
      answer: 'Payment is handled at pickup. We offer cash payment or direct bank transfer, whichever you prefer.'
    },
    {
      question: 'What condition should my car be in?',
      answer: 'Any condition! Mechanical issues, dents, high mileage — we buy them all. Your starting offer accounts for condition based on the VIN and your description.'
    }
  ]

  return (
    <section id="faq" className="faq section">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-accordion">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className={`faq-item ${openIdx === idx ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              >
                <span>{item.question}</span>
                <span className="faq-toggle">{openIdx === idx ? '−' : '+'}</span>
              </button>
              {openIdx === idx && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
