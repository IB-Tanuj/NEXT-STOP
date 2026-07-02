import { useState, useEffect } from "react"
import { spotPhotos } from "../data/homepageData"

const LocationSpotlight = ({ theme, activeLocation, locationData }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (activeLocation) {
      setVisible(false)
      const t = setTimeout(() => setVisible(true), 80)
      return () => clearTimeout(t)
    }
  }, [activeLocation])

  if (!activeLocation) return null

  const key = activeLocation.toLowerCase()
  const loc = locationData?.[key]
  const photo = spotPhotos?.[key]

  if (!loc || !photo) return null

  return (
    <div style={{
      width: "100%",
      padding: "80px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: theme.bg,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    }}>

      <div style={{
        color: theme.primary,
        fontSize: "13px",
        letterSpacing: "4px",
        fontWeight: "700",
        marginBottom: "12px",
        textTransform: "uppercase",
      }}>
        📍 Famous Spots In
      </div>

      <h2 style={{
        color: theme.text,
        fontSize: "clamp(28px, 5vw, 42px)",
        fontWeight: "900",
        marginBottom: "40px",
        textAlign: "center",
        letterSpacing: "-1px",
      }}>
        {loc.name}
      </h2>

      {/* 4 Photos Side by Side */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",
        width: "100%",
        maxWidth: "1100px",
        marginBottom: "40px",
      }}>
        {photo.heroImages.map((img, i) => (
          <div
            key={i}
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              height: "220px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={img}
              alt={`${loc.name} ${i + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
          </div>
        ))}
      </div>

      {/* Spot Chips */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        justifyContent: "center",
        maxWidth: "900px",
      }}>
        {loc.spots?.map((spot, i) => (
          <div
            key={spot.name}
            style={{
              padding: "12px 22px",
              borderRadius: "30px",
              background: theme.card,
              border: `1px solid ${theme.primary}44`,
              color: theme.text,
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`,
              cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${theme.primary}22`
              e.currentTarget.style.border = `1px solid ${theme.primary}`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = theme.card
              e.currentTarget.style.border = `1px solid ${theme.primary}44`
            }}
          >
            <span style={{ fontSize: "18px" }}>{spot.emoji}</span>
            {spot.name}
          </div>
        ))}
      </div>

    </div>
  )
}

export default LocationSpotlight