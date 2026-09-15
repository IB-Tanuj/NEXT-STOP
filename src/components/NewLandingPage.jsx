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
  const bgRef = useRef(null)
  const rafRef = useRef(null)
  const bgYRef = useRef(0)
  const pageStartRef = useRef(performance.now())
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

  // Parallax background scroll tracking
  useEffect(() => {
    const bgImg = bgRef.current
    if (!bgImg) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const INTRO_MS = 1300

    const tick = (now) => {
      const safeNow = typeof now === 'number' && !isNaN(now) ? now : performance.now()
      
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const scrollY = typeof window.scrollY === 'number' ? window.scrollY : 0
      const p = Math.min(1, scrollY / maxScroll)
      
      const imgHeight = typeof bgImg.offsetHeight === 'number' ? bgImg.offsetHeight : 0
      const maxY = Math.max(0, imgHeight - window.innerHeight)
      const targetY = -p * maxY || 0

      if (reduceMotion) {
        bgYRef.current = targetY
        const y = isNaN(bgYRef.current) ? 0 : bgYRef.current
        bgImg.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
      } else {
        const currentY = isNaN(bgYRef.current) ? 0 : bgYRef.current
        bgYRef.current = currentY + (targetY - currentY) * 0.09
        
        const t = Math.min(1, Math.max(0, (safeNow - pageStartRef.current) / INTRO_MS))
        const ease = 1 - Math.pow(1 - t, 3)
        const scale = 1.34 - 0.34 * ease
        
        const finalY = isNaN(bgYRef.current) ? 0 : bgYRef.current
        const finalScale = isNaN(scale) ? 1 : scale
        
        bgImg.style.transform = `translate3d(0, ${finalY.toFixed(2)}px, 0) scale(${finalScale.toFixed(4)})`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

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
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.3, pointerEvents: 'none', overflow: 'hidden' }}>
        <img ref={bgRef} src="/landing2/background.webp" alt="background" style={{ width: '100%', height: '185vh', objectFit: 'cover', willChange: 'transform' }} />
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
