// Wrap your app in an error boundary or check console
import React, { useState, useEffect, lazy, Suspense } from "react"
import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom"
import { useTheme } from "./hooks/useTheme"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
const TripPage = lazy(() => import("./components/TripPage"))
import SeasonSection from "./components/SeasonSection"
import LocationSpotlight from "./components/LocationSpotlight"
import { locationData } from "./data/locationData"
import useScreenSize from "./hooks/useScreenSize"
const AboutPage = lazy(() => import("./components/AboutPage"))
const ExploreSidebar = lazy(() => import("./components/ExploreSidebar"))
const BudgetPage = lazy(() => import("./components/BudgetPage"))
const PlanTripPage = lazy(() => import("./components/PlanTripPage"))
const BusLoversPage = lazy(() => import("./components/BusLoversPage"))
const DevAdminPage = lazy(() => import("./components/DevAdminPage"))

import { allIndiaLocations } from "./data/allLocations"
import LandingPage from "./components/LandingPage"
const AuthPage = lazy(() => import("./components/AuthPage"))
import { useAuth } from "./context/AuthContext"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // Wait until session is checked
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function TripPageWrapper({ theme, onBack, setLocationTheme }) {
  const { locationId } = useParams();
  
  useEffect(() => {
    if (locationId) {
      setLocationTheme(locationId);
    }
  }, [locationId, setLocationTheme]);

  return <TripPage location={locationId} theme={theme} onBack={onBack} />;
}


const FallbackSpinner = ({ theme }) => (
  <div style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", background: theme?.bg || "#000" }}>
    <div style={{ color: theme?.primary || "#fff", fontSize: "24px", animation: "pulse 1.5s infinite" }}>⏳ Loading...</div>
  </div>
);

