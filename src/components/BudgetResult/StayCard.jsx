import React from "react";
import { card, sectionLabel, selectableRow } from "./SharedUI";

export const StayCard = React.memo(({
  theme,
  location,
  preferences,
  stayLoading,
  stayError,
  stayOptions,
  selectedStayIndex,
  setSelectedStayIndex,
  visibleStaysCount,
  setVisibleStaysCount,
  manualPrice,
  setManualPrice,
  isGroup,
  groupSize,
  roomOption,
  setRoomOption,
  getStayCost,
  totalBudget,
  totalEntryCost,
  transportCost
}) => {
  const pricePerNight = stayOptions[selectedStayIndex]?.pricePerNight || (manualPrice ? Number(manualPrice) : 0);
  const selectedStay = stayOptions[selectedStayIndex];

  return card(theme, <>
    {sectionLabel(theme, `🏨 SELECT YOUR STAY IN ${location?.name?.toUpperCase()}`)}
    <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "16px" }}>
      Showing real {preferences.stayType} options from Booking.com — tap to select
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
      <>
        {stayOptions.slice(0, visibleStaysCount).map((stay, i) => {
          const isSelected = selectedStayIndex === i;
          const thisCost = stay.pricePerNight * preferences.days * (isGroup ? (roomOption === "one" ? 1 : roomOption === "two" ? 2 : groupSize) : 1);
          const thisBuffer = totalBudget - totalEntryCost - transportCost - thisCost;
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
          );
        })}
        
        <div style={{ display: "flex", gap: "10px" }}>
          {visibleStaysCount < stayOptions.length && (
            <div 
              onClick={() => setVisibleStaysCount(prev => Math.min(prev + 5, stayOptions.length))}
              style={{
                flex: 1, padding: "10px", textAlign: "center", color: theme.primary, 
                fontWeight: "700", fontSize: "13px", cursor: "pointer",
                borderRadius: "8px", background: `${theme.primary}11`,
                marginTop: "4px", marginBottom: "8px", transition: "background 0.2s"
              }}
              onMouseOver={e => e.currentTarget.style.background = `${theme.primary}22`}
              onMouseOut={e => e.currentTarget.style.background = `${theme.primary}11`}
            >
              Show more ⬇
            </div>
          )}
          {visibleStaysCount > 5 && (
            <div 
              onClick={() => setVisibleStaysCount(5)}
              style={{
                flex: 1, padding: "10px", textAlign: "center", color: theme.subtext, 
                fontWeight: "700", fontSize: "13px", cursor: "pointer",
                borderRadius: "8px", background: `rgba(255, 255, 255, 0.05)`,
                marginTop: "4px", marginBottom: "8px", transition: "background 0.2s"
              }}
              onMouseOver={e => e.currentTarget.style.background = `rgba(255, 255, 255, 0.1)`}
              onMouseOut={e => e.currentTarget.style.background = `rgba(255, 255, 255, 0.05)`}
            >
              Show less ⬆
            </div>
          )}
        </div>
      </>
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
          theme,
          opt.label, null,
          `₹${opt.cost.toLocaleString("en-IN")}`, null,
          roomOption === opt.id,
          () => setRoomOption(opt.id)
        ))}
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
  </>);
});
