import { useMemo, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNotification } from "../context/NotificationContext"
import { generateTripPlan } from "../utils/tripPlanUtils"
import { saveTodayPlan } from "../utils/todayPlanUtils"
import { TripOverviewTab } from "./TripPlan/TripOverviewTab"
import { ItineraryView } from "./TripPlan/ItineraryView"

const completeSummary = (data) => Boolean(
  data?.activities?.length && data?.festivals?.length &&
  data?.foodRecommendations?.length && data?.localEmergency?.length
)

const TodayPlanViewer = ({ theme, plan: initialPlan, onClose, onUpdated }) => {
  const { session } = useAuth()
  const { showAlert } = useNotification()
  const [plan, setPlan] = useState(initialPlan)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showItinerary, setShowItinerary] = useState(false)

  const data = useMemo(() => plan?.trip_data || {}, [plan?.trip_data])
  const preferences = data.preferences || {}
  const aiData = plan?.ai_data || {}
  const isGroup = preferences.budgetType === "group" || Number(preferences.groupSize) > 1
  const groupSize = Number(preferences.groupSize) || 1
  const budgetData = useMemo(() => ({
    foodBuffer: Number(data.buffer) || 0,
    stayCost: Number(data.hotel?.price) || 0,
    transportCost: Number(data.transport?.price) || 0,
    totalEntryCost: Array.isArray(data.spots)
      ? data.spots.reduce((sum, spot) => sum + Number(spot.cost ?? spot.total ?? 0), 0) * (isGroup ? groupSize : 1)
      : 0,
    totalBudget: Number(plan?.total_budget) || 0,
  }), [data, isGroup, groupSize, plan?.total_budget])

  const updatePlan = (nextPlan) => {
    if (!nextPlan) return
    setPlan(nextPlan)
    onUpdated?.(nextPlan)
  }

  const handleSave = async () => {
    if (!session?.access_token || !plan?.id) return
    if (plan.saved_trip_id) {
      showAlert("This trip is already saved.", "info")
      return
    }
    setIsGenerating(true)
    try {
      const result = await saveTodayPlan(session.access_token, plan.id)
      updatePlan(result.plan)
      showAlert("Trip saved to Saved Trips.", "info")
    } catch (error) {
      showAlert(error.message || "Could not save this trip.", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateSummary = async () => {
    if (!session?.access_token || !plan?.id) return
    if (!plan.saved_trip_id && plan.summary_status !== "failed") {
      showAlert("Save this trip first to generate its AI details from Today.", "info")
      return
    }
    setIsGenerating(true)
    const wasRecovery = plan.summary_status === "failed"
    try {
      const result = await generateTripPlan(
        plan.destination,
        preferences.days,
        data.buffer,
        data.hotel?.name || preferences.stayType,
        data.transport?.name || preferences.transport,
        preferences.activities || [],
        { todayPlanId: plan.id }
      )
      updatePlan(result.plan)
      showAlert(wasRecovery ? "AI details recovered for free." : "AI details generated from your Today plan.", "info")
    } catch (error) {
      if (error.plan) updatePlan(error.plan)
      showAlert(error.message || "Could not generate AI details.", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  const summaryReady = completeSummary(aiData)
  const itineraryReady = Array.isArray(aiData.itinerary) && aiData.itinerary.length > 0

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 5000, background: theme.bg, overflowY: "auto" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "28px 20px 60px", fontFamily: "'Segoe UI', sans-serif" }}>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: theme.subtext, cursor: "pointer", fontSize: "14px", padding: "8px 0", marginBottom: "28px" }}>
          ← Back to Today
        </button>

        <div style={{ color: theme.primary, fontSize: "12px", letterSpacing: "3px", fontWeight: "800", marginBottom: "8px" }}>TODAY · SAVED SNAPSHOT</div>
        <h1 style={{ color: theme.text, fontSize: "clamp(24px, 5vw, 38px)", margin: "0 0 8px", lineHeight: 1.1 }}>{plan?.title || plan?.destination}</h1>
        <div style={{ color: theme.subtext, fontSize: "14px", marginBottom: "24px" }}>{plan?.destination} · {preferences.days || "—"} days</div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
          <button onClick={handleSave} disabled={Boolean(plan?.saved_trip_id) || isGenerating} style={{ border: `1px solid ${theme.primary}88`, background: plan?.saved_trip_id ? `${theme.primary}22` : theme.primary, color: plan?.saved_trip_id ? theme.primary : "#fff", borderRadius: "10px", padding: "10px 16px", fontWeight: "800", cursor: plan?.saved_trip_id || isGenerating ? "default" : "pointer" }}>
            {plan?.saved_trip_id ? "✓ Already saved" : "Save to Saved Trips"}
          </button>
          {!summaryReady && (
            <button onClick={handleGenerateSummary} disabled={isGenerating} style={{ border: `1px solid #fbbf24`, background: "#fbbf2418", color: "#fbbf24", borderRadius: "10px", padding: "10px 16px", fontWeight: "800", cursor: isGenerating ? "default" : "pointer" }}>
              {isGenerating ? "Working..." : plan?.summary_status === "failed" ? "Try AI details again · Free" : "Generate AI details"}
            </button>
          )}
        </div>

        {!summaryReady && !plan?.saved_trip_id && plan?.summary_status !== "failed" && (
          <div style={{ background: "#fbbf2414", border: "1px solid #fbbf2455", borderRadius: "12px", padding: "14px 16px", color: theme.subtext, fontSize: "13px", marginBottom: "16px" }}>
            Save this trip to enable AI details and itinerary generation from Today. If the original AI request failed, retrying it is free.
          </div>
        )}

        <TripOverviewTab
          theme={theme}
          locationName={plan?.destination}
          days={preferences.days}
          isGroup={isGroup}
          groupSize={groupSize}
          budget={plan?.total_budget}
          stayType={data.hotel?.name || preferences.stayType}
          transport={data.transport?.name || preferences.transport}
          foodBuffer={Number(data.buffer) || 0}
          budgetData={budgetData}
          aiLoading={false}
          aiData={aiData}
        />

        <div style={{ background: theme.card, border: `1px solid ${theme.primary}33`, borderRadius: "16px", padding: "20px 24px", marginTop: "16px" }}>
          <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "8px" }}>📅 ITINERARY</div>
          {itineraryReady ? (
            <button onClick={() => setShowItinerary(value => !value)} style={{ border: `1px solid ${theme.primary}66`, background: "transparent", color: theme.primary, borderRadius: "10px", padding: "10px 14px", fontWeight: "800", cursor: "pointer" }}>
              {showItinerary ? "Hide itinerary" : "View itinerary"}
            </button>
          ) : plan?.saved_trip_id ? (
            <>
              <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "12px" }}>Generate a day-by-day itinerary after saving this trip. Completing a failed original request is free.</div>
              <button onClick={() => setShowItinerary(true)} style={{ border: `1px solid ${theme.primary}`, background: `${theme.primary}18`, color: theme.primary, borderRadius: "10px", padding: "10px 14px", fontWeight: "800", cursor: "pointer" }}>
                Generate itinerary
              </button>
            </>
          ) : (
            <div style={{ color: theme.subtext, fontSize: "13px" }}>Save this trip first to generate an itinerary later.</div>
          )}
        </div>

        {showItinerary && plan?.saved_trip_id && (
          <div style={{ marginTop: "16px" }}>
            <ItineraryView
              theme={theme}
              locationName={plan.destination}
              days={preferences.days}
              budget={data.buffer}
              stayType={data.hotel?.name || preferences.stayType}
              transport={data.transport?.name || preferences.transport}
               selectedActivities={aiData.activities || preferences.activities || []}
               selectedFestivals={aiData.festivals || []}
               todayPlanId={plan.id}
               initialItinerary={aiData.itinerary}
               autoGenerate={!itineraryReady}
               onItineraryLoaded={(result, updatedPlan) => {
                if (updatedPlan) updatePlan(updatedPlan)
                else updatePlan({ ...plan, ai_data: { ...aiData, ...result } })
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default TodayPlanViewer
