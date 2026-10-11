import { useEffect, useState } from "react"
import { getSeasonKey, themes } from "../themes"
import "./ProductAdPage.css"

const SEASON_DETAILS = {
  shishir: { emoji: "☃️", label: "Shishir", line: "Crisp skies. Quiet roads." },
  vasant: { emoji: "🌸", label: "Vasant", line: "Fresh air. New routes." },
  grishma: { emoji: "☀️", label: "Grishma", line: "Long days. Cooler escapes." },
  varsha: { emoji: "🌧️", label: "Varsha", line: "Rain-washed places await." },
  sharad: { emoji: "🍁", label: "Sharad", line: "Golden light. Clear skies." },
  hemant: { emoji: "❄️", label: "Hemant", line: "Cold mornings. Warm memories." },
}

const PREVIEW_TABS = [
  { label: "Explore", shortLabel: "Search", icon: "⌕" },
  { label: "Budget", shortLabel: "Budget", icon: "◔" },
  { label: "Trip", shortLabel: "Trip", icon: "⌁" },
]

const BUDGET_ROWS = [
  ["Stay", "₹10,000", "40%", "stay"],
  ["Travel", "₹6,250", "25%", "travel"],
  ["Food", "₹5,000", "20%", "food"],
  ["Activities", "₹3,750", "15%", "activities"],
]

const ITINERARY = [
  ["09:00", "Amber Fort", "Entry ₹200 · beat the queues", "🎟"],
  ["13:00", "Lunch at LMB", "Old City · try the ghewar", "🍛"],
  ["16:30", "Hawa Mahal", "Best light at golden hour", "📸"],
  ["19:30", "Chokhi Dhani", "Cab ₹350 · book ahead", "🚕"],
]

function BrandMark() {
  return <span className="product-ad-mark">N→S</span>
}

function ExplorePreview({ season }) {
  return (
    <div className="preview-screen explore-preview">
      <div className="preview-season-pill">
        <span>{season.emoji}</span> {season.label} · {season.line}
      </div>

      <div className="preview-heading">
        <span>Where to</span>
        <strong>next?</strong>
      </div>

      <div className="preview-search is-focused">
        <span className="search-icon">⌕</span>
        <span className="search-value">Jaipur</span>
        <span className="search-caret" />
        <span className="search-submit">→</span>
      </div>

      <div className="destination-preview-card">
        <div className="destination-image-wrap">
          <img src="/landing2/jaipur.webp" alt="Jaipur at golden hour" />
          <span className="image-rating">★ 4.8 · Trending</span>
        </div>
        <div className="destination-card-copy">
          <div>
            <h3>Jaipur</h3>
            <p>Rajasthan · The Pink City</p>
          </div>
          <span className="card-arrow">→</span>
        </div>
        <div className="destination-tags">
          <span className="tag-highlight">🍁 Best in {season.label}</span>
          <span>3D · 2N</span>
          <span>from ₹6,800</span>
        </div>
      </div>

      <div className="preview-suggestions">
        <span>Also worth a stop</span>
        <span>Udaipur</span>
        <span>Jodhpur</span>
      </div>
    </div>
  )
}

