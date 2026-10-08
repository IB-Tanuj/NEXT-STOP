const API_BASE = import.meta.env.VITE_API_URL || ""

export const notifyTodayPlansChanged = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("today-plans-changed"))
}

// Keep this id stable for the lifetime of a planning screen. React Strict Mode
// may replay effects in development, but the server will see the same plan id.
export const createClientPlanId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID()
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, character => {
    const random = Math.random() * 16 | 0
    const value = character === "x" ? random : (random & 0x3 | 0x8)
    return value.toString(16)
  })
}

const authHeaders = (token, json = false) => ({
  ...(json ? { "Content-Type": "application/json" } : {}),
  Authorization: `Bearer ${token}`,
})

const parseResponse = async (response, fallback) => {
  let payload = {}
  try { payload = await response.json() } catch { /* use fallback below */ }
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || fallback)
    error.status = response.status
    error.code = payload.error
    error.remaining = payload.remaining ?? payload.quota?.remaining
    error.resetAt = payload.resetAt ?? payload.quota?.resetAt
    error.plan = payload.plan
    error.quota = payload.quota
    throw error
  }
  return payload
}

export const getTodayPlans = async (token) => {
  const response = await fetch(`${API_BASE}/api/today-plans`, { headers: authHeaders(token) })
  return parseResponse(response, "Could not load Today plans.")
}

export const createTodayPlan = async (token, { id, destination, totalBudget, tripData }) => {
  const response = await fetch(`${API_BASE}/api/today-plans`, {
    method: "POST",
    headers: authHeaders(token, true),
    body: JSON.stringify({ id, destination, total_budget: totalBudget, trip_data: tripData }),
  })
  try {
    const payload = await parseResponse(response, "Could not create Today plan.")
    notifyTodayPlansChanged()
    return payload.plan
  } catch (error) {
    notifyTodayPlansChanged()
    throw error
  }
}

export const updateTodayPlan = async (token, id, { destination, totalBudget, tripData }) => {
  const response = await fetch(`${API_BASE}/api/today-plans/${id}`, {
    method: "PUT",
    headers: authHeaders(token, true),
    body: JSON.stringify({ destination, total_budget: totalBudget, trip_data: tripData }),
  })
  const payload = await parseResponse(response, "Could not update Today plan.")
  return payload.plan
}

export const renameTodayPlan = async (token, id, title) => {
  const response = await fetch(`${API_BASE}/api/today-plans/${id}`, {
    method: "PATCH",
    headers: authHeaders(token, true),
    body: JSON.stringify({ title }),
  })
  const payload = await parseResponse(response, "Could not rename Today plan.")
  notifyTodayPlansChanged()
  return payload.plan
}

export const saveTodayPlan = async (token, id) => {
  const response = await fetch(`${API_BASE}/api/today-plans/${id}/save`, {
    method: "POST",
    headers: authHeaders(token, true),
    body: JSON.stringify({}),
  })
  const payload = await parseResponse(response, "Could not save this trip.")
  notifyTodayPlansChanged()
  return payload
}
