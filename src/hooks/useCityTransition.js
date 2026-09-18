import { useRef, useCallback, useMemo } from 'react'
import { usePageTransition } from 'motion-organic/react'

/**
 * Pool of cinema-grade transitions suited for city color changes.
 * Each entry has a name and default options that make it look great
 * as a fullscreen color-switch overlay.
 */
const TRANSITION_POOL = [
  { name: 'organic-blob', opts: { points: 12, wobble: 0.6, preset: 'liquid' } },
  { name: 'liquid-blob', opts: { points: 10, wobble: 0.5, preset: 'liquid' } },
  { name: 'aperture-iris', opts: { blades: 9, preset: 'snappy' } },
  { name: 'chromatic-fluid', opts: { distortion: 0.8, preset: 'cinematic' } },
  { name: 'metaball-merge', opts: { count: 6, preset: 'liquid' } },
  { name: 'noise-dissolve', opts: { grainScale: 3, preset: 'cinematic' } },
  { name: 'oscar-bubble', opts: { points: 10, wobble: 0.5, preset: 'liquid' } },
  { name: 'concentric-halo', opts: { rings: 5, preset: 'gentle' } },
  { name: 'pixel-dissolve', opts: { gridSize: 12, scatter: 40, preset: 'snappy' } },
  { name: 'rack-focus', opts: { blur: 20, preset: 'cinematic' } },
]

/**
 * useCityTransition — Picks a random cinema-grade transition each time
 * and fires it to visually bridge city color theme changes.
 * 
 * @returns {{ fireTransition: (onCovered: () => void) => Promise<void>, isAnimating: boolean }}
 */
export function useCityTransition() {
  const lastIndexRef = useRef(-1)
  const currentTransitionRef = useRef(TRANSITION_POOL[0].name)
  const currentOptsRef = useRef(TRANSITION_POOL[0].opts)

  // Pick next random transition (never same twice in a row)
  const pickNext = useCallback(() => {
    let idx
    do {
      idx = Math.floor(Math.random() * TRANSITION_POOL.length)
    } while (idx === lastIndexRef.current && TRANSITION_POOL.length > 1)
    
    lastIndexRef.current = idx
    const picked = TRANSITION_POOL[idx]
    currentTransitionRef.current = picked.name
    currentOptsRef.current = picked.opts
    return picked
  }, [])

  // We initialize with the first transition, but swap before each fire
  const { trigger, isAnimating } = usePageTransition(
    currentTransitionRef.current,
    currentOptsRef.current
  )

  /**
   * Fire a random transition effect. The `onCovered` callback is called
   * at the midpoint when the overlay fully covers the screen — this is
   * when you should swap the theme colors.
   */
  const fireTransition = useCallback(async (onCovered) => {
    if (isAnimating) return

    // Pick a new random transition for next time
    pickNext()

    try {
      // trigger(event, onCoveredCallback)
      // We pass null for event since this isn't click-positioned
      await trigger(null, () => {
        if (onCovered) onCovered()
      })
    } catch (err) {
      // If transition fails for any reason, still apply the theme change
      console.warn('City transition effect failed, applying theme directly:', err)
      if (onCovered) onCovered()
    }
  }, [trigger, isAnimating, pickNext])

  return {
    fireTransition,
    isAnimating,
  }
}
