import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import RainCanvas from "./Landing/RainCanvas"
import RainAudio from "./Landing/RainAudio"
import SeasonTimer from "./Landing/SeasonTimer"
import FeatureCarousel from "./Landing/FeatureCarousel"
import DestinationGrid from "./Landing/DestinationGrid"
import LandingAuthDrawer from "./Landing/LandingAuthDrawer"
import "./Landing/LandingStyles.css"
import { getSeasonKey } from "../themes"

const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const bgRef = useRef(null)
  const wrapperRef = useRef(null)
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
      // Clean up URL without reloading
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

  // Current season determines if rain is shown (varsha = monsoon)
  const showRain = seasonKey === "varsha"

  const { timerCard, seasonBadge, seasonEmoji, seasonName } = SeasonTimer()

  // Parallax background scroll tracking
  useEffect(() => {
    const bgImg = bgRef.current
    if (!bgImg) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const INTRO_MS = 1300

    const tick = (now) => {
      // Safety check: sometimes 'now' from requestAnimationFrame isn't perfectly formed immediately
      const safeNow = typeof now === 'number' && !isNaN(now) ? now : performance.now()
      
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const scrollY = typeof window.scrollY === 'number' ? window.scrollY : 0
      const p = Math.min(1, scrollY / maxScroll)
      
      const imgHeight = typeof bgImg.offsetHeight === 'number' ? bgImg.offsetHeight : 0
      const maxY = Math.max(0, imgHeight - window.innerHeight)
      const targetY = -p * maxY || 0 // fallback to 0 if NaN

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
    const revealables = wrapper.querySelectorAll(".section-head, .dest-card, .carousel-hint, .footer, .destinations")
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

  // Season-specific description text
  const seasonDescriptions = {
    varsha: "It's the land's lushest season. Travel while it pours.",
    grishma: "The sun blazes — find your escape to cooler ground.",
    sharad: "Golden light, clear skies — the best season to explore.",
    hemant: "Cold air, warm hearts — India's winter awaits.",
    shishir: "Dew-kissed mornings and crisp trails before spring.",
    vasant: "Flowers bloom across the land — spring is here.",
  }

  return (
    <div className="landing-page" ref={wrapperRef} style={{ position: 'relative', zIndex: 0 }}>
      {/* Background Scene */}
      <div className="bg-scene" aria-hidden="true">
        <img ref={bgRef} src="/landing/bg-falls.png" alt="" />
      </div>

      {/* Rain Canvas (monsoon only) */}
      <RainCanvas enabled={showRain} />

      {/* Slide-out Auth Drawer */}
      <LandingAuthDrawer 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialMode={authMode} 
      />

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <header className="topbar">
          <a className="brand" href="#home">
            <span className="brand-mark">N→S</span>
            <span className="brand-name">NEXT·STOP</span>
          </a>
          <nav className="topbar-right">
            <span className="season-badge">{seasonBadge}</span>
            <button className="btn btn-ghost" type="button" onClick={() => openAuth('login')}>Login</button>
            <button className="btn btn-solid" type="button" onClick={() => openAuth('signup')}>Sign Up</button>
          </nav>
        </header>

        <main className="hero-content">
          <p className="season-line">
            <span>{seasonEmoji}</span> It's <strong>{seasonName}</strong> — {seasonDescriptions[seasonKey] || seasonDescriptions.varsha}
          </p>

          <h1 className="logo">NEXT<span className="logo-dash">–</span>STOP</h1>
          <p className="tagline">Every stop, every stay, every fare — live. One itinerary built around you.</p>
          <p className="description">
            NEXT·STOP is your real-time trip co-pilot: split your budget as you plan,
            compare live hotel prices from hostel bunks to luxury suites, track train,
            flight and bus fares as they move, and dive into spot intel — entry fees,
            permits, rules and expert tips. Then watch it all become a personal itinerary.
          </p>

          <div className="hero-actions">
            <button className="btn btn-solid btn-lg" type="button" onClick={() => openAuth('signup')}>
              Start Planning
            </button>
            <a className="btn btn-outline btn-lg" href="#destinations">
              Explore {seasonName} Picks
            </a>
          </div>

          {timerCard}
        </main>

        <a className="scroll-hint" href="#destinations" aria-label="Scroll down">▾</a>
      </section>

      {/* ── FEATURES CAROUSEL ── */}
      <FeatureCarousel />

      {/* ── DESTINATIONS ── */}
      <DestinationGrid seasonKey={seasonKey} />

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p><strong>NEXT·STOP</strong> — real-time trips, season by season.</p>
        <p className="footer-seasons">
          🌸 Vasant · ☀️ Grishma · 🌧️ Varsha · 🍁 Sharad · ❄️ Hemant · ☃️ Shishir
        </p>
      </footer>

      {/* Rain Audio Toggle (monsoon only) */}
      <RainAudio enabled={showRain} />
    </div>
  )
}

export default LandingPage
