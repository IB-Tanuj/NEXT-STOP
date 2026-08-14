import { useState, useEffect } from "react"
import { transportCosts, entryCosts } from "../data/tripData"
import { getDistanceBetweenStations, findNearestStation, haversineDistance } from "../data/stations"
import TripPlan from "./TripPlan"

const DESTINATION_STATIONS = {
  goa: "MAO",
  manali: "CDG",
}



const DEFAULT_FOOD_COSTS = {
  local: { min: 100, max: 200, avg: 150 },
  mix: { min: 300, max: 550, avg: 400 },
  restaurant: { min: 600, max: 1200, avg: 850 },
  hotel_meals: { min: 1000, max: 2000, avg: 1400 },
}

// Generate dynamic medium data for direct routes
const generateDynamicMediumData = (dist, mode, destinationName) => {
  if (!dist) dist = 1000

  if (mode === "train") {
    const hours = Math.max(2, Math.round(dist / 55))
    const duration = `${hours}-${Math.round(hours * 1.15)}hr`
    return {
      options: [
        { type: "General (Unreserved)", min: Math.max(50, Math.round(dist * 0.22 / 10) * 10), max: Math.max(80, Math.round(dist * 0.28 / 10) * 10), duration, note: "No seat reservation, basic seating" },
        { type: "Sleeper Class (SL)", min: Math.max(120, Math.round(dist * 0.40 / 10) * 10), max: Math.max(160, Math.round(dist * 0.50 / 10) * 10), duration, note: "Reaching berths, no AC" },
        { type: "3AC Economy (3E)", min: Math.max(350, Math.round(dist * 1.00 / 50) * 50), max: Math.max(450, Math.round(dist * 1.20 / 50) * 50), duration, note: "3-tier berths, AC, reading lights" },
        { type: "3AC (3A)", min: Math.max(400, Math.round(dist * 1.15 / 50) * 50), max: Math.max(500, Math.round(dist * 1.35 / 50) * 50), duration, note: "3-tier berths, AC, bedding included" },
        { type: "2AC (2A)", min: Math.max(550, Math.round(dist * 1.50 / 50) * 50), max: Math.max(750, Math.round(dist * 1.85 / 50) * 50), duration, note: "2-tier berths, AC, curtains" },
        { type: "1AC (1A)", min: Math.max(900, Math.round(dist * 2.50 / 50) * 50), max: Math.max(1250, Math.round(dist * 3.20 / 50) * 50), duration, note: "Private cabins, premium bedding, meals" }
      ],
      recommended: {
        min: Math.max(120, Math.round(dist * 0.40 / 10) * 10),
        max: Math.max(400, Math.round(dist * 1.15 / 50) * 50)
      }
    }
  }

  if (mode === "bus") {
    const hours = Math.max(1, Math.round(dist / 50))
    const duration = `${hours}-${Math.round(hours * 1.2)}hr`
    return {
      options: [
        { type: "Non-AC Seater", min: Math.max(80, Math.round(dist * 1.2 / 50) * 50), max: Math.max(120, Math.round(dist * 1.6 / 50) * 50), duration, note: "Direct regular bus" },
        { type: "AC Sleeper", min: Math.max(150, Math.round(dist * 2.0 / 50) * 50), max: Math.max(250, Math.round(dist * 2.6 / 50) * 50), duration, note: "Comfortable overnight bus" },
        { type: "Volvo AC Seater/Sleeper", min: Math.max(200, Math.round(dist * 2.8 / 50) * 50), max: Math.max(350, Math.round(dist * 3.6 / 50) * 50), duration, note: "Premium Volvo / Scania coach" }
      ],
      recommended: {
        min: Math.max(150, Math.round(dist * 2.0 / 50) * 50),
        max: Math.max(350, Math.round(dist * 3.6 / 50) * 50)
      }
    }
  }

  if (mode === "flight") {
    if (dist < 300) {
      return {
        options: [{ type: "Economy Lite (Short Haul)", min: 1800, max: 2500, duration: "1-1.5hr", note: "Propeller / Regional flight" }],
        recommended: { min: 1800, max: 2500 }
      }
    }
    const hours = (dist / 800 + 0.8).toFixed(1)
    const duration = `${hours}hr`
    return {
      options: [
        { type: "Economy Lite", min: Math.max(2200, Math.round((2000 + dist * 1.2) / 100) * 100), max: Math.max(3000, Math.round((2800 + dist * 1.6) / 100) * 100), duration, note: "Basic seat, no meals, 15kg check-in" },
        { type: "Economy Value/Classic", min: Math.max(2800, Math.round((2600 + dist * 1.5) / 100) * 100), max: Math.max(4000, Math.round((3600 + dist * 2.0) / 100) * 100), duration, note: "Standard seat, snack, 15-20kg check-in" },
        { type: "Economy Flex", min: Math.max(3800, Math.round((3500 + dist * 2.2) / 100) * 100), max: Math.max(6000, Math.round((5500 + dist * 3.0) / 100) * 100), duration, note: "Free changes, standard seat, meal" }
      ],
      recommended: {
        min: Math.max(2200, Math.round((2000 + dist * 1.2) / 100) * 100),
        max: Math.max(4000, Math.round((3600 + dist * 2.0) / 100) * 100)
      }
    }
  }

  if (mode === "personal") {
    return {
      note: `Road trip from starting location to ${destinationName || 'destination'} ~${Math.round(dist)}km`,
      approxFuel: {
        min: Math.max(300, Math.round(dist * 3.5)),
        max: Math.max(600, Math.round(dist * 5.5)),
        note: `Fuel cost based on average mileage and distance`
      }
    }
  }

  return null
}

