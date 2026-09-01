import { useState, useEffect, useRef, useMemo } from "react"
import { getCurrentSeason } from "../data/homepageData"
import { themes } from "../themes"

const seasonMessages = {
  shishir: [
    "Frosty mornings, warm chai ☃️",
    "Dew-kissed trails await 🌫️",
    "Crisp air, clear skies ✨",
    "Pack a shawl and go 🧣",
    "Winter's quiet beauty 🏔️",
    "Perfect light for photos 📸",
  ],
  vasant: [
    "Flowers and new destinations 🌸",
    "Fresh season, fresh adventure 🌱",
    "Spring is the best time! 🌺",
    "Bloom where you travel 🌼",
    "New beginnings, new places ✨",
    "Nature's calling you out 🦋",
  ],
  grishma: [
    "Isn't it too hot? 🥵",
    "Wanna go someplace chill? ❄️",
    "Escape the heat! 🌊",
    "Sun's out, bags out! ☀️",
    "Too hot to stay home 🔥",
    "Find your cool spot 🏔️",
  ],
  varsha: [
    "Perfect weather to travel 🌧️",
    "Rain makes everything beautiful 💚",
    "Chase the waterfalls 🌊",
    "Cozy trip season is here ☕",
    "Monsoon magic awaits 🌿",
    "Get drenched in adventure 💧",
  ],
  sharad: [
    "Golden season, golden trips 🍁",
    "Best time to explore India 🗺️",
    "Cool breeze, warm memories 🌅",
    "Pack light, travel far 🎒",
    "Autumn calls for adventure 🍂",
    "Perfect weather, perfect trip ✨",
  ],
  hemant: [
    "Bundle up and hit the road 🧣",
    "Snow is calling! ❄️",
    "Winter wanderlust activated 🏔️",
    "Cold outside, warm memories 🔥",
    "Best chai at hill stations ☕",
    "Find your winter escape 🌨️",
  ],
}

/* ── Floating Particles ── */
const Particles = ({ color }) => {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 8,
      duration: Math.random() * 10 + 12,
      opacity: Math.random() * 0.5 + 0.1,
    })),
  [])

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            bottom: "-10px",
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: p.opacity,
            animation: `particleFloat ${p.duration}s ${p.delay}s linear infinite`,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Gradient Orbs ── */
const GradientOrbs = ({ colors }) => {
  const orbData = [
    { size: 400, top: "10%", left: "15%", anim: "orbDrift1", dur: "20s" },
    { size: 350, top: "60%", right: "10%", anim: "orbDrift2", dur: "25s" },
    { size: 300, top: "40%", left: "50%", anim: "orbDrift3", dur: "18s" },
  ]

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {orbData.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            borderRadius: "50%",
            backgroundImage: `radial-gradient(circle, ${colors[i % colors.length]}30 0%, transparent 70%)`,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            filter: "blur(80px)",
            animation: `${orb.anim} ${orb.dur} ease-in-out infinite`,
            transition: "background 0.8s ease",
          }}
        />
      ))}
    </div>
  )
}

/* ── Typewriter Hook ── */
const useTypewriter = (text, speed = 30) => {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return { displayed, done }
}

