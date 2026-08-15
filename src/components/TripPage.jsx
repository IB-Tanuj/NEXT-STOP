import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import PlanningPage from "./PlanningPage"
import { locationData } from "../data/locationData"
import { fetchImagesWithCache, getCachedImages } from "../utils/imageCache"

export { locationData }

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const LocationBoundary = ({ coords, zoom, theme, locationName, customBoundary }) => {
  const map = useMap()

  useEffect(() => {
    map.setView(coords, zoom, { animate: true, duration: 1.5 })
    map.setMinZoom(4)
    map.setMaxZoom(16)

    const layerGroup = L.layerGroup().addTo(map)

    const boundaryStyle = {
      color: theme.primary,
      weight: 3,
      fillColor: theme.primary,
      fillOpacity: 0.15,
    }

    // Try to find a polygon result from a Nominatim response array
    const findPolygonResult = (data) =>
      data.find(d => d.geojson && (d.geojson.type === 'Polygon' || d.geojson.type === 'MultiPolygon'))

    const addGeoJSON = (geojson) => {
      const geoLayer = L.geoJSON(geojson, { style: boundaryStyle })
      layerGroup.addLayer(geoLayer)
      const bounds = geoLayer.getBounds()
      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds.pad(0.2))
      }
    }

    // Use custom boundary if provided (like Manali)
    if (customBoundary) {
      const polygon = L.polygon(customBoundary, boundaryStyle)
      layerGroup.addLayer(polygon)
      const bounds = polygon.getBounds()
      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds.pad(0.2))
      }
      return () => { layerGroup.remove() }
    }

    // Fetch boundary from Nominatim with smart fallbacks
    const fetchBoundary = async () => {
      const encodedName = encodeURIComponent(locationName)

      // Query strategies — stop at first one that returns a polygon
      const queries = [
        // 1. Standard search with limit=5 to find polygon among results
        `https://nominatim.openstreetmap.org/search?q=${encodedName},India&polygon_geojson=1&format=json&limit=5`,
        // 2. Try district search (works for cities like Mumbai, Chennai)
        `https://nominatim.openstreetmap.org/search?q=${encodedName}+district,India&polygon_geojson=1&format=json&limit=3`,
        // 3. Try municipal corporation (works for Mumbai, Jaipur etc)
        `https://nominatim.openstreetmap.org/search?q=${encodedName}+Municipal+Corporation&polygon_geojson=1&format=json&limit=3`,
      ]

      for (const url of queries) {
        try {
          const res = await fetch(url)
          const data = await res.json()
          const match = findPolygonResult(data)
          if (match) {
            addGeoJSON(match.geojson)
            return
          }
        } catch (err) {
          console.log("Nominatim query failed:", err)
        }
        // Small delay to respect Nominatim rate limits (1 req/sec)
        await new Promise(r => setTimeout(r, 1100))
      }

      console.log(`No Nominatim polygon found for "${locationName}"`)
    }

    fetchBoundary()

    return () => { layerGroup.remove() }
  }, [locationName])

  return null
}


