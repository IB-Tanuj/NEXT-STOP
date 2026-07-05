import { useState } from "react"
import { exploreCategories } from "../data/exploreData"

const ExploreSidebar = ({ theme, isOpen, onClose, onLocationSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const tagColors = {
    "Adventure": "#FF6B6B",
    "Mountains": "#4ECDC4",
    "Beach": "#45B7D1",
    "Budget": "#A8E6CF",
    "Snow": "#BDE0FE",
    "Culture": "#FFE66D",
    "Nature": "#70E000",
    "Offbeat": "#FF9500",
    "Heritage": "#C49A3C",
    "Scenic": "#9B59B6",
    "Spiritual": "#F39C12",
    "Photography": "#E91E63",
    "Festival": "#FF5722",
    "default": "#888",
  }

  const getTagColor = (tag) => tagColors[tag] || tagColors.default

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 200,
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: selectedCategory ? "680px" : "320px",
        maxWidth: "95vw",
        background: theme.bg,
        borderRight: `1px solid ${theme.primary}33`,
        zIndex: 300,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.4s ease, width 0.3s ease",
        display: "flex",
        overflowY: "hidden",
      }}>

        {/* Left Panel — Category List */}
        <div style={{
          width: "320px",
          flexShrink: 0,
          overflowY: "auto",
          borderRight: selectedCategory ? `1px solid ${theme.primary}22` : "none",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Header */}
          <div style={{
            padding: "24px 20px",
            borderBottom: `1px solid ${theme.primary}22`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            background: theme.bg,
            zIndex: 5,
          }}>
            <div>
              <div style={{ color: theme.primary, fontSize: "11px", letterSpacing: "3px", fontWeight: "700", marginBottom: "4px" }}>
                EXPLORE
              </div>
              <div style={{ color: theme.text, fontSize: "18px", fontWeight: "900" }}>
                Discover India
              </div>
            </div>
            <div
              onClick={onClose}
              style={{
                color: theme.subtext,
                cursor: "pointer",
                fontSize: "20px",
                lineHeight: 1,
                padding: "4px 8px",
              }}>
              ✕
            </div>
          </div>

          {/* Category List */}
          <div style={{ padding: "12px 0" }}>
            {exploreCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(
                  selectedCategory?.id === cat.id ? null : cat
                )}
                style={{
                  padding: "14px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: selectedCategory?.id === cat.id ? `${theme.primary}22` : "transparent",
                  borderLeft: `3px solid ${selectedCategory?.id === cat.id ? theme.primary : "transparent"}`,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  if (selectedCategory?.id !== cat.id) {
                    e.currentTarget.style.background = `${theme.primary}11`
                  }
                }}
                onMouseLeave={e => {
                  if (selectedCategory?.id !== cat.id) {
                    e.currentTarget.style.background = "transparent"
                  }
                }}
              >
                <span style={{ fontSize: "22px" }}>{cat.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    color: selectedCategory?.id === cat.id ? theme.primary : theme.text,
                    fontWeight: "700",
                    fontSize: "14px",
                    marginBottom: "2px",
                  }}>
                    {cat.label}
                  </div>
                  <div style={{ color: theme.subtext, fontSize: "11px" }}>
                    {cat.locations.length} destinations
                  </div>
                </div>
                <div style={{
                  color: theme.subtext,
                  fontSize: "12px",
                  transform: selectedCategory?.id === cat.id ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.3s ease",
                }}>
                  ›
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Locations */}
        {selectedCategory && (
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 20px",
            animation: "slideIn 0.3s ease",
          }}>
            <div style={{
              color: theme.primary,
              fontSize: "11px",
              letterSpacing: "3px",
              fontWeight: "700",
              marginBottom: "6px",
            }}>
              {selectedCategory.emoji} {selectedCategory.label.toUpperCase()}
            </div>
            <div style={{
              color: theme.subtext,
              fontSize: "13px",
              marginBottom: "24px",
              lineHeight: "1.5",
            }}>
              {selectedCategory.description}
            </div>

            {selectedCategory.locations.map((loc, i) => (
              <div
                key={i}
                onClick={() => {
                  if (loc.available) {
                    onLocationSelect(loc.locationKey)
                    onClose()
                  }
                }}
                style={{
                  background: theme.card,
                  borderRadius: "14px",
                  padding: "18px",
                  marginBottom: "12px",
                  border: `1px solid ${loc.available ? theme.primary + "44" : theme.primary + "11"}`,
                  cursor: loc.available ? "pointer" : "default",
                  opacity: loc.available ? 1 : 0.6,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => {
                  if (loc.available) {
                    e.currentTarget.style.border = `1px solid ${theme.primary}`
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }
                }}
                onMouseLeave={e => {
                  if (loc.available) {
                    e.currentTarget.style.border = `1px solid ${theme.primary}44`
                    e.currentTarget.style.transform = "translateY(0)"
                  }
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "8px",
                }}>
                  <div>
                    <div style={{
                      color: theme.text,
                      fontWeight: "700",
                      fontSize: "15px",
                      marginBottom: "2px",
                    }}>
                      {loc.name}
                    </div>
                    <div style={{ color: theme.subtext, fontSize: "11px" }}>
                      📍 {loc.state}
                    </div>
                  </div>
                  {loc.available ? (
                    <div style={{
                      background: theme.primary,
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: "800",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      letterSpacing: "0.5px",
                      flexShrink: 0,
                    }}>
                      PLAN NOW →
                    </div>
                  ) : (
                    <div style={{
                      background: `${theme.primary}22`,
                      color: theme.subtext,
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      flexShrink: 0,
                    }}>
                      COMING SOON
                    </div>
                  )}
                </div>

                <div style={{
                  color: theme.subtext,
                  fontSize: "12px",
                  lineHeight: "1.5",
                  marginBottom: "10px",
                }}>
                  {loc.desc}
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {loc.tags.map((tag, j) => (
                    <div key={j} style={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "#fff",
                      background: getTagColor(tag) + "cc",
                    }}>
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

export default ExploreSidebar