// Generate dynamic medium data for multi-leg routes
const generateDynamicMultiLegData = (fromStationCode, toStationCode, nearestStationObj, stationToDestDist, destinationName) => {
  if (!fromStationCode || !toStationCode || !nearestStationObj) return null
  const dist = getDistanceBetweenStations(fromStationCode, toStationCode) || 1000
  const trainHours = Math.max(2, Math.round(dist / 55))
  const trainDurationStr = `${trainHours}-${Math.round(trainHours * 1.15)}hr`

  const roadDist = Math.round(stationToDestDist)
  const busHours = Math.max(1, Math.round(roadDist / 35))
  const busDurationStr = `${busHours}-${Math.round(busHours * 1.3)}hr`
  
  const taxiHours = Math.max(1, Math.round(roadDist / 42))
  const taxiDurationStr = `${taxiHours}-${Math.round(taxiHours * 1.15)}hr`

  return {
    note: `No direct train to ${destinationName || 'destination'} — trains go to nearest station (${nearestStationObj.name}), then bus/taxi.`,
    stations: {
      [nearestStationObj.code.toLowerCase()]: {
        label: nearestStationObj.name,
        duration: trainDurationStr,
        options: [
          { type: "General", min: Math.max(50, Math.round(dist * 0.22 / 10) * 10), max: Math.max(80, Math.round(dist * 0.28 / 10) * 10) },
          { type: "Sleeper", min: Math.max(120, Math.round(dist * 0.40 / 10) * 10), max: Math.max(160, Math.round(dist * 0.50 / 10) * 10) },
          { type: "3AC", min: Math.max(400, Math.round(dist * 1.15 / 50) * 50), max: Math.max(500, Math.round(dist * 1.35 / 50) * 50) },
          { type: "2AC", min: Math.max(550, Math.round(dist * 1.50 / 50) * 50), max: Math.max(750, Math.round(dist * 1.85 / 50) * 50) },
          { type: "1AC", min: Math.max(900, Math.round(dist * 2.50 / 50) * 50), max: Math.max(1250, Math.round(dist * 3.20 / 50) * 50) }
        ],
        transfer: {
          bus: [
            { type: "Regular Bus", min: Math.max(40, Math.round(roadDist * 1.2 / 10) * 10), max: Math.max(70, Math.round(roadDist * 1.6 / 10) * 10), duration: busDurationStr },
            { type: "AC / Shared Taxi", min: Math.max(100, Math.round(roadDist * 2.2 / 10) * 10), max: Math.max(180, Math.round(roadDist * 3.2 / 10) * 10), duration: busDurationStr }
          ],
          taxi: [
            { type: "Private Taxi", min: Math.max(400, Math.round(roadDist * 12 / 50) * 50), max: Math.max(600, Math.round(roadDist * 18 / 50) * 50), duration: taxiDurationStr }
          ]
        }
      }
    },
    recommended: {
      min: Math.max(120, Math.round(dist * 0.40 / 10) * 10) + Math.max(40, Math.round(roadDist * 1.2 / 10) * 10),
      max: Math.max(400, Math.round(dist * 1.15 / 50) * 50) + Math.max(100, Math.round(roadDist * 2.2 / 10) * 10)
    }
  }
}

