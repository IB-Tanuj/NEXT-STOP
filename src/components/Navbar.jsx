import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Navbar = ({ theme, isMobile, onAbout, onExplore, onBudget, onPlanTrip, onBusLovers }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: isMobile ? "16px 20px" : "20px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backdropFilter: "blur(10px)",
      borderBottom: `1px solid ${theme.primary}22`,
      backgroundColor: `${theme.bg}cc`,
    }}>

      {/* Logo */}
      <div style={{
        fontSize: isMobile ? "18px" : "24px",
        fontWeight: "900",
        letterSpacing: "3px",
        color: theme.primary,
        transition: "color 0.8s ease",
      }}>
        NEXT STOP
      </div>

      {/* Desktop Nav Links */}
      {!isMobile && (
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          {["Explore", "Plan Trip", "Bus Lovers", "Budget", "About"].map((item) => (
            <span key={item}
            onClick={() => {
  if (item === "About") onAbout()
  if (item === "Explore") onExplore()
    if (item === "Budget") onBudget()
      if (item === "Plan Trip") onPlanTrip()
      if (item === "Bus Lovers") onBusLovers()

}}
             style={{
              color: theme.subtext,
              cursor: "pointer",
              fontSize: "14px",
              letterSpacing: "1px",
              fontWeight: "500",
              transition: "color 0.3s",
            }}
              onMouseEnter={e => e.target.style.color = theme.primary}
              onMouseLeave={e => e.target.style.color = theme.subtext}
            >
              {item}
            </span>
          ))}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: theme.primary, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '14px', cursor: 'pointer'
              }} title={user.email}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <button 
                onClick={() => logout()}
                style={{
                  background: 'transparent', border: `1px solid ${theme.primary}55`,
                  padding: "8px 16px", borderRadius: "25px", color: theme.text,
                  fontWeight: "600", fontSize: "13px", cursor: "pointer", transition: "all 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = `${theme.primary}22`}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button 
            onClick={() => navigate('/login')}
            style={{
              background: theme.primary,
              border: "none",
              padding: "10px 24px",
              borderRadius: "25px",
              color: "#fff",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              letterSpacing: "1px",
              transition: "opacity 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              LOG IN
            </button>
          )}
        </div>
      )}

      {/* Mobile Hamburger */}
      {isMobile && (
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "4px",
          }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: "24px",
              height: "2px",
              background: theme.primary,
              borderRadius: "2px",
              transition: "all 0.3s ease",
              transform: menuOpen
                ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                  : i === 1 ? "opacity: 0"
                    : "rotate(-45deg) translate(5px, -5px)"
                : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: `${theme.bg}ee`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${theme.primary}22`,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          animation: "fadeIn 0.2s ease",
          zIndex: 100,
        }}>
          {["Explore", "Plan Trip", "Bus Lovers", "Budget", "About"].map((item) => (
            <span
              key={item}
              onClick={() => {
  if (item === "About") onAbout()
  if (item === "Explore") onExplore()
    if (item === "Budget") onBudget()
    if (item === "Plan Trip") onPlanTrip()
    if (item === "Bus Lovers") { onBusLovers(); setMenuOpen(false); }
}}
              style={{
                color: theme.subtext,
                cursor: "pointer",
                fontSize: "16px",
                letterSpacing: "1px",
                fontWeight: "600",
                padding: "8px 0",
                borderBottom: `1px solid ${theme.primary}22`,
              }}>
              {item}
            </span>
          ))}
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <div style={{ color: theme.text, fontSize: '14px', fontWeight: '500' }}>
                Logged in as {user.email}
              </div>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                style={{
                  background: 'transparent', border: `1px solid ${theme.primary}55`,
                  padding: "12px 24px", borderRadius: "25px", color: theme.text,
                  fontWeight: "600", fontSize: "14px", cursor: "pointer",
                }}>
                LOGOUT
              </button>
            </div>
          ) : (
            <button
            onClick={() => { navigate('/login'); setMenuOpen(false); }}
             style={{
              background: theme.primary,
              border: "none",
              padding: "14px 24px",
              borderRadius: "25px",
              color: "#fff",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              letterSpacing: "1px",
              marginTop: "8px",
            }}>
              LOG IN
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}

export default Navbar

