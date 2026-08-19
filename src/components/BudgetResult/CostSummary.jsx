import { card, sectionLabel } from "./SharedUI";

export const CostSummary = ({
  theme,
  stayCost,
  transportCost,
  totalEntryCost,
  totalSpent,
  foodBuffer
}) => {
  return card(theme, <>
    {sectionLabel(theme, "COST SUMMARY")}
    {[
      { label: "🏨 Stay", amount: stayCost, color: "#4ECDC4" },
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
  </>);
};