function BudgetPreview() {
  return (
    <div className="preview-screen budget-preview">
      <div className="preview-back">← <span>Jaipur · 3 days · 2 travellers</span></div>
      <h2>Split your budget</h2>
      <p className="preview-kicker">TOTAL BUDGET</p>
      <div className="budget-total">₹25,000</div>

      <div className="budget-visual">
        <div className="budget-ring"><div><strong>₹25K</strong><span>smart split</span></div></div>
        <div className="budget-legend">
          {BUDGET_ROWS.map((row) => (
            <div className="legend-row" key={row[0]}>
              <span className={`legend-dot ${row[3]}`} />
              <span>{row[0]}</span>
              <strong>{row[2]}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="budget-rows">
        {BUDGET_ROWS.map((row) => (
          <div className="budget-row" key={row[0]}>
            <div className="budget-row-heading"><span>{row[0]}</span><strong>{row[1]}</strong></div>
            <div className="budget-track"><span className={row[3]} style={{ width: row[2] }} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TripPreview() {
  return (
    <div className="preview-screen trip-preview">
      <div className="trip-title-row">
        <div>
          <p className="preview-kicker">YOUR PERSONAL ITINERARY</p>
          <h2>Your Jaipur trip</h2>
          <p>3 days · ₹24,180 of ₹25,000</p>
        </div>
        <span className="trip-ready">✓ Ready</span>
      </div>
      <div className="trip-progress"><span /></div>
      <div className="day-tabs"><span className="active">Day 1</span><span>Day 2</span><span>Day 3</span></div>

      <div className="itinerary-list">
        {ITINERARY.map((item) => (
          <div className="itinerary-item" key={item[0]}>
            <div className="itinerary-marker">{item[3]}</div>
            <div className="itinerary-copy">
              <span>{item[0]}</span>
              <h3>{item[1]}</h3>
              <p>{item[2]}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="offline-note">✓ Itinerary ready · saved offline</div>
    </div>
  )
}

function PreviewPanel({ activeTab, season }) {
  if (activeTab === 1) return <BudgetPreview />
  if (activeTab === 2) return <TripPreview />
  return <ExplorePreview season={season} />
}

function ProductAdPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const seasonKey = getSeasonKey()
  const season = SEASON_DETAILS[seasonKey] || SEASON_DETAILS.sharad
  const seasonTheme = themes[seasonKey] || themes.sharad

  useEffect(() => {
    document.title = "NEXT·STOP — Plan less. Go further."
    return () => { document.title = "NEXT·STOP" }
  }, [])

  useEffect(() => {
    if (isPaused) return undefined
    const timer = window.setInterval(() => {
      setActiveTab((tab) => (tab + 1) % PREVIEW_TABS.length)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [isPaused])

  return (
    <div
      className="product-ad"
      style={{ "--season-color": seasonTheme.primary, "--season-secondary": seasonTheme.secondary }}
    >
      <div className="product-ad-backdrop" aria-hidden="true" />
      <div className="product-ad-glow product-ad-glow-one" aria-hidden="true" />
      <div className="product-ad-glow product-ad-glow-two" aria-hidden="true" />

      <header className="product-ad-nav">
        <a className="product-ad-brand" href="/" aria-label="NEXT-STOP home">
          <BrandMark />
          <span>NEXT·STOP</span>
        </a>
        <div className="product-ad-nav-right">
          <span className="season-status"><span>{season.emoji}</span> {season.label} live</span>
          <a className="ad-video-link" href="/promo/next-stop-video-ad-v2.html">▶ Watch video</a>
          <a className="ad-login-link" href="/?auth=login">Log in</a>
          <a className="ad-nav-cta" href="/?auth=signup">Start planning <span>↗</span></a>
        </div>
      </header>

      <main className="product-ad-main">
        <section className="product-ad-copy" aria-labelledby="ad-title">
          <p className="ad-eyebrow"><span className="eyebrow-line" /> REAL-TIME TRIPS · ACROSS INDIA</p>
          <h1 id="ad-title">Plan less.<br /><em>Go further.</em></h1>
          <p className="ad-lede">Every stop, every stay, every fare — live. NEXT·STOP turns the messy parts of a trip into one clear plan built around you.</p>
          <div className="ad-actions">
            <a className="ad-primary-cta" href="/?auth=signup">Build my trip <span>→</span></a>
            <a className="ad-secondary-cta" href="#product-preview">See it in action <span>↓</span></a>
          </div>
          <div className="ad-proof-row" aria-label="Product benefits">
            <div><strong>6</strong><span>Indian seasons</span></div>
            <div><strong>∞</strong><span>ways to wander</span></div>
            <div><strong>1</strong><span>personal plan</span></div>
          </div>
          <p className="ad-season-line">{season.emoji} {season.label} is calling — {season.line.toLowerCase()}</p>
        </section>

        <section
          className="product-ad-demo"
          id="product-preview"
          aria-label="NEXT-STOP product preview"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="floating-chip chip-live"><span className="live-dot" /> LIVE FARES <strong>updating</strong></div>
          <div className="floating-chip chip-budget">₹25K <strong>smart split</strong></div>
          <div className="floating-chip chip-weather">☀️ 29° · clear skies</div>

          <div className="product-ad-device-shell">
            <div className="device-side-button device-side-button-one" />
            <div className="device-side-button device-side-button-two" />
            <div className="product-ad-device">
              <div className="device-status"><span>9:41</span><i /><span>▮▮▮ ◼</span></div>
              <div className="device-appbar">
                <div className="device-brand"><BrandMark /><span>NEXT·STOP</span></div>
                <div className="device-avatar">T</div>
              </div>
              <div className="device-panel">
                <PreviewPanel activeTab={activeTab} season={season} />
              </div>
              <nav className="device-tabs" aria-label="Preview screens">
                {PREVIEW_TABS.map((tab, index) => (
                  <button
                    className={activeTab === index ? "active" : ""}
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveTab(index)}
                    aria-label={tab.label}
                    aria-pressed={activeTab === index}
                  >
                    <span>{tab.icon}</span><small>{tab.shortLabel}</small>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="preview-caption">
            <span className="caption-index">0{activeTab + 1}</span>
            <div><strong>{PREVIEW_TABS[activeTab].label}</strong><span>{isPaused ? "Tap a tab to explore" : "Your trip, coming together"}</span></div>
            <div className="caption-dots" aria-hidden="true">{PREVIEW_TABS.map((tab, index) => <i className={activeTab === index ? "active" : ""} key={tab.label} />)}</div>
          </div>
        </section>
      </main>

      <footer className="product-ad-footer">
        <span>Search a place. See the possibilities.</span>
        <span className="footer-arrow">↓</span>
        <span>Then let NEXT·STOP do the joining up.</span>
      </footer>
    </div>
  )
}

export default ProductAdPage
