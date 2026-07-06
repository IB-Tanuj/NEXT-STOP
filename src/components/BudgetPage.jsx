import { useState } from "react"
import { getRecommendations } from "../data/allLocations"

const BudgetPage = ({ theme, onClose, onLocationSelect }) => {
  const [step, setStep] = useState(1)
  const [travelType, setTravelType] = useState(null)
  const [budget, setBudget] = useState("")
  const [groupSize, setGroupSize] = useState(2)
  const [days, setDays] = useState(3)
  const [results, setResults] = useState(null)

  const handleCalculate = () => {
    const recs = getRecommendations(
      Number(budget),
      travelType === "solo" ? 1 : groupSize,
      days
    )
    setResults(recs)
    setStep(3)
  }

  const recommended = results?.filter(r => r.status === "recommended") || []
  const stretch = results?.filter(r => r.status === "stretch") || []
  const outofreach = results?.filter(r => r.status === "outofreach") || []

  const LocationCard = ({ loc, showShortfall = false }) => (
    <div
      onClick={() => {
        if (loc.built) {
          onLocationSelect(loc.locationKey)
          onClose()
        }
      }}
      style={{
        background: theme.card,
        borderRadius: "14px",
        padding: "16px",
        marginBottom: "10px",
        border: `1px solid ${loc.built ? theme.primary + "44" : theme.primary + "11"}`,
        cursor: loc.built ? "pointer" : "default",
        opacity: loc.status === "outofreach" ? 0.5 : 1,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={e => {
        if (loc.built) {
          e.currentTarget.style.border = `1px solid ${theme.primary}`
          e.currentTarget.style.transform = "translateY(-2px)"
        }
      }}
      onMouseLeave={e => {
        if (loc.built) {
          e.currentTarget.style.border = `1px solid ${theme.primary}44`
          e.currentTarget.style.transform = "translateY(0)"
        }
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>{loc.emoji}</span>
          <div>
            <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px" }}>{loc.name}</div>
            <div style={{ color: theme.subtext, fontSize: "11px" }}>📍 {loc.state}</div>
          </div>
        </div>
        {loc.built ? (
          <div style={{
            background: theme.primary,
            color: "#fff",
            fontSize: "10px",
            fontWeight: "800",
            padding: "4px 10px",
            borderRadius: "20px",
          }}>
            PLAN NOW →
          </div>
        ) : (
          <div style={{
            background: `${theme.primary}22`,
            color: theme.subtext,
            fontSize: "10px",
            fontWeight: "700",
            padding: "4px 10px",
            borderRadius: "20px",
          }}>
            COMING SOON
          </div>
        )}
      </div>

      <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "10px", lineHeight: "1.5" }}>
        {loc.description}
      </div>

      {/* Cost Breakdown */}
      <div style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      }}>
        <div style={{
          background: `${theme.primary}11`,
          borderRadius: "8px",
          padding: "4px 10px",
          fontSize: "11px",
          color: theme.subtext,
        }}>
          🚌 Transport: ₹{loc.transportTotal.toLocaleString("en-IN")}
        </div>
        <div style={{
          background: `${theme.primary}11`,
          borderRadius: "8px",
          padding: "4px 10px",
          fontSize: "11px",
          color: theme.subtext,
        }}>
          🏨 Stay: ₹{loc.stayTotal.toLocaleString("en-IN")}
        </div>
        {showShortfall ? (
          <div style={{
            background: "#ff6b6b22",
            borderRadius: "8px",
            padding: "4px 10px",
            fontSize: "11px",
            color: "#ff6b6b",
            fontWeight: "700",
          }}>
            Need ₹{loc.shortfall.toLocaleString("en-IN")} more
          </div>
        ) : (
          <div style={{
            background: loc.remaining > 0 ? "#A8E6CF22" : "#ff6b6b22",
            borderRadius: "8px",
            padding: "4px 10px",
            fontSize: "11px",
            color: loc.remaining > 0 ? "#A8E6CF" : "#ff6b6b",
            fontWeight: "700",
          }}>
            🍽️ ₹{Math.abs(loc.remaining).toLocaleString("en-IN")} {loc.remaining > 0 ? "for food" : "over"}
          </div>
        )}
      </div>

      {/* Tags */}
      <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
        {loc.tags.map((tag, i) => (
          <div key={i} style={{
            padding: "2px 8px",
            borderRadius: "20px",
            fontSize: "10px",
            fontWeight: "600",
            background: `${theme.primary}22`,
            color: theme.primary,
          }}>
            {tag}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 500,
      background: theme.bg,
      overflowY: "auto",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        position: "sticky",
        top: 0,
        background: `${theme.bg}ee`,
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${theme.primary}22`,
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
      }}>
        <div style={{ color: theme.primary, fontSize: "22px", fontWeight: "900", letterSpacing: "3px" }}>
          NEXT STOP
        </div>
        <div onClick={onClose} style={{ color: theme.subtext, cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
          ← Back
        </div>
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Step 1 — Solo or Group */}
        {step === 1 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ color: theme.primary, fontSize: "13px", letterSpacing: "4px", fontWeight: "700", marginBottom: "12px", textAlign: "center" }}>
              💰 BUDGET PLANNER
            </div>
            <h2 style={{ color: theme.text, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "900", marginBottom: "8px", textAlign: "center", letterSpacing: "-1px" }}>
              Find trips within<br />
              <span style={{ color: theme.primary }}>your budget</span>
            </h2>
            <p style={{ color: theme.subtext, fontSize: "14px", textAlign: "center", marginBottom: "48px", lineHeight: "1.7" }}>
              Tell us your budget and we'll show you every Indian destination you can explore — from comfortable fits to stretch goals.
            </p>

            <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "16px", textAlign: "center" }}>
              ARE YOU TRAVELING
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
              {["solo", "group"].map(type => (
                <div
                  key={type}
                  onClick={() => setTravelType(type)}
                  style={{
                    flex: 1,
                    padding: "24px",
                    borderRadius: "16px",
                    border: `2px solid ${travelType === type ? theme.primary : theme.primary + "33"}`,
                    background: travelType === type ? `${theme.primary}22` : theme.card,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>
                    {type === "solo" ? "👤" : "👥"}
                  </div>
                  <div style={{ color: travelType === type ? theme.primary : theme.text, fontWeight: "800", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {type}
                  </div>
                </div>
              ))}
            </div>

            {travelType === "group" && (
              <div style={{
                background: theme.card,
                borderRadius: "16px",
                padding: "20px 24px",
                border: `1px solid ${theme.primary}33`,
                marginBottom: "24px",
                animation: "fadeIn 0.3s ease",
              }}>
                <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "12px" }}>
                  👥 How many people?
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[2, 3, 4, 5, 6].map(n => (
                    <div
                      key={n}
                      onClick={() => setGroupSize(n)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "12px",
                        border: `2px solid ${groupSize === n ? theme.primary : theme.primary + "33"}`,
                        background: groupSize === n ? `${theme.primary}22` : "transparent",
                        color: groupSize === n ? theme.primary : theme.subtext,
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "15px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {travelType && (
              <button
                onClick={() => setStep(2)}
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
                  animation: "fadeIn 0.3s ease",
                }}
              >
                NEXT →
              </button>
            )}
          </div>
        )}

        {/* Step 2 — Budget + Days */}
        {step === 2 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div
              onClick={() => setStep(1)}
              style={{ color: theme.subtext, cursor: "pointer", fontSize: "14px", fontWeight: "600", marginBottom: "32px" }}
            >
              ← Back
            </div>

            <h2 style={{ color: theme.text, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "900", marginBottom: "40px", letterSpacing: "-1px" }}>
              What's your budget?
            </h2>

            {/* Budget Input */}
            <div style={{
              background: theme.card,
              borderRadius: "16px",
              padding: "24px",
              border: `1px solid ${theme.primary}33`,
              marginBottom: "16px",
            }}>
              <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "14px" }}>
                TOTAL BUDGET {travelType === "group" ? `(GROUP OF ${groupSize})` : "(SOLO)"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: theme.primary, fontWeight: "800", fontSize: "24px" }}>₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  placeholder="e.g. 10000"
                  style={{
                    flex: 1,
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: `2px solid ${budget ? theme.primary : theme.primary + "33"}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "18px",
                    outline: "none",
                    fontWeight: "700",
                  }}
                />
              </div>

              {/* Quick Budget Chips */}
              <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
                {(travelType === "solo"
                  ? [5000, 8000, 10000, 15000, 20000]
                  : [10000, 15000, 20000, 30000, 50000]
                ).map(amt => (
                  <div
                    key={amt}
                    onClick={() => setBudget(String(amt))}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: `1px solid ${budget === String(amt) ? theme.primary : theme.primary + "33"}`,
                      background: budget === String(amt) ? `${theme.primary}22` : "transparent",
                      color: budget === String(amt) ? theme.primary : theme.subtext,
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                    }}
                  >
                    ₹{amt.toLocaleString("en-IN")}
                  </div>
                ))}
              </div>
            </div>

            {/* Days Input */}
            <div style={{
              background: theme.card,
              borderRadius: "16px",
              padding: "24px",
              border: `1px solid ${theme.primary}33`,
              marginBottom: "24px",
            }}>
              <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "14px" }}>
                HOW MANY DAYS?
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[2, 3, 4, 5, 7, 10].map(d => (
                  <div
                    key={d}
                    onClick={() => setDays(d)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "12px",
                      border: `2px solid ${days === d ? theme.primary : theme.primary + "33"}`,
                      background: days === d ? `${theme.primary}22` : "transparent",
                      color: days === d ? theme.primary : theme.subtext,
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {d} days
                  </div>
                ))}
              </div>
            </div>

            {budget && (
              <button
                onClick={handleCalculate}
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
                }}
              >
                FIND MY TRIPS →
              </button>
            )}
          </div>
        )}

        {/* Step 3 — Results */}
        {step === 3 && results && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div
              onClick={() => setStep(2)}
              style={{ color: theme.subtext, cursor: "pointer", fontSize: "14px", fontWeight: "600", marginBottom: "24px" }}
            >
              ← Change Budget
            </div>

            <h2 style={{ color: theme.text, fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "900", marginBottom: "6px", letterSpacing: "-1px" }}>
              Trips for ₹{Number(budget).toLocaleString("en-IN")}
            </h2>
            <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "32px" }}>
              {travelType === "group" ? `👥 Group of ${groupSize}` : "👤 Solo"} · {days} days · from Delhi
            </div>

            {/* Recommended */}
            {recommended.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}>
                  <div style={{ color: "#4CAF50", fontSize: "18px" }}>✅</div>
                  <div>
                    <div style={{ color: theme.text, fontWeight: "800", fontSize: "16px" }}>
                      Recommended — {recommended.length} destinations
                    </div>
                    <div style={{ color: theme.subtext, fontSize: "12px" }}>
                      Fits your budget comfortably
                    </div>
                  </div>
                </div>
                {recommended.map(loc => <LocationCard key={loc.name} loc={loc} />)}
              </div>
            )}

            {/* Stretch */}
            {stretch.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}>
                  <div style={{ color: "#FFB347", fontSize: "18px" }}>⚠️</div>
                  <div>
                    <div style={{ color: theme.text, fontWeight: "800", fontSize: "16px" }}>
                      Stretch — {stretch.length} destinations
                    </div>
                    <div style={{ color: theme.subtext, fontSize: "12px" }}>
                      Possible but tight — small adjustments needed
                    </div>
                  </div>
                </div>
                {stretch.map(loc => <LocationCard key={loc.name} loc={loc} />)}
              </div>
            )}

            {/* Out of Reach */}
            {outofreach.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}>
                  <div style={{ color: "#ff6b6b", fontSize: "18px" }}>❌</div>
                  <div>
                    <div style={{ color: theme.text, fontWeight: "800", fontSize: "16px" }}>
                      Out of Reach — {outofreach.length} destinations
                    </div>
                    <div style={{ color: theme.subtext, fontSize: "12px" }}>
                      Increase your budget to unlock these
                    </div>
                  </div>
                </div>
                {outofreach.map(loc => <LocationCard key={loc.name} loc={loc} showShortfall={true} />)}
              </div>
            )}
          </div>
        )}

      </div>

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

export default BudgetPage