/* ── Glass Message Bubble ── */
const MessageBubble = ({ msg, visible, side, theme }) => (
  <div style={{
    position: "absolute",
    [side]: "80px",
    top: "50%",
    transform: "translateY(-50%)",
    maxWidth: "180px",
    padding: "14px 18px",
    borderRadius: "16px",
    backgroundColor: `${theme.card}cc`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${theme.primary}30`,
    color: theme.primary,
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "1.5",
    textAlign: "center",
    letterSpacing: "0.3px",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.8s ease",
    animation: visible ? "floatBubble 4s ease-in-out infinite" : "none",
    boxShadow: `0 8px 32px ${theme.glowColor || 'rgba(0,0,0,0.2)'}`,
    pointerEvents: "none",
  }}>
    {msg}
  </div>
)

/* ══════════════════════ HERO ══════════════════════ */

const Hero = ({ theme, setLocationTheme, onExplore, isMobile }) => {
  const [search, setSearch] = useState("")
  const [searchError, setSearchError] = useState(false)
  const [leftMsg, setLeftMsg] = useState("")
  const [rightMsg, setRightMsg] = useState("")
  const [leftVisible, setLeftVisible] = useState(false)
  const [rightVisible, setRightVisible] = useState(false)
  const [focused, setFocused] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [stateResults, setStateResults] = useState(null)
  const inputRef = useRef(null)

  const subtitle = "Smart trip planning with budget distribution, routes, local phrases and more — all in one place."
  const { displayed: typedSubtitle, done: typingDone } = useTypewriter(subtitle, 25)

  const [seasonLabel, seasonKey] = useState(() => {
    const month = new Date().getMonth() + 1
    if (month >= 3 && month <= 6) return ["☀️ Summer", "summer"]
    if (month >= 7 && month <= 9) return ["🌧️ Monsoon", "monsoon"]
    if (month >= 10 && month <= 11) return ["🍂 Autumn", "autumn"]
    if (month === 12 || month <= 2) return ["❄️ Winter", "winter"]
    return ["🌸 Spring", "spring"]
  })

  const getRandomMsg = (exclude) => {
    const msgs = seasonMessages[seasonKey[1]] || seasonMessages.summer
    const available = msgs.filter(m => m !== exclude)
    return available[Math.floor(Math.random() * available.length)]
  }

  // Trigger entrance animations
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Rotating side messages
  useEffect(() => {
    const showMessages = () => {
      const msg1 = getRandomMsg("")
      const msg2 = getRandomMsg(msg1)
      setLeftMsg(msg1)
      setRightMsg(msg2)
      setLeftVisible(true)
      setRightVisible(true)

      setTimeout(() => {
        setLeftVisible(false)
        setRightVisible(false)
      }, 3000)
    }

    showMessages()
    const interval = setInterval(showMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      const result = onExplore(search.trim())
      if (!result) {
        setSearchError(true)
        setStateResults(null)
      } else if (result && result.type === "state") {
        setSearchError(false)
        setStateResults(result)
      } else {
        setSearchError(false)
        setStateResults(null)
      }
    }
  }

  const suggestions = ["Goa", "Manali", "Jaipur", "Kerala", "Varanasi", "Udaipur", "Rishikesh", "Mumbai"]

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: theme.heroGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 20px 40px",
      position: "relative",
      overflow: "hidden",
      transition: "background-color 0.8s ease",
    }}>

      {/* ── Background Effects ── */}
      <Particles color={theme.particleColor || theme.primary} />
      <GradientOrbs colors={theme.orbColors || [theme.primary, theme.accent, theme.secondary]} />

      {/* — Side Message Bubbles — */}
{!isMobile && (
  <>
    <MessageBubble msg={leftMsg} visible={leftVisible} side="left" theme={theme} />
    <MessageBubble msg={rightMsg} visible={rightVisible} side="right" theme={theme} />
  </>
)}

      {/* ── Main Content ── */}
      <div style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "700px",
        width: "100%",
      }}>

        {/* Season Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 16px",
          borderRadius: "20px",
          backgroundColor: `${theme.primary}15`,
          border: `1px solid ${theme.primary}30`,
          color: theme.primary,
          fontSize: "13px",
          fontWeight: "600",
          marginBottom: "16px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          {seasonLabel[0]} Season
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontFamily: "var(--heading)",
          fontSize: "clamp(36px, 5.5vw, 64px)",
          fontWeight: "700",
          textAlign: "center",
          lineHeight: "1.05",
          marginBottom: "16px",
          color: theme.text,
          letterSpacing: "-3px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
        }}>
          WHERE'S YOUR{" "}
          <span style={{
            backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary}, ${theme.accent}, ${theme.primary})`,
            backgroundSize: "300% 300%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            animation: "gradientShift 4s ease infinite",
          }}>
            NEXT STOP?
          </span>
        </h1>

        {/* Typewriter Subtitle */}
        <p style={{
          color: theme.subtext,
          fontSize: "clamp(14px, 2vw, 17px)",
          textAlign: "center",
          maxWidth: "520px",
          marginBottom: "24px",
          lineHeight: "1.7",
          minHeight: "3.4em",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease 0.3s",
        }}>
          {typedSubtitle}
          {!typingDone && (
            <span style={{
              display: "inline-block",
              width: "2px",
              height: "1em",
              backgroundColor: theme.primary,
              marginLeft: "2px",
              verticalAlign: "text-bottom",
              animation: "cursorBlink 0.8s step-end infinite",
            }} />
          )}
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "560px",
            marginBottom: "24px",
            borderRadius: "50px",
            overflow: "hidden",
            boxShadow: focused
              ? `0 0 0 3px ${theme.glowColor || theme.primary + '44'}, 0 10px 40px ${theme.glowColor || 'rgba(0,0,0,0.3)'}`
              : `0 4px 20px rgba(0,0,0,0.2)`,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: focused ? "scale(1.02)" : "scale(1)",
            opacity: loaded ? 1 : 0,
            animation: loaded ? "fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both" : "none",
          }}
        >
          <input
            ref={inputRef}
            id="hero-search"
            type="text"
            value={search}
            onChange={(e) => { 
              const text = e.target.value;
              setSearch(text); 
              setLocationTheme(text);
              setSearchError(false);
              
              const clean = text.trim().toLowerCase();
              if (clean.length >= 3) {
                const exactStateMatches = allIndiaLocations.filter(l => l.state.toLowerCase() === clean);
                let matchedState = null;
                let cities = [];
                if (exactStateMatches.length > 0) {
                  matchedState = exactStateMatches[0].state;
                  cities = exactStateMatches;
                } else {
                  const startsWithStateMatches = allIndiaLocations.filter(l => l.state.toLowerCase().startsWith(clean));
                  if (startsWithStateMatches.length > 0) {
                    matchedState = startsWithStateMatches[0].state;
                    cities = startsWithStateMatches;
                  }
                }
                
                if (matchedState) {
                  setStateResults({ stateName: matchedState, cities });
                } else {
                  setStateResults(null);
                }
              } else {
                setStateResults(null);
              }
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search a destination e.g. Manali, Goa..."
            style={{
              flex: 1,
              padding: "18px 26px",
              border: "none",
              backgroundColor: `${theme.card}ee`,
              color: theme.text,
              fontSize: "15px",
              fontFamily: "var(--sans)",
              outline: "none",
              transition: "background-color 0.3s ease",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "18px 32px",
              border: "none",
              backgroundImage: theme.gradient,
              color: "#fff",
              fontFamily: "var(--sans)",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              letterSpacing: "1px",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.15)"}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            EXPLORE →
          </button>
        </form>

        {/* Error Message */}
        {searchError && (
          <div style={{
            color: "#FF6B6B",
            fontSize: "14px",
            marginBottom: "20px",
            marginTop: "-12px",
            padding: "8px 16px",
            backgroundColor: "rgba(255, 107, 107, 0.1)",
            border: "1px solid rgba(255, 107, 107, 0.2)",
            borderRadius: "8px",
            animation: "fadeInUp 0.3s ease both"
          }}>
            Location not found. Please try a major city!
          </div>
        )}

        {/* State Results Grid or Quick Suggestions */}
        {stateResults ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
            width: "100%",
            maxWidth: "600px",
            marginTop: "10px",
            animation: "fadeInUp 0.5s ease both",
          }}>
            <div style={{
              gridColumn: "1 / -1",
              color: theme.text,
              fontSize: "16px",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: "8px"
            }}>
              Destinations in {stateResults.stateName}
            </div>
            {stateResults.cities.map((city, i) => (
              <div
                key={city.locationKey}
                onClick={() => {
                  setSearch(city.name);
                  setLocationTheme(city.locationKey);
                  setStateResults(null);
                }}
                style={{
                  backgroundColor: `${theme.card}cc`,
                  border: `1px solid ${theme.primary}40`,
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  animation: `popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.05}s both`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = `${theme.primary}20`
                  e.currentTarget.style.transform = "translateY(-3px)"
                  e.currentTarget.style.boxShadow = `0 6px 16px ${theme.glowColor || 'rgba(0,0,0,0.1)'}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = `${theme.card}cc`
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <span style={{ color: theme.text, fontWeight: "600", fontSize: "14px", textAlign: "center" }}>{city.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <span style={{
              color: theme.subtext,
              fontSize: "13px",
              marginRight: "4px",
              opacity: loaded ? 0.7 : 0,
              transition: "opacity 0.4s ease 0.8s",
            }}>
              Try:
            </span>
            {suggestions.map((place, i) => (
              <span
                key={place}
                onClick={() => { setSearch(place); setLocationTheme(place) }}
                style={{
                  backgroundColor: `${theme.primary}15`,
                  border: `1px solid ${theme.primary}35`,
                  borderRadius: "20px",
                  padding: "6px 16px",
                  color: theme.primary,
                  fontSize: "13px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  animation: loaded
                    ? `popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.9 + i * 0.1}s both`
                    : "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = `${theme.primary}30`
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = `0 4px 12px ${theme.glowColor || 'transparent'}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = `${theme.primary}15`
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                {place}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Scroll Indicator ── */}
      <div style={{
        position: "absolute",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        opacity: loaded ? 0.5 : 0,
        transition: "opacity 0.6s ease 1.5s",
        animation: "bounce 2s ease infinite",
        pointerEvents: "none",
      }}>
        <span style={{
          color: theme.subtext,
          fontSize: "11px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          fontWeight: "500",
        }}>
          Scroll
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.subtext} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  )
}

export default Hero