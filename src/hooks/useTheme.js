import { useState, useEffect } from "react"
import { getSeasonTheme, themes, locationThemes } from "../themes"
import { allIndiaLocations } from "../data/allLocations"

export const useTheme = () => {
  const [theme, setTheme] = useState(getSeasonTheme())
  const [currentSeason, setCurrentSeason] = useState(theme.name)
  const [currentLocation, setCurrentLocation] = useState(null)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const applyTheme = (t) => {
    const root = document.documentElement
    root.style.setProperty("--bg", t.bg)
    root.style.setProperty("--primary", t.primary)
    root.style.setProperty("--secondary", t.secondary)
    root.style.setProperty("--accent", t.accent)
    root.style.setProperty("--text", t.text)
    root.style.setProperty("--subtext", t.subtext)
    root.style.setProperty("--card", t.card)
    root.style.setProperty("--gradient", t.gradient)
    root.style.setProperty("--hero-gradient", t.heroGradient)
  }

  const setLocationTheme = (locationInput) => {
    if (!locationInput || !locationInput.trim()) {
      resetToSeason()
      return
    }

    const loc = locationInput.toLowerCase().trim()
    
    // 1. Direct match on locationKey
    if (locationThemes[loc]) {
      setCurrentLocation(loc)
      setTheme(locationThemes[loc])
      return
    }

    // 2. Exact match on name or state
    const exactMatch = allIndiaLocations.find(l => 
      l.name.toLowerCase() === loc || l.state.toLowerCase() === loc
    )
    if (exactMatch && locationThemes[exactMatch.locationKey]) {
      setCurrentLocation(exactMatch.locationKey)
      setTheme(locationThemes[exactMatch.locationKey])
      return
    }

    // 3. StartsWith match (only if length >= 3 to avoid jumping)
    if (loc.length >= 3) {
      const startsWithMatch = allIndiaLocations.find(l => 
        l.name.toLowerCase().startsWith(loc) || l.state.toLowerCase().startsWith(loc)
      )
      if (startsWithMatch && locationThemes[startsWithMatch.locationKey]) {
        setCurrentLocation(startsWithMatch.locationKey)
        setTheme(locationThemes[startsWithMatch.locationKey])
        return
      }
    }

    // If no match found, revert to season so it doesn't get stuck
    resetToSeason()
  }

  const resetToSeason = () => {
    setCurrentLocation(null)
    setTheme(getSeasonTheme())
  }

  return {
    theme,
    currentSeason,
    currentLocation,
    setLocationTheme,
    resetToSeason,
  }
}