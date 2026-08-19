import React from "react";

export const ShimmerSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "10px 0" }}>
    <div className="skeleton-box" style={{ height: "24px", width: "60%" }}></div>
    <div className="skeleton-box" style={{ height: "14px", width: "100%" }}></div>
    <div className="skeleton-box" style={{ height: "14px", width: "80%" }}></div>
  </div>
)

export const card = (theme, children, extra = {}) => (
  <div className="hover-card" style={{
    background: theme.card,
    borderRadius: "16px",
    padding: "24px",
    border: `1px solid ${theme.primary}33`,
    marginBottom: "16px",
    ...extra,
  }}>
    {children}
  </div>
)

export const sectionLabel = (theme, text) => (
  <div style={{
    color: theme.subtext,
    fontSize: "12px",
    letterSpacing: "2px",
    marginBottom: "14px",
  }}>
    {text}
  </div>
)

export const comingSoon = (theme, feature) => (
  <div style={{
    padding: "30px 20px",
    textAlign: "center",
    border: `1px dashed ${theme.primary}44`,
    borderRadius: "12px",
  }}>
    <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔜</div>
    <div style={{ color: theme.text, fontWeight: "700", marginBottom: "4px" }}>{feature}</div>
    <div style={{ color: theme.subtext, fontSize: "12px" }}>Data coming soon!</div>
  </div>
)

export const bookingLink = (theme, item, i, total) => (
  <a
    key={i}
    href={item.link}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 16px",
      borderRadius: "12px",
      marginBottom: i < total - 1 ? "8px" : "0",
      border: `1px solid ${theme.primary}33`,
      background: "transparent",
      textDecoration: "none",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={e => e.currentTarget.style.border = `1px solid ${theme.primary}`}
    onMouseLeave={e => e.currentTarget.style.border = `1px solid ${theme.primary}33`}
  >
    <div>
      <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>{item.label}</div>
      <div style={{ color: theme.subtext, fontSize: "12px" }}>{item.note}</div>
    </div>
    <div style={{ color: theme.primary, fontWeight: "700", fontSize: "13px" }}>Open →</div>
  </a>
)
