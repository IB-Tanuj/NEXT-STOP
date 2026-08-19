export const BudgetStatus = ({ foodBuffer, theme }) => (
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
);
