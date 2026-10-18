import { useState, useEffect } from "react"
import BudgetResult from "./BudgetResult"
import { getStationsByCity, getNearbyStations, haversineDistance } from "../data/stations"
import { getAirportsByCity, getNearbyAirports } from "../data/airports"

const TripPreferences = ({ location, theme, planData, onBack }) => {
  const [days, setDays] = useState("")
  const [transport, setTransport] = useState(null)
  const [stayType, setStayType] = useState(null)
  const [activities, setActivities] = useState([])
  const [showBudget, setShowBudget] = useState(false)
  const [prefData, setPrefData] = useState(null)
  
  const [selectedStation, setSelectedStation] = useState(null)
  const [selectedAirport, setSelectedAirport] = useState(null)
  const [availableStations, setAvailableStations] = useState([])
  const [availableAirports, setAvailableAirports] = useState([])

  const locName = location?.name?.toLowerCase() || "";
  const isIsland = locName.includes("andaman") || locName.includes("nicobar") || locName.includes("lakshadweep") || locName.includes("havelock");

  let distance = 0;
  if (planData?.originCoords && location?.coords) {
    distance = haversineDistance(planData.originCoords.lat, planData.originCoords.lng, location.coords[0], location.coords[1]);
  } else if (planData?.originCity && location?.coords) {
    const originStations = getStationsByCity(planData.originCity);
    if (originStations.length > 0) {
      distance = haversineDistance(originStations[0].lat, originStations[0].lng, location.coords[0], location.coords[1]);
    }
  }
  
  // Disable bus if distance > 1000km
  const isLongDistance = distance > 1000;

  const transportOptions = [
    (!isLongDistance && !isIsland) && { id: "bus", label: "Bus", emoji: "🚌", desc: "Affordable, scenic route" },
    !isIsland && { id: "train", label: "Train", emoji: "🚂", desc: "Comfortable, most popular" },
    { id: "flight", label: "Flight", emoji: "✈️", desc: "Fastest, higher cost" },
    !isIsland && { id: "personal", label: "Personal Vehicle", emoji: "🚗", desc: "Own car/bike, flexible" },
    isIsland && { id: "ship", label: "Ship / Ferry", emoji: "🚢", desc: "Ocean journey to the islands" },
  ].filter(Boolean)

  const stayOptions = [
    { id: "hostel", label: "Hostel", emoji: "🛏️", desc: "₹300-800/night, meet travelers" },
    { id: "budget", label: "Budget Hotel", emoji: "🏨", desc: "₹800-2000/night, basic comfort" },
    { id: "mid", label: "Mid Range", emoji: "🏩", desc: "₹2000-5000/night, good amenities" },
    { id: "luxury", label: "Luxury", emoji: "🏰", desc: "₹5000+/night, premium experience" },
  ]

  const activityOptions = location?.spots?.map(spot => ({
    id: spot.name,
    label: spot.name,
    emoji: spot.emoji,
  })) || []

  useEffect(() => {
    if (transport === "train") {
      let stations = []
      if (planData?.originCoords) {
        stations = getNearbyStations(planData.originCoords.lat, planData.originCoords.lng)
      } else {
        stations = getStationsByCity(planData?.originCity)
      }
      setAvailableStations(stations)
      if (stations.length > 0) {
        setSelectedStation(prev => (prev && stations.some(s => s.code === prev.code) ? prev : stations[0]))
      }
    } else if (transport === "flight") {
      let airports = []
      if (planData?.originCoords) {
        airports = getNearbyAirports(planData.originCoords.lat, planData.originCoords.lng)
      } else {
        airports = getAirportsByCity(planData?.originCity)
      }
      setAvailableAirports(airports)
      if (airports.length > 0) {
        setSelectedAirport(prev => (prev && airports.some(a => a.code === prev.code) ? prev : airports[0]))
      }
    }
  }, [transport, planData]);

  const isValid = () => {
    if (!days || isNaN(days) || Number(days) < 1) return false
    if (!transport) return false
    if (!stayType) return false
    if (transport === "train" && availableStations.length > 0 && !selectedStation) return false
    if (transport === "flight" && availableAirports.length > 0 && !selectedAirport) return false
    return true
  }

  const handleNext = () => {
    setPrefData({
      days: Number(days),
      transport,
      stayType,
      activities,
      selectedStation,
      selectedAirport
    })
    handleOpenBudget()
  }

  useEffect(() => {
    // Popstate listener to handle browser back button
    const handlePopState = () => {
      if (showBudget) {
        setShowBudget(false);
      } else {
        onBack();
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [showBudget, onBack]);

  const handleOpenBudget = () => {
    setShowBudget(true);
    window.history.pushState({ page: 'budget' }, '', window.location.href);
  };

  const handleCloseBudget = () => {
    setShowBudget(false);
    if (window.history.state?.page === 'budget') {
       window.history.back();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.heroGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 20px",
      fontFamily: "'Segoe UI', sans-serif",
      transition: "background 0.8s ease",
    }}>

      {/* Back Button */}
      <div
        onClick={onBack}
        style={{
          position: "fixed",
          top: "30px",
          left: "40px",
          color: theme.subtext,
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          zIndex: 10,
        }}>
        ← Back
      </div>

      {/* Header */}
      <div style={{
        color: theme.primary,
        fontSize: "13px",
        letterSpacing: "4px",
        fontWeight: "700",
        marginBottom: "8px",
        textTransform: "uppercase",
      }}>
        📍 {location?.name} — STEP 2 OF 3
      </div>

      <h2 style={{
        color: theme.text,
        fontSize: "clamp(20px, 4vw, 30px)",
        fontWeight: "900",
        marginBottom: "40px",
        textAlign: "center",
        letterSpacing: "-1px",
      }}>
        Tell us how you like to travel ✈️
      </h2>

      <div style={{
        width: "100%",
        maxWidth: "620px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>

        {/* Days of Stay */}
        <div style={{
          background: theme.card,
          borderRadius: "16px",
          padding: "24px",
          border: `1px solid ${theme.primary}33`,
        }}>
          <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "10px" }}>
            QUESTION 1
          </div>
          <div style={{ color: theme.text, fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
            📅 How many days are you planning to stay?
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
            {[1, 2, 3, 4, 5, 7, 10].map((d) => (
              <button type="button"
                key={d}
                onClick={() => setDays(String(d))}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  border: `2px solid ${days === String(d) ? theme.primary : theme.primary + "33"}`,
                  background: days === String(d) ? `${theme.primary}22` : "transparent",
                  color: days === String(d) ? theme.primary : theme.subtext,
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}>
                {d} {d === 1 ? "day" : "days"}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Or type custom days e.g. 14"
            style={{
              width: "100%",
              padding: "12px 18px",
              borderRadius: "12px",
              border: `2px solid ${days ? theme.primary : theme.primary + "33"}`,
              background: theme.bg,
              color: theme.text,
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Transport Block */}
        <div style={{
          background: theme.card,
          borderRadius: "16px",
          padding: "24px",
          border: `1px solid ${theme.primary}33`,
          boxSizing: "border-box",
        }}>
          <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "10px" }}>
            QUESTION 2
          </div>
          <div style={{ color: theme.text, fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
            🚌 How are you planning to travel?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {transportOptions.map((opt) => (
              <button type="button"
                key={opt.id}
                onClick={() => {
                  setTransport(opt.id)
                  setSelectedStation(null)
                  setSelectedAirport(null)
                }}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: `2px solid ${transport === opt.id ? theme.primary : theme.primary + "33"}`,
                  background: transport === opt.id ? `${theme.primary}22` : "transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}>
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>{opt.emoji}</div>
                <div style={{ color: transport === opt.id ? theme.primary : theme.text, fontWeight: "700", fontSize: "14px" }}>
                  {opt.label}
                </div>
                <div style={{ color: theme.subtext, fontSize: "11px", marginTop: "4px" }}>
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Personal Vehicle Notice */}
          {transport === "personal" && (
            <div style={{
              marginTop: "16px",
              padding: "14px 18px",
              borderRadius: "12px",
              background: `${theme.primary}12`,
              border: `1px solid ${theme.primary}33`,
              color: theme.subtext,
              fontSize: "13px",
              lineHeight: "1.5",
              animation: "fadeIn 0.3s ease",
            }}>
              💡 For personal vehicles, we will use your exact coordinates (if provided) or city center for precise distance and fuel calculation!
            </div>
          )}

          {/* Train Station Selection Section */}
          {transport === "train" && availableStations.length > 0 && (
            <div style={{
              marginTop: "20px",
              paddingTop: "18px",
              borderTop: `1px solid ${theme.primary}22`,
              animation: "fadeIn 0.3s ease",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                flexWrap: "wrap",
                gap: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>🚉</span>
                  <div>
                    <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>
                      Select Departure Station {planData?.originCity ? `(${planData.originCity})` : ""}
                    </div>
                    <div style={{ color: theme.subtext, fontSize: "11px", marginTop: "2px" }}>
                      Choose your nearest boarding point for accurate train fares & routes
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  background: `${theme.primary}15`,
                  color: theme.primary,
                  border: `1px solid ${theme.primary}33`,
                }}>
                  {availableStations.length} available
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {availableStations.map((st) => {
                  const isSelected = selectedStation?.code === st.code
                  return (
                    <button
                      type="button"
                      key={st.code}
                      onClick={() => setSelectedStation(st)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        border: isSelected ? `2px solid ${theme.primary}` : `1px solid ${theme.primary}33`,
                        borderRadius: "12px",
                        padding: "14px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        background: isSelected ? `${theme.primary}20` : `${theme.primary}08`,
                        boxShadow: isSelected ? `0 4px 14px ${theme.primary}22` : "none",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        outline: "none",
                        textAlign: "left",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = `${theme.primary}15`
                          e.currentTarget.style.borderColor = `${theme.primary}66`
                          e.currentTarget.style.transform = "translateY(-1px)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = `${theme.primary}08`
                          e.currentTarget.style.borderColor = `${theme.primary}33`
                          e.currentTarget.style.transform = "none"
                        }
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <div style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? theme.primary : theme.subtext + "66"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}>
                          {isSelected && (
                            <div style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: theme.primary,
                            }} />
                          )}
                        </div>

                        <span style={{ fontSize: "20px", flexShrink: 0 }}>🚂</span>

                        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                          <span style={{
                            color: isSelected ? theme.primary : theme.text,
                            fontWeight: isSelected ? "700" : "600",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}>
                            {st.name}
                          </span>
                          <span style={{ color: theme.subtext, fontSize: "11px", marginTop: "1px" }}>
                            {st.city || "Delhi"}{st.distance ? ` · ${st.distance.toFixed(1)} km away` : ""}
                          </span>
                        </div>
                      </div>

                      <div style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        background: isSelected ? theme.primary : `${theme.primary}18`,
                        color: isSelected ? (theme.bg || "#0b1311") : theme.primary,
                        fontWeight: "800",
                        fontSize: "13px",
                        letterSpacing: "0.5px",
                        flexShrink: 0,
                        border: `1px solid ${isSelected ? theme.primary : theme.primary + "44"}`,
                        transition: "all 0.2s ease",
                      }}>
                        {st.code}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Airport Selection Section */}
          {transport === "flight" && availableAirports.length > 0 && (
            <div style={{
              marginTop: "20px",
              paddingTop: "18px",
              borderTop: `1px solid ${theme.primary}22`,
              animation: "fadeIn 0.3s ease",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                flexWrap: "wrap",
                gap: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>✈️</span>
                  <div>
                    <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>
                      Select Departure Airport {planData?.originCity ? `(${planData.originCity})` : ""}
                    </div>
                    <div style={{ color: theme.subtext, fontSize: "11px", marginTop: "2px" }}>
                      Choose your nearest airport for live flight routes & fares
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  background: `${theme.primary}15`,
                  color: theme.primary,
                  border: `1px solid ${theme.primary}33`,
                }}>
                  {availableAirports.length} available
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {availableAirports.map((ap) => {
                  const isSelected = selectedAirport?.code === ap.code
                  return (
                    <button
                      type="button"
                      key={ap.code}
                      onClick={() => setSelectedAirport(ap)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        border: isSelected ? `2px solid ${theme.primary}` : `1px solid ${theme.primary}33`,
                        borderRadius: "12px",
                        padding: "14px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        background: isSelected ? `${theme.primary}20` : `${theme.primary}08`,
                        boxShadow: isSelected ? `0 4px 14px ${theme.primary}22` : "none",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        outline: "none",
                        textAlign: "left",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = `${theme.primary}15`
                          e.currentTarget.style.borderColor = `${theme.primary}66`
                          e.currentTarget.style.transform = "translateY(-1px)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = `${theme.primary}08`
                          e.currentTarget.style.borderColor = `${theme.primary}33`
                          e.currentTarget.style.transform = "none"
                        }
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <div style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? theme.primary : theme.subtext + "66"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}>
                          {isSelected && (
                            <div style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: theme.primary,
                            }} />
                          )}
                        </div>

                        <span style={{ fontSize: "20px", flexShrink: 0 }}>✈️</span>

                        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                          <span style={{
                            color: isSelected ? theme.primary : theme.text,
                            fontWeight: isSelected ? "700" : "600",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}>
                            {ap.name}
                          </span>
                          <span style={{ color: theme.subtext, fontSize: "11px", marginTop: "1px" }}>
                            {ap.city || "Airport"}{ap.distance ? ` · ${ap.distance.toFixed(1)} km away` : ""}
                          </span>
                        </div>
                      </div>

                      <div style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        background: isSelected ? theme.primary : `${theme.primary}18`,
                        color: isSelected ? (theme.bg || "#0b1311") : theme.primary,
                        fontWeight: "800",
                        fontSize: "13px",
                        letterSpacing: "0.5px",
                        flexShrink: 0,
                        border: `1px solid ${isSelected ? theme.primary : theme.primary + "44"}`,
                        transition: "all 0.2s ease",
                      }}>
                        {ap.code}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Stay Type */}
        <div style={{
          background: theme.card,
          borderRadius: "16px",
          padding: "24px",
          border: `1px solid ${theme.primary}33`,
        }}>
          <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "10px" }}>
            QUESTION 3
          </div>
          <div style={{ color: theme.text, fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
            🏨 What kind of stay do you prefer?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {stayOptions.map((opt) => (
              <button type="button"
                key={opt.id}
                onClick={() => setStayType(opt.id)}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: `2px solid ${stayType === opt.id ? theme.primary : theme.primary + "33"}`,
                  background: stayType === opt.id ? `${theme.primary}22` : "transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                 }}>
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>{opt.emoji}</div>
                <div style={{ color: stayType === opt.id ? theme.primary : theme.text, fontWeight: "700", fontSize: "14px" }}>
                  {opt.label}
                </div>
                <div style={{ color: theme.subtext, fontSize: "11px", marginTop: "4px" }}>
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        
        {/* Activities */}
        <div style={{
          background: theme.card,
          borderRadius: "16px",
          padding: "24px",
          border: `1px solid ${theme.primary}33`,
        }}>
          <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "10px" }}>
            QUESTION 4 — OPTIONAL
          </div>
          <div style={{ color: theme.text, fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>
            🎯 Any specific spots you want to visit?
          </div>
          <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "16px" }}>
            Select all that apply — we'll include entry fees in your budget
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {activityOptions.map((opt) => (
              <button type="button"
                key={opt.id}
                onClick={() => {
                  setActivities(prev =>
                    prev.includes(opt.id)
                      ? prev.filter(a => a !== opt.id)
                      : [...prev, opt.id]
                  )
                }}
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: `2px solid ${activities.includes(opt.id) ? theme.primary : theme.primary + "33"}`,
                  background: activities.includes(opt.id) ? `${theme.primary}22` : "transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                 }}>
                <span style={{ fontSize: "20px" }}>{opt.emoji}</span>
                <span style={{
                  color: activities.includes(opt.id) ? theme.primary : theme.text,
                  fontWeight: "600",
                  fontSize: "13px",
                }}>
                  {opt.label}
                </span>
                {activities.includes(opt.id) && (
                  <span style={{ marginLeft: "auto", color: theme.primary, fontSize: "12px" }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        {isValid() && (
          <button
            onClick={handleNext}
            style={{
              background: theme.primary,
              border: "none",
              padding: "18px",
              borderRadius: "50px",
              color: "#fff",
              fontWeight: "800",
              fontSize: "16px",
              cursor: "pointer",
              letterSpacing: "2px",
              boxShadow: `0 8px 32px ${theme.primary}66`,
              animation: "fadeIn 0.4s ease",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            CALCULATE MY BUDGET →
          </button>
        )}
      </div>
      {showBudget && prefData && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 3000,
          background: theme.bg,
          overflowY: "auto",
        }}>
          <BudgetResult
            location={location}
            theme={theme}
            planData={planData}
            preferences={prefData}
            onBack={handleCloseBudget}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
      `}</style>
    </div>
  )
}

export default TripPreferences
