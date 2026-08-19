import { card, sectionLabel, selectableRow } from "./SharedUI";

export const TransportCard = ({
  theme,
  location,
  planData,
  preferences,
  mediumData,
  transportMedium,
  isMultiLeg,
  isDirect,
  isFlightMultiLeg,
  stationKeys,
  selectedStation,
  setSelectedStation,
  selectedTrainClass,
  setSelectedTrainClass,
  selectedTransferType,
  setSelectedTransferType,
  selectedTransferClass,
  setSelectedTransferClass,
  selectedDirectClass,
  setSelectedDirectClass,
  selectedFlightClass,
  setSelectedFlightClass,
  selectedFlightTransfer,
  setSelectedFlightTransfer,
  transportCost,
  totalBudget,
  totalEntryCost,
  stayCost,
  isGroup,
  groupSize
}) => {
  return (
    <>
      {/* Transport Card — Multi-leg (Train) */}
      {isMultiLeg && transportMedium !== "personal" && card(theme, <>
        {sectionLabel(theme, `🚂 ${transportMedium.toUpperCase()} JOURNEY — MULTI-LEG`)}
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
            theme,
            st.label,
            `Train duration: ${st.duration}`,
            "", null,
            selectedStation === key,
            () => setSelectedStation(key)
          ) 
        })}

        {/* Step 2 — Select Train Class */}
        {selectedStation && (
          <>
            <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px", margin: "16px 0 10px" }}>
              Step 2 — Select train class ({planData.selectedStationName || "Origin"} → {mediumData.stations[selectedStation]?.label}):
            </div>
            {mediumData.stations[selectedStation]?.options?.map((opt, i) => {
              return selectableRow(
                theme,
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
                theme,
                opt.type,
                `Duration: ${opt.duration}`,
                `₹${opt.min}–₹${opt.max}`, "per person",
                selectedTransferClass === opt.type,
                () => setSelectedTransferClass(opt.type),
                false,
                i
              )
            ))}

            {/* Taxi options */}
            {selectedTransferType === "taxi" && mediumData.stations[selectedStation]?.transfer?.taxi?.map((opt, i) => (
              selectableRow(
                theme,
                opt.type,
                `Duration: ${opt.duration}`,
                `₹${opt.min}–₹${opt.max}`, isGroup ? "shared taxi" : "per taxi",
                true,
                () => {},
                false,
                i
              )
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
      {isFlightMultiLeg && transportMedium === "flight" && card(theme, <>
        {sectionLabel(theme, "✈️ FLIGHT JOURNEY")}
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
            theme,
            opt.type,
            `${opt.note || ""} ${opt.duration ? `· ${opt.duration}` : ""}`,
            priceText,
            "per person",
            selectedFlightClass === opt.type,
            () => setSelectedFlightClass(opt.type),
            false,
            i
          )
        })}

        {/* Airport transfer */}
        <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px", margin: "16px 0 10px" }}>
          Step 2 — Airport → {location?.name} transfer:
        </div>
        {Object.entries(mediumData.transfer || {}).map(([key, val], i) => selectableRow(
          theme,
          key === "cab" ? "🚕 Cab" : key === "selfDrive" ? "🚗 Self Drive" : "🚙 SUV/Premium Cab",
          `Duration: ${val.duration}`,
          `₹${val.min}–₹${val.max}`, "per transfer",
          selectedFlightTransfer === key,
          () => setSelectedFlightTransfer(key),
          false,
          i
        ))}

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
      {isDirect && transportMedium !== "personal" && !isFlightMultiLeg && card(theme, <>
        {sectionLabel(theme, `${transportMedium === "flight" ? "✈️" : transportMedium === "train" ? "🚂" : "🚌"} SELECT ${transportMedium.toUpperCase()} CLASS (${preferences.selectedStation?.name || preferences.selectedAirport?.name || planData.originCity || "Origin"} → ${location?.name})`)}
        
        {transportMedium !== "flight" && (
          <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "16px" }}>
            Tap to see real-time food buffer update
          </div>
        )}

        {mediumData.options?.map((opt, i) => {
          const thisCost = Math.round((opt.min + opt.max) / 2) * 2 * (isGroup ? groupSize : 1)
          const thisBuffer = totalBudget - stayCost - totalEntryCost - thisCost
          
          const priceText = opt.min === opt.max ? `₹${opt.min.toLocaleString("en-IN")} per leg` : `₹${opt.min.toLocaleString("en-IN")}–₹${opt.max.toLocaleString("en-IN")} per leg`
          const rightBottomText = transportMedium === "flight" ? undefined : `${thisBuffer >= 0 ? `₹${thisBuffer.toLocaleString("en-IN")} for food` : `₹${Math.abs(thisBuffer).toLocaleString("en-IN")} over budget`}`
          
          return selectableRow(
            theme,
            opt.type,
            `${opt.note || ""} ${opt.duration ? `· ${opt.duration}` : ""}`,
            priceText,
            rightBottomText,
            selectedDirectClass === opt.type,
            () => setSelectedDirectClass(opt.type),
            thisBuffer < 0 && transportMedium !== "flight", 
            i
          )
        })}
      </>)}
    </>
  );
};
