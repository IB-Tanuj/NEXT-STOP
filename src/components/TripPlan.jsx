import { useState, useEffect } from "react"
import { generateTripPlan } from "../utils/tripPlanUtils"
import { ItineraryView } from "./TripPlan/ItineraryView"
import { TripOverviewTab } from "./TripPlan/TripOverviewTab"
import { TripActivitiesTab } from "./TripPlan/TripActivitiesTab"
import { TripBookingTab } from "./TripPlan/TripBookingTab"
import { TripEmergencyTab } from "./TripPlan/TripEmergencyTab"

const TripPlan = ({ location, theme, planData, preferences, budgetData, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [aiData, setAiData] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")
  const [showItinerary, setShowItinerary] = useState(false)

  const foodBuffer = budgetData?.foodBuffer || 0
  const isGroup = planData?.budgetType === "group"
  const groupSize = Number(planData?.groupSize) || 1
  const stayType = preferences?.stayType
  const transport = preferences?.transport
  const locationName = location?.name || ""

  useEffect(() => {
    let cancelled = false
    const fetchAiPlan = async () => {
      setAiLoading(true)
      setAiError("")
      try {
        const spots = preferences?.activities || []
        const data = await generateTripPlan(
          locationName,
          preferences?.days,
          foodBuffer,
          stayType,
          transport,
          spots
        )
        if (!cancelled) setAiData(data)
      } catch (err) {
        console.error("AI generation failed:", err)
        if (!cancelled) setAiError("Could not generate AI plan — showing placeholders instead")
      } finally {
        if (!cancelled) setAiLoading(false)
      }
    }
    fetchAiPlan()
    return () => { cancelled = true }
  }, [locationName, preferences, foodBuffer, stayType, transport])

  const tabs = [
    { id: "overview", label: "📋 Overview" },
    { id: "activities", label: "🎯 Activities & Festivals" },
    { id: "booking", label: "🔗 Book Now" },
    { id: "emergency", label: "🆘 Emergency" },
  ]

  if (showItinerary) {
    return (
      <ItineraryView
        theme={theme}
        locationName={locationName}
        days={preferences?.days}
        budget={foodBuffer}
        stayType={stayType}
        transport={transport}
        selectedActivities={aiData?.activities || []}
        selectedFestivals={aiData?.festivals || []}
        onBack={() => setShowItinerary(false)}
      />
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.heroGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 20px 40px",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Back */}
      <div onClick={onBack} style={{
        position: "fixed", top: "30px", left: "40px",
        color: theme.subtext, cursor: "pointer",
        fontSize: "14px", fontWeight: "600", zIndex: 10,
      }}>← Back</div>

      {/* Header */}
      <div style={{ color: theme.primary, fontSize: "13px", letterSpacing: "4px", fontWeight: "700", marginBottom: "8px" }}>
        🗺️ YOUR TRIP PLAN
      </div>
      <h2 style={{ color: theme.text, fontSize: "clamp(20px, 4vw, 30px)", fontWeight: "900", marginBottom: "8px", textAlign: "center" }}>
        {locationName} · {preferences?.days} Days
      </h2>

      {/* Budget Buffer and Itinerary Button Row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        marginBottom: "16px",
        width: "100%",
        maxWidth: "620px",
        flexWrap: "wrap",
      }}>
        {/* Budget Buffer */}
        <div style={{
          background: foodBuffer >= 0 ? `${theme.primary}22` : "#ff6b6b22",
          border: `1px solid ${foodBuffer >= 0 ? theme.primary : "#ff6b6b"}`,
          borderRadius: "12px",
          padding: "12px 24px",
          textAlign: "center",
          flex: "1 1 auto",
          minWidth: "250px",
        }}>
          <span style={{ color: theme.subtext, fontSize: "13px" }}>💰 Food, Activities & Festivals: </span>
          <span style={{
            color: foodBuffer >= 0 ? "#A8E6CF" : "#ff6b6b",
            fontWeight: "900", fontSize: "18px",
          }}>
            ₹{Math.abs(foodBuffer).toLocaleString("en-IN")}
            {foodBuffer < 0 ? " (over!)" : ""}
          </span>
        </div>

        {/* Itinerary Button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "200px" }}>
          <button
            onClick={() => setShowItinerary(true)}
            style={{
              background: "transparent",
              border: `2px solid ${theme.primary}`,
              color: theme.primary,
              padding: "10px 24px",
              borderRadius: "12px",
              fontWeight: "800",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = theme.primary
              e.currentTarget.style.color = "#000"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = theme.primary
            }}
          >
            Itinerary
          </button>
        </div>
      </div>

      {/* Warnings */}
      {aiError && (
        <div style={{
          background: "#FFB34722",
          border: "1px solid #FFB347",
          borderRadius: "12px",
          padding: "12px 24px",
          marginBottom: "16px",
          textAlign: "center",
          width: "100%",
          maxWidth: "620px",
        }}>
          <div style={{ color: "#FFB347", fontSize: "13px" }}>⚠️ {aiError}</div>
        </div>
      )}
      {foodBuffer <= 0 && (
        <div style={{
          background: "#ff6b6b22",
          border: "2px solid #ff6b6b",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "16px",
          textAlign: "center",
          width: "100%",
          maxWidth: "620px",
        }}>
          <div style={{ fontSize: "24px", marginBottom: "6px" }}>⚠️</div>
          <div style={{ color: "#ff6b6b", fontWeight: "800", fontSize: "15px", marginBottom: "4px" }}>
            No money left for food!
          </div>
          <div style={{ color: theme.subtext, fontSize: "13px" }}>
            Deselect some activities or festivals to free up budget
          </div>
        </div>
      )}

      {foodBuffer > 0 && foodBuffer < 500 && (
        <div style={{
          background: "#FFB34722",
          border: "2px solid #FFB347",
          borderRadius: "12px",
          padding: "14px 24px",
          marginBottom: "16px",
          textAlign: "center",
          width: "100%",
          maxWidth: "620px",
        }}>
          <div style={{ color: "#FFB347", fontWeight: "800", fontSize: "14px" }}>
            ⚠️ Very little left for food — be careful with selections!
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
        maxWidth: "620px",
      }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 16px",
              borderRadius: "20px",
              border: `2px solid ${activeTab === tab.id ? theme.primary : theme.primary + "33"}`,
              background: activeTab === tab.id ? `${theme.primary}22` : "transparent",
              color: activeTab === tab.id ? theme.primary : theme.subtext,
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "13px",
              transition: "all 0.3s ease",
            }}>
            {tab.label}
          </div>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: "620px" }}>
        {activeTab === "overview" && (
          <TripOverviewTab
            theme={theme}
            locationName={locationName}
            days={preferences?.days}
            isGroup={isGroup}
            groupSize={groupSize}
            budget={planData?.budget}
            stayType={stayType}
            transport={transport}
            foodBuffer={foodBuffer}
            aiLoading={aiLoading}
            aiData={aiData}
          />
        )}

        {activeTab === "activities" && (
          <TripActivitiesTab
            theme={theme}
            locationName={locationName}
            aiLoading={aiLoading}
            aiData={aiData}
          />
        )}

        {activeTab === "booking" && (
          <TripBookingTab
            theme={theme}
            transport={transport}
            stayType={stayType}
            locationName={locationName}
          />
        )}

        {activeTab === "emergency" && (
          <TripEmergencyTab
            theme={theme}
            locationName={locationName}
            aiLoading={aiLoading}
            aiData={aiData}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default TripPlan
