import React from "react";
import { card, sectionLabel, comingSoon, ShimmerSkeleton } from "./SharedUI"

export const TripEmergencyTab = React.memo(({ theme, locationName, aiLoading, aiData }) => {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {card(theme, <>
        {sectionLabel(theme, "🆘 NATIONAL EMERGENCY NUMBERS")}
        {[
          { label: "🚨 Police", number: "100" },
          { label: "🚑 Ambulance", number: "108" },
          { label: "🔥 Fire", number: "101" },
          { label: "🆘 National Emergency", number: "112" },
          { label: "👩 Women Helpline", number: "1091" },
          { label: "🚗 Road Accident", number: "1073" },
          { label: "✈️ Tourist Helpline", number: "1800-111-363" },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0",
            borderBottom: i < 6 ? `1px solid ${theme.primary}22` : "none",
          }}>
            <span style={{ color: theme.text, fontWeight: "600", fontSize: "14px" }}>{item.label}</span>
            <a href={`tel:${item.number}`} style={{
              color: theme.primary, fontWeight: "900",
              fontSize: "16px", textDecoration: "none",
            }}>
              {item.number}
            </a>
          </div>
        ))}
      </>)}

      {card(theme, <>
        {sectionLabel(theme, `🆘 LOCAL EMERGENCY — ${locationName.toUpperCase()}`)}
        {aiLoading ? (
          <ShimmerSkeleton />
        ) : aiData?.localEmergency?.length > 0 ? (
          aiData.localEmergency.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0",
              borderBottom: i < aiData.localEmergency.length - 1 ? `1px solid ${theme.primary}22` : "none",
            }}>
              <span style={{ color: theme.text, fontWeight: "600", fontSize: "14px" }}>{item.label}</span>
              <a href={`tel:${item.number}`} style={{
                color: theme.primary, fontWeight: "900",
                fontSize: "15px", textDecoration: "none",
              }}>
                {item.number}
              </a>
            </div>
          ))
        ) : comingSoon(theme, `Local emergency contacts for ${locationName}`)}
      </>)}
    </div>
  )
});
