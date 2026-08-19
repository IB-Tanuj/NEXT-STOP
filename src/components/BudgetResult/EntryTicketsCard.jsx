import { card, sectionLabel } from "./SharedUI";

export const EntryTicketsCard = ({
  theme,
  activeActivities,
  removedSpots,
  setRemovedSpots,
  spotLoading,
  spotInfos,
  preferences,
  entryBreakdown,
  totalEntryCost,
  expandedSpots,
  setExpandedSpots,
  isGroup,
  groupSize
}) => {
  if (activeActivities.length === 0 && removedSpots.length === 0) return null;

  return card(theme, <>
    {sectionLabel(theme, `🎯 ENTRY TICKETS & SPOT INFO ${isGroup ? `(× ${groupSize} people)` : ""}`)}
    
    {spotLoading && Object.keys(spotInfos).length < preferences.activities.length ? (
      <div style={{ color: theme.subtext, textAlign: "center", padding: "20px" }}>
        <div style={{ fontSize: "24px", marginBottom: "8px", animation: "pulse 1.5s infinite" }}>🎟️</div>
        Fetching live details and rules for your spots...
      </div>
    ) : (
      <>
        {entryBreakdown.map((item, i) => {
          const isExpanded = !!expandedSpots[item.name]
          const info = item.info
          
          return (
            <div key={i} style={{
              marginBottom: "12px",
              background: `${theme.primary}11`,
              border: `1px solid ${theme.primary}33`,
              borderRadius: "12px",
              overflow: "hidden"
            }}>
              {/* Header: Always visible */}
              <div style={{ 
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "16px",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.text, fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
                    📍 {item.name}
                  </div>
                  {info && !item.error && (
                    <div style={{ color: theme.subtext, fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>🕐 {info.openingHours?.open || "?"} – {info.openingHours?.close || "?"}</span>
                      {info.openingHours?.closedOn && <span style={{ color: "#ff6b6b" }}> (Closed {info.openingHours.closedOn})</span>}
                    </div>
                  )}
                </div>
                
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setRemovedSpots(prev => [...prev, item.name])
                    }}
                    style={{
                      background: "transparent", border: "none", color: "#ff6b6b", cursor: "pointer",
                      fontSize: "12px", fontWeight: "600", padding: "4px 8px", marginBottom: "4px"
                    }}
                  >
                    ✕ Remove
                  </button>
                  
                  <div style={{ color: item.cost === 0 ? "#A8E6CF" : theme.primary, fontWeight: "800", fontSize: "15px" }}>
                    {item.cost === 0 ? "FREE" : `₹${item.cost}${isGroup ? ` × ${groupSize}` : ""}`}
                  </div>
                  {isGroup && item.cost > 0 && (
                    <div style={{ color: theme.subtext, fontSize: "11px" }}>
                      Total: ₹{(item.cost * groupSize).toLocaleString("en-IN")}
                    </div>
                  )}
                </div>
              </div>

              {/* Pull Bar */}
              {info && !item.error && (
                <div 
                  onClick={() => setExpandedSpots(prev => ({ ...prev, [item.name]: !isExpanded }))}
                  style={{
                    background: `${theme.primary}22`,
                    padding: "6px",
                    textAlign: "center",
                    cursor: "pointer",
                    color: theme.subtext,
                    fontSize: "12px",
                    fontWeight: "600",
                    borderTop: `1px solid ${theme.primary}11`,
                    transition: "background 0.2s"
                  }}
                >
                  {isExpanded ? "▲ Hide Details" : "▼ View Rules & Info"}
                </div>
              )}

              {/* Expanded Details */}
              {isExpanded && info && !item.error && (
                <div style={{ padding: "16px", borderTop: `1px solid ${theme.primary}22`, background: `${theme.primary}0a`, fontSize: "13px" }}>
                  
                  {/* Rules & Permits */}
                  {(info.rules?.length > 0 || info.permit?.required) && (
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ color: theme.primary, fontWeight: "700", marginBottom: "4px", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>⚠️ Rules & Permits</div>
                      {info.permit?.required && (
                        <div style={{ color: "#FFE66D", marginBottom: "4px" }}>
                          <b>Permit Required:</b> {info.permit.details} {info.permit.cost ? `(₹${info.permit.cost})` : ""}
                        </div>
                      )}
                      {info.rules?.map((rule, idx) => (
                        <div key={idx} style={{ color: theme.text, marginBottom: "2px" }}>• {rule}</div>
                      ))}
                    </div>
                  )}

                  {/* Details grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                    {info.recommendedDuration && (
                      <div>
                        <div style={{ color: theme.subtext, fontSize: "11px" }}>DURATION</div>
                        <div style={{ color: theme.text }}>⏱️ {info.recommendedDuration}</div>
                      </div>
                    )}
                    {info.photographyPolicy && (
                      <div>
                        <div style={{ color: theme.subtext, fontSize: "11px" }}>PHOTOGRAPHY</div>
                        <div style={{ color: theme.text }}>📸 {info.photographyPolicy.allowed ? "Allowed" : "Not Allowed"} {info.photographyPolicy.fee ? `(Fee: ₹${info.photographyPolicy.fee})` : ""}</div>
                      </div>
                    )}
                    {info.accessibility && (
                      <div style={{ gridColumn: "span 2" }}>
                        <div style={{ color: theme.subtext, fontSize: "11px" }}>ACCESSIBILITY</div>
                        <div style={{ color: theme.text }}>♿ {info.accessibility}</div>
                      </div>
                    )}
                  </div>

                  {/* Tips */}
                  {info.tips?.length > 0 && (
                    <div>
                      <div style={{ color: theme.primary, fontWeight: "700", marginBottom: "4px", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>💡 Expert Tips</div>
                      {info.tips.map((tip, idx) => (
                        <div key={idx} style={{ color: theme.text, marginBottom: "2px", fontStyle: "italic" }}>"{tip}"</div>
                      ))}
                    </div>
                  )}
                  
                </div>
              )}
            </div>
          )
        })}

        {activeActivities.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", marginTop: "8px", borderTop: `1px solid ${theme.primary}33` }}>
            <span style={{ color: theme.text, fontWeight: "700" }}>Total Entry Cost</span>
            <span style={{ color: "#FFE66D", fontWeight: "800" }}>₹{totalEntryCost.toLocaleString("en-IN")}</span>
          </div>
        )}
        
        {removedSpots.length > 0 && (
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: `1px dashed ${theme.primary}44` }}>
            <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "8px" }}>Removed Spots:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {removedSpots.map(spot => (
                <span key={spot} style={{ 
                  background: "#ff6b6b22", color: "#ff6b6b", padding: "4px 10px", 
                  borderRadius: "20px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" 
                }}>
                  {spot}
                  <button 
                    onClick={() => setRemovedSpots(prev => prev.filter(s => s !== spot))}
                    style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontWeight: "bold", padding: 0 }}
                  >
                    + Add Back
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </>
    )}
  </>);
};
