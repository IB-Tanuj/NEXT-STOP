import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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

const LandingPage = ({ theme, isMobile }) => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const featureCards = [
    {
      title: "Smart Budgeting",
      description: "Auto-distribute your budget across travel, stay, and food based on real data.",
      icon: "💰"
    },
    {
      title: "Bus Lovers Mode",
      description: "Dedicated routing and pricing for the ultimate bus journey experiences.",
      icon: "🚌"
    },
    {
      title: "Live Insights",
      description: "Get real-time weather and crowd data to plan your days perfectly.",
      icon: "🌤️"
    },
    {
      title: "AI Itineraries",
      description: "Generate hour-by-hour plans tailored to your exact travel style.",
      icon: "✨"
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: theme.bg,
      fontFamily: "var(--sans)",
      color: theme.text,
      overflowX: "hidden",
    }}>
      
      {/* ── HERO SECTION ── */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: theme.heroGradient,
        position: "relative",
        padding: "80px 20px",
        textAlign: "center",
      }}>
        <Particles color={theme.particleColor || theme.primary} />
        <GradientOrbs colors={theme.orbColors || [theme.primary, theme.accent, theme.secondary]} />

        <div style={{ zIndex: 10, maxWidth: "800px" }}>
          <h1 style={{
            fontFamily: "var(--heading)",
            fontSize: "clamp(48px, 8vw, 84px)",
            fontWeight: "700",
            lineHeight: "1.05",
            marginBottom: "24px",
            letterSpacing: "-2px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
          }}>
            Plan trips <br />
            <span style={{
              backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary}, ${theme.accent}, ${theme.primary})`,
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              animation: "gradientShift 4s ease infinite",
            }}>
              that matter
            </span>
          </h1>
          
          <p style={{
            fontSize: "clamp(16px, 2.5vw, 20px)",
            color: theme.subtext,
            marginBottom: "40px",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.8s ease 0.3s",
            maxWidth: "600px",
            margin: "0 auto 40px auto",
            lineHeight: "1.6",
          }}>
            Create production-ready itineraries, manage budgets, and discover hidden gems in seconds using smart algorithms.
          </p>

          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: "16px 36px",
                borderRadius: "30px",
                border: "none",
                background: theme.gradient,
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                letterSpacing: "1px",
                boxShadow: `0 8px 24px ${theme.glowColor}`,
                transition: "transform 0.3s ease, filter 0.3s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.filter = "brightness(1.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.filter = "brightness(1)";
              }}
            >
              Try NEXT STOP free
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: "16px 36px",
                borderRadius: "30px",
                border: `1px solid ${theme.primary}55`,
                backgroundColor: "transparent",
                color: theme.text,
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = `${theme.primary}22`}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              Log in
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          opacity: loaded ? 0.6 : 0,
          animation: "bounce 2s ease infinite",
        }}>
          <span style={{ fontSize: "12px", color: theme.subtext, letterSpacing: "2px", textTransform: "uppercase" }}>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.subtext} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section style={{
        padding: isMobile ? "80px 20px" : "120px 40px",
        backgroundColor: theme.bg,
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: "700",
          marginBottom: "60px",
        }}>
          Pixel-perfect itineraries
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          {featureCards.map((card, i) => (
            <div key={i} style={{
              backgroundColor: `${theme.card}88`,
              border: `1px solid ${theme.primary}33`,
              borderRadius: "20px",
              padding: "40px 30px",
              textAlign: "left",
              backdropFilter: "blur(10px)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = `0 10px 30px ${theme.primary}22`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>{card.icon}</div>
              <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "12px", color: theme.text }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "15px", color: theme.subtext, lineHeight: "1.6" }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MOCK DASHBOARD PREVIEW ── */}
      <section style={{
        padding: isMobile ? "40px 20px 80px" : "60px 40px 120px",
        display: "flex",
        justifyContent: "center",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1000px",
          height: isMobile ? "300px" : "600px",
          borderRadius: "16px",
          border: `1px solid ${theme.primary}44`,
          backgroundColor: `${theme.card}aa`,
          backgroundImage: `linear-gradient(to bottom, transparent, ${theme.bg})`,
          boxShadow: `0 20px 60px ${theme.glowColor}`,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <p style={{ color: theme.subtext, fontSize: "18px", fontWeight: "500" }}>
            [ Dashboard UI Preview ]
          </p>
        </div>
      </section>
      
      {/* ── FOOTER ── */}
      <footer style={{
        padding: "40px 20px",
        borderTop: `1px solid ${theme.primary}22`,
        textAlign: "center",
        color: theme.subtext,
        fontSize: "14px",
      }}>
        © 2026 NEXT STOP, Inc. · Built for explorers.
      </footer>
    </div>
  );
};

export default LandingPage;
