import { useState, useEffect, useRef } from "react"

const FEATURES = [
  {
    id: "saved-trips",
    icon: "🗂️",
    accentIcon: "✈️",
    title: "Saved Trips",
    tagline: "Your Dream Destinations, One Tap Away",
    description:
      "Bookmark any trip you love and revisit it anytime. Build your personal travel bucket list with all your plans, itineraries, and favorite spots saved in one beautiful collection — ready whenever you are.",
    highlights: [
      "Instant one-tap bookmarking",
      "Organize by season, mood or budget",
      "Sync across all your devices",
      "Share your collection with friends",
    ],
    gradient: "linear-gradient(135deg, #f97316, #fb923c, #fbbf24)",
    glowColor: "rgba(249, 115, 22, 0.35)",
    accentColor: "#f97316",
    bgPattern: "radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.06) 0%, transparent 50%)",
  },
  {
    id: "saving-track",
    icon: "📍",
    accentIcon: "🛤️",
    title: "Saving Track",
    tagline: "Every Penny Counts, Every Journey Matters",
    description:
      "Track every rupee you spend — in real-time. From chai stops to luxury stays, our intelligent saving tracker maps your spending against your budget and shows where you're winning. Watch your savings grow as you travel smarter.",
    highlights: [
      "Live expense tracking while traveling",
      "Visual budget vs. actual spending",
      "Smart saving suggestions per trip",
      "Spending heat-map by category",
    ],
    gradient: "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)",
    glowColor: "rgba(16, 185, 129, 0.35)",
    accentColor: "#10b981",
    bgPattern: "radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), radial-gradient(circle at 25% 25%, rgba(110, 231, 183, 0.06) 0%, transparent 50%)",
  },
  {
    id: "friend-requests",
    icon: "👥",
    accentIcon: "💌",
    title: "Friends",
    tagline: "Travel Together, Create Memories Forever",
    description:
      "Connect with fellow travelers and friends. Send requests, plan group trips, split budgets, and share live itineraries. Travel is better together — and now your crew is always one invite away.",
    highlights: [
      "Discover travel companions nearby",
      "Group trip planning & voting",
      "Split costs automatically",
      "Real-time trip sync with friends",
    ],
    gradient: "linear-gradient(135deg, #d946ef, #f0abfc, #e879f9)",
    glowColor: "rgba(217, 70, 239, 0.4)",
    accentColor: "#d946ef",
    bgPattern: "radial-gradient(circle at 30% 70%, rgba(217, 70, 239, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(240, 171, 252, 0.08) 0%, transparent 50%)",
  },
]

/* ── Floating particles for background ── */
const FloatingParticle = ({ delay, size, x, y, color, duration }) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      opacity: 0,
      animation: `showcaseFloat ${duration}s ease-in-out ${delay}s infinite`,
      pointerEvents: "none",
    }}
  />
)


