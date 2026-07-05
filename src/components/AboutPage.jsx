const AboutPage = ({ theme, onClose }) => {
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
        <div style={{
          color: theme.primary,
          fontSize: "22px",
          fontWeight: "900",
          letterSpacing: "3px",
        }}>
          NEXT STOP
        </div>
        <div
          onClick={onClose}
          style={{
            color: theme.subtext,
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}>
          ← Back
        </div>
      </div>

      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "60px 20px",
      }}>

        {/* Hero */}
        <div style={{
          textAlign: "center",
          marginBottom: "80px",
        }}>
          <div style={{
            color: theme.primary,
            fontSize: "13px",
            letterSpacing: "4px",
            fontWeight: "700",
            marginBottom: "16px",
          }}>
            🗺️ OUR STORY
          </div>
          <h1 style={{
            color: theme.text,
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: "900",
            letterSpacing: "-2px",
            marginBottom: "24px",
            lineHeight: "1.1",
          }}>
            Travel Smart.<br />
            <span style={{ color: theme.primary }}>Not Just Far.</span>
          </h1>
          <p style={{
            color: theme.subtext,
            fontSize: "18px",
            lineHeight: "1.8",
            maxWidth: "600px",
            margin: "0 auto",
          }}>
            NEXT STOP was born from a simple frustration — why does planning a trip in India have to be so hard and expensive?
          </p>
        </div>

        {/* Problem Section */}
        <div style={{
          background: theme.card,
          borderRadius: "24px",
          padding: "40px",
          border: `1px solid ${theme.primary}33`,
          marginBottom: "32px",
        }}>
          <div style={{
            color: theme.primary,
            fontSize: "13px",
            letterSpacing: "3px",
            fontWeight: "700",
            marginBottom: "16px",
          }}>
            😤 THE PROBLEM
          </div>
          <h2 style={{
            color: theme.text,
            fontSize: "24px",
            fontWeight: "800",
            marginBottom: "16px",
          }}>
            600 million Indians want to travel. Most don't know how.
          </h2>
          <p style={{
            color: theme.subtext,
            fontSize: "15px",
            lineHeight: "1.8",
            marginBottom: "16px",
          }}>
            Existing travel apps show you prices — but they don't actually help you plan. They don't tell you which train class you can afford after booking your hotel. They don't warn you that your food budget is too low. They don't speak your destination's language for you.
          </p>
          <p style={{
            color: theme.subtext,
            fontSize: "15px",
            lineHeight: "1.8",
          }}>
            Travel agents charge ₹2,000–₹10,000 for planning services that most budget travelers simply can't afford. First-time travelers, students, and young professionals are left to figure it all out alone — and often get it wrong.
          </p>
        </div>

        {/* Solution Section */}
        <div style={{
          background: theme.card,
          borderRadius: "24px",
          padding: "40px",
          border: `1px solid ${theme.primary}33`,
          marginBottom: "32px",
        }}>
          <div style={{
            color: theme.primary,
            fontSize: "13px",
            letterSpacing: "3px",
            fontWeight: "700",
            marginBottom: "16px",
          }}>
            💡 OUR SOLUTION
          </div>
          <h2 style={{
            color: theme.text,
            fontSize: "24px",
            fontWeight: "800",
            marginBottom: "24px",
          }}>
            An AI-powered travel agent in your pocket. Free.
          </h2>

          {[
            {
              emoji: "💰",
              title: "Smart Budget Distribution",
              desc: "Tell us your budget. We automatically split it between transport, stay, food and activities — and show you exactly which train class or hotel you can actually afford."
            },
            {
              emoji: "🗺️",
              title: "Interactive Trip Planning",
              desc: "Explore your destination on an interactive map. See famous spots, plan your route, and understand the geography before you even pack your bags."
            },
            {
              emoji: "🤖",
              title: "AI Trip Recommendations",
              desc: "Our AI agent generates personalized itineraries, activity suggestions, festival alerts and local food recommendations — specific to your destination and budget."
            },
            {
              emoji: "🗣️",
              title: "Local Phrases Offline",
              desc: "50 essential phrases in the local language of your destination — categorized for greetings, shopping, directions, emergencies and food. Screenshot them for offline use."
            },
            {
              emoji: "👥",
              title: "Group Travel Made Easy",
              desc: "Traveling with friends? We calculate per-person costs, room sharing options, and split the budget fairly — so nobody overpays."
            },
            {
              emoji: "🚂",
              title: "Multi-leg Journey Planning",
              desc: "Some destinations need connecting transport. We handle complex routes like Delhi → Chandigarh → Manali automatically, with all options and costs."
            },
          ].map((feature, i) => (
            <div key={i} style={{
              display: "flex",
              gap: "16px",
              padding: "16px 0",
              borderBottom: i < 5 ? `1px solid ${theme.primary}22` : "none",
            }}>
              <div style={{ fontSize: "28px", flexShrink: 0 }}>{feature.emoji}</div>
              <div>
                <div style={{ color: theme.text, fontWeight: "700", fontSize: "15px", marginBottom: "6px" }}>
                  {feature.title}
                </div>
                <div style={{ color: theme.subtext, fontSize: "13px", lineHeight: "1.6" }}>
                  {feature.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why I Built This */}
        <div style={{
          background: theme.card,
          borderRadius: "24px",
          padding: "40px",
          border: `1px solid ${theme.primary}33`,
          marginBottom: "32px",
        }}>
          <div style={{
            color: theme.primary,
            fontSize: "13px",
            letterSpacing: "3px",
            fontWeight: "700",
            marginBottom: "16px",
          }}>
            ❤️ WHY I BUILT THIS
          </div>
          <p style={{
            color: theme.subtext,
            fontSize: "15px",
            lineHeight: "1.8",
            marginBottom: "16px",
          }}>
            NEXT STOP started as a personal project — built by a young developer who was tired of overspending on trips because of poor planning tools. Every trip had the same problem: transport cost too much, hotel ate the budget, and there was nothing left for food or experiences.
          </p>
          <p style={{
            color: theme.subtext,
            fontSize: "15px",
            lineHeight: "1.8",
            marginBottom: "16px",
          }}>
            The idea was simple: what if a website could automatically figure out the smartest way to spend your travel budget? Not just show prices — but actually distribute your money intelligently based on what matters most to you.
          </p>
          <p style={{
            color: theme.subtext,
            fontSize: "15px",
            lineHeight: "1.8",
          }}>
            I built NEXT STOP for every Indian who has ever wanted to travel but didn't know where to start, how much to spend, or who to ask. This is for the first-time traveler, the budget backpacker, the college student, and the family planning their first holiday together.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}>
          {[
            { number: "4", label: "Destinations (Growing)", emoji: "📍" },
            { number: "500+", label: "Planned Locations", emoji: "🗺️" },
            { number: "₹0", label: "Cost to Use", emoji: "💰" },
            { number: "∞", label: "Trips You Can Plan", emoji: "✈️" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: theme.card,
              borderRadius: "16px",
              padding: "24px",
              border: `1px solid ${theme.primary}33`,
              textAlign: "center",
            }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{stat.emoji}</div>
              <div style={{
                color: theme.primary,
                fontSize: "28px",
                fontWeight: "900",
                marginBottom: "4px",
              }}>
                {stat.number}
              </div>
              <div style={{ color: theme.subtext, fontSize: "12px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Vision */}
        <div style={{
          background: `${theme.primary}11`,
          borderRadius: "24px",
          padding: "40px",
          border: `1px solid ${theme.primary}44`,
          textAlign: "center",
          marginBottom: "32px",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>🚀</div>
          <h2 style={{
            color: theme.text,
            fontSize: "22px",
            fontWeight: "800",
            marginBottom: "16px",
          }}>
            Where We're Headed
          </h2>
          <p style={{
            color: theme.subtext,
            fontSize: "14px",
            lineHeight: "1.8",
            maxWidth: "500px",
            margin: "0 auto",
          }}>
            500+ Indian destinations. Real-time transport prices. Hotel booking integration. Mobile app. Multi-language support. And eventually — making intelligent travel planning accessible to every person in India, in their own language, on any device.
          </p>
        </div>

        {/* Contact */}
        <div style={{
          textAlign: "center",
          padding: "20px",
        }}>
          <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "8px" }}>
            Built with ❤️ for India
          </div>
          <div style={{ color: theme.primary, fontWeight: "700", fontSize: "15px" }}>
            #SamarthYatra 🇮🇳
          </div>
        </div>

      </div>
    </div>
  )
}

export default AboutPage