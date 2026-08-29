import React from "react";
import { useState, useEffect } from "react"
import { fetchItineraryData, buildItineraryCacheKey } from "../../utils/tripPlanUtils"

export const ItineraryView = React.memo(({ theme, locationName, days, budget, stayType, transport, selectedActivities, selectedFestivals, onBack }) => {
  const [itineraryData, setItineraryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cacheSource, setCacheSource] = useState("") // "session", "backend", or "api"

  useEffect(() => {
    let cancelled = false
    const fetchItinerary = async () => {
      // ── Build cache key ──
      const cacheKey = buildItineraryCacheKey({
        location: locationName, days, budget, stayType, transport, selectedActivities, selectedFestivals
      })
      console.log(`[Itinerary Cache] Frontend key: ${cacheKey}`)

      // ── Check sessionStorage first ──
      try {
        const sessionCached = sessionStorage.getItem(cacheKey)
        if (sessionCached) {
          console.log(`[Itinerary Cache] SESSION HIT — using cached result (0 API calls)`)
          const parsed = JSON.parse(sessionCached)
          if (!cancelled) {
            setItineraryData(parsed)
            setCacheSource("session")
            setLoading(false)
          }
          return
        }
      } catch (e) {
        console.warn("[Itinerary Cache] sessionStorage read failed:", e)
      }

      // ── Fetch from backend (which has its own cache layer) ──
      try {
        const { data, cacheStatus } = await fetchItineraryData(
          locationName, days, budget, stayType, transport, selectedActivities, selectedFestivals
        )
        if (!cancelled) {
          setItineraryData(data)
          setCacheSource(cacheStatus === "HIT" ? "backend" : "api")
          console.log(`[Itinerary Cache] Backend responded with X-Cache: ${cacheStatus}`)

          // ── Store in sessionStorage for future same-session hits ──
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(data))
          } catch (e) {
            console.warn("[Itinerary Cache] sessionStorage write failed:", e)
          }
        }
      } catch (err) {
        console.error("Itinerary generation failed:", err)
        if (!cancelled) setError("Failed to generate itinerary. Please try again.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    const timeoutId = setTimeout(() => {
      fetchItinerary()
    }, 300)
    
    return () => { 
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [locationName, days, budget, stayType, transport, selectedActivities, selectedFestivals])

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.heroGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 20px 40px",
      fontFamily: "'Segoe UI', sans-serif",
      animation: "fadeIn 0.3s ease",
    }}>
      {/* Back */}
      <div onClick={onBack} style={{
        position: "fixed", top: "30px", left: "40px",
        color: theme.subtext, cursor: "pointer",
        fontSize: "14px", fontWeight: "600", zIndex: 10,
      }}>← Back</div>

      <div style={{ color: theme.primary, fontSize: "13px", letterSpacing: "4px", fontWeight: "700", marginBottom: "8px" }}>
        📅 DAY-BY-DAY ITINERARY
      </div>
      <h2 style={{ color: theme.text, fontSize: "clamp(20px, 4vw, 30px)", fontWeight: "900", marginBottom: "32px", textAlign: "center" }}>
        {locationName} · {days} Days
      </h2>

      <div style={{ width: "100%", maxWidth: "620px" }}>
        {loading ? (
          <div style={{ color: theme.subtext, textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "32px", marginBottom: "16px", animation: "pulse 1.5s infinite" }}>⏳</div>
            <div style={{ fontWeight: "600" }}>Generating your personalized itinerary...</div>
            <div style={{ fontSize: "13px", marginTop: "8px", opacity: 0.8 }}>This might take a few moments</div>
          </div>
        ) : error ? (
          <div style={{
            background: "#ff6b6b22",
            border: "1px solid #ff6b6b",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
          }}>
            <div style={{ color: "#ff6b6b", fontSize: "14px", fontWeight: "600" }}>⚠️ {error}</div>
          </div>
        ) : itineraryData?.itinerary?.length > 0 ? (
          itineraryData.itinerary.map((dayPlan, i) => (
            <div key={i} style={{
              background: theme.card,
              borderRadius: "16px",
              padding: "24px",
              border: `1px solid ${theme.primary}33`,
              marginBottom: "16px",
            }}>
              <div style={{
                color: theme.primary,
                fontSize: "12px",
                letterSpacing: "2px",
                fontWeight: "700",
                marginBottom: "4px"
              }}>
                DAY {dayPlan.day}
              </div>
              <h3 style={{
                color: theme.text,
                fontSize: "18px",
                fontWeight: "800",
                marginBottom: "16px"
              }}>
                {dayPlan.title}
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ width: "24px", flexShrink: 0, textAlign: "center", fontSize: "16px" }}>🌅</div>
                  <div>
                    <div style={{ color: theme.text, fontSize: "13px", fontWeight: "700", marginBottom: "2px" }}>Morning</div>
                    <div style={{ color: theme.subtext, fontSize: "13px", lineHeight: 1.5 }}>{dayPlan.morning}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ width: "24px", flexShrink: 0, textAlign: "center", fontSize: "16px" }}>☀️</div>
                  <div>
                    <div style={{ color: theme.text, fontSize: "13px", fontWeight: "700", marginBottom: "2px" }}>Afternoon</div>
                    <div style={{ color: theme.subtext, fontSize: "13px", lineHeight: 1.5 }}>{dayPlan.afternoon}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ width: "24px", flexShrink: 0, textAlign: "center", fontSize: "16px" }}>🌙</div>
                  <div>
                    <div style={{ color: theme.text, fontSize: "13px", fontWeight: "700", marginBottom: "2px" }}>Evening</div>
                    <div style={{ color: theme.subtext, fontSize: "13px", lineHeight: 1.5 }}>{dayPlan.evening}</div>
                  </div>
                </div>
              </div>
              
              <div style={{
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: `1px solid ${theme.primary}22`,
                textAlign: "right",
                color: theme.primary,
                fontWeight: "800",
                fontSize: "13px"
              }}>
                Estimated Cost: ₹{dayPlan.estimatedCost}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: theme.subtext, textAlign: "center", padding: "40px" }}>
            No itinerary data available.
          </div>
        )}
      </div>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
});
