import { useState, useEffect, useRef, useCallback } from "react"
import { getSeasonTheme, themes, locationThemes } from "../themes"
import { allIndiaLocations } from "../data/allLocations"

export const useTheme = () => {
  const [theme, setTheme] = useState(getSeasonTheme())
  const [currentSeason, setCurrentSeason] = useState(theme.name)
  const [currentLocation, setCurrentLocation] = useState(null)
  // Pending theme for transition coordination
  const pendingThemeRef = useRef(null)
  const pendingLocationRef = useRef(null)

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

  /**
   * Resolve a location input to a theme. Returns the matched theme object
   * and locationKey, or null if no exact match found.
   * Only matches on exact full name — no partial/startsWith matching.
   */
  const resolveLocationTheme = useCallback((locationInput) => {
    if (!locationInput || !locationInput.trim()) return null

    const loc = locationInput.toLowerCase().trim()
    
    // 1. Direct match on locationKey
    if (locationThemes[loc]) {
      return { theme: locationThemes[loc], locationKey: loc }
    }

    // 2. Exact match on name or state
    const exactMatch = allIndiaLocations.find(l => 
      l.name.toLowerCase() === loc || l.state.toLowerCase() === loc
    )
    if (exactMatch && locationThemes[exactMatch.locationKey]) {
      return { theme: locationThemes[exactMatch.locationKey], locationKey: exactMatch.locationKey }
    }

    return null
  }, [])

  /**
   * Set theme directly (immediate, no transition).
   * Used for non-hero contexts (URL-based, sidebar, etc.)
   */
  const setLocationTheme = useCallback((locationInput) => {
    if (!locationInput || !locationInput.trim()) {
      resetToSeason()
      return false
    }

    const resolved = resolveLocationTheme(locationInput)
    if (resolved) {
      setCurrentLocation(resolved.locationKey)
      setTheme(resolved.theme)
      return true
    }

    // If no exact match found, revert to season so it doesn't get stuck
    resetToSeason()
    return false
  }, [resolveLocationTheme])

  /**
   * Prepare a theme change for transition coordination.
   * Stores the pending theme without applying it.
   * Returns true if a valid match was found (caller should fire transition).
   */
  const prepareThemeChange = useCallback((locationInput) => {
    const resolved = resolveLocationTheme(locationInput)
    if (resolved) {
      pendingThemeRef.current = resolved.theme
      pendingLocationRef.current = resolved.locationKey
      return true
    }
    pendingThemeRef.current = null
    pendingLocationRef.current = null
    return false
  }, [resolveLocationTheme])

  /**
   * Commit the pending theme change (called at transition midpoint).
   */
  const commitPendingTheme = useCallback(() => {
    if (pendingThemeRef.current) {
      setCurrentLocation(pendingLocationRef.current)
      setTheme(pendingThemeRef.current)
      pendingThemeRef.current = null
      pendingLocationRef.current = null
    }
  }, [])

  const resetToSeason = useCallback(() => {
    setCurrentLocation(null)
    pendingThemeRef.current = null
    pendingLocationRef.current = null
    setTheme(getSeasonTheme())
  }, [])

  return {
    theme,
    currentSeason,
    currentLocation,
    setLocationTheme,
    resolveLocationTheme,
    prepareThemeChange,
    commitPendingTheme,
    resetToSeason,
  }
}