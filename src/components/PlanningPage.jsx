import { useState } from "react"
import TripPreferences from "./TripPreferences"
import { searchCities } from "../data/stations"
import { useAuth } from "../context/AuthContext"

const PlanningPage = ({ location, theme, choice, onBack }) => {
  const { session } = useAuth();
  const [leavingFrom, setLeavingFrom] = useState("")
  const [leavingCoords, setLeavingCoords] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [budgetType, setBudgetType] = useState("") // "solo" or "group"
  const [groupSize, setGroupSize] = useState("")
  const [groupMembers, setGroupMembers] = useState([])
  const [budget, setBudget] = useState("")
  const [specificPlace, setSpecificPlace] = useState("")
  const [placeSearch, setPlaceSearch] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [planData, setPlanData] = useState(null)
  const [showBudget, setShowBudget] = useState(false)
  const [friends, setFriends] = useState([])
  const [showFriendsModal, setShowFriendsModal] = useState({ show: false, index: null })

  const isValid = () => {
    if (!selectedCity) return false
    if (!budgetType) return false
    if (!budget.trim()) return false
    if (Number(budget) < 2200) return false
    if (budgetType === "group" && !groupSize.trim()) return false
    if (budgetType === "group" && groupMembers.some(m => !m?.name?.trim())) return false
    if (choice === "specific" && !specificPlace) return false
    return true
  }

  const fetchFriends = async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    } catch (err) {
      console.error("Failed to fetch friends", err);
    }
  };

  const handleGetLocation = () => {
    setLocationLoading(true)
    setLocationError("")
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser")
      setLocationLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLeavingCoords({ lat: latitude, lng: longitude })

        try {
          // Reverse geocode to find the actual city name
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          const data = await res.json()

          // Nominatim's display_name provides the most accurate, street-level address available
          let foundLocation = data.display_name || ""

          // If the display name is too long, we can shorten it to the first 3 components (e.g. Street, Suburb, City)
          if (foundLocation) {
            const parts = foundLocation.split(", ")
            foundLocation = parts.slice(0, 3).join(", ")
          } else {
            // Fallback to exact coordinates if Nominatim fails to provide an address
            foundLocation = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
          }

          setLeavingFrom(foundLocation)
          setSelectedCity(foundLocation)
        } catch (err) {
          console.warn("Reverse geocoding failed, falling back to 'Current Location'")
          setLeavingFrom("Current Location")
          setSelectedCity("Current Location")
        }

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
  const filteredSuggestions = location?.suggestions?.filter(spot =>
    spot.name.toLowerCase().includes(placeSearch.toLowerCase())
  ) || []

  // Tie internal overlay state to browser history
  useEffect(() => {
    const handlePopState = (event) => {
      if (showBudget) {
        setShowBudget(false);
      } else if (showPreferences) {
        setShowPreferences(false);
      } else {
        onBack();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [showPreferences, showBudget, onBack]);

  const handleOpenPreferences = () => {
    setShowPreferences(true);
    window.history.pushState({ page: 'preferences' }, '', window.location.href);
  };

  const handleClosePreferences = () => {
    setShowPreferences(false);
    if (window.history.state?.page === 'preferences') {
       window.history.back();
    }
  };

  const handleOpenBudget = (prefs) => {
    setPlanData(prefs);
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

          {leavingFrom && !selectedCity && !locationLoading && leavingFrom.length >= 2 && (
            <div style={{
              color: "#FFB347",
              fontSize: "12px",
              marginTop: "8px",
            }}>
              ⚠️ Please select a city from the dropdown to continue!
            </div>
          )}

          {selectedCity && (
            <div style={{
              color: theme.subtext,
              fontSize: "12px",
              marginTop: "8px",
              lineHeight: "1.6",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              ✅ City selected: <span style={{ color: theme.primary, fontWeight: "700" }}>{selectedCity}</span>
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

              {budget && Number(budget) < 2200 && (
                <div style={{
                  color: "#FFB347",
                  fontSize: "12px",
                  marginTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  animation: "fadeIn 0.2s ease"
                }}>
                  ⚠️ Minimum budget required is ₹2,200 to cover basic transport and stays.
                </div>
              )}
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
                    onClick={() => {
                      setGroupSize(String(num));
                      const size = String(num) === "7+" ? 7 : num;
                      setGroupMembers(Array(Math.max(0, size - 1)).fill(null).map(() => ({ name: "", uid: null, id: null })));
                    }}
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

          {budgetType === "group" && groupSize && (
            <div style={{ marginTop: "24px", animation: "fadeIn 0.4s ease" }}>
              <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "4px" }}>
                👥 Who's coming with you?
              </div>
              <div style={{ color: theme.subtext, fontSize: "11px", marginBottom: "12px", fontStyle: "italic", opacity: 0.8 }}>
                *Use dummy names for now if your friends do not have an account on Next-Stop
              </div>
              {Array.from({ length: Math.max(0, (isNaN(parseInt(groupSize)) ? 7 : parseInt(groupSize)) - 1) }).map((_, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder={`Member ${i + 2} Name`}
                    value={groupMembers[i]?.name || ""}
                    onChange={(e) => {
                      const newMembers = [...groupMembers];
                      newMembers[i] = { name: e.target.value, uid: null, id: null };
                      setGroupMembers(newMembers);
                    }}
                    style={{
                      flex: "1 1 200px", padding: "12px", borderRadius: "8px",
                      border: `1px solid ${groupMembers[i]?.uid ? theme.primary : theme.primary + "33"}`, background: groupMembers[i]?.uid ? `${theme.primary}11` : "transparent",
                      color: groupMembers[i]?.uid ? theme.primary : theme.text, outline: "none",
                      fontWeight: groupMembers[i]?.uid ? "bold" : "normal"
                    }}
                    readOnly={!!groupMembers[i]?.uid} // lock input if connected to UID
                  />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={async () => {
                        if (groupMembers[i]?.uid) {
                          // Unlink
                          const newMembers = [...groupMembers];
                          newMembers[i] = { name: "", uid: null, id: null };
                          setGroupMembers(newMembers);
                          return;
                        }
                        const usernameInput = prompt("Enter the friend's Username (e.g. tanuj):");
                        if (!usernameInput || !usernameInput.trim()) return;
                        try {
                          const reqRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends/request`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${session?.access_token || ''}`
                            },
                            body: JSON.stringify({ targetUsername: usernameInput.trim() })
                          });
                          const data = await reqRes.json();
                          if (reqRes.ok) {
                            alert(data.message || "Friend request sent! They can be added to the trip once they accept.");
                          } else {
                            // If they are already friends, we can fetch their info and add them directly
                            if (data.error === 'You are already friends') {
                              const userRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/user/search/${usernameInput.trim()}`);
                              if (userRes.ok) {
                                const userData = await userRes.json();
                                const newMembers = [...groupMembers];
                                newMembers[i] = { name: userData.full_name || userData.username || userData.unique_id, uid: userData.username, id: userData.id };
                                setGroupMembers(newMembers);
                              } else {
                                alert("User not found");
                              }
                            } else {
                              alert(data.error || "Failed to send friend request");
                            }
                          }
                        } catch (err) {
                          alert("Failed to process request");
                        }
                      }}

                      style={{
                        background: groupMembers[i]?.uid ? "#ff6b6b22" : `${theme.primary}22`,
                        color: groupMembers[i]?.uid ? "#ff6b6b" : theme.primary, border: "none",
                        padding: "0 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer"
                      }}
                    >
                      {groupMembers[i]?.uid ? "Unlink" : "Add by Username"}
                    </button>
                    {!groupMembers[i]?.uid && (
                      <button
                        onClick={async () => {
                          await fetchFriends();
                          setShowFriendsModal({ show: true, index: i });
                        }}
                        style={{
                          background: `${theme.primary}22`, color: theme.primary, border: "none",
                          padding: "0 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer"
                        }}
                      >
                        Add from friends
                      </button>
                    )}
                  </div>
                </div>
              ))}
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
            onClick={handleOpenPreferences}
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
            planData={{ leavingFrom, originCoords: leavingCoords, originCity: selectedCity, budget, budgetType, groupSize, groupMembers }}
            onBack={handleClosePreferences}
            onNext={handleOpenBudget}
          />
        </div>
      )}

      {showFriendsModal.show && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 2500,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: theme.card,
            padding: "24px",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "400px",
            border: `1px solid ${theme.primary}33`
          }}>
            <h3 style={{ color: theme.text, marginTop: 0 }}>Select a Friend</h3>
            <div style={{ display: 'grid', gap: '10px', margin: '20px 0' }}>
              {friends.length === 0 ? (
                <div style={{ color: theme.subtext, textAlign: 'center', padding: '20px' }}>
                  No friends found. Add friends from your profile!
                </div>
              ) : (
                friends.map(friend => (
                  <div key={friend.id}
                    onClick={() => {
                      const newMembers = [...groupMembers];
                      newMembers[showFriendsModal.index] = { name: friend.full_name || friend.username || friend.unique_id, uid: friend.username, id: friend.id };
                      setGroupMembers(newMembers);
                      setShowFriendsModal({ show: false, index: null });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '12px',
                      background: `${theme.primary}11`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: `1px solid ${theme.primary}22`
                    }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', overflow: 'hidden' }}>
                      {friend.avatar_url ? (
                        <img src={friend.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        friend.full_name?.charAt(0) || friend.username?.charAt(0) || 'U'
                      )}
                    </div>
                    <div>
                      <div style={{ color: theme.text, fontWeight: 'bold' }}>{friend.full_name || friend.username}</div>
                      {friend.username && <div style={{ color: theme.subtext, fontSize: '12px' }}>@{friend.username}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setShowFriendsModal({ show: false, index: null })}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: `1px solid ${theme.primary}`,
                color: theme.primary,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
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