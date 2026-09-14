import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import FallingLeaves from "./Landing/FallingLeaves"
import LandingAudioV2 from "./Landing/LandingAudioV2"
import SeasonTimer from "./Landing/SeasonTimer"
import FeatureCarousel from "./Landing/FeatureCarousel"
import ScrollableDestinationGrid from "./Landing/ScrollableDestinationGrid"
import LandingAuthDrawer from "./Landing/LandingAuthDrawer"
import "./Landing/LandingStyles.css" // Keep original styles for base structure
import { getSeasonKey } from "../themes"

const NewLandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const wrapperRef = useRef(null)
  const seasonKey = getSeasonKey()

  // Drawer state
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  // Check URL parameters to auto-open drawer
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('auth') === 'login') {
      setAuthMode('login')
      setIsAuthOpen(true)
      window.history.replaceState({}, '', '/')
    } else if (params.get('auth') === 'signup') {
      setAuthMode('signup')
      setIsAuthOpen(true)
      window.history.replaceState({}, '', '/')
    }
  }, [location.search])

  const openAuth = (mode) => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  const { timerCard, seasonBadge, seasonEmoji, seasonName } = SeasonTimer()

  // Scroll-reveal observer
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const revealables = wrapper.querySelectorAll(".section-head, .scroll-card, .carousel-hint, .footer, .scrollable-destinations")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    revealables.forEach((el, i) => {
      el.classList.add("reveal")
      el.style.animationDelay = `${(i % 4) * 90}ms`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-page v2-landing" ref={wrapperRef} style={{ position: 'relative', zIndex: 0, background: 'linear-gradient(135deg, #0f172a, #1e1b4b, #2e1065)' }}>
      {/* Background Image Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.3, pointerEvents: 'none' }}>
        <img src="/landing2/background.png" alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <FallingLeaves />

      <LandingAuthDrawer 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialMode={authMode} 
      />

      {/* Switch to Classic View Toggle */}
      <button 
        onClick={() => navigate("/classic")} 
        style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 100,
            padding: '8px 16px',
            background: 'rgba(253, 224, 71, 0.1)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(253, 224, 71, 0.4)',
            color: '#fde047',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'background 0.3s'
        }}
      >
        Classic View
      </button>

      {/* ── HERO ── */}
      <section className="hero" id="home" style={{ position: 'relative', zIndex: 10 }}>
        <header className="topbar">
          <a className="brand" href="#home" style={{ color: '#fde047' }}>
            <span className="brand-mark" style={{ background: '#fde047', color: '#1e1b4b' }}>N→S</span>
            <span className="brand-name">NEXT·STOP</span>
          </a>
          <nav className="topbar-right">
            <span className="season-badge" style={{ border: '1px solid #fde047', color: '#fde047' }}>{seasonBadge}</span>
            <button className="btn btn-ghost" type="button" onClick={() => openAuth('login')} style={{ color: '#f8fafc' }}>Login</button>
            <button className="btn btn-solid" type="button" onClick={() => openAuth('signup')} style={{ background: '#fde047', color: '#1e1b4b' }}>Sign Up</button>
          </nav>
        </header>

        <main className="hero-content" style={{ margin: '0 auto' }}>
          <p className="season-line" style={{ color: '#e2e8f0' }}>
            <span>{seasonEmoji}</span> It's <strong>{seasonName}</strong> — Golden light, clear skies.
          </p>

          <h1 className="logo" style={{ color: '#fde047', textShadow: '0 0 20px rgba(253, 224, 71, 0.3)' }}>NEXT<span className="logo-dash">–</span>STOP</h1>
          <p className="tagline" style={{ color: '#e2e8f0' }}>Every stop, every stay, every fare — live. One itinerary built around you.</p>
          
          <div className="hero-actions" style={{ marginTop: '40px' }}>
            <button className="btn btn-solid btn-lg" type="button" onClick={() => openAuth('signup')} style={{ background: '#fde047', color: '#1e1b4b' }}>
              Start Planning
            </button>
            <a className="btn btn-outline btn-lg" href="#destinations" style={{ borderColor: '#fde047', color: '#fde047' }}>
              Explore Autumn Picks
            </a>
          </div>

          <div style={{ marginTop: '50px' }}>
            {timerCard}
          </div>
        </main>

        <a className="scroll-hint" href="#destinations" aria-label="Scroll down" style={{ color: '#fde047' }}>▾</a>
      </section>

      {/* ── FEATURES CAROUSEL ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <FeatureCarousel />
      </div>

      {/* ── DESTINATIONS (Scrollable) ── */}
      <ScrollableDestinationGrid />

      {/* ── FOOTER ── */}
      <footer className="footer" style={{ position: 'relative', zIndex: 10 }}>
        <p><strong>NEXT·STOP</strong> — real-time trips, season by season.</p>
        <p className="footer-seasons">
          🌸 Vasant · ☀️ Grishma · 🌧️ Varsha · 🍁 Sharad · ❄️ Hemant · ☃️ Shishir
        </p>
      </footer>

      {/* Audio Toggle */}
      <LandingAudioV2 />
    </div>
  )
}

export default NewLandingPage
