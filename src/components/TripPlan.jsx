import { useState, useEffect } from "react"
import { localPhrases } from "../data/localPhrases"

const generateTripPlan = async (location, days, budget, stayType, transport, spots) => {
  const response = await fetch("/api/trip/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location,
      days,
      budget,
      stayType,
      transport,
      spots,
    }),
  });

  console.log("Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend Error Response:", errorText);
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log("Backend Response:", data);
  return data;
}

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

const TripPlan = ({ location, theme, planData, preferences, budgetData, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedActivities, setSelectedActivities] = useState([])
  const [selectedFestivals, setSelectedFestivals] = useState([])
  const [aiData, setAiData] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")

  const foodBuffer = budgetData?.foodBuffer || 0
  const [remainingBuffer, setRemainingBuffer] = useState(foodBuffer)

  const isGroup = planData?.budgetType === "group"
  const groupSize = Number(planData?.groupSize) || 1
  const stayType = preferences?.stayType
  const transport = preferences?.transport
  const locationName = location?.name || ""

  useEffect(() => {
    let cancelled = false
    const fetchAiPlan = async () => {
      setAiLoading(true)
      setAiError("")
      try {
        const spots = preferences?.activities || []
        const data = await generateTripPlan(
          locationName,
          preferences?.days,
          foodBuffer,
          stayType,
          transport,
          spots
        )
        if (!cancelled) setAiData(data)
      } catch (err) {
        console.error("AI generation failed:", err)
        setAiError("Could not generate AI plan — showing placeholders instead")
      }
      setAiLoading(false)
      return () => { cancelled = true }
    }
    fetchAiPlan()
  }, [])

  const handleActivityToggle = (item) => {
    const isSelected = selectedActivities.find(a => a.id === item.id)
    if (isSelected) {
      setSelectedActivities(prev => prev.filter(a => a.id !== item.id))
      setRemainingBuffer(prev => prev + item.cost)
    } else {
      setSelectedActivities(prev => [...prev, item])
      setRemainingBuffer(prev => prev - item.cost)
    }
  }

  const handleFestivalToggle = (item) => {
    const isSelected = selectedFestivals.find(f => f.id === item.id)
    if (isSelected) {
      setSelectedFestivals(prev => prev.filter(f => f.id !== item.id))
      setRemainingBuffer(prev => prev + item.cost)
    } else {
      setSelectedFestivals(prev => [...prev, item])
      setRemainingBuffer(prev => prev - item.cost)
    }
  }

  // ── Book Now Links based on selections ────────────────
  const getTransportLinks = () => {
    const links = {
      train: [
        { label: "🚂 Book Train on IRCTC", link: "https://www.irctc.co.in", note: "Official Indian Railways booking" },
        { label: "🚂 Book Train on ixigo", link: "https://www.ixigo.com/trains", note: "Compare prices & book" },
      ],
      bus: [
        { label: "🚌 Book Bus on RedBus", link: "https://www.redbus.in", note: "Largest bus booking platform" },
        { label: "🚌 Book Bus on AbhiBus", link: "https://www.abhibus.com", note: "Alternative bus booking" },
      ],
      flight: [
        { label: "✈️ Book Flight on MakeMyTrip", link: "https://www.makemytrip.com/flights", note: "Compare all airlines" },
        { label: "✈️ Book Flight on IndiGo", link: "https://www.goindigo.in", note: "Cheapest domestic flights" },
        { label: "✈️ Book Flight on Air India", link: "https://www.airindia.com", note: "Full service airline" },
      ],
      personal: [
        { label: "🗺️ Plan Route on Google Maps", link: `https://www.google.com/maps/dir/Delhi/${locationName}`, note: "Get driving directions" },
        { label: "⛽ Check Fuel Prices", link: "https://www.goodreturns.in/petrol-price.html", note: "Today's petrol/diesel prices" },
        { label: "🅿️ Book Parking on Park+", link: "https://www.parkplus.io", note: "Pre-book parking spots" },
      ],
    }
    return links[transport] || []
  }

  const getStayLinks = () => {
    const allLinks = {
      hostel: [
        { label: "🛏️ Book on HostelWorld", link: "https://www.hostelworld.com", note: "Best hostel booking platform" },
        { label: "🛏️ Book on Zostel", link: "https://www.zostel.com", note: "India's top hostel chain" },
      ],
      budget: [
        { label: "🏨 Book on OYO", link: "https://www.oyorooms.com", note: "Budget hotels across India" },
        { label: "🏨 Book on Booking.com", link: "https://www.booking.com", note: "Compare budget hotels" },
      ],
      mid: [
        { label: "🏩 Book on Booking.com", link: "https://www.booking.com", note: "Best mid-range selection" },
        { label: "🏩 Book on MakeMyTrip", link: "https://www.makemytrip.com/hotels", note: "Hotels with deals" },
      ],
      premium: [
        { label: "🏰 Book on Booking.com", link: "https://www.booking.com", note: "Premium hotel selection" },
        { label: "🏰 Book on Taj Hotels", link: "https://www.tajhotels.com", note: "India's finest hotels" },
      ],
      luxury: [
        { label: "👑 Book on Booking.com", link: "https://www.booking.com", note: "Luxury collection" },
        { label: "👑 Book on Taj Hotels", link: "https://www.tajhotels.com", note: "Ultra premium experience" },
        { label: "👑 Book on ITC Hotels", link: "https://www.itchotels.com", note: "Luxury Indian hospitality" },
      ],
    }
    return allLinks[stayType] || allLinks.budget
  }

  const tabs = [
    { id: "overview", label: "📋 Overview" },
    { id: "activities", label: "🎯 Activities & Festivals" },
    { id: "booking", label: "🔗 Book Now" },
    { id: "emergency", label: "🆘 Emergency" },
  ]

  const card = (children, extra = {}) => (
    <div style={{
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

  const sectionLabel = (text) => (
    <div style={{
      color: theme.subtext,
      fontSize: "12px",
      letterSpacing: "2px",
      marginBottom: "14px",
    }}>
      {text}
    </div>
  )

  const comingSoon = (feature) => (
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

  const bookingLink = (item, i, total) => (
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

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.heroGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 20px 40px",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Back */}
      <div onClick={onBack} style={{
        position: "fixed", top: "30px", left: "40px",
        color: theme.subtext, cursor: "pointer",
        fontSize: "14px", fontWeight: "600", zIndex: 10,
      }}>← Back</div>

      {/* Header */}
      <div style={{ color: theme.primary, fontSize: "13px", letterSpacing: "4px", fontWeight: "700", marginBottom: "8px" }}>
        🗺️ YOUR TRIP PLAN
      </div>
      <h2 style={{ color: theme.text, fontSize: "clamp(20px, 4vw, 30px)", fontWeight: "900", marginBottom: "8px", textAlign: "center" }}>
        {locationName} · {preferences?.days} Days
      </h2>

      {/* Budget Buffer */}
      <div style={{
        background: remainingBuffer >= 0 ? `${theme.primary}22` : "#ff6b6b22",
        border: `1px solid ${remainingBuffer >= 0 ? theme.primary : "#ff6b6b"}`,
        borderRadius: "12px",
        padding: "12px 24px",
        marginBottom: "16px",
        textAlign: "center",
      }}>
        <span style={{ color: theme.subtext, fontSize: "13px" }}>💰 Food & Activities Buffer: </span>
        <span style={{
          color: remainingBuffer >= 0 ? "#A8E6CF" : "#ff6b6b",
          fontWeight: "900", fontSize: "18px",
        }}>
          ₹{Math.abs(remainingBuffer).toLocaleString("en-IN")}
          {remainingBuffer < 0 ? " (over!)" : ""}
        </span>
      </div>

      {/* Warnings */}
      {aiError && (
        <div style={{
          background: "#FFB34722",
          border: "1px solid #FFB347",
          borderRadius: "12px",
          padding: "12px 24px",
          marginBottom: "16px",
          textAlign: "center",
          width: "100%",
          maxWidth: "620px",
        }}>
          <div style={{ color: "#FFB347", fontSize: "13px" }}>⚠️ {aiError}</div>
        </div>
      )}
      {remainingBuffer <= 0 && (
        <div style={{
          background: "#ff6b6b22",
          border: "2px solid #ff6b6b",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "16px",
          textAlign: "center",
          width: "100%",
          maxWidth: "620px",
        }}>
          <div style={{ fontSize: "24px", marginBottom: "6px" }}>⚠️</div>
          <div style={{ color: "#ff6b6b", fontWeight: "800", fontSize: "15px", marginBottom: "4px" }}>
            No money left for food!
          </div>
          <div style={{ color: theme.subtext, fontSize: "13px" }}>
            Deselect some activities or festivals to free up budget
          </div>
        </div>
      )}

      {remainingBuffer > 0 && remainingBuffer < 500 && (
        <div style={{
          background: "#FFB34722",
          border: "2px solid #FFB347",
          borderRadius: "12px",
          padding: "14px 24px",
          marginBottom: "16px",
          textAlign: "center",
          width: "100%",
          maxWidth: "620px",
        }}>
          <div style={{ color: "#FFB347", fontWeight: "800", fontSize: "14px" }}>
            ⚠️ Very little left for food — be careful with selections!
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
        maxWidth: "620px",
      }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 16px",
              borderRadius: "20px",
              border: `2px solid ${activeTab === tab.id ? theme.primary : theme.primary + "33"}`,
              background: activeTab === tab.id ? `${theme.primary}22` : "transparent",
              color: activeTab === tab.id ? theme.primary : theme.subtext,
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "13px",
              transition: "all 0.3s ease",
            }}>
            {tab.label}
          </div>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: "620px" }}>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>

            {/* Trip Summary */}
            {card(<>
              {sectionLabel("📋 TRIP SUMMARY")}
              {[
                { label: "📍 Destination", value: locationName },
                { label: "📅 Duration", value: `${preferences?.days} days` },
                { label: "👤 Traveler", value: isGroup ? `Group of ${groupSize}` : "Solo" },
                { label: "💰 Total Budget", value: `₹${Number(planData?.budget).toLocaleString("en-IN")}` },
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

            {/* Stay Recommendations */}
            {card(<>
              {sectionLabel(`🏨 RECOMMENDED ${stayType?.toUpperCase()} IN ${locationName.toUpperCase()}`)}
              {aiLoading ? (
                <div style={{ color: theme.subtext, textAlign: "center", padding: "20px" }}>
                  🤖 AI is generating recommendations...
                </div>
              ) : aiData?.stayRecommendations?.length > 0 ? (
                aiData.stayRecommendations.map((stay, i) => (
                  <div key={i} style={{
                    padding: "14px 16px",
                    borderRadius: "12px",
                    marginBottom: "8px",
                    border: `1px solid ${theme.primary}33`,
                    background: "transparent",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>{stay.name}</div>
                      <div style={{ color: theme.primary, fontWeight: "800" }}>₹{stay.pricePerNight}/night</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ color: theme.subtext, fontSize: "12px" }}>{stay.highlight}</div>
                      <div style={{ color: "#FFE66D", fontSize: "12px" }}>⭐ {stay.rating}</div>
                    </div>
                  </div>
                ))
              ) : comingSoon(`${stayType} recommendations for ${locationName}`)}
            </>)}

            {/* Food Recommendations */}
            {card(<>
              {sectionLabel(`🍽️ POPULAR FOOD IN ${locationName.toUpperCase()}`)}
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>
                        {food.mustTry && "🌟 "}{food.name}
                      </div>
                      <div style={{ color: theme.subtext, fontSize: "12px" }}>{food.description}</div>
                      <div style={{ color: theme.subtext, fontSize: "11px", textTransform: "capitalize" }}>{food.type}</div>
                    </div>
                    <div style={{ color: theme.primary, fontWeight: "800", fontSize: "14px" }}>
                      ~₹{food.avgCost}
                    </div>
                  </div>
                ))
              ) : comingSoon(`Food recommendations for ${locationName}`)}
            </>)}

            {/* Nearby Restaurants */}
            {card(<>
              {sectionLabel(`📍 NEARBY RESTAURANTS`)}
              <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "12px" }}>
                Based on your selected spots — nearest restaurants shown first
              </div>
              {comingSoon(`Restaurant recommendations near your selected spots in ${locationName}`)}
            </>)}

          </div>
        )}

        {activeTab === "activities" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>

            {card(<>
              {sectionLabel(`🎯 ACTIVITIES IN ${locationName.toUpperCase()}`)}
              <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "16px" }}>
                Select activities — cost deducted from buffer in real time
              </div>
              {aiLoading ? (
                <div style={{ color: theme.subtext, textAlign: "center", padding: "20px" }}>
                  🤖 AI is finding activities...
                </div>
              ) : aiData?.activities?.length > 0 ? (
                aiData.activities.map((activity, i) => {
                  const isSelected = selectedActivities.find(a => a.id === activity.id)
                  return (
                    <div
                      key={i}
                      onClick={() => handleActivityToggle(activity)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        marginBottom: "8px",
                        border: `2px solid ${isSelected ? theme.primary : theme.primary + "33"}`,
                        background: isSelected ? `${theme.primary}22` : "transparent",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <div style={{ color: isSelected ? theme.primary : theme.text, fontWeight: "700", fontSize: "14px" }}>
                          {isSelected ? "✅ " : ""}{activity.name}
                        </div>
                        <div style={{ color: activity.cost === 0 ? "#A8E6CF" : theme.primary, fontWeight: "800" }}>
                          {activity.cost === 0 ? "FREE" : `₹${activity.cost}`}
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ color: theme.subtext, fontSize: "12px" }}>{activity.description}</div>
                        <div style={{ color: theme.subtext, fontSize: "11px" }}>⏱️ {activity.duration}</div>
                      </div>
                      {activity.bestTime && (
                        <div style={{ color: theme.subtext, fontSize: "11px", marginTop: "4px" }}>
                          Best time: {activity.bestTime}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : comingSoon(`Activities for ${locationName}`)}
            </>)}

            {card(<>
              {sectionLabel(`🎉 FESTIVALS & EVENTS IN ${locationName.toUpperCase()}`)}
              <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "16px" }}>
                Upcoming festivals — select to include in budget
              </div>
              {aiLoading ? (
                <div style={{ color: theme.subtext, textAlign: "center", padding: "20px" }}>
                  🤖 AI is finding festivals...
                </div>
              ) : aiData?.festivals?.length > 0 ? (
                aiData.festivals.map((festival, i) => {
                  const isSelected = selectedFestivals.find(f => f.id === festival.id)
                  return (
                    <div
                      key={i}
                      onClick={() => handleFestivalToggle(festival)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        marginBottom: "8px",
                        border: `2px solid ${isSelected ? theme.primary : theme.primary + "33"}`,
                        background: isSelected ? `${theme.primary}22` : "transparent",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <div style={{ color: isSelected ? theme.primary : theme.text, fontWeight: "700", fontSize: "14px" }}>
                          {isSelected ? "✅ " : ""}{festival.name}
                        </div>
                        <div style={{ color: festival.cost === 0 ? "#A8E6CF" : theme.primary, fontWeight: "800" }}>
                          {festival.cost === 0 ? "FREE" : `₹${festival.cost}`}
                        </div>
                      </div>
                      <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "2px" }}>{festival.description}</div>
                      <div style={{ color: theme.subtext, fontSize: "11px" }}>📅 {festival.date}</div>
                    </div>
                  )
                })
              ) : comingSoon(`Festivals for ${locationName}`)}
            </>)}

          </div>
        )}

        {/* Book Now Tab */}
        {activeTab === "booking" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>

            {/* Transport */}
            {card(<>
              {sectionLabel(`🚌 BOOK YOUR ${transport?.toUpperCase()}`)}
              {getTransportLinks().map((item, i) => bookingLink(item, i, getTransportLinks().length))}
            </>)}

            {/* Stay */}
            {card(<>
              {sectionLabel(`🏨 BOOK YOUR ${stayType?.toUpperCase()}`)}
              {getStayLinks().map((item, i) => bookingLink(item, i, getStayLinks().length))}
            </>)}

          </div>
        )}

        {/* Emergency Tab */}
        {activeTab === "emergency" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>

            {card(<>
              {sectionLabel("🆘 NATIONAL EMERGENCY NUMBERS")}
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

            {card(<>
              {sectionLabel(`🆘 LOCAL EMERGENCY — ${locationName.toUpperCase()}`)}
              {aiLoading ? (
                <div style={{ color: theme.subtext, textAlign: "center", padding: "20px" }}>
                  🤖 AI is finding local contacts...
                </div>
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
              ) : comingSoon(`Local emergency contacts for ${locationName}`)}
            </>)}

          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default TripPlan