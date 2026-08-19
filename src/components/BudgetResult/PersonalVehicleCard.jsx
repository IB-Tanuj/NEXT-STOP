import React from "react";
import { card, sectionLabel } from "./SharedUI";

export const PersonalVehicleCard = React.memo(({
  theme,
  vehicleLoading,
  liveVehicleData,
  routeData,
  publicComparison,
  isGroup
}) => {
  return card(theme, <>
    {sectionLabel(theme, "🚗 PERSONAL VEHICLE")}
    
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

    {sectionLabel(theme, "💡 PUBLIC TRANSPORT COMPARISON")}
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
  </>);
});
