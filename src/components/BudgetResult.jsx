import { useState, useEffect } from "react"
import { transportCosts, stayCosts, entryCosts } from "../data/tripData"
import TripPlan from "./TripPlan"

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
  const routeKey = `delhi-${locationKey}`
  const isGroup = planData.budgetType === "group"
  const groupSize = Number(planData.groupSize) || 1
  const totalBudget = Number(planData.budget)
  const perPersonBudget = isGroup ? Math.round(totalBudget / groupSize) : totalBudget

  // ── Stay ───────────────────────────────────────────────
  const stayData = stayCosts[locationKey]?.[preferences.stayType]
  const pricePerNight = stayData?.avg || 0
  const [roomOption, setRoomOption] = useState("separate")

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
  const mediumData = routeData?.[transportMedium]
  const isMultiLeg = mediumData?.stations !== undefined
  const isDirect = mediumData?.options !== undefined

  // ── Multi-leg state ────────────────────────────────────
  const stationKeys = isMultiLeg ? Object.keys(mediumData.stations) : []
  const [selectedStation, setSelectedStation] = useState(stationKeys[0] || "")
  const [selectedTrainClass, setSelectedTrainClass] = useState("")
  const [selectedTransferType, setSelectedTransferType] = useState("bus")
  const [selectedTransferClass, setSelectedTransferClass] = useState("")

  // ── Direct transport state ─────────────────────────────
  const [selectedDirectClass, setSelectedDirectClass] = useState("")

  // ── Flight transfer state ──────────────────────────────
  const isFlightMultiLeg = transportMedium === "flight" && mediumData?.transfer !== undefined
  const [selectedFlightClass, setSelectedFlightClass] = useState("")
  const [selectedFlightTransfer, setSelectedFlightTransfer] = useState("")

  useEffect(() => {
    if (isMultiLeg && selectedStation) {
      const st = mediumData.stations[selectedStation]
      if (st?.options?.length > 0) setSelectedTrainClass(st.options[0].type)
      if (st?.transfer?.bus?.length > 0) setSelectedTransferClass(st.transfer.bus[0].type)
    }
    if (isDirect && mediumData?.options?.length > 0) {
      setSelectedDirectClass(mediumData.options[0].type)
    }
    if (isFlightMultiLeg) {
      if (mediumData?.options?.length > 0) setSelectedFlightClass(mediumData.options[0].type)
      const transferKeys = Object.keys(mediumData.transfer || {})
      if (transferKeys.length > 0) setSelectedFlightTransfer(transferKeys[0])
    }
  }, [selectedStation])

  // ── Transport Cost Calculation ─────────────────────────
  const getTransportCost = () => {
    if (transportMedium === "personal") return 0

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
      key={keyProp}
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

        {/* Stay Card */}
        {card(<>
          {sectionLabel("🏨 STAY")}
          {isGroup && (
            <div style={{ marginBottom: "16px" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: theme.text, fontWeight: "600", fontSize: "14px" }}>
                {preferences.stayType} · {preferences.days} nights
              </div>
              <div style={{ color: theme.subtext, fontSize: "12px" }}>
                ₹{pricePerNight}/night × {isGroup ? `${roomOption === "separate" ? groupSize : roomOption === "two" ? 2 : 1} room(s) × ` : ""}{preferences.days} nights
              </div>
            </div>
            <div style={{ color: "#4ECDC4", fontWeight: "800", fontSize: "20px" }}>
              ₹{getStayCost(roomOption).toLocaleString("en-IN")}
            </div>
          </div>
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
                Step 2 — Select train class (Delhi → {mediumData.stations[selectedStation]?.label}):
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
          {mediumData.options?.map((opt, i) => selectableRow(
            opt.type,
            `Duration: ${opt.duration}`,
            `₹${opt.min}–₹${opt.max}`, "per person",
            selectedFlightClass === opt.type,
            () => setSelectedFlightClass(opt.type)
          ,i))}

          {/* Airport transfer */}
          <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px", margin: "16px 0 10px" }}>
            Step 2 — Airport → {location?.name} transfer:
          </div>
          {Object.entries(mediumData.transfer || {}).map(([key, val]) => selectableRow(
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
          {sectionLabel(`🚌 SELECT ${transportMedium.toUpperCase()} CLASS`)}
          <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "16px" }}>
            Tap to see real-time food buffer update
          </div>
          {mediumData.options?.map((opt, i) => {
            const thisCost = Math.round((opt.min + opt.max) / 2) * 2 * (isGroup ? groupSize : 1)
            const thisBuffer = totalBudget - getStayCost(roomOption) - totalEntryCost - thisCost
            return selectableRow(
              opt.type,
              `${opt.note || ""} ${opt.duration ? `· ${opt.duration}` : ""}`,
              `₹${opt.min}–₹${opt.max} per leg`,
              `${thisBuffer >= 0 ? `₹${thisBuffer.toLocaleString("en-IN")} for food` : `₹${Math.abs(thisBuffer).toLocaleString("en-IN")} over budget`}`,
              selectedDirectClass === opt.type,
              () => setSelectedDirectClass(opt.type),
              thisBuffer < 0,i
            )
          })}
        </>)}

        {/* Personal Vehicle */}
        {transportMedium === "personal" && publicComparison.length > 0 && card(<>
          {sectionLabel("🚗 PERSONAL VEHICLE")}
          <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "16px" }}>
            {routeData?.personal?.note}
          </div>
          <div style={{ color: theme.text, fontWeight: "700", marginBottom: "16px" }}>
            Approximate fuel cost: ₹{routeData?.personal?.approxFuel?.min?.toLocaleString("en-IN")} — ₹{routeData?.personal?.approxFuel?.max?.toLocaleString("en-IN")}
          </div>
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
      `}</style>
    </div>
  )
}

export default BudgetResult