function App() {
  const { theme, setLocationTheme, resetToSeason } = useTheme()
  const navigate = useNavigate()
  const [spotlightLocation, setSpotlightLocation] = useState(null)
  const { isMobile, isTablet } = useScreenSize()
  const [showAbout, setShowAbout] = useState(false)
  const [showExplore, setShowExplore] = useState(false)
  const [showBudget, setShowBudget] = useState(false)
  const [showPlanTrip, setShowPlanTrip] = useState(false)
  const [showBusLovers, setShowBusLovers] = useState(false)

  const handleThemeOnly = (location) => {
    setLocationTheme(location)
    if (location.trim() && locationData[location.trim().toLowerCase()]) {
      setSpotlightLocation(location.trim().toLowerCase())
    } else if (!location.trim()) {
      setSpotlightLocation(null)
    }
  }

  const handleExplore = (location) => {
    let resolvedKey = location;
    
    if (location && typeof location === "string") {
      const clean = location.trim().toLowerCase();
      
      // 1. Direct match on locationKey
      let match = allIndiaLocations.find(l => l.locationKey === clean);
      if (match) {
        resolvedKey = match.locationKey;
      } else {
        // 2. Exact match on name
        match = allIndiaLocations.find(l => l.name.toLowerCase() === clean);
        if (match) {
          resolvedKey = match.locationKey;
        } else {
          // 3. Exact match on state
          const stateMatches = allIndiaLocations.filter(l => l.state.toLowerCase() === clean);
          if (stateMatches.length > 0) {
            return { type: "state", stateName: stateMatches[0].state, cities: stateMatches };
          } else {
            // 4. StartsWith match on name or state (minimum length 3)
            if (clean.length >= 3) {
              const startsWithNameMatch = allIndiaLocations.find(l => l.name.toLowerCase().startsWith(clean));
              if (startsWithNameMatch) {
                resolvedKey = startsWithNameMatch.locationKey;
              } else {
                const startsWithStateMatches = allIndiaLocations.filter(l => l.state.toLowerCase().startsWith(clean));
                if (startsWithStateMatches.length > 0) {
                  return { type: "state", stateName: startsWithStateMatches[0].state, cities: startsWithStateMatches };
                } else {
                  // 5. Includes / substring match on name or state
                  const includesNameMatch = allIndiaLocations.find(l => l.name.toLowerCase().includes(clean));
                  if (includesNameMatch) {
                    resolvedKey = includesNameMatch.locationKey;
                  } else {
                    const includesStateMatches = allIndiaLocations.filter(l => l.state.toLowerCase().includes(clean));
                    if (includesStateMatches.length > 0) {
                      return { type: "state", stateName: includesStateMatches[0].state, cities: includesStateMatches };
                    } else {
                      // 6. Common misspellings fallback
                      const misspellings = {
                        maharastra: "mumbai",
                        maharashtra: "mumbai",
                        "west bengal": "kolkata",
                        westbengal: "kolkata",
                        up: "varanasi",
                        "uttar pradesh": "varanasi",
                        uttarpradesh: "varanasi",
                        mp: "indore",
                        "madhya pradesh": "indore",
                        madhyapradesh: "indore",
                        ap: "vizag",
                        "andhra pradesh": "vizag",
                        andhrapradesh: "vizag",
                        hp: "shimla",
                        himachal: "shimla",
                        "himachal pradesh": "shimla",
                        himachalpradesh: "shimla",
                        uk: "rishikesh",
                        uttarakhand: "rishikesh",
                        "j&k": "srinagar",
                        kashmir: "srinagar",
                        jammu: "srinagar",
                        "jammu & kashmir": "srinagar",
                        tn: "chennai",
                        tamilnadu: "chennai",
                        "tamil nadu": "chennai",
                      };
                      if (misspellings[clean]) {
                        resolvedKey = misspellings[clean];
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Verify if the resolved key actually exists in our data
    if (locationData[resolvedKey]) {
      setLocationTheme(resolvedKey)
      navigate(`/trip/${resolvedKey}`)
      return true
    }
    
    // If not found (e.g. they typed numbers or unsupported city), return false
    return false
  }

  const handleBack = () => {
    navigate("/app")
    resetToSeason()
  }
  

  return (
    <div style={{
      backgroundColor: theme?.bg || "#060a10",
      minHeight: "100vh",
      fontFamily: "var(--sans)",
      transition: "all 0.8s ease",
    }}>
      <Suspense fallback={<FallbackSpinner theme={theme} />}>
      <Routes>
        <Route path="/dev" element={<DevAdminPage theme={theme} setLocationTheme={setLocationTheme} />} />
        
        {/* New Marketing Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login Page */}
        <Route path="/login" element={<AuthPage theme={theme} />} />

        {/* Protected Dashboard / Search App */}
        <Route path="/app" element={
          <ProtectedRoute>
            <>
              <Navbar theme={theme} isMobile={isMobile} 
              onAbout={() => setShowAbout(true)}
              onExplore={() => setShowExplore(true)}
              onBudget={() => setShowBudget(true)}
              onPlanTrip={() => setShowPlanTrip(true)}
              onBusLovers={() => setShowBusLovers(true)}
              />
              <Hero
                theme={theme}
                setLocationTheme={handleThemeOnly}
                onExplore={handleExplore}
                isMobile={isMobile}
              />
              {/* Season section — only when no location searched */}
              {!spotlightLocation && (
                <SeasonSection
                  theme={theme}
                  isMobile={isMobile}
                  onLocationClick={(name) => {
                    handleExplore(name)
                  }}
                />
              )}
              {/* Location spotlight — only when a location IS searched */}
              {spotlightLocation && (
                <LocationSpotlight
                  theme={theme}
                  isMobile={isMobile}
                  activeLocation={spotlightLocation}
                  locationData={locationData}
                />
              )}
            </>
          </ProtectedRoute>
        } />
        <Route path="/trip/:locationId" element={
          <TripPageWrapper theme={theme} onBack={handleBack} setLocationTheme={setLocationTheme} />
        } />
      </Routes>
      </Suspense>
      {showAbout && (
  <Suspense fallback={null}>
  <AboutPage theme={theme} onClose={() => setShowAbout(false)} />
  </Suspense>
)}
<Suspense fallback={null}>
<ExploreSidebar
  theme={theme}
  isOpen={showExplore}
  onClose={() => setShowExplore(false)}
  onLocationSelect={(locationKey) => {
    handleThemeOnly(locationKey)
    handleExplore(locationKey)
  }}
/>
</Suspense>
{showBudget && (
  <Suspense fallback={null}>
  <BudgetPage theme={theme} onClose={() => setShowBudget(false)} onLocationSelect={(locationKey) => { setShowBudget(false); handleThemeOnly(locationKey); handleExplore(locationKey); }} />
  </Suspense>
)}

{showPlanTrip && (
  <Suspense fallback={null}>
  <PlanTripPage theme={theme} onClose={() => setShowPlanTrip(false)} onStartPlanning={() => { const searchBar = document.getElementById("hero-search"); if (searchBar) { searchBar.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => searchBar.focus(), 600); } }} />
  </Suspense>
)}

{showBusLovers && (
  <Suspense fallback={null}>
  <BusLoversPage theme={theme} onClose={() => setShowBusLovers(false)} />
  </Suspense>
)}
    </div>
  )
}

export default App

