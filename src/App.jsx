import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import VINExplainer from './components/VINExplainer'
import SocialProof from './components/SocialProof'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Features />
      <VINExplainer />
      <SocialProof />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  )
}

