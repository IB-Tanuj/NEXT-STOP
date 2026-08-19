import React from "react";
import { useState } from "react"
import { localPhrases } from "../../data/localPhrases"
import { card, sectionLabel, comingSoon } from "./SharedUI"

const PhraseCategory = ({ category, theme }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ borderBottom: `1px solid ${theme.primary}11` }}>
      {/* Category Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${theme.primary}11`}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>
          {category.label}
        </div>
        <div style={{
          color: theme.subtext,
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          {category.phrases.length} phrases
          <span style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            display: "inline-block",
          }}>▼</span>
        </div>
      </div>

      {/* Phrases List */}
      {expanded && (
        <div style={{ padding: "0 24px 16px" }}>
          {category.phrases.map((phrase, i) => (
            <div
              key={i}
              style={{
                padding: "12px 0",
                borderBottom: i < category.phrases.length - 1 ? `1px solid ${theme.primary}11` : "none",
              }}
            >
              <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "4px" }}>
                {phrase.english}
              </div>
              <div style={{ color: theme.primary, fontWeight: "700", fontSize: "15px", marginBottom: "2px" }}>
                {phrase.local}
              </div>
              <div style={{ color: theme.text, fontSize: "13px", fontFamily: "serif" }}>
                {phrase.script}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const TripOverviewTab = React.memo(({
  theme,
  locationName,
  days,
  isGroup,
  groupSize,
  budget,
  stayType,
  transport,
  foodBuffer,
  aiLoading,
  aiData
}) => {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Trip Summary */}
      {card(theme, <>
        {sectionLabel(theme, "📋 TRIP SUMMARY")}
        {[
          { label: "📍 Destination", value: locationName },
          { label: "📅 Duration", value: `${days} days` },
          { label: "👤 Traveler", value: isGroup ? `Group of ${groupSize}` : "Solo" },
          { label: "💰 Total Budget", value: `₹${Number(budget).toLocaleString("en-IN")}` },
          { label: "🏨 Stay", value: stayType },
          { label: "🚌 Transport", value: transport },
          { label: "🍽️ Food Buffer", value: `₹${foodBuffer.toLocaleString("en-IN")}` },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: i < 6 ? `1px solid ${theme.primary}22` : "none",
          }}>
            <span style={{ color: theme.subtext, fontSize: "14px" }}>{item.label}</span>
            <span style={{ color: theme.text, fontWeight: "700", fontSize: "14px", textTransform: "capitalize" }}>{item.value}</span>
          </div>
        ))}
      </>)}

      {/* Local Phrases */}
      {(() => {
        const locationKey = locationName?.toLowerCase()
        const phrases = localPhrases[locationKey]
        if (!phrases) return null

        return (
          <div style={{
            background: theme.card,
            borderRadius: "16px",
            border: `1px solid ${theme.primary}33`,
            overflow: "hidden",
            marginBottom: "16px",
          }}>
            {/* Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: `1px solid ${theme.primary}22`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ color: theme.subtext, fontSize: "12px", letterSpacing: "2px", marginBottom: "4px" }}>
                  🗣️ LOCAL PHRASES
                </div>
                <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px" }}>
                  Basic {phrases.language} for your trip
                </div>
              </div>
              <div style={{
                background: `${theme.primary}22`,
                border: `1px solid ${theme.primary}44`,
                borderRadius: "20px",
                padding: "6px 14px",
                color: theme.primary,
                fontSize: "12px",
                fontWeight: "700",
              }}>
                📸 Screenshot to save offline
              </div>
            </div>

            {/* Categories */}
            {Object.entries(phrases.categories).map(([catKey, category]) => (
              <PhraseCategory
                key={catKey}
                category={category}
                theme={theme}
              />
            ))}
          </div>
        )
      })()}

      {/* Food Recommendations */}
      {card(theme, <>
        {sectionLabel(theme, `🍽️ POPULAR FOOD IN ${locationName.toUpperCase()}`)}
        {aiLoading ? (
          <div style={{ color: theme.subtext, textAlign: "center", padding: "20px" }}>
            🤖 AI is generating food recommendations...
          </div>
        ) : aiData?.foodRecommendations?.length > 0 ? (
          aiData.foodRecommendations.map((food, i) => (
            <div key={i} style={{
              padding: "14px 16px",
              borderRadius: "12px",
              marginBottom: "8px",
              border: `1px solid ${theme.primary}33`,
            }}>
              <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>
                {food.mustTry && "🌟 "}{food.name}
              </div>
              <div style={{ color: theme.subtext, fontSize: "12px" }}>{food.description}</div>
              <div style={{ color: theme.subtext, fontSize: "11px", textTransform: "capitalize" }}>{food.type}</div>
            </div>
          ))
        ) : comingSoon(theme, `Food recommendations for ${locationName}`)}
      </>)}

      {/* Nearby Restaurants */}
      {card(theme, <>
        {sectionLabel(theme, `📍 NEARBY RESTAURANTS`)}
        <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "12px" }}>
          Based on your selected spots — nearest restaurants shown first
        </div>
        {comingSoon(theme, `Restaurant recommendations near your selected spots in ${locationName}`)}
      </>)}
    </div>
  )
});
