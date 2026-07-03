import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import PlanningPage from "./PlanningPage"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export const locationData = {
  goa: {
    name: "Goa",
    coords: [15.4989, 73.8278],
    zoom: 11,
    spots: [
      { name: "Baga Beach", coords: [15.5564, 73.7515], emoji: "🏖️" },
      { name: "Dudhsagar Falls", coords: [15.3144, 74.3144], emoji: "💧" },
      { name: "Old Goa Churches", coords: [15.5009, 73.9116], emoji: "⛪" },
      { name: "Anjuna Beach", coords: [15.5736, 73.7400], emoji: "🌊" },
      
      { name: "Fort Aguada", coords: [15.4942, 73.7733], emoji: "🏰" },
      { name: "Palolem Beach", coords: [15.0100, 74.0232], emoji: "🌴" },
      { name: "Calangute Beach", coords: [15.5438, 73.7554], emoji: "🏖️" },
    ],
    suggestions: [
      { name: "Baga Beach", emoji: "🏖️" },
      { name: "Dudhsagar Falls", emoji: "💧" },
      { name: "Old Goa Churches", emoji: "⛪" },
      { name: "Anjuna Beach", emoji: "🌊" },
      { name: "Fort Aguada", emoji: "🏰" },
      { name: "Palolem Beach", emoji: "🌴" },
      { name: "Calangute Beach", emoji: "🏖️" },
    ]
  },
  manali: {
    name: "Manali",
    coords: [32.2432, 77.1892],
    zoom: 13,
    customBoundary: [
      [32.3900, 77.1200],
      [32.3750, 77.1500],
      [32.3717, 77.2367],
      [32.3500, 77.2800],
      [32.3200, 77.3000],
      [32.2900, 77.2900],
      [32.2600, 77.2700],
      [32.2396, 77.1735],
      [32.2200, 77.1500],
      [32.1900, 77.1400],
      [32.1800, 77.1200],
      [32.2000, 77.0900],
      [32.2400, 77.0700],
      [32.2800, 77.0800],
      [32.3200, 77.0900],
      [32.3600, 77.1000],
      [32.3900, 77.1200],
    ],
    spots: [
      { name: "Rohtang Pass", coords: [32.3717, 77.2367], emoji: "🏔️" },
      { name: "Solang Valley", coords: [32.3189, 77.1458], emoji: "⛷️" },
      { name: "Hadimba Temple", coords: [32.2396, 77.1735], emoji: "🛕" },
      { name: "Beas River", coords: [32.2318, 77.1924], emoji: "🌊" },
      { name: "Mall Road", coords: [32.2396, 77.1892], emoji: "🛍️" },
      { name: "Naggar Castle", coords: [32.1033, 77.1692], emoji: "🏯" },
      { name: "Jogini Falls", coords: [32.2598, 77.1805], emoji: "💧" },
    ],
    suggestions: [
      { name: "Rohtang Pass", emoji: "🏔️" },
      { name: "Solang Valley", emoji: "⛷️" },
      { name: "Hadimba Temple", emoji: "🛕" },
      { name: "Beas River", emoji: "🌊" },
      { name: "Mall Road", emoji: "🛍️" },
      { name: "Naggar Castle", emoji: "🏯" },
      { name: "Jogini Falls", emoji: "💧" },
    ]
  },
  kerala: {
    name: "Kerala",
    coords: [10.8505, 76.2711],
    zoom: 8,
    spots: [
      { name: "Alleppey Backwaters", coords: [9.4981, 76.3388], emoji: "🚢" },
      { name: "Munnar Tea Gardens", coords: [10.0889, 77.0595], emoji: "🍵" },
      { name: "Kovalam Beach", coords: [8.4004, 76.9787], emoji: "🏖️" },
      { name: "Wayanad Wildlife", coords: [11.6854, 76.1320], emoji: "🐘" },
      { name: "Thekkady Periyar", coords: [9.5992, 77.1693], emoji: "🌿" },
      { name: "Varkala Beach", coords: [8.7378, 76.7164], emoji: "🌊" },
      { name: "Thrissur Pooram", coords: [10.5276, 76.2144], emoji: "🎭" },
      { name: "Bekal Fort", coords: [12.3908, 75.0353], emoji: "🏰" },
      { name: "Athirappilly Falls", coords: [10.2834, 76.5694], emoji: "💧" },
      { name: "Kannur Beach", coords: [11.8745, 75.3704], emoji: "🏖️" },
      { name: "Padmanabhaswamy Temple", coords: [8.4821, 76.9453], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Alleppey Backwaters", emoji: "🚢" },
      { name: "Munnar Tea Gardens", emoji: "🍵" },
      { name: "Kovalam Beach", emoji: "🏖️" },
      { name: "Wayanad Wildlife", emoji: "🐘" },
      { name: "Thekkady Periyar", emoji: "🌿" },
      { name: "Varkala Beach", emoji: "🌊" },
      { name: "Thrissur Pooram", emoji: "🎭" },
      { name: "Bekal Fort", emoji: "🏰" },
      { name: "Athirappilly Falls", emoji: "💧" },
      { name: "Kannur Beach", emoji: "🏖️" },
      { name: "Padmanabhaswamy Temple", emoji: "🛕" },
    ]
  },
  rajasthan: {
    name: "Rajasthan",
    coords: [27.0238, 74.2179],
    zoom: 7,
    spots: [
      { name: "Jaipur City Palace", coords: [26.9255, 75.8236], emoji: "🏯" },
      { name: "Jaisalmer Fort", coords: [26.9157, 70.9083], emoji: "🏰" },
      { name: "Udaipur Lake Palace", coords: [24.5754, 73.6830], emoji: "🌊" },
      { name: "Sam Sand Dunes", coords: [26.8753, 70.5383], emoji: "🐪" },
      { name: "Mehrangarh Fort", coords: [26.2980, 73.0188], emoji: "🏯" },
      { name: "Pushkar Lake", coords: [26.4898, 74.5511], emoji: "🛕" },
      { name: "Amber Fort", coords: [26.9855, 75.8513], emoji: "🏰" },
      { name: "Ranthambore Tiger Reserve", coords: [26.0173, 76.5026], emoji: "🐯" },
      { name: "Hawa Mahal", coords: [26.9239, 75.8267], emoji: "🏛️" },
      { name: "Mount Abu", coords: [24.5926, 72.7156], emoji: "⛰️" },
      { name: "Chittorgarh Fort", coords: [24.8887, 74.6269], emoji: "🏰" },
    ],
    suggestions: [
      { name: "Jaipur City Palace", emoji: "🏯" },
      { name: "Jaisalmer Fort", emoji: "🏰" },
      { name: "Udaipur Lake Palace", emoji: "🌊" },
      { name: "Sam Sand Dunes", emoji: "🐪" },
      { name: "Mehrangarh Fort", emoji: "🏯" },
      { name: "Pushkar Lake", emoji: "🛕" },
      { name: "Amber Fort", emoji: "🏰" },
      { name: "Ranthambore Tiger Reserve", emoji: "🐯" },
      { name: "Hawa Mahal", emoji: "🏛️" },
      { name: "Mount Abu", emoji: "⛰️" },
      { name: "Chittorgarh Fort", emoji: "🏰" },
    ]
  },
}
const LocationBoundary = ({ coords, zoom, theme, locationName, customBoundary }) => {
  const map = useMap()

  useEffect(() => {
    map.setView(coords, zoom, { animate: true, duration: 1.5 })
    map.setMinZoom(zoom - 1)
    map.setMaxZoom(16)

    // Use custom boundary if provided
    if (customBoundary) {
      const polygon = L.polygon(customBoundary, {
        color: theme.primary,
        weight: 3,
        fillColor: theme.primary,
        fillOpacity: 0.15,
      })
      polygon.addTo(map)
      map.fitBounds(polygon.getBounds(), { padding: [40, 40] })
      return
    }

    // Otherwise fetch from Nominatim
    const fetchBoundary = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${locationName},India&polygon_geojson=1&format=json&limit=1`
        )
        const data = await res.json()
        if (data.length > 0 && data[0].geojson) {
          const geoLayer = L.geoJSON(data[0].geojson, {
            style: {
              color: theme.primary,
              weight: 3,
              fillColor: theme.primary,
              fillOpacity: 0.15,
            }
          })
          geoLayer.addTo(map)
          map.fitBounds(geoLayer.getBounds(), { padding: [40, 40] })
        }
      } catch (err) {
        console.log("Boundary fetch failed", err)
      }
    }

    fetchBoundary()
  }, [locationName])

  return null
}

const TripPage = ({ location, theme, onBack }) => {
  const [mapVisible, setMapVisible] = useState(true)
  const [questionsVisible, setQuestionsVisible] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [activeSpot, setActiveSpot] = useState(null)
  const [planningVisible, setPlanningVisible] = useState(false)

  const loc = locationData[location?.toLowerCase()] || locationData.goa

  const handleContinue = () => {
    setMapVisible(false)
    setTimeout(() => {
      setQuestionsVisible(true)
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
