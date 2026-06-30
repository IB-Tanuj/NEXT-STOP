import { useState } from "react"
import BudgetResult from "./BudgetResult"

const TripPreferences = ({ location, theme, planData, onBack, onNext }) => {
  const [days, setDays] = useState("")
  const [transport, setTransport] = useState(null)
  const [stayType, setStayType] = useState(null)
  const [foodType, setFoodType] = useState(null)
  const [activities, setActivities] = useState([])
  const [showBudget, setShowBudget] = useState(false)
const [prefData, setPrefData] = useState(null)

  const longDistanceLocations = ["goa", "kerala"]
  const isLongDistance = longDistanceLocations.includes(location?.name?.toLowerCase())

  const transportOptions = [
    !isLongDistance && { id: "bus", label: "Bus", emoji: "🚌", desc: "Affordable, scenic route" },
    { id: "train", label: "Train", emoji: "🚂", desc: "Comfortable, most popular" },
    { id: "flight", label: "Flight", emoji: "✈️", desc: "Fastest, higher cost" },
    { id: "personal", label: "Personal Vehicle", emoji: "🚗", desc: "Own car/bike, flexible — any distance!" },
  ].filter(Boolean)

  const stayOptions = [
    { id: "hostel", label: "Hostel", emoji: "🛏️", desc: "₹300-800/night, meet travelers" },
    { id: "budget", label: "Budget Hotel", emoji: "🏨", desc: "₹800-2000/night, basic comfort" },
    { id: "mid", label: "Mid Range", emoji: "🏩", desc: "₹2000-5000/night, good amenities" },
    { id: "luxury", label: "Luxury", emoji: "🏰", desc: "₹5000+/night, premium experience" },
  ]

  const foodOptions = [
    { id: "local", label: "Local Dhabas", emoji: "🍛", desc: "₹100-300/day, authentic taste" },
    { id: "mix", label: "Mix", emoji: "🍽️", desc: "₹300-600/day, best of both" },
    { id: "restaurant", label: "Restaurants", emoji: "🍴", desc: "₹600-1500/day, comfortable dining" },
    { id: "hotel_meals", label: "Hotel Meals", emoji: "🛎️", desc: "₹800-2000/day, all inclusive" },
  ]

  const activityOptions = location?.spots?.map(spot => ({
    id: spot.name,
    label: spot.name,
    emoji: spot.emoji,
  })) || []

  const isValid = () => {
    if (!days || isNaN(days) || Number(days) < 1) return false
    if (!transport) return false
    if (!stayType) return false
    return true
  }

  const handleNext = () => {
    setPrefData({
      days: Number(days),
      transport,
      stayType,
      activities,
    })
    setShowBudget(true)
  }

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
              <div
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
              </div>
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

        {/* Transport */}
        <div style={{
          background: theme.card,
          borderRadius: "16px",
          padding: "24px",
          border: `1px solid ${theme.primary}33`,
        }}>
          <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "10px" }}>
            QUESTION 2
          </div>
          <div style={{ color: theme.text, fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
            🚌 How are you planning to travel?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {transportOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setTransport(opt.id)}
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
              </div>
            ))}
          </div>
          {transport === "personal" && (
            <div style={{
              marginTop: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: `${theme.primary}11`,
              border: `1px solid ${theme.primary}33`,
              color: theme.subtext,
              fontSize: "13px",
              animation: "fadeIn 0.3s ease",
            }}>
              💡 Since you're using a personal vehicle, we'll split your budget between stay, food and activities. We'll also show you what the trip would cost via public transport!
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
              <div
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
              </div>
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
              <div
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
              </div>
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
            onBack={() => setShowBudget(false)}
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