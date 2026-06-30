import { useState, useEffect } from "react"

const Navbar = ({ theme }) => {
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = ["Explore", "Plan Trip", "Budget", "About"]

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: scrolled ? "12px 40px" : "20px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      borderBottom: `1px solid ${theme.primary}18`,
      backgroundColor: `${theme.bg}bb`,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: scrolled
        ? `0 4px 30px ${theme.glowColor || 'rgba(0,0,0,0.3)'}`
        : "none",
    }}>
      {/* Logo */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
      }}>
        <span style={{
          fontSize: "22px",
          transition: "transform 0.5s ease",
          display: "inline-block",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "rotate(20deg) scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "rotate(0deg) scale(1)"}
        >
          ✈️
        </span>
        <span style={{
          fontFamily: "var(--heading)",
          fontSize: "22px",
          fontWeight: "700",
          letterSpacing: "3px",
          backgroundImage: theme.gradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          transition: "all 0.8s ease",
        }}>
          NEXT STOP
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {navLinks.map((item) => (
          <span
            key={item}
            style={{
              position: "relative",
              color: hoveredLink === item ? theme.primary : theme.subtext,
              cursor: "pointer",
              fontSize: "14px",
              letterSpacing: "0.5px",
              fontWeight: "500",
              transition: "color 0.3s ease",
              paddingBottom: "4px",
            }}
            onMouseEnter={() => setHoveredLink(item)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {item}
            {/* Animated underline */}
            <span style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              width: hoveredLink === item ? "100%" : "0%",
              height: "2px",
              backgroundImage: theme.gradient,
              borderRadius: "1px",
              transform: "translateX(-50%)",
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }} />
          </span>
        ))}

        {/* CTA Button */}
        <button
          style={{
            backgroundImage: theme.gradient,
            border: "none",
            padding: "10px 26px",
            borderRadius: "25px",
            color: "#fff",
            fontFamily: "var(--sans)",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            letterSpacing: "1px",
            transition: "all 0.3s ease",
            boxShadow: `0 0 20px ${theme.glowColor || 'transparent'}`,
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = `0 6px 30px ${theme.glowColor || 'transparent'}`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = `0 0 20px ${theme.glowColor || 'transparent'}`
          }}
        >
          START PLANNING
        </button>
      </div>
    </nav>
  )
}

export default Navbar
