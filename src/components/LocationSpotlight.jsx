import { useState, useEffect, useRef } from "react"
import { spotPhotos } from "../data/homepageData"
import { fetchImagesWithCache } from "../utils/imageCache"

const LocationSpotlight = ({ theme, activeLocation, locationData }) => {
  const [visible, setVisible] = useState(false)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const fetchedForRef = useRef(null) // track which location we already fetched

  useEffect(() => {
    if (!activeLocation) return

    setVisible(false)
    setLightboxIndex(null)
    const t = setTimeout(() => setVisible(true), 80)

    const key = activeLocation.toLowerCase()

    // Use static fallback if available (instant)
    const staticPhotos = spotPhotos?.[key]
    if (staticPhotos?.heroImages) {
      setImages(staticPhotos.heroImages)
    } else {
      setImages([])
    }

    // Always fetch from API for fresh/better images (unless already fetched for this location)
    if (fetchedForRef.current !== key) {
      fetchedForRef.current = key
      fetchLocationImages(key)
    }

    return () => clearTimeout(t)
  }, [activeLocation])

  const fetchLocationImages = async (key) => {
    const loc = locationData?.[key]
    if (!loc) return

    setLoading(true)
    try {
      const query = `${loc.name} India famous places tourism`
      const urls = await fetchImagesWithCache(query, 6)
      if (urls.length > 0) {
        setImages(urls)
      }
    } catch (err) {
      console.error("LocationSpotlight image fetch failed:", err)
      // Keep static fallback if API fails
    } finally {
      setLoading(false)
    }
  }

  if (!activeLocation) return null

  const key = activeLocation.toLowerCase()
  const loc = locationData?.[key]
  if (!loc) return null

  // Lightbox
  const lightboxImages = images
  const lightboxTotal = lightboxImages.length

  return (
    <>
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
          color: theme.primary, fontSize: "13px",
          letterSpacing: "4px", fontWeight: "700",
          marginBottom: "12px", textTransform: "uppercase",
        }}>
          📍 Famous Spots In
        </div>

        <h2 style={{
          color: theme.text, fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: "900", marginBottom: "40px",
          textAlign: "center", letterSpacing: "-1px",
        }}>
          {loc.name}
        </h2>

        {/* Photos Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(images.length || 4, 4)}, 1fr)`,
          gap: "12px",
          width: "100%",
          maxWidth: "1100px",
          marginBottom: "40px",
        }}>
          {loading && images.length === 0 ? (
            // Shimmer skeletons
            [1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "220px",
                  background: `linear-gradient(110deg, ${theme.card} 30%, ${theme.primary}12 50%, ${theme.card} 70%)`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}
              />
            ))
          ) : images.length > 0 ? (
            images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                onClick={() => setLightboxIndex(i)}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "220px",
                  cursor: "pointer",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s, box-shadow 0.3s ease`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  position: "relative",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 12px 32px ${theme.primary}44`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"}
              >
                <img
                  src={img}
                  alt={`${loc.name} ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  onError={e => { e.currentTarget.style.display = "none" }}
                />
                {/* Expand hint on hover */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,0,0,0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.3s ease",
                  pointerEvents: "none",
                }}>
                  <span style={{
                    color: "#fff", fontSize: "24px",
                    opacity: 0, transition: "opacity 0.3s ease",
                  }}>🔍</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: "1 / -1", textAlign: "center",
              color: theme.subtext, padding: "40px", opacity: 0.6,
            }}>
              📷 Loading images...
            </div>
          )}
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

      {/* Fullscreen Lightbox */}
      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 5000,
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            animation: "fadeIn 0.25s ease",
          }}
        >
          {/* Close */}
          <div
            onClick={() => setLightboxIndex(null)}
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
            fontWeight: "800", fontSize: "16px",
          }}>
            📍 {loc.name}
          </div>

          {/* Main image */}
          <img
            src={lightboxImages[lightboxIndex]}
            alt={`${loc.name} ${lightboxIndex + 1}`}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "85vw", maxHeight: "75vh", objectFit: "contain",
              borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          />

          {/* Prev / Next */}
          {lightboxTotal > 1 && (
            <>
              {[
                { dir: -1, side: "left", char: "‹" },
                { dir: 1, side: "right", char: "›" },
              ].map(({ dir, side, char }) => (
                <div
                  key={side}
                  onClick={e => {
                    e.stopPropagation()
                    setLightboxIndex((lightboxIndex + dir + lightboxTotal) % lightboxTotal)
                  }}
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

          {/* Thumbnails */}
          <div onClick={e => e.stopPropagation()} style={{
            position: "absolute", bottom: "32px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
          }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {lightboxImages.slice(0, 6).map((img, i) => (
                <img
                  key={i} src={img} alt=""
                  onClick={() => setLightboxIndex(i)}
                  style={{
                    width: "52px", height: "36px", objectFit: "cover",
                    borderRadius: "6px", cursor: "pointer",
                    border: lightboxIndex === i ? `2px solid ${theme.primary}` : "2px solid rgba(255,255,255,0.2)",
                    opacity: lightboxIndex === i ? 1 : 0.5,
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "600" }}>
              {lightboxIndex + 1} / {lightboxTotal}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LocationSpotlight