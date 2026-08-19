export const card = (theme, children, extra = {}) => (
  <div style={{
    background: theme.card,
    borderRadius: "16px",
    padding: "24px",
    border: `1px solid ${theme.primary}33`,
    ...extra,
  }}>
    {children}
  </div>
);

export const sectionLabel = (theme, text) => (
  <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "14px" }}>
    {text}
  </div>
);

export const selectableRow = (theme, label, sublabel, rightTop, rightBottom, isSelected, onClick, danger = false, keyProp) => (
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
);
