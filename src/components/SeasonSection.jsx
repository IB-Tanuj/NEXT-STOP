import { useState, useEffect, useRef } from "react"
import { seasonGetaways, getCurrentSeason } from "../data/homepageData"
import { locationData } from "./TripPage"

// ── Shimmer Skeleton ────────────────────────────────────
const ShimmerCard = ({ theme }) => (
  <div style={{
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    height: "340px",
  }}>
    <div style={{
      width: "100%",
      height: "100%",
      background: `linear-gradient(110deg, ${theme.card} 30%, ${theme.primary}12 50%, ${theme.card} 70%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s ease-in-out infinite",
    }} />
    {/* Fake text lines */}
    <div style={{ position: "absolute", bottom: "60px", left: "20px", right: "20px", zIndex: 3 }}>
      <div style={{ width: "60%", height: "18px", borderRadius: "8px", background: `${theme.primary}15`, marginBottom: "8px" }} />
      <div style={{ width: "40%", height: "12px", borderRadius: "6px", background: `${theme.primary}10` }} />
    </div>
  </div>
)

// ── Fullscreen Lightbox ─────────────────────────────────
const Lightbox = ({ images, index, spotName, theme, onClose, onNav }) => {
  if (index === null || !images?.length) return null
  const total = images.length

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.25s ease",
      }}
    >
      {/* Close */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", top: "24px", right: "28px",
          color: "#fff", fontSize: "28px", cursor: "pointer",
          width: "44px", height: "44px",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "50%", background: "rgba(255,255,255,0.1)",
          transition: "background 0.2s ease", zIndex: 5001,
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
      >✕</div>

      {/* Title */}
      <div style={{
        position: "absolute", top: "28px", left: "50%",
        transform: "translateX(-50%)", color: theme.primary,
        fontWeight: "800", fontSize: "16px", letterSpacing: "0.5px",
      }}>
        {spotName}
      </div>

      {/* Main image */}
      <img
        src={images[index]}
        alt={`${spotName} ${index + 1}`}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: "85vw", maxHeight: "75vh", objectFit: "contain",
          borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      />

      {/* Prev / Next */}
      {total > 1 && (
        <>
          {[
            { dir: -1, side: "left", char: "‹" },
            { dir: 1, side: "right", char: "›" },
          ].map(({ dir, side, char }) => (
            <div
              key={side}
              onClick={e => { e.stopPropagation(); onNav((index + dir + total) % total) }}
              style={{
                position: "absolute", [side]: "16px", top: "50%",
                transform: "translateY(-50%)",
                width: "48px", height: "48px", borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: "22px", color: "#fff",
                transition: "all 0.2s ease", backdropFilter: "blur(8px)",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >{char}</div>
          ))}
        </>
      )}

      {/* Thumbnails + counter */}
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", bottom: "32px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
      }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {images.map((img, i) => (
            <img
              key={i} src={img} alt=""
              onClick={() => onNav(i)}
              style={{
                width: "52px", height: "36px", objectFit: "cover",
                borderRadius: "6px", cursor: "pointer",
                border: index === i ? `2px solid ${theme.primary}` : "2px solid rgba(255,255,255,0.2)",
                opacity: index === i ? 1 : 0.5,
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "600" }}>
          {index + 1} / {total}
        </div>
      </div>
    </div>
  )
}


// ── Main Season Section ─────────────────────────────────
const SeasonSection = ({ theme, onLocationClick }) => {
  const season = getCurrentSeason()
  const data = seasonGetaways[season]

  const [visibleCards, setVisibleCards] = useState([])
  const [cardImages, setCardImages] = useState({}) // { "Coorg": [url1, url2, ...] }
  const [loadingCards, setLoadingCards] = useState({})
  const [lightboxImages, setLightboxImages] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxName, setLightboxName] = useState("")
  const sectionRef = useRef(null)
  const fetchedRef = useRef(false)

  // Fetch images when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !fetchedRef.current) {
            fetchedRef.current = true
            // Stagger card appearance
            data.spots.forEach((_, i) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, i])
              }, i * 150)
            })
            // Fetch images one by one (rate limit safe)
            fetchAllCardImages()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const fetchAllCardImages = async () => {
    for (const spot of data.spots) {
      setLoadingCards(prev => ({ ...prev, [spot.name]: true }))
      try {
        const query = `${spot.name} ${spot.state} India tourism landscape`
        const res = await fetch(`/api/images/search?q=${encodeURIComponent(query)}&limit=4`)
        const json = await res.json()
        const urls = (json.images || []).map(img => img.thumbnail || img.url).filter(Boolean)
        setCardImages(prev => ({ ...prev, [spot.name]: urls.length > 0 ? urls : null }))
      } catch {
        setCardImages(prev => ({ ...prev, [spot.name]: null }))
      } finally {
        setLoadingCards(prev => ({ ...prev, [spot.name]: false }))
      }
      // Rate limit delay
      await new Promise(r => setTimeout(r, 1500))
    }
  }

  const openLightbox = (spotName, imageIndex) => {
    const imgs = cardImages[spotName]
    if (!imgs?.length) return
    setLightboxImages(imgs)
    setLightboxIndex(imageIndex)
    setLightboxName(spotName)
  }

  if (!data) return null

  return (
    <>
      <div ref={sectionRef} style={{
        width: "100%",
        padding: "100px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: theme.bg,
      }}>
        <div style={{
          color: theme.primary, fontSize: "13px",
          letterSpacing: "4px", fontWeight: "700",
          marginBottom: "12px", textTransform: "uppercase",
        }}>
          {data.emoji} {data.label}
        </div>

        <h2 style={{
          color: theme.text, fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: "900", marginBottom: "12px",
          textAlign: "center", letterSpacing: "-1px",
        }}>
          {data.title}
        </h2>

        <p style={{
          color: theme.subtext, fontSize: "15px",
          textAlign: "center", maxWidth: "500px",
          marginBottom: "56px", lineHeight: "1.7",
        }}>
          {data.subtitle}
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px", width: "100%", maxWidth: "1100px",
        }}>
          {data.spots.map((spot, i) => {
            const images = cardImages[spot.name]
            const isLoading = loadingCards[spot.name]
            const hasLocation = !!locationData[spot.locationKey]
            const currentImg = images?.[0]

            // Still loading → shimmer
            if (isLoading && !images) {
              return (
                <div
                  key={spot.name}
                  style={{
                    opacity: visibleCards.includes(i) ? 1 : 0,
                    transform: visibleCards.includes(i) ? "translateY(0)" : "translateY(30px)",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                  }}
                >
                  <ShimmerCard theme={theme} />
                </div>
              )
            }

            return (
              <div
                key={spot.name}
                onClick={() => {
                  if (hasLocation && onLocationClick) {
                    onLocationClick(spot.name)
                  }
                }}
                style={{
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  height: "340px",
                  cursor: hasLocation ? "pointer" : "default",
                  opacity: visibleCards.includes(i) ? 1 : 0,
                  transform: visibleCards.includes(i) ? "translateY(0)" : "translateY(30px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 16px 40px ${theme.primary}44`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"}
              >
                {/* Background image */}
                {currentImg ? (
                  <img
                    src={currentImg}
                    alt={spot.name}
                    loading="lazy"
                    decoding="async"
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(135deg, ${theme.card}, ${theme.primary}22)`,
                  }} />
                )}

                {/* Gradient overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.85) 100%)",
                  zIndex: 2, pointerEvents: "none",
                }} />

                {/* Temp badge */}
                <div style={{
                  position: "absolute", top: "16px", right: "16px",
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "20px", padding: "6px 14px",
                  color: "#fff", fontSize: "12px", fontWeight: "700", zIndex: 3,
                }}>
                  🌡️ {spot.temp}
                </div>

                {/* Expand icon (top-left) — opens lightbox */}
                {images?.length > 0 && (
                  <div
                    onClick={e => {
                      e.stopPropagation()
                      openLightbox(spot.name, 0)
                    }}
                    style={{
                      position: "absolute", top: "16px", left: "16px",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      borderRadius: "50%", width: "36px", height: "36px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", fontSize: "16px", color: "#fff", zIndex: 3,
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  >
                    🔍
                  </div>
                )}

                {/* Text content */}
                <div style={{
                  position: "absolute", bottom: "20px",
                  left: 0, right: 0, padding: "0 20px", zIndex: 3,
                }}>
                  <div style={{ color: "#fff", fontSize: "20px", fontWeight: "900", marginBottom: "2px" }}>
                    {spot.name}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginBottom: "4px", fontWeight: "600" }}>
                    {spot.state}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", marginBottom: "10px" }}>
                    {spot.tagline}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {hasLocation ? (
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        background: theme.primary, borderRadius: "20px",
                        padding: "5px 12px", fontSize: "10px",
                        fontWeight: "800", color: "#fff", letterSpacing: "1px",
                      }}>
                        PLAN THIS TRIP →
                      </div>
                    ) : (
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        background: "rgba(255,255,255,0.12)", borderRadius: "20px",
                        padding: "5px 12px", fontSize: "10px",
                        fontWeight: "800", color: "rgba(255,255,255,0.5)", letterSpacing: "1px",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}>
                        🔜 COMING SOON
                      </div>
                    )}

                    {/* Thumbnail strip */}
                    {images?.length > 1 && (
                      <div style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
                        {images.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            onClick={e => {
                              e.stopPropagation()
                              openLightbox(spot.name, idx)
                            }}
                            style={{
                              width: "28px", height: "20px", objectFit: "cover",
                              borderRadius: "4px", cursor: "pointer",
                              border: idx === 0 ? `1px solid ${theme.primary}` : "1px solid rgba(255,255,255,0.3)",
                              opacity: idx === 0 ? 1 : 0.6,
                              transition: "opacity 0.2s ease",
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                            onMouseLeave={e => { if (idx !== 0) e.currentTarget.style.opacity = "0.6" }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        spotName={lightboxName}
        theme={theme}
        onClose={() => setLightboxIndex(null)}
        onNav={setLightboxIndex}
      />
    </>
  )
}

export default SeasonSection
