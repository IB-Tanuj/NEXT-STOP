import { useState } from "react"
import TripPreferences from "./TripPreferences"
import { searchCities } from "../data/stations"

const PlanningPage = ({ location, theme, choice, onBack }) => {
  const [leavingFrom, setLeavingFrom] = useState("")
  const [leavingCoords, setLeavingCoords] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [budgetType, setBudgetType] = useState(null)
  const [budget, setBudget] = useState("")
  const [groupSize, setGroupSize] = useState("")
  const [specificPlace, setSpecificPlace] = useState("")
  const [placeSearch, setPlaceSearch] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [planData, setPlanData] = useState(null)
  const [showBudget, setShowBudget] = useState(false)

  const isValid = () => {
    if (!selectedCity) return false
    if (!budgetType) return false
    if (!budget.trim()) return false
    if (budgetType === "group" && !groupSize.trim()) return false
    if (choice === "specific" && !specificPlace) return false
    return true
  }

  const handleGetLocation = () => {
    setLocationLoading(true)
    setLocationError("")
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser")
      setLocationLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLeavingCoords({ lat: latitude, lng: longitude })
        setLeavingFrom("Current Location")
        setSelectedCity("Current Location")
        setLocationLoading(false)
      },
      (error) => {
        setLocationError("Could not get location. Please search for your city manually.")
        setLocationLoading(false)
      }
    )
  }

  const handleCitySearch = (value) => {
    setLeavingFrom(value)
    setSelectedCity(null)
    setLeavingCoords(null)
    const results = searchCities(value)
    setSuggestions(results)
    setShowSuggestions(results.length > 0)
  }

  const filteredSpots = location?.spots?.filter(spot =>
    spot.name.toLowerCase().includes(placeSearch.toLowerCase())
  ) || []

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.heroGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px",
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
        📍 {location?.name}
      </div>

      <h2 style={{
        color: theme.text,
        fontSize: "clamp(22px, 4vw, 32px)",
        fontWeight: "900",
        marginBottom: "40px",
        textAlign: "center",
        letterSpacing: "-1px",
      }}>
        Let's plan your perfect trip 🗺️
      </h2>

      <div style={{
        width: "100%",
        maxWidth: "580px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>

        {/* Question 1 - Leaving From */}
        <div style={{
          background: theme.card,
          borderRadius: "16px",
          padding: "24px",
          border: `1px solid ${theme.primary}33`,
        }}>
          <div style={{
            color: theme.subtext,
            fontSize: "12px",
            letterSpacing: "2px",
            marginBottom: "10px",
          }}>
            QUESTION 1
          </div>
          <div style={{
            color: theme.text,
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "14px",
          }}>
            📍 Where are you starting from?
          </div>

          {/* Use My Location Button */}
          <button
            onClick={handleGetLocation}
            disabled={locationLoading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: `2px solid ${theme.primary}`,
              background: leavingCoords ? `${theme.primary}22` : "transparent",
              color: theme.primary,
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              marginBottom: "4px",
              transition: "all 0.3s ease",
              letterSpacing: "1px",
            }}>
            {locationLoading ? "📡 Getting your location..." : leavingCoords ? "✅ Location detected!" : "🎯 Use my current location"}
          </button>
          
          <div style={{ color: theme.subtext, fontSize: "11px", textAlign: "center", marginBottom: "12px", fontStyle: "italic" }}>
            *Planning a road trip? Use 'Current Location' for the most accurate fuel & distance calculation!
          </div>

          <div style={{
            color: theme.subtext,
            fontSize: "12px",
            textAlign: "center",
            marginBottom: "12px",
          }}>
            — or type manually —
          </div>

          <input
            type="text"
            value={leavingFrom}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={(e) => handleCitySearch(e.target.value)}
            placeholder="e.g. Delhi, Mumbai, Bengaluru..."
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "12px",
              border: `2px solid ${selectedCity ? theme.primary : theme.primary + "33"}`,
              background: theme.bg,
              color: theme.text,
              fontSize: "15px",
              outline: "none",
              transition: "border 0.3s ease",
              boxSizing: "border-box",
            }}
          />
           {/* City Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              background: theme.card,
              borderRadius: "12px",
              border: `1px solid ${theme.primary}44`,
              marginTop: "8px",
              overflow: "hidden",
              animation: "fadeIn 0.2s ease",
              maxHeight: "280px",
              overflowY: "auto",
            }}>
              {suggestions.map((city, i) => (
                  <div
                    key={city}
                    onMouseDown={() => {
                      setLeavingFrom(city)
                      setSelectedCity(city)
                      setShowSuggestions(false)
                      setSuggestions([])
                    }}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: i < suggestions.length - 1 ? `1px solid ${theme.primary}22` : "none",
                      transition: "background 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `${theme.primary}22`}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: "18px" }}>📍</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "14px",
                      }}>
                        {city}
                      </div>

                    </div>
                  </div>
              ))}
            </div>
          )}

          {leavingFrom && !selectedStationCode && !locationLoading && leavingFrom.length >= 2 && (
            <div style={{
              color: "#FFB347",
              fontSize: "12px",
              marginTop: "8px",
            }}>
              ⚠️ Please select a station from the dropdown to continue!
            </div>
          )}

          {selectedStationCode && (
            <div style={{
              color: theme.subtext,
              fontSize: "12px",
              marginTop: "8px",
              lineHeight: "1.6",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              ✅ Station selected: <span style={{ color: theme.primary, fontWeight: "700" }}>{selectedStationName} ({selectedStationCode})</span>
            </div>
          )}
        </div>

        {/* Question 2 - Budget */}
        <div style={{
          background: theme.card,
          borderRadius: "16px",
          padding: "24px",
          border: `1px solid ${theme.primary}33`,
        }}>
          <div style={{
            color: theme.subtext,
            fontSize: "12px",
            letterSpacing: "2px",
            marginBottom: "10px",
          }}>
            QUESTION 2
          </div>
          <div style={{
            color: theme.text,
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "14px",
          }}>
            💰 What's your budget?
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            {["solo", "group"].map((type) => (
              <div
                key={type}
                onClick={() => { setBudgetType(type); setBudget(""); setGroupSize("") }}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: `2px solid ${budgetType === type ? theme.primary : theme.primary + "33"}`,
                  background: budgetType === type ? `${theme.primary}22` : "transparent",
                  color: budgetType === type ? theme.primary : theme.subtext,
                  textAlign: "center",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}>
                {type === "solo" ? "👤 Solo" : "👥 Group"}
              </div>
            ))}
          </div>

          {budgetType && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "8px" }}>
                {budgetType === "solo" ? "Your total budget" : "Total group budget"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: theme.primary, fontWeight: "800", fontSize: "20px" }}>₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 5000"
                  style={{
                    flex: 1,
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: `2px solid ${budget ? theme.primary : theme.primary + "33"}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "15px",
                    outline: "none",
                    transition: "border 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

          {budgetType === "group" && budget && (
            <div style={{ marginTop: "16px", animation: "fadeIn 0.3s ease" }}>
              <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "8px" }}>
                👥 How many people in the group?
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[2, 3, 4, 5, 6, "7+"].map((num) => (
                  <div
                    key={num}
                    onClick={() => setGroupSize(String(num))}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "12px",
                      border: `2px solid ${groupSize === String(num) ? theme.primary : theme.primary + "33"}`,
                      background: groupSize === String(num) ? `${theme.primary}22` : "transparent",
                      color: groupSize === String(num) ? theme.primary : theme.subtext,
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                    }}>
                    {num}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Question 3 - Specific Place (only if choice === "specific") */}
        {choice === "specific" && (
          <div style={{
            background: theme.card,
            borderRadius: "16px",
            padding: "24px",
            border: `1px solid ${theme.primary}33`,
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{
              color: theme.subtext,
              fontSize: "12px",
              letterSpacing: "2px",
              marginBottom: "10px",
            }}>
              QUESTION 3
            </div>
            <div style={{
              color: theme.text,
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "14px",
            }}>
              🗺️ Where specifically in {location?.name} do you want to go?
            </div>

            <input
              type="text"
              value={placeSearch}
              onChange={(e) => { setPlaceSearch(e.target.value); setSpecificPlace("") }}
              placeholder={`e.g. Baga Beach, Fort Aguada...`}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: "12px",
                border: `2px solid ${specificPlace ? theme.primary : theme.primary + "33"}`,
                background: theme.bg,
                color: theme.text,
                fontSize: "15px",
                outline: "none",
                transition: "border 0.3s ease",
                boxSizing: "border-box",
                marginBottom: "12px",
              }}
            />

            {/* Suggestions */}
            {placeSearch && !specificPlace && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                animation: "fadeIn 0.2s ease",
              }}>
                {filteredSpots.length > 0 ? filteredSpots.map((spot) => (
                  <div
                    key={spot.name}
                    onClick={() => { setSpecificPlace(spot.name); setPlaceSearch(spot.name) }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: theme.bg,
                      border: `1px solid ${theme.primary}33`,
                      color: theme.text,
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    onMouseEnter={e => e.currentTarget.style.border = `1px solid ${theme.primary}`}
                    onMouseLeave={e => e.currentTarget.style.border = `1px solid ${theme.primary}33`}
                  >
                    <span>{spot.emoji}</span>
                    <span>{spot.name}</span>
                  </div>
                )) : (
                  <div style={{ color: theme.subtext, fontSize: "13px", padding: "8px" }}>
                    No matching spots found — try a different name
                  </div>
                )}
              </div>
            )}

            {specificPlace && (
              <div style={{
                color: theme.subtext,
                fontSize: "13px",
                marginTop: "4px",
              }}>
                ✅ Selected: <span style={{ color: theme.primary, fontWeight: "700" }}>{specificPlace}</span>
              </div>
            )}
          </div>
        )}

        {/* Trip Summary */}
        {budget && budgetType && (
          <div style={{
            background: `${theme.primary}11`,
            border: `1px solid ${theme.primary}44`,
            borderRadius: "12px",
            padding: "16px 24px",
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "6px" }}>
              TRIP SUMMARY
            </div>
            <div style={{ color: theme.text, fontSize: "15px", fontWeight: "600", lineHeight: "1.8" }}>
              📍 {location?.name}
              {specificPlace && <span style={{ color: theme.primary }}> → {specificPlace}</span>}
              <br />
              {budgetType === "solo" ? "👤 Solo" : `👥 Group of ${groupSize || "?"}`} &nbsp;|&nbsp;
              💰 ₹{Number(budget).toLocaleString("en-IN")}
              {budgetType === "group" && groupSize && (
                <span style={{ color: theme.subtext, fontSize: "13px" }}>
                  {" "}(₹{Math.round(Number(budget) / Number(groupSize)).toLocaleString("en-IN")} per person)
                </span>
              )}
              <br />
              {leavingFrom && <span>🚉 From: {leavingFrom}</span>}
            </div>
          </div>
        )}

        {/* Next Button */}
        {isValid() && (
          <button 
          onClick={() => setShowPreferences(true)}
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
            PLAN MY TRIP →
          </button>
        )}
      </div>
      {showPreferences && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          background: theme.bg,
          overflowY: "auto",
        }}>
          <TripPreferences
            location={location}
            theme={theme}
            planData={{ leavingFrom, originCoords: leavingCoords, originCity: selectedCity, budget, budgetType, groupSize }}
            onBack={() => setShowPreferences(false)}
            onNext={(prefs) => {
              setPlanData(prefs)
              setShowBudget(true)
              }}
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

export default PlanningPage