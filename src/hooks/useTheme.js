import { useState, useEffect } from "react"
import { getSeasonTheme, themes, locationThemes } from "../themes"

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

  const setLocationTheme = (location) => {
    const loc = location.toLowerCase()
    if (locationThemes[loc]) {
      setCurrentLocation(loc)
      setTheme(locationThemes[loc])
    }
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