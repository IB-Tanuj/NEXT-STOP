// Wrap your app in an error boundary or check console
import { useState } from "react"
import { useTheme } from "./hooks/useTheme"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import TripPage from "./components/TripPage"
import SeasonSection from "./components/SeasonSection"
import LocationSpotlight from "./components/LocationSpotlight"
import { locationData } from "./components/TripPage"
import useScreenSize from "./hooks/useScreenSize"
import AboutPage from "./components/AboutPage"
import ExploreSidebar from "./components/ExploreSidebar"
import BudgetPage from "./components/BudgetPage"
import PlanTripPage from "./components/PlanTripPage"

import { allIndiaLocations } from "./data/allLocations"

function App() {
  const { theme, setLocationTheme, resetToSeason } = useTheme()
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [spotlightLocation, setSpotlightLocation] = useState(null)
  const { isMobile, isTablet } = useScreenSize()
  const [showAbout, setShowAbout] = useState(false)
  const [showExplore, setShowExplore] = useState(false)
  const [showBudget, setShowBudget] = useState(false)
  const [showPlanTrip, setShowPlanTrip] = useState(false)

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
          // 3. Exact match on state (map to its main built city/entry)
          const stateMatches = allIndiaLocations.filter(l => l.state.toLowerCase() === clean);
          if (stateMatches.length > 0) {
            const exactStateMatch = stateMatches.find(l => l.name.toLowerCase() === clean);
            resolvedKey = exactStateMatch ? exactStateMatch.locationKey : stateMatches[0].locationKey;
          } else {
            // 4. StartsWith match on name or state (minimum length 3)
            if (clean.length >= 3) {
              const startsWithMatch = allIndiaLocations.find(l => 
                l.name.toLowerCase().startsWith(clean) || l.state.toLowerCase().startsWith(clean)
              );
              if (startsWithMatch) {
                resolvedKey = startsWithMatch.locationKey;
              } else {
                // 5. Includes / substring match on name or state
                const includesMatch = allIndiaLocations.find(l => 
                  l.name.toLowerCase().includes(clean) || l.state.toLowerCase().includes(clean)
                );
                if (includesMatch) {
                  resolvedKey = includesMatch.locationKey;
                } else {
                  // 6. Common misspellings fallback (e.g. "maharastra" -> "mumbai")
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

    // Verify if the resolved key actually exists in our data
    if (locationData[resolvedKey]) {
      setSelectedLocation(resolvedKey)
      setLocationTheme(resolvedKey)
      setCurrentPage("trip")
      return true
    }
    
    // If not found (e.g. they typed numbers or unsupported city), return false
    return false
  }

  const handleBack = () => {
    setCurrentPage("home")
    resetToSeason()
    setSelectedLocation(null)
  }
  

  return (
    <div style={{
      backgroundColor: theme.bg,
      minHeight: "100vh",
      fontFamily: "var(--sans)",
      transition: "all 0.8s ease",
    }}>
      {currentPage === "home" && (
  <>
    <Navbar theme={theme} isMobile={isMobile} 
    onAbout={() => setShowAbout(true)}
    onExplore={() => setShowExplore(true)}
    onBudget={() => setShowBudget(true)}
    onPlanTrip={() => setShowPlanTrip(true)}
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
          handleThemeOnly(name)
          setSpotlightLocation(name)
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
)}
      {currentPage === "trip" && (
        <TripPage
          location={selectedLocation}
          theme={theme}
          onBack={handleBack}
        />
      )}
      {showAbout && (
  <AboutPage
    theme={theme}
    onClose={() => setShowAbout(false)}
  />
)}
<ExploreSidebar
  theme={theme}
  isOpen={showExplore}
  onClose={() => setShowExplore(false)}
  onLocationSelect={(locationKey) => {
    handleThemeOnly(locationKey)
    handleExplore(locationKey)
  }}
  
/>
{showBudget && (
  <BudgetPage
    theme={theme}
    onClose={() => setShowBudget(false)}
    onLocationSelect={(locationKey) => {
      setShowBudget(false)
      handleThemeOnly(locationKey)
      handleExplore(locationKey)
    }}
  />
)}

{showPlanTrip && (
  <PlanTripPage
    theme={theme}
    onClose={() => setShowPlanTrip(false)}
    onStartPlanning={() => {
      const searchBar = document.getElementById("hero-search")
      if (searchBar) {
        searchBar.scrollIntoView({ behavior: "smooth", block: "center" })
        setTimeout(() => searchBar.focus(), 600)
      }
    }}
  />
)}
    </div>
  )
}

export default App

