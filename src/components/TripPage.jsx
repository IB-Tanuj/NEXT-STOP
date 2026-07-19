import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import PlanningPage from "./PlanningPage"
import { bestTimeData } from "../data/bestTime"
import { locationData } from "../data/locationData"

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
    map.setMinZoom(zoom - 1)
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
            minZoom={loc.zoom - 2}
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
                    setActiveSpot(activeSpot?.name === spot.name ? null : spot)
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
              background: "#000000cc",
              borderRadius: "16px",
              padding: "16px",
              backdropFilter: "blur(10px)",
              border: `2px solid ${theme.primary}44`,
              animation: "fadeIn 0.3s ease",
            }}>
              <div style={{
                color: theme.primary,
                fontWeight: "700",
                fontSize: "14px",
                textAlign: "center",
                marginBottom: "12px",
                letterSpacing: "1px",
              }}>
                {activeSpot.emoji} {activeSpot.name}
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}>
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/seed/${encodeURIComponent(activeSpot.name)}${i}/160/120`}
                    alt={activeSpot.name}
                    style={{
                      width: "150px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: `2px solid ${theme.primary}`,
                    }}
                  />
                ))}
              </div>
              <div
                onClick={() => setActiveSpot(null)}
                style={{
                  color: theme.subtext,
                  fontSize: "12px",
                  textAlign: "center",
                  marginTop: "10px",
                  cursor: "pointer",
                }}>
                click marker again to close ✕
              </div>
            </div>
          )}

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
        const data = bestTimeData[locationKey]
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