const TripPage = ({ location, theme, onBack }) => {
  const [mapVisible, setMapVisible] = useState(true)
  const [questionsVisible, setQuestionsVisible] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [activeSpot, setActiveSpot] = useState(null)
  const [planningVisible, setPlanningVisible] = useState(false)
  const [showBestTime, setShowBestTime] = useState(false)
  const [spotImages, setSpotImages] = useState({}) // { "Baga Beach": [urls...] }
  const [loadingImages, setLoadingImages] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null) // fullscreen image viewer
  const [bestTimeData, setBestTimeData] = useState(null)
  const fetchingRef = useRef(false) // prevent overlapping API calls (rate limit)

  useEffect(() => {
    if (!location) return;
    const locKey = location.toLowerCase();
    
    // Fetch Best Time data
    const fetchBestTime = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/best-time/${locKey}`);
        if (res.ok) {
          const data = await res.json();
          setBestTimeData(data);
        } else {
          console.error("Failed to fetch best time data");
        }
      } catch (err) {
        console.error("Error fetching best time:", err);
      }
    };

    fetchBestTime();
  }, [location]);

  // Fetch real images from backend when a spot marker is clicked
  const fetchSpotImages = async (spotName, locationName) => {
    // Skip if already cached locally in state or another request is in-flight
    if (spotImages[spotName]) return
    if (fetchingRef.current) return

    const query = `${spotName} ${locationName} India`
    const isCached = !!getCachedImages(query)

    // Only block other requests if we're actually making a network call
    if (!isCached) fetchingRef.current = true
    
    setLoadingImages(true)
    try {
      const urls = await fetchImagesWithCache(query, 4)
      setSpotImages(prev => ({ ...prev, [spotName]: urls.length > 0 ? urls : null }))
    } catch (err) {
      console.error("Image fetch failed:", err)
      setSpotImages(prev => ({ ...prev, [spotName]: null }))
    } finally {
      setLoadingImages(false)
      // Small delay before allowing next request (respects rate limits), but only if we hit the network
      if (!isCached) {
        setTimeout(() => { fetchingRef.current = false }, 1500)
      }
    }
  }

  const loc = locationData[location?.toLowerCase()] || {
    name: location,
    coords: [20.5937, 78.9629], // Center of India
    zoom: 5,
    spots: [],
    customBoundary: null
  }
  const locationKey = location?.toLowerCase()

  const handleContinue = () => {
    setMapVisible(false)
    setTimeout(() => {
      setShowBestTime(true)
    }, 600)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.heroGradient,
      transition: "background 0.8s ease",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* MAP SECTION */}
      {mapVisible && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
        }}>
          {/* Map Header */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `${theme.bg}dd`,
            backdropFilter: "blur(10px)",
          }}>
            <div style={{
              fontSize: "22px",
              fontWeight: "900",
              color: theme.primary,
              letterSpacing: "2px",
            }}>
              NEXT STOP
            </div>
            <div style={{
              color: theme.text,
              fontSize: "18px",
              fontWeight: "700",
            }}>
              📍 {loc.name}
            </div>
            <button
              onClick={onBack}
              style={{
                background: "transparent",
                border: `1px solid ${theme.primary}44`,
                color: theme.subtext,
                padding: "8px 20px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "13px",
              }}>
              ← Change Location
            </button>
          </div>

          {/* Full Screen Map */}
          <MapContainer
            center={loc.coords}
            zoom={loc.zoom}
            minZoom={4}
            maxZoom={16}
            style={{ width: "100%", height: "100vh" }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution="© OpenStreetMap © CARTO"
            />
            <LocationBoundary
              coords={loc.coords}
              zoom={loc.zoom}
              theme={theme}
              locationName={loc.name}
              customBoundary={loc.customBoundary || null}
            />
            {loc.spots.map((spot) => (
              <Marker
                key={spot.name}
                position={spot.coords}
                icon={L.divIcon({
                  className: "",
                  html: `
  <div class="spot-marker" style="position: relative;">
    <div style="
      width: 12px;
      height: 12px;
      background: ${theme.accent};
      border-radius: 50%;
      border: 2px solid ${theme.primary};
      box-shadow: 0 0 6px ${theme.primary}88;
      cursor: pointer;
    "></div>
    <div class="spot-label" style="
      position: absolute;
      left: 16px;
      top: -4px;
      background: ${theme.bg}ee;
      color: ${theme.primary};
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      border: 1px solid ${theme.primary}44;
    ">${spot.name}</div>
  </div>
`,
                  iconAnchor: [6, 6],
                })}
                eventHandlers={{
                  click: () => {
                    const newSpot = activeSpot?.name === spot.name ? null : spot
                    setActiveSpot(newSpot)
                    if (newSpot) {
                      fetchSpotImages(newSpot.name, loc.name)
                    }
                  }
                }}
              >
              </Marker>
            ))}


          </MapContainer>
          {/* Image Popup Overlay */}
          {activeSpot && (
            <div style={{
              position: "fixed",
              bottom: "100px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2000,
              background: `${theme.bg}ee`,
              borderRadius: "20px",
              padding: "20px",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${theme.primary}33`,
              animation: "fadeIn 0.3s ease",
              boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${theme.primary}15`,
              maxWidth: "380px",
              width: "90vw",
            }}>
              <div style={{
                color: theme.primary,
                fontWeight: "800",
                fontSize: "15px",
                textAlign: "center",
                marginBottom: "14px",
                letterSpacing: "0.5px",
              }}>
                {activeSpot.emoji} {activeSpot.name}
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}>
                {loadingImages && !spotImages[activeSpot.name] ? (
                  /* Loading skeleton */
                  [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        borderRadius: "10px",
                        background: `linear-gradient(110deg, ${theme.card} 30%, ${theme.primary}15 50%, ${theme.card} 70%)`,
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.5s ease-in-out infinite",
                      }}
                    />
                  ))
                ) : spotImages[activeSpot.name] ? (
                  /* Real images from API — click to open lightbox */
                  spotImages[activeSpot.name].slice(0, 4).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${activeSpot.name} ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      onClick={() => setLightboxIndex(i)}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: `1px solid ${theme.primary}33`,
                        cursor: "pointer",
                        transition: "transform 0.3s ease, border-color 0.3s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "scale(1.03)"
                        e.currentTarget.style.borderColor = theme.primary
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "scale(1)"
                        e.currentTarget.style.borderColor = `${theme.primary}33`
                      }}
                      onError={e => { e.currentTarget.style.display = "none" }}
                    />
                  ))
                ) : (
                  /* Fallback if API failed */
                  <div style={{
                    gridColumn: "1 / -1",
                    color: theme.subtext,
                    fontSize: "13px",
                    textAlign: "center",
                    padding: "20px",
                    opacity: 0.6,
                  }}>
                    📷 Images couldn't be loaded
                  </div>
                )}
              </div>
              <div
                onClick={() => setActiveSpot(null)}
                style={{
                  color: theme.subtext,
                  fontSize: "12px",
                  textAlign: "center",
                  marginTop: "12px",
                  cursor: "pointer",
                  opacity: 0.7,
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.style.opacity = "0.7"}
              >
                tap here to close ✕
              </div>
            </div>
          )}

          {/* Fullscreen Image Lightbox */}
          {lightboxIndex !== null && activeSpot && spotImages[activeSpot.name] && (() => {
            const images = spotImages[activeSpot.name].slice(0, 4)
            const total = images.length
            return (
              <div
                onClick={() => setLightboxIndex(null)}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 3000,
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
                {/* Close button */}
                <div
                  onClick={() => setLightboxIndex(null)}
                  style={{
                    position: "absolute",
                    top: "24px",
                    right: "28px",
                    color: "#fff",
                    fontSize: "28px",
                    cursor: "pointer",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    transition: "background 0.2s ease",
                    zIndex: 3001,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                >
                  ✕
                </div>

                {/* Spot name */}
                <div style={{
                  position: "absolute",
                  top: "28px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: theme.primary,
                  fontWeight: "800",
                  fontSize: "16px",
                  letterSpacing: "0.5px",
                }}>
                  {activeSpot.emoji} {activeSpot.name}
                </div>

                {/* Main image */}
                <img
                  src={images[lightboxIndex]}
                  alt={`${activeSpot.name} ${lightboxIndex + 1}`}
                  onClick={e => e.stopPropagation()}
                  style={{
                    maxWidth: "85vw",
                    maxHeight: "75vh",
                    objectFit: "contain",
                    borderRadius: "16px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    transition: "opacity 0.3s ease",
                  }}
                  onError={e => { e.currentTarget.src = "" }}
                />

                {/* Prev / Next buttons */}
                {total > 1 && (
                  <>
                    <div
                      onClick={e => {
                        e.stopPropagation()
                        setLightboxIndex((lightboxIndex - 1 + total) % total)
                      }}
                      style={{
                        position: "absolute",
                        left: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        border: `1px solid rgba(255,255,255,0.2)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "22px",
                        color: "#fff",
                        transition: "all 0.2s ease",
                        backdropFilter: "blur(8px)",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    >
                      ‹
                    </div>
                    <div
                      onClick={e => {
                        e.stopPropagation()
                        setLightboxIndex((lightboxIndex + 1) % total)
                      }}
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        border: `1px solid rgba(255,255,255,0.2)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "22px",
                        color: "#fff",
                        transition: "all 0.2s ease",
                        backdropFilter: "blur(8px)",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    >
                      ›
                    </div>
                  </>
                )}

                {/* Image counter + thumbnail strip */}
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    bottom: "32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div style={{
                    display: "flex",
                    gap: "8px",
                  }}>
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        onClick={() => setLightboxIndex(i)}
                        style={{
                          width: "52px",
                          height: "36px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          cursor: "pointer",
                          border: lightboxIndex === i
                            ? `2px solid ${theme.primary}`
                            : "2px solid rgba(255,255,255,0.2)",
                          opacity: lightboxIndex === i ? 1 : 0.5,
                          transition: "all 0.2s ease",
                        }}
                      />
                    ))}
                  </div>
                  <div style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>
                    {lightboxIndex + 1} / {total}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Continue Button */}
          <div style={{
            position: "fixed",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}>
            <button
              onClick={handleContinue}
              style={{
                background: theme.primary,
                border: "none",
                padding: "16px 48px",
                borderRadius: "50px",
                color: "#fff",
                fontWeight: "800",
                fontSize: "16px",
                cursor: "pointer",
                letterSpacing: "2px",
                boxShadow: `0 8px 32px ${theme.primary}66`,
              }}>
              CONTINUE →
            </button>
          </div>
        </div>
      )}
      {/* BEST TIME SECTION */}
      {showBestTime && !questionsVisible && (() => {
        const data = bestTimeData;
        const currentMonth = new Date().toLocaleString("default", { month: "short" })
        const ratingColors = {
          5: "#4CAF50",
          4: "#8BC34A",
          3: "#FFC107",
          2: "#FF9800",
          1: "#f44336",
        }

        return (
          <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            animation: "fadeIn 0.8s ease",
          }}>

            {/* Back to map */}
            <div
              onClick={() => { setShowBestTime(false); setMapVisible(true) }}
              style={{
                position: "absolute",
                top: "30px",
                left: "40px",
                color: theme.subtext,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}>
              ← Back to Map
            </div>

            <div style={{ width: "100%", maxWidth: "620px" }}>

              {/* Header */}
              <div style={{ color: theme.primary, fontSize: "13px", letterSpacing: "4px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>
                📅 BEST TIME TO VISIT
              </div>
              <h2 style={{ color: theme.text, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "900", marginBottom: "8px", textAlign: "center" }}>
                {loc.name}
              </h2>

              {data ? (
                <>
                  {/* Summary Card */}
                  <div style={{
                    background: theme.card,
                    borderRadius: "16px",
                    padding: "20px 24px",
                    border: `1px solid ${theme.primary}33`,
                    marginBottom: "16px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                      <div>
                        <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "4px" }}>✅ Best time</div>
                        <div style={{ color: "#4CAF50", fontWeight: "800", fontSize: "15px" }}>{data.best}</div>
                      </div>
                      <div>
                        <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "4px" }}>❌ Avoid</div>
                        <div style={{ color: "#f44336", fontWeight: "800", fontSize: "15px" }}>{data.avoid}</div>
                      </div>
                    </div>
                    <div style={{ color: theme.subtext, fontSize: "13px", lineHeight: "1.6" }}>
                      {data.summary}
                    </div>
                  </div>

                  {/* Month Grid */}
                  <div style={{
                    background: theme.card,
                    borderRadius: "16px",
                    padding: "20px 24px",
                    border: `1px solid ${theme.primary}33`,
                    marginBottom: "16px",
                  }}>
                    <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "16px" }}>
                      MONTH BY MONTH
                    </div>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "8px",
                    }}>
                      {data.months.map((m) => {
                        const isCurrentMonth = m.month === currentMonth
                        return (
                          <div
                            key={m.month}
                            style={{
                              padding: "10px 6px",
                              borderRadius: "10px",
                              border: `2px solid ${isCurrentMonth ? theme.primary : ratingColors[m.rating] + "44"}`,
                              background: isCurrentMonth ? `${theme.primary}22` : `${ratingColors[m.rating]}11`,
                              textAlign: "center",
                              position: "relative",
                            }}
                          >
                            {isCurrentMonth && (
                              <div style={{
                                position: "absolute",
                                top: "-8px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: theme.primary,
                                color: "#fff",
                                fontSize: "8px",
                                fontWeight: "800",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                whiteSpace: "nowrap",
                              }}>
                                NOW
                              </div>
                            )}
                            <div style={{ color: theme.text, fontWeight: "700", fontSize: "13px", marginBottom: "4px" }}>
                              {m.month}
                            </div>
                            <div style={{ color: ratingColors[m.rating], fontSize: "11px", fontWeight: "600" }}>
                              {m.label}
                            </div>
                            <div style={{ marginTop: "4px" }}>
                              {[...Array(5)].map((_, i) => (
                                <span key={i} style={{
                                  color: i < m.rating ? ratingColors[m.rating] : theme.primary + "22",
                                  fontSize: "8px",
                                }}>●</span>
                              ))}
                            </div>
                            <div style={{ color: theme.subtext, fontSize: "10px", marginTop: "8px", lineHeight: "1.2" }}>
                              {m.note}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Tips */}
                  <div style={{
                    background: theme.card,
                    borderRadius: "16px",
                    padding: "20px 24px",
                    border: `1px solid ${theme.primary}33`,
                    marginBottom: "24px",
                  }}>
                    <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "14px" }}>
                      💡 TRAVEL TIPS
                    </div>
                    {data.tips.map((tip, i) => (
                      <div key={i} style={{
                        color: theme.text,
                        fontSize: "13px",
                        padding: "8px 0",
                        borderBottom: i < data.tips.length - 1 ? `1px solid ${theme.primary}11` : "none",
                        lineHeight: "1.5",
                      }}>
                        {tip}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{
                  background: theme.card,
                  borderRadius: "16px",
                  padding: "40px",
                  border: `1px solid ${theme.primary}33`,
                  textAlign: "center",
                  marginBottom: "24px",
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔜</div>
                  <div style={{ color: theme.text, fontWeight: "700" }}>Best time data coming soon!</div>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={() => {
                  setShowBestTime(false)
                  setQuestionsVisible(true)
                }}
                style={{
                  width: "100%",
                  background: theme.primary,
                  border: "none",
                  padding: "16px",
                  borderRadius: "50px",
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "16px",
                  cursor: "pointer",
                  letterSpacing: "2px",
                  boxShadow: `0 8px 32px ${theme.primary}66`,
                }}>
                CONTINUE TO PLANNING →
              </button>

            </div>
          </div>
        )
      })()}

      {/* QUESTIONS SECTION */}
      {questionsVisible && (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          animation: "fadeIn 0.8s ease",
        }}>

          <div
            onClick={() => { setQuestionsVisible(false); setMapVisible(true) }}
            style={{
              position: "absolute",
              top: "30px",
              left: "40px",
              color: theme.subtext,
              cursor: "pointer",
              fontSize: "14px",
            }}>
            ← Back to Map
          </div>

          <h2 style={{
            color: theme.primary,
            fontSize: "14px",
            letterSpacing: "4px",
            fontWeight: "700",
            marginBottom: "12px",
            textTransform: "uppercase",
          }}>
            📍 {loc.name}
          </h2>

          {/* Question 1 */}
          <div
            onClick={() => setSelectedChoice("explore")}
            style={{
              background: selectedChoice === "explore" ? `${theme.primary}22` : theme.card,
              border: `2px solid ${selectedChoice === "explore" ? theme.primary : theme.primary + "33"}`,
              borderRadius: "16px",
              padding: "24px 32px",
              marginBottom: "16px",
              width: "100%",
              maxWidth: "600px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}>
            <div style={{ color: theme.text, fontSize: "18px", fontWeight: "700" }}>
              🗺️ Do you want to explore all of {loc.name}?
            </div>
            <div style={{ color: theme.subtext, fontSize: "13px", marginTop: "6px" }}>
              We'll plan your full trip covering the best of everything
            </div>
          </div>

          {/* Question 2 */}
          <div
            onClick={() => setSelectedChoice("specific")}
            style={{
              background: selectedChoice === "specific" ? `${theme.primary}22` : theme.card,
              border: `2px solid ${selectedChoice === "specific" ? theme.primary : theme.primary + "33"}`,
              borderRadius: "16px",
              padding: "24px 32px",
              marginBottom: "32px",
              width: "100%",
              maxWidth: "600px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}>
            <div style={{ color: theme.text, fontSize: "18px", fontWeight: "700" }}>
              📍 Do you have a specific place in mind in {loc.name}?
            </div>
            <div style={{ color: theme.subtext, fontSize: "13px", marginTop: "6px" }}>
              Pick a spot and we'll plan everything around it
            </div>
          </div>

          {/* Suggestions */}
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <div style={{
              color: theme.subtext,
              fontSize: "13px",
              marginBottom: "16px",
              letterSpacing: "2px",
            }}>
              POPULAR IN {loc.name.toUpperCase()}
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}>
              {loc.suggestions.map((spot) => (
                <div
                  key={spot.name}
                  style={{
                    background: theme.card,
                    border: `1px solid ${theme.primary}22`,
                    borderRadius: "12px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = `1px solid ${theme.primary}88`
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = `1px solid ${theme.primary}22`
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <span style={{ fontSize: "28px" }}>{spot.emoji}</span>
                  <span style={{ color: theme.text, fontWeight: "600", fontSize: "14px" }}>
                    {spot.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          {selectedChoice && (
            <button
              onClick={() => setPlanningVisible(true)}
              style={{
                marginTop: "32px",
                background: theme.primary,
                border: "none",
                padding: "16px 48px",
                borderRadius: "50px",
                color: "#fff",
                fontWeight: "800",
                fontSize: "16px",
                cursor: "pointer",
                letterSpacing: "2px",
                boxShadow: `0 8px 32px ${theme.primary}66`,
                animation: "fadeIn 0.4s ease",
              }}>
              LET'S PLAN →
            </button>
          )}
        </div>
      )}
      {planningVisible && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          background: theme.bg,
          overflowY: "auto",
        }}>
          <PlanningPage
            location={loc}
            theme={theme}
            choice={selectedChoice}
            onBack={() => setPlanningVisible(false)}
          />
        </div>
      )}

      <style>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .leaflet-popup-content-wrapper {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }
  .leaflet-popup-tip {
    display: none !important;
  }
  .leaflet-popup-content {
    margin: 0 !important;
  }
    .spot-marker:hover .spot-label {
    opacity: 1 !important;
  }
`}</style>
    </div>
  )
}

export default TripPage