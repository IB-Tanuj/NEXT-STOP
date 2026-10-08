import { useCallback, useEffect, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNotification } from "../context/NotificationContext"
import { getTodayPlans, renameTodayPlan, saveTodayPlan } from "../utils/todayPlanUtils"
import TodayPlanViewer from "./TodayPlanViewer"

const formatCountdown = (resetAt, now) => {
  if (!resetAt) return ""
  const seconds = Math.max(0, Math.floor((new Date(resetAt).getTime() - now) / 1000))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${String(minutes).padStart(2, "0")}m`
}

const TodaySidebar = ({ theme, isOpen, onClose, onStateChange }) => {
  const { session } = useAuth()
  const { showAlert, showPrompt } = useNotification()
  const [state, setState] = useState({ plans: [], limit: 5, remaining: 5, resetAt: null })
  const [loading, setLoading] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [viewingPlan, setViewingPlan] = useState(null)
  const resetRefreshRef = useRef(null)

  const loadPlans = useCallback(async () => {
    if (!session?.access_token) return
    setLoading(true)
    try {
      const nextState = await getTodayPlans(session.access_token)
      setState(nextState)
      onStateChange?.(nextState)
    } catch (error) {
      showAlert(error.message || "Could not load Today plans.", "error")
    } finally {
      setLoading(false)
    }
  }, [onStateChange, session, showAlert])

  useEffect(() => {
    const timer = setTimeout(loadPlans, 0)
    return () => clearTimeout(timer)
  }, [isOpen, loadPlans])

  useEffect(() => {
    const refresh = () => loadPlans()
    window.addEventListener("today-plans-changed", refresh)
    return () => window.removeEventListener("today-plans-changed", refresh)
  }, [loadPlans])

  useEffect(() => {
    if (!isOpen) return undefined
    const firstUpdate = setTimeout(() => setNow(Date.now()), 0)
    const interval = setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (state.resetAt && current >= new Date(state.resetAt).getTime() && resetRefreshRef.current !== state.resetAt) {
        resetRefreshRef.current = state.resetAt
        loadPlans()
      }
    }, 30000)
    return () => {
      clearTimeout(firstUpdate)
      clearInterval(interval)
    }
  }, [isOpen, loadPlans, state.resetAt])

  const replacePlan = (plan) => {
    if (!plan) return
    setState(current => ({ ...current, plans: current.plans.map(item => item.id === plan.id ? plan : item) }))
    setViewingPlan(current => current?.id === plan.id ? plan : current)
  }

  const handleRename = async (plan) => {
    const title = await showPrompt("Name this trip", plan.title || plan.destination)
    if (!title?.trim()) return
    try {
      replacePlan(await renameTodayPlan(session.access_token, plan.id, title.trim()))
    } catch (error) {
      showAlert(error.message || "Could not rename this trip.", "error")
    }
  }

  const handleSave = async (plan) => {
    if (plan.saved_trip_id) {
      showAlert("This trip is already saved.", "info")
      return
    }
    try {
      const result = await saveTodayPlan(session.access_token, plan.id)
      replacePlan(result.plan)
      showAlert("Trip saved to Saved Trips.", "info")
    } catch (error) {
      showAlert(error.message || "Could not save this trip.", "error")
    }
  }

  return (
    <>
      {isOpen && <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />}
      <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "420px", maxWidth: "94vw", background: theme.bg, borderRight: `1px solid ${theme.primary}44`, zIndex: 350, transform: isOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.35s ease", overflowY: "auto", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ padding: "24px 20px 16px", borderBottom: `1px solid ${theme.primary}22`, position: "sticky", top: 0, background: `${theme.bg}f2`, backdropFilter: "blur(14px)", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ color: theme.primary, fontSize: "11px", letterSpacing: "3px", fontWeight: "800", marginBottom: "5px" }}>TODAY'S PLANNING DESK</div>
              <div style={{ color: theme.text, fontSize: "22px", fontWeight: "900" }}>{state.remaining}/{state.limit} left</div>
              <div style={{ color: theme.subtext, fontSize: "12px", marginTop: "4px" }}>Resets at 5:30 AM IST{state.resetAt ? ` · ${formatCountdown(state.resetAt, now)}` : ""}</div>
            </div>
            <button onClick={onClose} style={{ border: "none", background: "transparent", color: theme.subtext, cursor: "pointer", fontSize: "20px" }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: "5px", marginTop: "16px" }}>
            {Array.from({ length: state.limit }, (_, index) => <span key={index} style={{ height: "5px", flex: 1, borderRadius: "10px", background: index < state.limit - state.remaining ? theme.primary : `${theme.primary}22` }} />)}
          </div>
        </div>

        <div style={{ padding: "18px 16px 30px" }}>
          {loading ? <div style={{ color: theme.subtext, textAlign: "center", padding: "40px 10px" }}>Loading Today plans...</div> : state.plans.length === 0 ? (
            <div style={{ color: theme.subtext, textAlign: "center", padding: "50px 18px", lineHeight: 1.6 }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🧭</div>
              <div style={{ color: theme.text, fontWeight: "800", marginBottom: "6px" }}>Your planning desk is empty</div>
              Plan a trip and it will appear here for quick access today.
            </div>
          ) : state.plans.map((plan, index) => {
            const days = plan.trip_data?.preferences?.days || plan.trip_data?.hotel?.days || "—"
            return (
              <div key={plan.id} style={{ background: theme.card, border: `1px solid ${theme.primary}33`, borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
                <div style={{ color: theme.primary, fontSize: "11px", letterSpacing: "2px", fontWeight: "800", marginBottom: "5px" }}>TRIP {index + 1}</div>
                <div style={{ color: theme.text, fontSize: "17px", fontWeight: "800", marginBottom: "4px" }}>{plan.title || plan.destination}</div>
                <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "14px" }}>{plan.destination} · {days} days · ₹{Number(plan.total_budget || 0).toLocaleString("en-IN")}</div>
                <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                   <button aria-label={`View ${plan.title || plan.destination}`} onClick={() => setViewingPlan(plan)} style={{ border: `1px solid ${theme.primary}`, background: `${theme.primary}18`, color: theme.primary, borderRadius: "8px", padding: "8px 11px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>View</button>
                   <button aria-label={plan.saved_trip_id ? `${plan.title || plan.destination} is already saved` : `Save ${plan.title || plan.destination}`} onClick={() => handleSave(plan)} disabled={Boolean(plan.saved_trip_id)} style={{ border: `1px solid ${theme.primary}55`, background: plan.saved_trip_id ? `${theme.primary}18` : "transparent", color: plan.saved_trip_id ? theme.primary : theme.text, borderRadius: "8px", padding: "8px 11px", fontSize: "12px", fontWeight: "800", cursor: plan.saved_trip_id ? "default" : "pointer" }}>{plan.saved_trip_id ? "✓ Already saved" : "Save"}</button>
                   <button aria-label={`Rename ${plan.title || plan.destination}`} onClick={() => handleRename(plan)} style={{ border: `1px solid ${theme.primary}55`, background: "transparent", color: theme.subtext, borderRadius: "8px", padding: "8px 11px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>Rename</button>
                </div>
              </div>
            )
          })}
        </div>
      </aside>
      {viewingPlan && <TodayPlanViewer theme={theme} plan={viewingPlan} onClose={() => setViewingPlan(null)} onUpdated={replacePlan} />}
    </>
  )
}

export default TodaySidebar
