// API Calls
export const generateTripPlan = async (location, days, budget, stayType, transport, spots) => {
  const response = await fetch("/api/trip/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location,
      days,
      budget,
      stayType,
      transport,
      spots,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend Error Response:", errorText);
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

export const fetchItineraryData = async (location, days, budget, stayType, transport, selectedActivities, selectedFestivals) => {
  const response = await fetch("/api/trip/generate-itinerary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location,
      days,
      budget,
      stayType,
      transport,
      selectedActivities,
      selectedFestivals,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const cacheStatus = response.headers.get("X-Cache") || "UNKNOWN"
  const data = await response.json();
  return { data, cacheStatus };
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
