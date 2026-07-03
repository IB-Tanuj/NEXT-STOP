// Wrap your app in an error boundary or check console
import { useState } from "react"
import { useTheme } from "./hooks/useTheme"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import TripPage from "./components/TripPage"
import SummerSection from "./components/SummerSection"
import LocationSpotlight from "./components/LocationSpotlight"
import { locationData } from "./components/TripPage"
import useScreenSize from "./hooks/useScreenSize"

function App() {
  const { theme, setLocationTheme, resetToSeason } = useTheme()
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [spotlightLocation, setSpotlightLocation] = useState(null)
  const { isMobile, isTablet } = useScreenSize()

  const handleThemeOnly = (location) => {
  if (location.trim()) {
    setLocationTheme(location)
    if (locationData[location.toLowerCase()]) {
      setSpotlightLocation(location)
    }
  }
}

  const handleExplore = (location) => {
    setSelectedLocation(location)
    setLocationTheme(location)
    setCurrentPage("trip")
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
    <Navbar theme={theme} isMobile={isMobile} />
    <Hero
      theme={theme}
      setLocationTheme={handleThemeOnly}
      onExplore={handleExplore}
      isMobile={isMobile}
    />
    <SummerSection
      theme={theme}
      isMobile={isMobile}
      onLocationClick={(name) => {
        handleThemeOnly(name)
        setSpotlightLocation(name)
      }}
    />
    <LocationSpotlight
      theme={theme}
      isMobile={isMobile}
      activeLocation={spotlightLocation}
      locationData={locationData}
    />
  </>
)}
      {currentPage === "trip" && (
        <TripPage
          location={selectedLocation}
          theme={theme}
          onBack={handleBack}
        />
      )}
    </div>
  )
}

export default App

