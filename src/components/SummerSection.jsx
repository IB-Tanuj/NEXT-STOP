import { useState, useEffect, useRef } from "react"
import { summerGetaways } from "../data/homepageData"

const ImageSlider = ({ images, theme }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: current === i ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />
      ))}

      {/* Dot indicators */}
      <div style={{
        position: "absolute",
        bottom: "70px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "6px",
        zIndex: 5,
      }}>
        {images.map((_, i) => (
          <div
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
            style={{
              width: current === i ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: current === i ? "#fff" : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Small preview strip */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "6px",
        zIndex: 5,
      }}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
            style={{
              width: "40px",
              height: "28px",
              objectFit: "cover",
              borderRadius: "4px",
              border: current === i ? "2px solid #fff" : "2px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "border 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  )
}

const SummerSection = ({ theme, onLocationClick }) => {
  const [visibleCards, setVisibleCards] = useState([])
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            summerGetaways.forEach((_, i) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, i])
              }, i * 150)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} style={{
      width: "100%",
      padding: "100px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: theme.bg,
    }}>

      <div style={{
        color: theme.primary,
        fontSize: "13px",
        letterSpacing: "4px",
        fontWeight: "700",
        marginBottom: "12px",
        textTransform: "uppercase",
      }}>
        ☀️ Beat The Heat
      </div>

      <h2 style={{
        color: theme.text,
        fontSize: "clamp(28px, 5vw, 42px)",
        fontWeight: "900",
        marginBottom: "12px",
        textAlign: "center",
        letterSpacing: "-1px",
      }}>
        Summer Getaways To Escape To
      </h2>

      <p style={{
        color: theme.subtext,
        fontSize: "15px",
        textAlign: "center",
        maxWidth: "500px",
        marginBottom: "56px",
        lineHeight: "1.7",
      }}>
        It's hot out there — here's where the rest of India is running off to right now.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
        width: "100%",
        maxWidth: "1100px",
      }}>
        {summerGetaways.map((spot, i) => (
          <div
            key={spot.name}
            onClick={() => spot.isExisting && onLocationClick && onLocationClick(spot.name)}
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              height: "340px",
              cursor: spot.isExisting ? "pointer" : "default",
              opacity: visibleCards.includes(i) ? 1 : 0,
              transform: visibleCards.includes(i) ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `0 16px 40px ${theme.primary}44`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"
            }}
          >
            {/* Image Slider */}
            <ImageSlider images={spot.images} theme={theme} />

            {/* Gradient */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.85) 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }} />

            {/* Temp Badge */}
            <div style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "20px",
              padding: "6px 14px",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "700",
              zIndex: 3,
            }}>
              🌡️ {spot.temp}
            </div>

            {/* Text Content */}
            <div style={{
              position: "absolute",
              bottom: "60px",
              left: 0,
              right: 0,
              padding: "0 20px",
              zIndex: 3,
            }}>
              <div style={{
                color: "#fff",
                fontSize: "20px",
                fontWeight: "900",
                marginBottom: "2px",
              }}>
                {spot.name}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "11px",
                marginBottom: "4px",
                fontWeight: "600",
              }}>
                {spot.state}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "12px",
              }}>
                {spot.tagline}
              </div>
              {spot.isExisting && (
                <div style={{
                  marginTop: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: theme.primary,
                  borderRadius: "20px",
                  padding: "5px 12px",
                  fontSize: "10px",
                  fontWeight: "800",
                  color: "#fff",
                  letterSpacing: "1px",
                }}>
                  PLAN THIS TRIP →
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SummerSection