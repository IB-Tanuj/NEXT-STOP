import { useState, useEffect } from "react"
import { transportCosts } from "../data/tripData"
import { getDistanceBetweenStations, findNearestStation, haversineDistance } from "../data/stations"
import TripPlan from "./TripPlan"

import { DESTINATION_STATIONS, DEFAULT_FOOD_COSTS, generateDynamicMediumData, generateDynamicMultiLegData, calculateSmartSplit } from "../utils/budgetUtils"
import { BudgetStatus } from "./BudgetResult/BudgetStatus"
import { StayCard } from "./BudgetResult/StayCard"
import { TransportCard } from "./BudgetResult/TransportCard"
import { PersonalVehicleCard } from "./BudgetResult/PersonalVehicleCard"
import { EntryTicketsCard } from "./BudgetResult/EntryTicketsCard"
import { CostSummary } from "./BudgetResult/CostSummary"
const BudgetResult = ({ location, theme, planData, preferences, onBack }) => {
  const [showTripPlan, setShowTripPlan] = useState(false)
  const locationKey = location?.name?.toLowerCase()
  const routeKey = `delhi-${locationKey}` // fallback key for static data
  const isGroup = planData.budgetType === "group"
  const groupSize = Number(planData.groupSize) || 1
  const totalBudget = Number(planData.budget)
  const perPersonBudget = isGroup ? Math.round(totalBudget / groupSize) : totalBudget

  // ── Spot Info Data (Dynamic via Gemini API) ─────────
  const [spotInfos, setSpotInfos] = useState({})
  const [spotLoading, setSpotLoading] = useState(true)
  const [spotError, setSpotError] = useState(null)
  const [removedSpots, setRemovedSpots] = useState([])
  const [expandedSpots, setExpandedSpots] = useState({}) // Tracks which spots are expanded

  const activeActivities = preferences.activities?.filter(a => !removedSpots.includes(a)) || []

  const fetchAllSpots = async () => {
    if (!preferences.activities?.length) {
      setSpotLoading(false)
      return
    }
    setSpotLoading(true)
    setSpotError(null)
    
    try {
      const res = await fetch('/api/spots/info-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spots: preferences.activities, locationName: location?.name })
      })
      
      if (res.ok) {
        const data = await res.json()
        setSpotInfos(data)
      } else {
        console.error("Batch spot fetch failed:", res.status)
        setSpotError(res.status)
      }
    } catch (err) {
      console.error("Failed to fetch spot info batch", err)
      setSpotError(500)
    }

    setSpotLoading(false)
  }

  useEffect(() => {
    fetchAllSpots()
  }, [preferences.activities, location?.name])

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
      
      if (sessionStorage.getItem('DEV_MOCK_API') === 'true') {
        setTimeout(() => {
          setTrainError("Mock API Mode Enabled - Using Fallback Data")
          setTrainLoading(false)
        }, 500)
        return
      }

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
  const [visibleStaysCount, setVisibleStaysCount] = useState(5)
  const [manualPrice, setManualPrice] = useState("")
  const [roomOption, setRoomOption] = useState("separate")

  useEffect(() => {
    if (!locationKey || !preferences.stayType) return
    const controller = new AbortController()

    setStayLoading(true)
    setStayError(null)
    setStayOptions([]) // Clear old options
    setVisibleStaysCount(5) // Reset visible count on new search

    // Build query params for hotel API
    const params = new URLSearchParams({
      destination: location?.name || locationKey,
      daysOfStay: String(preferences.days || 3),
      transportMode: preferences.transport || 'personal',
      adults: String(isGroup ? groupSize : 2),
    })
    if (calculatedDist) params.set('distanceKms', String(calculatedDist))

    if (sessionStorage.getItem('DEV_MOCK_API') === 'true') {
      setTimeout(() => {
        setStayError("Mock API Mode Enabled - Trying TinyFish fallback")
        setStayLoading(false)
        
        // Directly trigger the fallback fetch logic since the normal fetch chain won't run
        fetch('/api/live/search-stays', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: location?.name || locationKey,
            days: preferences.days,
            budgetType: preferences.budgetType,
            groupSize: isGroup ? groupSize : 1
          }),
          signal: controller.signal
        })
        .then(r => r.json())
        .then(tinyData => {
          if (tinyData?.stays) {
            setStayOptions(tinyData.stays.map(s => ({
              ...s,
              pricePerNight: Math.round(Number(s.totalCost) / Number(preferences.days)),
              maxCapacity: groupSize,
            })))
            setSelectedStayIndex(0)
            setStayError(null)
          } else {
            throw new Error("TinyFish mock failed")
          }
        })
        .catch(err => {
          if (err.name !== "AbortError") setStayError(err.message)
        })

      }, 500)
      return
    }

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
          let mapped = hotels.map(hotel => {
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

          // Filter and Sort based on stayType
          const stayType = (preferences.stayType || '').toLowerCase();
          let filtered = [...mapped];
          
          if (stayType === 'hostel') {
             filtered = mapped.filter(h => h.pricePerNight >= 150 && h.pricePerNight <= 1200);
             if (filtered.length === 0) filtered = [...mapped]; // Fallback if no matching prices
             filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
          } else if (stayType === 'budget') {
             filtered = mapped.filter(h => h.pricePerNight >= 500 && h.pricePerNight <= 2500);
             if (filtered.length === 0) filtered = [...mapped]; 
             filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
          } else if (stayType === 'mid') {
             filtered = mapped.filter(h => h.pricePerNight >= 2000 && h.pricePerNight <= 6000);
             if (filtered.length === 0) filtered = [...mapped];
             filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
          } else if (stayType === 'luxury') {
             filtered = mapped.filter(h => h.pricePerNight >= 5000);
             if (filtered.length === 0) filtered = [...mapped];
             filtered.sort((a, b) => b.pricePerNight - a.pricePerNight); // Highest price first for luxury
          } else {
             // Fallback sort
             filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
          }
          
          // Return up to 20 hotels
          mapped = filtered.slice(0, 20);

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

  // ── Entry Tickets (Dynamic) ──────────────────────────────
  const entryBreakdown = []
  let entryPerPerson = 0
  
  activeActivities.forEach(activity => {
    const info = spotInfos[activity]
    if (info && !info.error) {
      const cost = info.entryPrice?.adult || 0
      entryPerPerson += cost
      entryBreakdown.push({ name: activity, cost, info })
    } else if (info && info.error) {
      entryBreakdown.push({ name: activity, cost: 0, info, error: true })
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

        <BudgetStatus foodBuffer={foodBuffer} theme={theme} />
        
        <StayCard 
          theme={theme} location={location} preferences={preferences}
          stayLoading={stayLoading} stayError={stayError} stayOptions={stayOptions}
          selectedStayIndex={selectedStayIndex} setSelectedStayIndex={setSelectedStayIndex}
          visibleStaysCount={visibleStaysCount} setVisibleStaysCount={setVisibleStaysCount}
          manualPrice={manualPrice} setManualPrice={setManualPrice}
          isGroup={isGroup} groupSize={groupSize} roomOption={roomOption} setRoomOption={setRoomOption}
          getStayCost={getStayCost} totalBudget={totalBudget} totalEntryCost={totalEntryCost} transportCost={transportCost}
        />

        <TransportCard 
          theme={theme} location={location} planData={planData} preferences={preferences}
          mediumData={mediumData} transportMedium={transportMedium} isMultiLeg={isMultiLeg} isDirect={isDirect} isFlightMultiLeg={isFlightMultiLeg}
          stationKeys={stationKeys} selectedStation={selectedStation} setSelectedStation={setSelectedStation}
          selectedTrainClass={selectedTrainClass} setSelectedTrainClass={setSelectedTrainClass}
          selectedTransferType={selectedTransferType} setSelectedTransferType={setSelectedTransferType}
          selectedTransferClass={selectedTransferClass} setSelectedTransferClass={setSelectedTransferClass}
          selectedDirectClass={selectedDirectClass} setSelectedDirectClass={setSelectedDirectClass}
          selectedFlightClass={selectedFlightClass} setSelectedFlightClass={setSelectedFlightClass}
          selectedFlightTransfer={selectedFlightTransfer} setSelectedFlightTransfer={setSelectedFlightTransfer}
          transportCost={transportCost} totalBudget={totalBudget} totalEntryCost={totalEntryCost} stayCost={getStayCost(roomOption)}
          isGroup={isGroup} groupSize={groupSize}
        />

        {transportMedium === "personal" && publicComparison.length > 0 && (
          <PersonalVehicleCard 
            theme={theme} vehicleLoading={vehicleLoading} liveVehicleData={liveVehicleData}
            routeData={routeData} publicComparison={publicComparison} isGroup={isGroup}
          />
        )}

        <EntryTicketsCard 
          theme={theme} activeActivities={activeActivities} removedSpots={removedSpots} setRemovedSpots={setRemovedSpots}
          spotLoading={spotLoading} spotError={spotError} retryFetchSpots={fetchAllSpots} spotInfos={spotInfos} preferences={preferences}
          entryBreakdown={entryBreakdown} totalEntryCost={totalEntryCost}
          expandedSpots={expandedSpots} setExpandedSpots={setExpandedSpots}
          isGroup={isGroup} groupSize={groupSize}
        />

        <CostSummary 
          theme={theme} stayCost={getStayCost(roomOption)} transportCost={transportCost}
          totalEntryCost={totalEntryCost} totalSpent={totalSpent} foodBuffer={foodBuffer}
        />
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