// ── Smart Split ────────────────────────────────────────
const calculateSmartSplit = (remaining, days, locationKey, groupSize, transport) => {
  let transportPercent = 40
  const farLocations = ["goa", "kerala"]
  if (farLocations.includes(locationKey)) transportPercent += 5
  if (days < 3) transportPercent += 5
  if (days > 7) transportPercent -= 5
  if (groupSize > 3) transportPercent -= 5
  if (transport === "personal") transportPercent = 0
  const foodPercent = 100 - transportPercent
  return {
    transportBudget: Math.round(remaining * transportPercent / 100),
    foodBudget: Math.round(remaining * foodPercent / 100),
    transportPercent,
    foodPercent,
  }
}
const BudgetResult = ({ location, theme, planData, preferences, onBack }) => {
  const [showTripPlan, setShowTripPlan] = useState(false)
  const locationKey = location?.name?.toLowerCase()
  const routeKey = `delhi-${locationKey}` // fallback key for static data
  const isGroup = planData.budgetType === "group"
  const groupSize = Number(planData.groupSize) || 1
  const totalBudget = Number(planData.budget)
  const perPersonBudget = isGroup ? Math.round(totalBudget / groupSize) : totalBudget

  // ── Live train data from API ────────────────────────
  const [liveTrainData, setLiveTrainData] = useState(null)
  const [trainLoading, setTrainLoading] = useState(false)
  const [trainError, setTrainError] = useState(null)

  const fromStation = preferences.selectedStation?.code
  const fromAirport = preferences.selectedAirport?.code

  // Resolve destination station dynamically (nearest to location coords)
  const destCoords = location?.coords
  const nearestStation = destCoords ? findNearestStation(destCoords[0], destCoords[1]) : null
  const toStation = DESTINATION_STATIONS[locationKey] || nearestStation?.code || "MAO"

  // Check if we need a road transfer (> 40km between station and location coordinates)
  const stationCoords = nearestStation ? [nearestStation.lat, nearestStation.lng] : null
  const stationToDestDist = (destCoords && stationCoords) 
    ? haversineDistance(destCoords[0], destCoords[1], stationCoords[0], stationCoords[1])
    : 0
  const isMultiLegJourney = stationToDestDist > 40

  const baseDistance = getDistanceBetweenStations("NDLS", toStation) || 1500
  let calculatedDist = baseDistance
  if (planData.originCoords && destCoords) {
    calculatedDist = Math.round(haversineDistance(planData.originCoords.lat, planData.originCoords.lng, destCoords[0], destCoords[1]))
  } else if (fromStation || fromAirport) {
    calculatedDist = getDistanceBetweenStations(fromStation || fromAirport, toStation) || baseDistance
  }

  useEffect(() => {
    if (fromStation && preferences.transport === "train") {
      setTrainLoading(true)
      setTrainError(null)
      fetch(`/api/trains/search?from=${fromStation}&to=${toStation}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then(data => {
          if (data.error) throw new Error(data.error)
          setLiveTrainData(data)
        })
        .catch(err => {
          console.warn("Train API failed, using fallback data:", err.message)
          setTrainError(err.message)
        })
        .finally(() => setTrainLoading(false))
    }
  }, [fromStation, toStation, preferences.transport])

  // ── Live flight data from API ────────────────────────
  const [liveFlightData, setLiveFlightData] = useState(null)
  const [flightLoading, setFlightLoading] = useState(false)
  const [flightError, setFlightError] = useState(null)

  useEffect(() => {
    if (preferences.transport === "flight") {
      setFlightLoading(true)
      setFlightError(null)
      const originParam = fromAirport || "DEL"
      fetch(`/api/flights/search?from=${originParam}&destination=${locationKey}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then(data => {
          if (data.error) throw new Error(data.error)
          setLiveFlightData(data)
        })
        .catch(err => {
          console.warn("Flight API failed:", err.message)
          setFlightError(err.message)
        })
        .finally(() => setFlightLoading(false))
    }
  }, [locationKey, preferences.transport])

  // ── Live vehicle data from API ───────────────────────
  const [vehicleType, setVehicleType] = useState("hatchback")
  const [fuelType, setFuelType] = useState("petrol")
  const [liveVehicleData, setLiveVehicleData] = useState(null)
  const [vehicleLoading, setVehicleLoading] = useState(false)
  const [vehicleError, setVehicleError] = useState(null)

  useEffect(() => {
    if (preferences.transport === "personal") {
      setVehicleLoading(true)
      setVehicleError(null)
      
      fetch(`/api/vehicle/calculate?distanceKm=${calculatedDist}&vehicleType=${vehicleType}&fuelType=${fuelType}&passengerCount=${groupSize}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error)
          setLiveVehicleData(data)
        })
        .catch(err => {
          console.warn("Vehicle API failed:", err)
          setVehicleError(err.message)
        })
        .finally(() => setVehicleLoading(false))
    }
  }, [preferences.transport, vehicleType, fuelType, groupSize, calculatedDist])

  // ── Stay (Booking.com via RapidAPI, TinyFish fallback) ────
  const [stayOptions, setStayOptions] = useState([])
  const [stayLoading, setStayLoading] = useState(false)
  const [stayError, setStayError] = useState(null)
  const [selectedStayIndex, setSelectedStayIndex] = useState(0)
  const [manualPrice, setManualPrice] = useState("")
  const [roomOption, setRoomOption] = useState("separate")

  useEffect(() => {
    if (!locationKey || !preferences.stayType) return
    const controller = new AbortController()

    setStayLoading(true)
    setStayError(null)
    setStayOptions([]) // Clear old options

    // Build query params for hotel API
    const params = new URLSearchParams({
      destination: location?.name || locationKey,
      daysOfStay: String(preferences.days || 3),
      transportMode: preferences.transport || 'personal',
      adults: String(isGroup ? groupSize : 2),
    })
    if (calculatedDist) params.set('distanceKms', String(calculatedDist))

    fetch(`/api/hotels/search?${params.toString()}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        const hotels = data?.apiData?.data
        if (Array.isArray(hotels) && hotels.length > 0) {
          const daysOfStay = preferences.days || 3

          // Map Booking.com response to our stayOptions format
          const mapped = hotels.slice(0, 5).map(hotel => {
            const totalPrice = hotel.priceBreakdown?.grossPrice?.value || 0
            const currency = hotel.priceBreakdown?.grossPrice?.currency || 'INR'
            // Convert to INR if needed (approximate rates)
            let priceINR = totalPrice
            if (currency === 'EUR') priceINR = totalPrice * 96
            else if (currency === 'USD') priceINR = totalPrice * 85
            else if (currency === 'GBP') priceINR = totalPrice * 108

            const perNight = Math.round(priceINR / daysOfStay)
            const stars = hotel.propertyClass || hotel.accuratePropertyClass || 0
            const reviewWord = hotel.reviewScoreWord || ''
            const starText = stars > 0 ? `${stars}★` : ''

            return {
              name: hotel.name || 'Hotel',
              pricePerNight: perNight,
              rating: hotel.reviewScore ? String(hotel.reviewScore) : 'N/A',
              maxCapacity: 2, // Booking.com doesn't expose this directly; we searched with `adults` param
              highlight: [starText, reviewWord].filter(Boolean).join(' · ') || 'Great stay',
            }
          })

          setStayOptions(mapped)
          setSelectedStayIndex(0)
        } else {
          throw new Error("No hotels found from Booking API")
        }
      })
      .catch(err => {
        if (err.name === "AbortError") return

        // Fallback to TinyFish if hotel API fails
        console.warn("Hotel API failed, trying TinyFish fallback:", err.message)
        fetch('/api/live/search-stays', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location: location?.name, stayType: preferences.stayType }),
          signal: controller.signal
        })
          .then(res => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`)))
          .then(data => {
            if (data.stays?.length > 0) {
              setStayOptions(data.stays)
              setSelectedStayIndex(0)
            } else {
              throw new Error("No stay options from fallback either")
            }
          })
          .catch(fallbackErr => {
            if (fallbackErr.name === "AbortError") return
            console.warn("TinyFish fallback also failed:", fallbackErr.message)
            setStayError(fallbackErr.message)
            setStayOptions([])
            setSelectedStayIndex(-1)
          })
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setStayLoading(false)
        }
      })

    return () => controller.abort()
  }, [locationKey, preferences.stayType])

  // If there's an error, selectedStay is undefined, so it gracefully falls back to manualPrice
  const selectedStay = stayOptions[selectedStayIndex]
  const pricePerNight = selectedStay?.pricePerNight || (manualPrice ? Number(manualPrice) : 0)

  const getStayCost = (option) => {
    if (!isGroup) return pricePerNight * preferences.days
    if (option === "one") return pricePerNight * preferences.days * 1
    if (option === "two") return pricePerNight * preferences.days * 2
    return pricePerNight * preferences.days * groupSize
  }

  // ── Entry Tickets ──────────────────────────────────────
  const entriesData = entryCosts[locationKey] || {}
  const entryBreakdown = []
  let entryPerPerson = 0
  preferences.activities?.forEach(activity => {
    const e = entriesData[activity]
    if (e) {
      entryPerPerson += e.cost
      entryBreakdown.push({ name: activity, cost: e.cost, note: e.note })
    }
  })
  const totalEntryCost = entryPerPerson * (isGroup ? groupSize : 1)


  // ── Transport Detection ────────────────────────────────
  const routeData = transportCosts[routeKey]
  const transportMedium = preferences.transport
  let mediumData = routeData?.[transportMedium]
  let isDynamicTransport = false
  
  if (!mediumData && (fromStation || fromAirport || transportMedium === "bus" || transportMedium === "personal")) {
    if (transportMedium === "train" && isMultiLegJourney && nearestStation) {
      mediumData = generateDynamicMultiLegData(fromStation, toStation, nearestStation, stationToDestDist, location?.name)
    } else {
      mediumData = generateDynamicMediumData(calculatedDist, transportMedium, location?.name)
    }
    isDynamicTransport = true
  }

  // ── Dynamic Distance Scaling (Fallback for API) ─────────
  if (!isDynamicTransport && mediumData && fromStation && toStation) {
    const baseDistance = getDistanceBetweenStations("NDLS", toStation) || 1500
    const newDistance = getDistanceBetweenStations(fromStation, toStation) || baseDistance
    
    // Scale factor (capped between 0.2x and 3x)
    let scale = newDistance / baseDistance
    if (scale < 0.2) scale = 0.2
    if (scale > 3) scale = 3

    // Deep copy mediumData to safely mutate
    mediumData = JSON.parse(JSON.stringify(mediumData))

    if (mediumData.options) {
      mediumData.options = mediumData.options.map(opt => {
        const scaledMin = Math.round((opt.min * scale) / 50) * 50
        const scaledMax = Math.round((opt.max * scale) / 50) * 50
        let scaledDuration = opt.duration
        
        // Scale duration string like "36-40hr"
        if (opt.duration) {
          const hoursMatch = opt.duration.match(/(\d+)-(\d+)hr/)
          if (hoursMatch) {
            const hMin = Math.round(parseInt(hoursMatch[1]) * scale)
            const hMax = Math.round(parseInt(hoursMatch[2]) * scale)
            scaledDuration = `${Math.max(1, hMin)}-${Math.max(2, hMax)}hr`
          } else {
            const singleMatch = opt.duration.match(/(\d+)hr/)
            if (singleMatch) {
              const h = Math.round(parseInt(singleMatch[1]) * scale)
              scaledDuration = `${Math.max(1, h)}hr`
            }
          }
        }
        
        return {
          ...opt,
          min: scaledMin,
          max: scaledMax,
          duration: scaledDuration
        }
      })
    }
    
    // Scale multi-leg options
    if (mediumData.stations) {
      Object.keys(mediumData.stations).forEach(stKey => {
        const st = mediumData.stations[stKey]
        if (st.options) {
          st.options = st.options.map(opt => {
            const scaledMin = Math.round((opt.min * scale) / 50) * 50
            const scaledMax = Math.round((opt.max * scale) / 50) * 50
            return { ...opt, min: scaledMin, max: scaledMax }
          })
        }
      })
    }
  }

  // ── Inject Live Flight/Train Data ────────────────────────────
  if (transportMedium === "flight" && liveFlightData && liveFlightData.options?.length > 0) {
    mediumData = {
      ...mediumData,
      options: liveFlightData.options.map(f => ({
        type: f.type,
        min: f.price,
        max: f.price,
        duration: f.duration,
        note: f.note
      })),
      note: liveFlightData.options[0]?.note || "Live prices from Google Flights"
    }
  } else if (transportMedium === "train" && liveTrainData && liveTrainData.options?.length > 0) {
    mediumData = {
      ...mediumData,
      options: liveTrainData.options.map(t => ({
        type: t.type,
        min: t.price,
        max: t.price,
        duration: t.duration,
        note: t.note
      })),
      note: liveTrainData.options[0]?.note || "Live prices from Train API"
    }
  }

  const isMultiLeg = mediumData?.stations !== undefined
  const isDirect = mediumData?.options !== undefined

  // ── Multi-leg state ────────────────────────────────────
  const stationKeys = isMultiLeg ? Object.keys(mediumData.stations) : []
  const [selectedStation, setSelectedStation] = useState(stationKeys[0] || "")
  const [selectedTrainClass, setSelectedTrainClass] = useState("")
  const [selectedTransferType, setSelectedTransferType] = useState("bus")
  const [selectedTransferClass, setSelectedTransferClass] = useState("")

  // Ensure selectedStation updates if stationKeys change
  useEffect(() => {
    if (isMultiLeg && stationKeys.length > 0 && !selectedStation) {
      setSelectedStation(stationKeys[0])
    }
  }, [isMultiLeg, stationKeys, selectedStation])

  // ── Direct transport state ─────────────────────────────
  const [selectedDirectClass, setSelectedDirectClass] = useState("")

  // ── Flight transfer state ──────────────────────────────
  const isFlightMultiLeg = transportMedium === "flight" && mediumData?.transfer !== undefined
  const [selectedFlightClass, setSelectedFlightClass] = useState("")
  const [selectedFlightTransfer, setSelectedFlightTransfer] = useState("")

  useEffect(() => {
    if (isMultiLeg && selectedStation && mediumData?.stations) {
      const st = mediumData.stations[selectedStation]
      if (st?.options?.length > 0 && !st.options.some(o => o.type === selectedTrainClass)) {
        setSelectedTrainClass(st.options[0].type)
      }
      if (st?.transfer?.bus?.length > 0 && !st.transfer.bus.some(o => o.type === selectedTransferClass)) {
        setSelectedTransferClass(st.transfer.bus[0].type)
      }
    }
    if (isDirect && mediumData?.options?.length > 0) {
      if (!mediumData.options.some(o => o.type === selectedDirectClass)) {
        setSelectedDirectClass(mediumData.options[0].type)
      }
    }
    if (isFlightMultiLeg && mediumData) {
      if (mediumData?.options?.length > 0 && !mediumData.options.some(o => o.type === selectedFlightClass)) {
        setSelectedFlightClass(mediumData.options[0].type)
      }
      const transferKeys = Object.keys(mediumData.transfer || {})
      if (transferKeys.length > 0 && !transferKeys.includes(selectedFlightTransfer)) {
        setSelectedFlightTransfer(transferKeys[0])
      }
    }
  }, [
    selectedStation, isMultiLeg, isDirect, isFlightMultiLeg, mediumData,
    selectedTrainClass, selectedTransferClass, selectedDirectClass,
    selectedFlightClass, selectedFlightTransfer
  ])

  // ── Transport Cost Calculation ─────────────────────────
  const getTransportCost = () => {
    if (transportMedium === "personal") return liveVehicleData ? liveVehicleData.breakdown.totalTripCost : 0

    if (isMultiLeg && selectedStation) {
      const st = mediumData.stations[selectedStation]

      // Train leg cost
      const trainOpt = st?.options?.find(o => o.type === selectedTrainClass)
      const trainCostPerPerson = trainOpt ? Math.round((trainOpt.min + trainOpt.max) / 2) : 0

      // Transfer leg cost
      let transferCostPerPerson = 0
      if (selectedTransferType === "bus") {
        const busOpt = st?.transfer?.bus?.find(o => o.type === selectedTransferClass)
        transferCostPerPerson = busOpt ? Math.round((busOpt.min + busOpt.max) / 2) : 0
      } else if (selectedTransferType === "taxi") {
        const taxiOpt = st?.transfer?.taxi?.[0]
        transferCostPerPerson = taxiOpt ? Math.round((taxiOpt.min + taxiOpt.max) / 2) / (isGroup ? groupSize : 1) : 0
      }

      const totalPerPerson = (trainCostPerPerson + transferCostPerPerson) * 2 // round trip
      return totalPerPerson * (isGroup ? groupSize : 1)
    }

    if (isDirect) {
      const opt = mediumData?.options?.find(o => o.type === selectedDirectClass)
      if (!opt) return 0
      const avg = Math.round((opt.min + opt.max) / 2)
      return avg * 2 * (isGroup ? groupSize : 1)
    }

    if (isFlightMultiLeg) {
      const flightOpt = mediumData?.options?.find(o => o.type === selectedFlightClass)
      const flightCost = flightOpt ? Math.round((flightOpt.min + flightOpt.max) / 2) : 0

      const transferData = mediumData?.transfer?.[selectedFlightTransfer]
      const transferCost = transferData ? Math.round((transferData.min + transferData.max) / 2) : 0

      return (flightCost * 2 + transferCost) * (isGroup ? groupSize : 1)
    }

    return 0
  }

  // ── Real Time Budget ───────────────────────────────────
  const stayCost = getStayCost(roomOption)
  const transportCost = getTransportCost()
  const totalSpent = stayCost + totalEntryCost + transportCost
  const foodBuffer = totalBudget - totalSpent

  // ── Public Comparison (personal vehicle) ──────────────
  const publicComparison = ["bus", "train", "flight"].map(mode => {
    const m = routeData?.[mode]?.recommended
    if (!m) return null
    const avg = Math.round((m.min + m.max) / 2) * 2 * (isGroup ? groupSize : 1)
    return { mode, cost: avg }
  }).filter(Boolean)

  const card = (children, extra = {}) => (
    <div style={{
      background: theme.card,
      borderRadius: "16px",
      padding: "24px",
      border: `1px solid ${theme.primary}33`,
      ...extra,
    }}>
      {children}
    </div>
  )

  const sectionLabel = (text) => (
    <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "14px" }}>
      {text}
    </div>
  )

  const selectableRow = (label, sublabel, rightTop, rightBottom, isSelected, onClick, danger = false, keyProp) => (
    <div
      key={keyProp || `${label}-${sublabel}`}
      onClick={onClick}
      style={{
        padding: "12px 16px",
        borderRadius: "12px",
        marginBottom: "8px",
        border: `2px solid ${isSelected ? theme.primary : danger ? "#ff6b6b33" : theme.primary + "22"}`,
        background: isSelected ? `${theme.primary}22` : "transparent",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "all 0.3s ease",
      }}>
      <div>
        <div style={{ color: isSelected ? theme.primary : theme.text, fontWeight: isSelected ? "800" : "600", fontSize: "14px" }}>
          {isSelected ? "⭐ " : ""}{label}
        </div>
        {sublabel && <div style={{ color: theme.subtext, fontSize: "11px" }}>{sublabel}</div>}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ color: danger ? "#ff6b6b" : theme.primary, fontWeight: "800", fontSize: "13px" }}>{rightTop}</div>
        {rightBottom && <div style={{ color: theme.subtext, fontSize: "11px" }}>{rightBottom}</div>}
      </div>
    </div>
  )

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
        💰 SMART BUDGET BREAKDOWN
      </div>
      <h2 style={{ color: theme.text, fontSize: "clamp(20px, 4vw, 30px)", fontWeight: "900", marginBottom: "8px", textAlign: "center" }}>
        Your {preferences.days}-Day Trip to {location?.name}
      </h2>
      <div style={{ color: theme.subtext, fontSize: "14px", marginBottom: "40px", textAlign: "center" }}>
        {isGroup ? `👥 Group of ${groupSize}` : "👤 Solo"} &nbsp;|&nbsp;
        Total: ₹{totalBudget.toLocaleString("en-IN")}
        {isGroup && <span> · ₹{perPersonBudget.toLocaleString("en-IN")}/person</span>}
        {planData.selectedStationCode && (
          <span> &nbsp;|&nbsp; 🚉 From: {planData.selectedStationName || planData.selectedStationCode} → {location?.name}</span>
        )}
      </div>

      <div style={{ width: "100%", maxWidth: "620px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Budget Status */}
        <div style={{
          background: foodBuffer >= 0 ? `${theme.primary}22` : "#ff6b6b22",
          border: `2px solid ${foodBuffer >= 0 ? theme.primary : "#ff6b6b"}`,
          borderRadius: "16px", padding: "20px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>{foodBuffer >= 0 ? "✅" : "⚠️"}</div>
          <div style={{ color: theme.text, fontWeight: "800", fontSize: "18px", marginBottom: "6px" }}>
            {foodBuffer >= 0 ? "Budget works!" : `Short by ₹${Math.abs(foodBuffer).toLocaleString("en-IN")}`}
          </div>
          <div style={{ color: theme.subtext, fontSize: "13px" }}>
            {foodBuffer >= 0
              ? `₹${foodBuffer.toLocaleString("en-IN")} remaining for food, shopping & activities`
              : "Reduce stay days, share rooms or pick cheaper transport"}
          </div>
        </div>

        {/* Stay Card — Live TinyFish Search */}
        {card(<>
          {sectionLabel(`🏨 SELECT YOUR STAY IN ${location?.name?.toUpperCase()}`)}
          <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "16px" }}>
            Showing real {preferences.stayType} options — tap to select
          </div>

          {stayLoading ? (
            <div style={{ color: theme.subtext, textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px", animation: "pulse 1.5s infinite" }}>🔍</div>
              Searching for {preferences.stayType} stays in {location?.name}...
            </div>
          ) : stayError ? (
            <div>
              <div style={{
                background: "#ff6b6b22", border: "1px solid #ff6b6b",
                borderRadius: "12px", padding: "16px", marginBottom: "16px", textAlign: "center",
              }}>
                <div style={{ color: "#ff6b6b", fontWeight: "700", fontSize: "14px", marginBottom: "6px" }}>
                  ⚠️ Could not fetch live stay options
                </div>
                <div style={{ color: theme.subtext, fontSize: "12px" }}>
                  Enter your expected price per night manually:
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ color: theme.text, fontWeight: "700", fontSize: "16px" }}>₹</span>
                <input
                  type="number"
                  value={manualPrice}
                  onChange={e => setManualPrice(e.target.value)}
                  placeholder="e.g. 800"
                  style={{
                    flex: 1, padding: "12px 16px", borderRadius: "12px",
                    border: `2px solid ${theme.primary}44`, background: "transparent",
                    color: theme.text, fontSize: "16px", fontWeight: "700",
                    outline: "none",
                  }}
                />
                <span style={{ color: theme.subtext, fontSize: "13px" }}>/night</span>
              </div>
            </div>
          ) : stayOptions.length > 0 ? (
            stayOptions.map((stay, i) => {
              const isSelected = selectedStayIndex === i
              const thisCost = stay.pricePerNight * preferences.days * (isGroup ? (roomOption === "one" ? 1 : roomOption === "two" ? 2 : groupSize) : 1)
              const thisBuffer = totalBudget - totalEntryCost - transportCost - thisCost
              return (
                <div
                  key={i}
                  onClick={() => setSelectedStayIndex(i)}
                  style={{
                    padding: "14px 16px", borderRadius: "12px", marginBottom: "8px",
                    border: `2px solid ${isSelected ? theme.primary : theme.primary + "22"}`,
                    background: isSelected ? `${theme.primary}22` : "transparent",
                    cursor: "pointer", transition: "all 0.3s ease",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <div style={{ color: isSelected ? theme.primary : theme.text, fontWeight: isSelected ? "800" : "600", fontSize: "14px" }}>
                      {isSelected ? "⭐ " : ""}{stay.name}
                    </div>
                    <div style={{ color: theme.primary, fontWeight: "800" }}>₹{stay.pricePerNight}/night</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ color: theme.subtext, fontSize: "11px" }}>
                      ⭐ {stay.rating} · 👥 {stay.maxCapacity} people · {stay.highlight}
                    </div>
                    <div style={{ color: thisBuffer >= 0 ? theme.subtext : "#ff6b6b", fontSize: "11px" }}>
                      {thisBuffer >= 0 ? `₹${thisBuffer.toLocaleString("en-IN")} left` : `₹${Math.abs(thisBuffer).toLocaleString("en-IN")} over`}
                    </div>
                  </div>
                </div>
              )
            })
          ) : null}

          {isGroup && stayOptions.length > 0 && !stayLoading && (
            <div style={{ marginTop: "12px", marginBottom: "12px" }}>
              <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "10px" }}>
                Room sharing for {groupSize} people:
              </div>
              {[
                { id: "separate", label: `${groupSize} separate rooms`, cost: getStayCost("separate") },
                { id: "two", label: "2 shared rooms", cost: getStayCost("two") },
                { id: "one", label: "1 shared room", cost: getStayCost("one") },
              ].map(opt => selectableRow(
                opt.label, null,
                `₹${opt.cost.toLocaleString("en-IN")}`, null,
                roomOption === opt.id,
                () => setRoomOption(opt.id)
              ,))}
            </div>
          )}

          {pricePerNight > 0 && (
            <div style={{
              marginTop: "12px", padding: "14px 16px", borderRadius: "12px",
              background: `${theme.primary}11`, border: `1px solid ${theme.primary}33`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ color: theme.text, fontWeight: "600", fontSize: "14px" }}>
                  {selectedStay?.name || preferences.stayType} · {preferences.days} nights
                </div>
                <div style={{ color: theme.subtext, fontSize: "12px" }}>
                  ₹{pricePerNight}/night × {isGroup ? `${roomOption === "separate" ? groupSize : roomOption === "two" ? 2 : 1} room(s) × ` : ""}{preferences.days} nights
                </div>
              </div>
              <div style={{ color: "#4ECDC4", fontWeight: "800", fontSize: "20px" }}>
                ₹{getStayCost(roomOption).toLocaleString("en-IN")}
              </div>
            </div>
          )}
        </>)}

        {/* Transport Card — Multi-leg (Train) */}
        {isMultiLeg && transportMedium !== "personal" && card(<>
          {sectionLabel(`🚂 ${transportMedium.toUpperCase()} JOURNEY — MULTI-LEG`)}
          <div style={{ color: "#FFB347", fontSize: "13px", marginBottom: "16px", padding: "10px", borderRadius: "8px", background: "#FFB34722" }}>
            ℹ️ {mediumData.note}
          </div>

          {/* Step 1 — Select Station */}
          <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px", marginBottom: "10px" }}>
            Step 1 — Select nearest station:
          </div>
          {stationKeys.map(key => {
            const st = mediumData.stations[key]
            return selectableRow(
              st.label,
              `Train duration: ${st.duration}`,
              "", null,
              selectedStation === key,
              () => setSelectedStation(key)
            ,) 
          })}

          {/* Step 2 — Select Train Class */}
          {selectedStation && (
            <>
          <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px", margin: "16px 0 10px" }}>
                Step 2 — Select train class ({planData.selectedStationName || "Origin"} → {mediumData.stations[selectedStation]?.label}):
              </div>
              {mediumData.stations[selectedStation]?.options?.map((opt, i) => {
                const avg = Math.round((opt.min + opt.max) / 2)
                return selectableRow(
                  opt.type, null,
                  `₹${opt.min}–₹${opt.max}`, "per person",
                  selectedTrainClass === opt.type,
                  () => setSelectedTrainClass(opt.type)
                )
              })}
            </>
          )}

          {/* Step 3 — Select Transfer */}
          {selectedStation && (
            <>
              <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px", margin: "16px 0 10px" }}>
                Step 3 — {mediumData.stations[selectedStation]?.label} → {location?.name} by:
              </div>

              {/* Transfer type toggle */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                {["bus", "taxi"].map(type => {
                  const hasData = mediumData.stations[selectedStation]?.transfer?.[type]
                  if (!hasData) return null
                  return (
                    <div
                      key={type}
                      onClick={() => {
                        setSelectedTransferType(type)
                        if (type === "bus") {
                          const first = mediumData.stations[selectedStation]?.transfer?.bus?.[0]
                          if (first) setSelectedTransferClass(first.type)
                        }
                      }}
                      style={{
                        flex: 1, padding: "10px", borderRadius: "10px", textAlign: "center",
                        border: `2px solid ${selectedTransferType === type ? theme.primary : theme.primary + "33"}`,
                        background: selectedTransferType === type ? `${theme.primary}22` : "transparent",
                        color: selectedTransferType === type ? theme.primary : theme.subtext,
                        cursor: "pointer", fontWeight: "700", fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}>
                      {type === "bus" ? "🚌 Bus" : "🚕 Taxi"}
                    </div>
                  )
                })}
              </div>

              {/* Bus options */}
              {selectedTransferType === "bus" && mediumData.stations[selectedStation]?.transfer?.bus?.map((opt, i) => (
                selectableRow(
                  opt.type,
                  `Duration: ${opt.duration}`,
                  `₹${opt.min}–₹${opt.max}`, "per person",
                  selectedTransferClass === opt.type,
                  () => setSelectedTransferClass(opt.type)
                ,i)
              ))}

              {/* Taxi options */}
              {selectedTransferType === "taxi" && mediumData.stations[selectedStation]?.transfer?.taxi?.map((opt, i) => (
                selectableRow(
                  opt.type,
                  `Duration: ${opt.duration}`,
                  `₹${opt.min}–₹${opt.max}`, isGroup ? "shared taxi" : "per taxi",
                  true,
                  () => {}
                ,i)
              ))}
            </>
          )}

          {/* Total transport cost */}
          <div style={{
            marginTop: "16px", padding: "14px 16px", borderRadius: "12px",
            background: `${theme.primary}11`, border: `1px solid ${theme.primary}33`,
            display: "flex", justifyContent: "space-between",
          }}>
            <span style={{ color: theme.text, fontWeight: "700" }}>Total Transport (Round Trip)</span>
            <span style={{ color: theme.primary, fontWeight: "900", fontSize: "18px" }}>
              ₹{transportCost.toLocaleString("en-IN")}
            </span>
          </div>
        </>)}

        {/* Transport Card — Flight with transfer */}
        {isFlightMultiLeg && transportMedium === "flight" && card(<>
          {sectionLabel("✈️ FLIGHT JOURNEY")}
          {mediumData.note && (
            <div style={{ color: "#FFB347", fontSize: "13px", marginBottom: "16px", padding: "10px", borderRadius: "8px", background: "#FFB34722" }}>
              ℹ️ {mediumData.note}
            </div>
          )}

          {/* Flight class */}
          <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px", marginBottom: "10px" }}>
            Step 1 — Select flight class:
          </div>
          {mediumData.options?.map((opt, i) => {
            const priceText = opt.min === opt.max ? `₹${opt.min.toLocaleString("en-IN")}` : `₹${opt.min.toLocaleString("en-IN")}–₹${opt.max.toLocaleString("en-IN")}`
            return selectableRow(
              opt.type,
              `${opt.note || ""} ${opt.duration ? `· ${opt.duration}` : ""}`,
              priceText,
              "per person",
              selectedFlightClass === opt.type,
              () => setSelectedFlightClass(opt.type)
            ,i)
          })}

          {/* Airport transfer */}
          <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px", margin: "16px 0 10px" }}>
            Step 2 — Airport → {location?.name} transfer:
          </div>
          {Object.entries(mediumData.transfer || {}).map(([key, val], i) => selectableRow(
            key === "cab" ? "🚕 Cab" : key === "selfDrive" ? "🚗 Self Drive" : "🚙 SUV/Premium Cab",
            `Duration: ${val.duration}`,
            `₹${val.min}–₹${val.max}`, "per transfer",
            selectedFlightTransfer === key,
            () => setSelectedFlightTransfer(key)
          ,i))}

          <div style={{
            marginTop: "16px", padding: "14px 16px", borderRadius: "12px",
            background: `${theme.primary}11`, border: `1px solid ${theme.primary}33`,
            display: "flex", justifyContent: "space-between",
          }}>
            <span style={{ color: theme.text, fontWeight: "700" }}>Total Transport (Round Trip)</span>
            <span style={{ color: theme.primary, fontWeight: "900", fontSize: "18px" }}>
              ₹{transportCost.toLocaleString("en-IN")}
            </span>
          </div>
        </>)}

        {/* Transport Card — Direct */}
        {isDirect && transportMedium !== "personal" && !isFlightMultiLeg && card(<>
          {sectionLabel(`${transportMedium === "flight" ? "✈️" : transportMedium === "train" ? "🚂" : "🚌"} SELECT ${transportMedium.toUpperCase()} CLASS (${preferences.selectedStation?.name || preferences.selectedAirport?.name || planData.originCity || "Origin"} → ${location?.name})`)}
          
          {transportMedium !== "flight" && (
            <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "16px" }}>
              Tap to see real-time food buffer update
            </div>
          )}

          {mediumData.options?.map((opt, i) => {
            const thisCost = Math.round((opt.min + opt.max) / 2) * 2 * (isGroup ? groupSize : 1)
            const thisBuffer = totalBudget - getStayCost(roomOption) - totalEntryCost - thisCost
            
            const priceText = opt.min === opt.max ? `₹${opt.min.toLocaleString("en-IN")} per leg` : `₹${opt.min.toLocaleString("en-IN")}–₹${opt.max.toLocaleString("en-IN")} per leg`
            const rightBottomText = transportMedium === "flight" ? undefined : `${thisBuffer >= 0 ? `₹${thisBuffer.toLocaleString("en-IN")} for food` : `₹${Math.abs(thisBuffer).toLocaleString("en-IN")} over budget`}`
            
            return selectableRow(
              opt.type,
              `${opt.note || ""} ${opt.duration ? `· ${opt.duration}` : ""}`,
              priceText,
              rightBottomText,
              selectedDirectClass === opt.type,
              () => setSelectedDirectClass(opt.type),
              thisBuffer < 0 && transportMedium !== "flight", i
            )
          })}
        </>)}

        {/* Personal Vehicle */}
        {transportMedium === "personal" && publicComparison.length > 0 && card(<>
          {sectionLabel("🚗 PERSONAL VEHICLE")}
          
          {vehicleLoading ? (
            <div style={{ color: theme.primary, padding: "10px", textAlign: "center", fontSize: "14px" }}>
              Calculating optimal route distance and live fuel costs...
            </div>
          ) : liveVehicleData ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div style={{ color: theme.text, fontSize: "14px", fontWeight: "600" }}>
                Route Distance: <span style={{ color: theme.primary }}>{liveVehicleData.distanceKm} km (one-way)</span>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: `${theme.primary}11`, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.primary}22` }}>
                  <div style={{ color: theme.subtext, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>⛽ Fuel Est.</div>
                  <div style={{ color: theme.text, fontWeight: "700", fontSize: "16px" }}>₹{liveVehicleData.breakdown.fuelCost.toLocaleString("en-IN")}</div>
                  <div style={{ color: theme.subtext, fontSize: "11px" }}>{liveVehicleData.breakdown.fuelRequired} req.</div>
                </div>
                <div style={{ background: `${theme.primary}11`, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.primary}22` }}>
                  <div style={{ color: theme.subtext, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>🛣️ Toll Tax</div>
                  <div style={{ color: theme.text, fontWeight: "700", fontSize: "16px" }}>₹{liveVehicleData.breakdown.tollCost.toLocaleString("en-IN")}</div>
                  <div style={{ color: theme.subtext, fontSize: "11px" }}>NHAI standard rate</div>
                </div>
              </div>

              <div style={{ color: theme.text, fontWeight: "800", fontSize: "16px", marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
                <span>Total Road Trip Cost</span>
                <span style={{ color: "#4ECDC4" }}>₹{liveVehicleData.breakdown.totalTripCost.toLocaleString("en-IN")}</span>
              </div>
              
              {isGroup && (
                 <div style={{ color: theme.subtext, fontSize: "12px", textAlign: "right" }}>
                   (₹{liveVehicleData.breakdown.costPerPerson.toLocaleString("en-IN")} per person)
                 </div>
              )}

              {liveVehicleData.tips && liveVehicleData.tips.map((tip, i) => (
                <div key={i} style={{ background: `${theme.primary}11`, padding: "8px 12px", borderRadius: "6px", fontSize: "12px", color: theme.subtext, display: "flex", gap: "8px" }}>
                  <span>💡</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "16px" }}>
                {routeData?.personal?.note || "A road trip is a great way to explore at your own pace!"}
              </div>
              <div style={{ color: theme.text, fontWeight: "700", marginBottom: "16px" }}>
                Approximate fuel cost: ₹{routeData?.personal?.approxFuel?.min?.toLocaleString("en-IN")} — ₹{routeData?.personal?.approxFuel?.max?.toLocaleString("en-IN")}
              </div>
            </>
          )}

          {sectionLabel("💡 PUBLIC TRANSPORT COMPARISON")}
          {publicComparison.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < publicComparison.length - 1 ? `1px solid ${theme.primary}22` : "none",
            }}>
              <span style={{ color: theme.text, fontWeight: "600", fontSize: "14px" }}>
                {item.mode === "bus" ? "🚌 Bus" : item.mode === "train" ? "🚂 Train" : "✈️ Flight"}
              </span>
              <span style={{ color: theme.primary, fontWeight: "700" }}>
                ₹{item.cost.toLocaleString("en-IN")} round trip
              </span>
            </div>
          ))}
        </>)}

        {/* Entry Tickets */}
        {entryBreakdown.length > 0 && card(<>
          {sectionLabel(`🎯 ENTRY TICKETS ${isGroup ? `(× ${groupSize} people)` : ""}`)}
          {entryBreakdown.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < entryBreakdown.length - 1 ? `1px solid ${theme.primary}22` : "none",
            }}>
              <div>
                <div style={{ color: theme.text, fontSize: "14px", fontWeight: "600" }}>📍 {item.name}</div>
                <div style={{ color: theme.subtext, fontSize: "12px" }}>{item.note}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: item.cost === 0 ? "#A8E6CF" : theme.primary, fontWeight: "700" }}>
                  {item.cost === 0 ? "FREE" : `₹${item.cost}${isGroup ? ` × ${groupSize}` : ""}`}
                </div>
                {isGroup && item.cost > 0 && (
                  <div style={{ color: theme.subtext, fontSize: "11px" }}>
                    Total: ₹{(item.cost * groupSize).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", marginTop: "8px", borderTop: `1px solid ${theme.primary}33` }}>
            <span style={{ color: theme.text, fontWeight: "700" }}>Total Entry Cost</span>
            <span style={{ color: "#FFE66D", fontWeight: "800" }}>₹{totalEntryCost.toLocaleString("en-IN")}</span>
          </div>
        </>)}

        {/* Cost Summary */}
        {card(<>
          {sectionLabel("COST SUMMARY")}
          {[
            { label: "🏨 Stay", amount: getStayCost(roomOption), color: "#4ECDC4" },
            { label: "🚌 Transport (round trip)", amount: transportCost, color: "#FF6B6B" },
            { label: "🎯 Entry Tickets", amount: totalEntryCost, color: "#FFE66D" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0", borderBottom: `1px solid ${theme.primary}22`,
            }}>
              <span style={{ color: theme.text, fontWeight: "600", fontSize: "14px" }}>{item.label}</span>
              <span style={{ color: item.color, fontWeight: "800", fontSize: "15px" }}>
                ₹{item.amount.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${theme.primary}22` }}>
            <span style={{ color: theme.text, fontWeight: "800", fontSize: "16px" }}>💰 Total Spent</span>
            <span style={{ color: theme.primary, fontWeight: "900", fontSize: "18px" }}>
              ₹{totalSpent.toLocaleString("en-IN")}
            </span>
          </div>
          <div style={{
            marginTop: "12px", padding: "16px", borderRadius: "12px",
            background: foodBuffer >= 0 ? `${theme.primary}22` : "#ff6b6b22",
            border: `1px solid ${foodBuffer >= 0 ? theme.primary : "#ff6b6b"}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px" }}>
                🍽️ Food & Activities Buffer
              </div>
              <div style={{ color: theme.subtext, fontSize: "12px" }}>
                {foodBuffer >= 0 ? "Remaining for food, shopping & fun!" : "Over budget!"}
              </div>
            </div>
            <div style={{ color: foodBuffer >= 0 ? "#A8E6CF" : "#ff6b6b", fontWeight: "900", fontSize: "22px" }}>
              ₹{Math.abs(foodBuffer).toLocaleString("en-IN")}
            </div>
          </div>
        </>)}

        {/* Next Button */}
        <button
         onClick={() => setShowTripPlan(true)}
          style={{
            background: theme.primary, border: "none", padding: "18px",
            borderRadius: "50px", color: "#fff", fontWeight: "800",
            fontSize: "16px", cursor: "pointer", letterSpacing: "2px",
            boxShadow: `0 8px 32px ${theme.primary}66`, marginTop: "8px",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          SEE FULL TRIP PLAN →
          
        </button>
       
        

      </div>
      {showTripPlan && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 4000,
          background: theme.bg, overflowY: "auto",
        }}>
          <TripPlan
            location={location}
            theme={theme}
            planData={planData}
            preferences={preferences}
            budgetData={{ foodBuffer }}
            onBack={() => setShowTripPlan(false)}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export default BudgetResult