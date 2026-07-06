const steps = [
  {
    number: "01",
    emoji: "🔍",
    title: "Search Your Destination",
    desc: "Type any Indian destination in the search bar or pick from our curated summer getaways. The website theme changes to match your destination instantly.",
  },
  {
    number: "02",
    emoji: "🗺️",
    title: "Explore the Map",
    desc: "See your destination on an interactive map with famous tourist spots highlighted. Zoom in, explore the area and get a feel for the geography before you go.",
  },
  {
    number: "03",
    emoji: "📅",
    title: "Check Best Time to Visit",
    desc: "See month-by-month ratings and travel tips so you know exactly when to go — and when to avoid your destination.",
  },
  {
    number: "04",
    emoji: "💰",
    title: "Set Your Budget",
    desc: "Tell us your total budget — solo or group. Our smart engine automatically splits it between transport, stay, food and activities based on your preferences.",
  },
  {
    number: "05",
    emoji: "🚂",
    title: "Choose Your Transport",
    desc: "See every transport option within your budget — from sleeper class trains to flights. For places like Manali we handle multi-leg journeys automatically.",
  },
  {
    number: "06",
    emoji: "🤖",
    title: "Get Your AI Trip Plan",
    desc: "Our AI generates a personalized itinerary, activity recommendations, festival alerts, stay suggestions and local food recommendations — all specific to your destination and budget.",
  },
  {
    number: "07",
    emoji: "🗣️",
    title: "Learn Local Phrases",
    desc: "Get 50 essential phrases in the local language — greetings, shopping, directions, emergencies and food. Screenshot them for offline use when there's no network.",
  },
  {
    number: "08",
    emoji: "🔗",
    title: "Book Everything",
    desc: "Direct links to IRCTC, RedBus, IndiGo, Booking.com and OYO — based on your selected transport and stay type. No hunting around multiple websites.",
  },
]

const PlanTripPage = ({ theme, onClose, onStartPlanning }) => {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 500,
      background: theme.bg,
      overflowY: "auto",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        position: "sticky",
        top: 0,
        background: `${theme.bg}ee`,
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${theme.primary}22`,
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
      }}>
        <div style={{ color: theme.primary, fontSize: "22px", fontWeight: "900", letterSpacing: "3px" }}>
          NEXT STOP
        </div>
        <div onClick={onClose} style={{ color: theme.subtext, cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
          ← Back
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 20px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{
            color: theme.primary,
            fontSize: "13px",
            letterSpacing: "4px",
            fontWeight: "700",
            marginBottom: "16px",
          }}>
            🗺️ HOW IT WORKS
          </div>
          <h1 style={{
            color: theme.text,
            fontSize: "clamp(32px, 6vw, 52px)",
            fontWeight: "900",
            letterSpacing: "-2px",
            marginBottom: "20px",
            lineHeight: "1.1",
          }}>
            Plan your perfect trip<br />
            <span style={{ color: theme.primary }}>in 8 simple steps</span>
          </h1>
          <p style={{
            color: theme.subtext,
            fontSize: "16px",
            lineHeight: "1.8",
            maxWidth: "500px",
            margin: "0 auto 32px",
          }}>
            From destination search to booking confirmation — NEXT STOP handles everything. Here's exactly how it works.
          </p>
          <button
            onClick={() => { onClose(); onStartPlanning() }}
            style={{
              background: theme.primary,
              border: "none",
              padding: "14px 36px",
              borderRadius: "50px",
              color: "#fff",
              fontWeight: "800",
              fontSize: "15px",
              cursor: "pointer",
              letterSpacing: "2px",
              boxShadow: `0 8px 32px ${theme.primary}66`,
            }}
          >
            START PLANNING NOW →
          </button>
        </div>

        {/* Steps */}
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute",
            left: "28px",
            top: "20px",
            bottom: "20px",
            width: "2px",
            background: `linear-gradient(180deg, ${theme.primary}, ${theme.primary}22)`,
          }} />

          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                display: "flex",
                gap: "24px",
                marginBottom: "40px",
                position: "relative",
              }}
            >
              {/* Number Circle */}
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: theme.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "14px",
                fontWeight: "900",
                color: "#fff",
                boxShadow: `0 4px 16px ${theme.primary}66`,
                zIndex: 1,
              }}>
                {step.number}
              </div>

              {/* Content */}
              <div style={{
                background: theme.card,
                borderRadius: "16px",
                padding: "24px",
                border: `1px solid ${theme.primary}22`,
                flex: 1,
                transition: "border 0.3s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.border = `1px solid ${theme.primary}66`}
                onMouseLeave={e => e.currentTarget.style.border = `1px solid ${theme.primary}22`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "24px" }}>{step.emoji}</span>
                  <div style={{ color: theme.text, fontWeight: "800", fontSize: "16px" }}>
                    {step.title}
                  </div>
                </div>
                <div style={{ color: theme.subtext, fontSize: "13px", lineHeight: "1.7" }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          background: `${theme.primary}11`,
          borderRadius: "24px",
          padding: "40px",
          border: `1px solid ${theme.primary}44`,
          textAlign: "center",
          marginTop: "20px",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>🚀</div>
          <h2 style={{ color: theme.text, fontSize: "22px", fontWeight: "800", marginBottom: "12px" }}>
            Ready to plan your trip?
          </h2>
          <p style={{ color: theme.subtext, fontSize: "14px", marginBottom: "24px", lineHeight: "1.7" }}>
            Search any Indian destination and let NEXT STOP handle the rest — budget, transport, stay, food and activities.
          </p>
          <button
            onClick={() => { onClose(); onStartPlanning() }}
            style={{
              background: theme.primary,
              border: "none",
              padding: "14px 36px",
              borderRadius: "50px",
              color: "#fff",
              fontWeight: "800",
              fontSize: "15px",
              cursor: "pointer",
              letterSpacing: "2px",
              boxShadow: `0 8px 32px ${theme.primary}66`,
            }}
          >
            START PLANNING →
          </button>
        </div>

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

export default PlanTripPage