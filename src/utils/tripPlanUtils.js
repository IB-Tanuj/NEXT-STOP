import supabase from "../config/supabase"

const getAccessToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) {
    throw new Error("You must be signed in to generate a trip plan.")
  }
  return session.access_token
}

const throwApiError = async (response, fallbackMessage) => {
  let payload
  try {
    payload = await response.json()
  } catch {
    // Keep the HTTP status as the fallback when the server did not return JSON.
    payload = { error: fallbackMessage }
  }

  const error = new Error(payload.message || payload.error || `${fallbackMessage} (HTTP ${response.status})`)
  error.status = response.status
  error.code = payload.error
  error.remaining = payload.remaining
  error.resetAt = payload.resetAt
  error.plan = payload.plan
  error.quota = payload.quota
  throw error
}

const getQuota = (response, payload) => ({
  limit: Number(response.headers.get("X-Trip-Quota-Limit") || payload?.quota?.limit || 5),
  remaining: Number(response.headers.get("X-Trip-Quota-Remaining") || payload?.quota?.remaining || 0),
  resetAt: payload?.quota?.resetAt || payload?.resetAt || (() => {
    const value = response.headers.get("X-Trip-Quota-Reset")
    return value ? new Date(Number(value) * 1000).toISOString() : null
  })(),
  charged: payload?.quota?.charged === true,
})

const waitForPlan = async (planId, accessToken, kind, savedTripId) => {
    if (!planId) return null
    for (let attempt = 0; attempt < 90; attempt += 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const endpoint = savedTripId
          ? `/api/today-plans/saved-trip/${savedTripId}`
          : `/api/today-plans/${planId}`
        const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) return null
    const { plan } = await response.json()
    const status = kind === "summary" ? plan.summary_status : plan.itinerary_status
    if (status === "ready" || status === "failed") return plan
  }
  return null
}

// API Calls
export const generateTripPlan = async (location, days, budget, stayType, transport, spots, options = {}) => {
  const accessToken = await getAccessToken()
  const response = await fetch("/api/trip/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      location,
      days,
      budget,
      stayType,
      transport,
      spots,
      todayPlanId: options.todayPlanId,
      savedTripId: options.savedTripId,
    }),
  });

  if (!response.ok) {
    await throwApiError(response, "Trip plan generation failed")
  }

  const payload = await response.json()
  const quota = getQuota(response, payload)
  let plan = payload.plan
  if (response.status === 202) plan = await waitForPlan(options.todayPlanId || plan?.id, accessToken, "summary", options.savedTripId) || plan
  return { data: plan?.ai_data || {}, plan, quota, cacheStatus: response.headers.get("X-Cache") || "UNKNOWN" }
}

export const fetchItineraryData = async (location, days, budget, stayType, transport, selectedActivities, selectedFestivals, options = {}) => {
  const accessToken = await getAccessToken()
  const response = await fetch("/api/trip/generate-itinerary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      location,
      days,
      budget,
      stayType,
      transport,
      selectedActivities,
      selectedFestivals,
      todayPlanId: options.todayPlanId,
      savedTripId: options.savedTripId,
    }),
  });

  if (!response.ok) {
    await throwApiError(response, "Itinerary generation failed")
  }

  const payload = await response.json();
  const quota = getQuota(response, payload)
  let plan = payload.plan
  if (response.status === 202) plan = await waitForPlan(options.todayPlanId || plan?.id, accessToken, "itinerary", options.savedTripId) || plan
  return { data: plan?.ai_data || {}, plan, quota, cacheStatus: response.headers.get("X-Cache") || "UNKNOWN" };
}

// Cache and Bucketization logic
export const BUCKET_SIZE = 500

export const bucketize = (budget) => Math.round(budget / BUCKET_SIZE) * BUCKET_SIZE

export const buildItineraryCacheKey = ({ location, days, budget, stayType, transport, selectedActivities, selectedFestivals }) => {
  const loc = (location || "").toLowerCase().trim()
  const d = days || 3
  const stay = (stayType || "budget").toLowerCase()
  const trans = (transport || "train").toLowerCase()

  const actNames = (selectedActivities || [])
    .map(a => (typeof a === "string" ? a : a.name || ""))
    .filter(Boolean)
    .sort()
    .join("+")

  const festNames = (selectedFestivals || [])
    .map(f => (typeof f === "string" ? f : f.name || ""))
    .filter(Boolean)
    .sort()
    .join("+")

  const bucket = bucketize(Number(budget) || 0)

  return `itinerary:${loc}:${d}:${stay}:${trans}:act_${actNames || "none"}:fest_${festNames || "none"}:bucket_${bucket}`
}

// Links
export const getTransportLinks = (transport, locationName) => {
  const links = {
    train: [
      { label: "🚂 Book Train on IRCTC", link: "https://www.irctc.co.in", note: "Official Indian Railways booking" },
      { label: "🚂 Book Train on ixigo", link: "https://www.ixigo.com/trains", note: "Compare prices & book" },
    ],
    bus: [
      { label: "🚌 Book Bus on RedBus", link: "https://www.redbus.in", note: "Largest bus booking platform" },
      { label: "🚌 Book Bus on AbhiBus", link: "https://www.abhibus.com", note: "Alternative bus booking" },
    ],
    flight: [
      { label: "✈️ Book Flight on MakeMyTrip", link: "https://www.makemytrip.com/flights", note: "Compare all airlines" },
      { label: "✈️ Book Flight on IndiGo", link: "https://www.goindigo.in", note: "Cheapest domestic flights" },
      { label: "✈️ Book Flight on Air India", link: "https://www.airindia.com", note: "Full service airline" },
    ],
    personal: [
      { label: "🗺️ Plan Route on Google Maps", link: `https://www.google.com/maps/dir/Delhi/${locationName}`, note: "Get driving directions" },
      { label: "⛽ Check Fuel Prices", link: "https://www.goodreturns.in/petrol-price.html", note: "Today's petrol/diesel prices" },
      { label: "🅿️ Book Parking on Park+", link: "https://www.parkplus.io", note: "Pre-book parking spots" },
    ],
  }
  return links[transport] || []
}

export const getStayLinks = (stayType) => {
  const allLinks = {
    hostel: [
      { label: "🛏️ Book on HostelWorld", link: "https://www.hostelworld.com", note: "Best hostel booking platform" },
      { label: "🛏️ Book on Zostel", link: "https://www.zostel.com", note: "India's top hostel chain" },
    ],
    budget: [
      { label: "🏨 Book on OYO", link: "https://www.oyorooms.com", note: "Budget hotels across India" },
      { label: "🏨 Book on Booking.com", link: "https://www.booking.com", note: "Compare budget hotels" },
    ],
    mid: [
      { label: "🏩 Book on Booking.com", link: "https://www.booking.com", note: "Best mid-range selection" },
      { label: "🏩 Book on MakeMyTrip", link: "https://www.makemytrip.com/hotels", note: "Hotels with deals" },
    ],
    premium: [
      { label: "🏰 Book on Booking.com", link: "https://www.booking.com", note: "Premium hotel selection" },
      { label: "🏰 Book on Taj Hotels", link: "https://www.tajhotels.com", note: "India's finest hotels" },
    ],
    luxury: [
      { label: "👑 Book on Booking.com", link: "https://www.booking.com", note: "Luxury collection" },
      { label: "👑 Book on Taj Hotels", link: "https://www.tajhotels.com", note: "Ultra premium experience" },
      { label: "👑 Book on ITC Hotels", link: "https://www.itchotels.com", note: "Luxury Indian hospitality" },
    ],
  }
  return allLinks[stayType] || allLinks.budget
}