/* ── Single Feature Card ── */
const FeatureCard = ({ feature, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false)
  const isEven = index % 2 === 0

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isEven ? "row" : "row-reverse",
        alignItems: "center",
        gap: "clamp(30px, 5vw, 80px)",
        padding: "clamp(30px, 5vw, 60px)",
        borderRadius: "28px",
        background: feature.bgPattern + ", rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: isHovered
          ? `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${feature.glowColor}`
          : "0 20px 60px rgba(0,0,0,0.35)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isVisible
          ? isHovered ? "translateY(-8px)" : "translateY(0)"
          : "translateY(50px)",
        opacity: isVisible ? 1 : 0,
        position: "relative",
        overflow: "hidden",
        flexWrap: "wrap",
        cursor: "default",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border glow on hover */}
      <div
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "28px",
          background: feature.gradient,
          opacity: isHovered ? 0.15 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      />

      {/* Left/Right: Visual Showcase */}
      <div
        style={{
          flex: "1 1 280px",
          minWidth: 280,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Glowing orb background */}
        <div
          style={{
            position: "absolute",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: feature.gradient,
            opacity: isHovered ? 0.2 : 0.1,
            filter: "blur(25px)",
            transition: "all 0.6s ease",
            transform: isHovered ? "scale(1.15)" : "scale(1)",
          }}
        />

        {/* Icon container */}
        <div
          style={{
            position: "relative",
            width: "clamp(160px, 22vw, 220px)",
            height: "clamp(160px, 22vw, 220px)",
            borderRadius: "32px",
            background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
            border: `1px solid rgba(255,255,255,${isHovered ? 0.2 : 0.12})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: isHovered ? "rotate(-3deg) scale(1.05)" : "rotate(0deg) scale(1)",
            boxShadow: isHovered ? `0 20px 50px ${feature.glowColor}` : "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <span style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
            {feature.icon}
          </span>
          <span
            style={{
              position: "absolute",
              top: "-12px",
              right: "-12px",
              fontSize: "1.8rem",
              animation: "showcaseBounce 2s ease-in-out infinite",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
            }}
          >
            {feature.accentIcon}
          </span>

          {/* Stats badge */}
          <div
            style={{
              position: "absolute",
              bottom: "-16px",
              padding: "6px 16px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.6)",
              border: `1px solid ${feature.accentColor}44`,
              backdropFilter: "blur(4px)",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: feature.accentColor,
              whiteSpace: "nowrap",
            }}
          >
            {feature.id === "saved-trips" && "✦ LIVE NOW"}
            {feature.id === "saving-track" && "✦ LIVE NOW"}
            {feature.id === "friend-requests" && "✦ LIVE NOW"}
          </div>
        </div>
      </div>

      {/* Right/Left: Content */}
      <div style={{ flex: "1 1 340px", position: "relative", zIndex: 1 }}>
        <h3
          style={{
            fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "8px",
            background: feature.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {feature.title}
        </h3>

        <p
          style={{
            fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
            fontWeight: 500,
            color: "rgba(255,255,255,0.9)",
            marginBottom: "16px",
            fontStyle: "italic",
          }}
        >
          {feature.tagline}
        </p>

        <p
          style={{
            fontSize: "0.92rem",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.65)",
            fontWeight: 300,
            marginBottom: "24px",
          }}
        >
          {feature.description}
        </p>

        {/* Highlights grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
          {feature.highlights.map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.78)",
                fontWeight: 400,
                lineHeight: 1.45,
                transition: "transform 0.2s ease",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: `${feature.accentColor}22`,
                  border: `1px solid ${feature.accentColor}55`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.55rem",
                  color: feature.accentColor,
                  marginTop: 2,
                }}
              >
                ✓
              </span>
              {h}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Main Showcase Component ── */
const FeaturesShowcase = () => {
  const [visibleCards, setVisibleCards] = useState(new Set())
  const cardsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx)
            setVisibleCards((prev) => new Set([...prev, idx]))
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    )
    cardsRef.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="social-features"
      style={{
        position: "relative",
        padding: "clamp(60px, 10vh, 120px) clamp(16px, 4vw, 60px) clamp(30px, 5vh, 50px)",
        overflow: "hidden",
      }}
    >
      {/* Keyframes */}
      <style>{`
        @keyframes showcaseFloat {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 0.6; transform: translateY(-30px) scale(1); }
        }
        @keyframes showcaseBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(12deg); }
        }
        @keyframes showcaseGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes showcasePulseRing {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>

      {/* Floating background particles */}
      <FloatingParticle delay={0} size={6} x={10} y={20} color="rgba(249, 115, 22, 0.3)" duration={6} />
      <FloatingParticle delay={1.5} size={4} x={85} y={15} color="rgba(139, 92, 246, 0.3)" duration={8} />
      <FloatingParticle delay={2.2} size={8} x={50} y={70} color="rgba(16, 185, 129, 0.25)" duration={7} />
      <FloatingParticle delay={0.8} size={5} x={25} y={80} color="rgba(251, 191, 36, 0.2)" duration={9} />
      <FloatingParticle delay={3} size={3} x={70} y={45} color="rgba(196, 181, 253, 0.25)" duration={5.5} />
      <FloatingParticle delay={1} size={7} x={90} y={75} color="rgba(249, 115, 22, 0.2)" duration={7.5} />

      {/* Section Header */}
      <div
        style={{
          textAlign: "center",
          maxWidth: 680,
          margin: "0 auto clamp(40px, 7vh, 70px)",
        }}
        className="section-head reveal"
      >
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "14px",
            background: "linear-gradient(135deg, #f97316, #10b981, #8b5cf6)",
            backgroundSize: "200% 200%",
            animation: "showcaseGradient 4s ease infinite",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Social & Smart Features
        </p>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "16px",
            color: "#f8fafc",
          }}
        >
          Travel Smarter.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #fde047, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Together.
          </span>
        </h2>
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.6)",
            fontWeight: 300,
          }}
        >
          Save your dream trips, track every rupee, and invite your travel crew — 
          features designed to make every journey unforgettable.
        </p>
      </div>

      {/* Feature Cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(30px, 5vh, 50px)",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {FEATURES.map((feature, i) => (
          <div
            key={feature.id}
            ref={(el) => (cardsRef.current[i] = el)}
            data-idx={i}
            style={{
              transitionDelay: `${i * 150}ms`,
            }}
          >
            <FeatureCard feature={feature} index={i} isVisible={visibleCards.has(i)} />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          textAlign: "center",
          marginTop: "clamp(50px, 8vh, 80px)",
        }}
        className="section-head reveal"
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 36px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🚀</span>
          All these features are live — sign up and start using them today!
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 12px #10b981",
              animation: "showcaseBounce 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturesShowcase
