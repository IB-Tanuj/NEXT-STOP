import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Navbar = ({ theme, isMobile, onAbout, onExplore, onBudget, onPlanTrip, onBusLovers }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const { user, session, profile, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && session?.access_token) {
      fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends/requests`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.incoming) {
          setPendingCount(data.incoming.length);
        }
      })
      .catch(err => console.error("Error fetching requests count:", err));
    }
  }, [user, session]);

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
              <div 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: theme.primary, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
                transition: "transform 0.2s ease",
                position: 'relative'
              }} title="Profile Menu"
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  user.email.charAt(0).toUpperCase()
                )}
                {profile && !profile.username && (
                  <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '12px', height: '12px', backgroundColor: '#ff4757', borderRadius: '50%', border: `2px solid ${theme.bg}` }} title="Action Required" />
                )}
              </div>

              {profileMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: `${theme.bg}ee`,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.primary}55`,
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  minWidth: '200px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <div style={{ color: theme.subtext, fontSize: '13px', padding: '0 12px 8px', borderBottom: `1px solid ${theme.primary}22`, marginBottom: '4px', wordBreak: 'break-all' }}>
                    {user.email}
                  </div>
                  {[
                    { label: 'Profile', path: '/dashboard/profile', alert: profile && !profile.username },
                    { label: 'Saved Trips', path: '/dashboard/trips' },
                    { label: 'Savings Track', path: '/dashboard/savings' },
                    { label: 'Friend Requests', path: '/dashboard/requests', count: pendingCount },
                  ].map((item, idx) => (
                    <div
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        setProfileMenuOpen(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        color: theme.text,
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background 0.2s',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = `${theme.primary}22`}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.label}
                        {item.alert && <div style={{ width: '8px', height: '8px', backgroundColor: '#ff4757', borderRadius: '50%' }} />}
                      </span>
                      {item.count > 0 && (
                        <span style={{
                          background: theme.primary,
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          padding: '2px 6px',
                          borderRadius: '10px'
                        }}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  ))}
                  <div style={{ height: '1px', background: `${theme.primary}22`, margin: '4px 0' }} />
                  <div
                    onClick={() => { logout(); setProfileMenuOpen(false); }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      color: '#ff4757',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ff475722'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Logout
                  </div>
                </div>
              )}
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
              {[
                { label: 'Profile', path: '/dashboard/profile', alert: profile && !profile.username },
                { label: 'Saved Trips', path: '/dashboard/trips' },
                { label: 'Savings Track', path: '/dashboard/savings' },
                { label: 'Friend Requests', path: '/dashboard/requests', count: pendingCount },
              ].map((item) => (
                <div
                  key={item.label}
                  onClick={() => { navigate(item.path); setMenuOpen(false); }}
                  style={{
                    color: theme.text,
                    fontSize: '15px',
                    padding: '8px 0',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.primary}22`
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.label}
                    {item.alert && <div style={{ width: '8px', height: '8px', backgroundColor: '#ff4757', borderRadius: '50%' }} />}
                  </span>
                  {item.count > 0 && (
                    <span style={{
                      background: theme.primary,
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '10px'
                    }}>
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
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

