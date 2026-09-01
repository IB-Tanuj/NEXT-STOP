import { useRef, useEffect, useState, useCallback } from "react"

const AUDIO_FILES = ["/landing/rain.mp3"]
const LOOP_SECONDS = 40
const FILE_LEVEL = 0.35
const SYNTH_LEVEL = 0.14
const FADE_MS = 1200
const MUTED_KEY = "nextstop-rain-muted"

const RainAudio = ({ enabled = true }) => {
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem(MUTED_KEY) === "1" } catch { return false }
  })
  const audioCtxRef = useRef(null)
  const masterRef = useRef(null)
  const synthRef = useRef(null)
  const fileRef = useRef(null)
  const startedRef = useRef(false)
  const loopStartRef = useRef(0)
  const loopEndRef = useRef(0)
  const fadeIdRef = useRef(null)

  const audioSupported = typeof window !== "undefined" && !!(window.AudioContext || window.webkitAudioContext)

  const ensureCtx = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    const ctx = new AC()
    audioCtxRef.current = ctx
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    masterRef.current = master
    return ctx
  }, [])

  const fadeMasterTo = useCallback((target) => {
    if (!masterRef.current || !audioCtxRef.current) return
    const t = audioCtxRef.current.currentTime
    masterRef.current.gain.cancelScheduledValues(t)
    masterRef.current.gain.setTargetAtTime(target, t, 0.7)
  }, [])

  const fadeFileVolume = useCallback((el, target) => {
    if (!el) return
    if (fadeIdRef.current) cancelAnimationFrame(fadeIdRef.current)
    const from = el.volume
    const t0 = performance.now()
    const tick = (now) => {
      if (!el) return
      const t = Math.min(1, (now - t0) / FADE_MS)
      const ease = t * (2 - t)
      el.volume = Math.min(1, Math.max(0, from + (target - from) * ease))
      fadeIdRef.current = t < 1 ? requestAnimationFrame(tick) : null
    }
    fadeIdRef.current = requestAnimationFrame(tick)
  }, [])

  const buildSynth = useCallback(() => {
    if (synthRef.current) return
    const ctx = ensureCtx()
    if (!ctx) return
    const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
    const data = buf.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0
    for (let i = 0; i < data.length; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99765 * b0 + w * 0.099046
      b1 = 0.963 * b1 + w * 0.2965164
      b2 = 0.57 * b2 + w * 1.0526913
      data[i] = (b0 + b1 + b2 + w * 0.1848) * 0.22
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    noise.loop = true
    const hp = ctx.createBiquadFilter()
    hp.type = "highpass"
    hp.frequency.value = 400
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 5200
    const swell = ctx.createOscillator()
    swell.frequency.value = 0.11
    const swellAmt = ctx.createGain()
    swellAmt.gain.value = 1100
    swell.connect(swellAmt)
    swellAmt.connect(lp.frequency)
    const out = ctx.createGain()
    out.gain.value = 1
    noise.connect(hp)
    hp.connect(lp)
    lp.connect(out)
    out.connect(masterRef.current)
    noise.start()
    swell.start()
    synthRef.current = { noise, swell, out }
  }, [ensureCtx])

  const startAudio = useCallback(() => {
    if (startedRef.current) {
      if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume()
      return
    }
    startedRef.current = true
    const el = fileRef.current
    if (el) {
      const le = loopEndRef.current
      const ls = loopStartRef.current
      if (le && (el.currentTime < ls || el.currentTime >= le - 0.05)) el.currentTime = ls
      el.volume = 0
      el.play().catch(() => {})
      if (!muted) fadeFileVolume(el, FILE_LEVEL)
    } else {
      if (!ensureCtx()) return
      buildSynth()
      if (!muted) fadeMasterTo(SYNTH_LEVEL)
    }
  }, [muted, ensureCtx, buildSynth, fadeMasterTo, fadeFileVolume])

  // Probe for audio file on mount
  useEffect(() => {
    if (!enabled || !audioSupported) return

    const probe = (i) => {
      if (i >= AUDIO_FILES.length) return
      const el = new Audio()
      el.preload = "auto"
      el.loop = false
      el.src = AUDIO_FILES[i]

      el.addEventListener("loadedmetadata", () => {
        if (fileRef.current) return
        fileRef.current = el
        const d = el.duration
        if (isFinite(d) && d) {
          loopEndRef.current = d
          loopStartRef.current = Math.max(0, d - LOOP_SECONDS)
          if (!startedRef.current) el.currentTime = loopStartRef.current
        }
      }, { once: true })

      el.addEventListener("timeupdate", () => {
        const le = loopEndRef.current
        if (le && el.currentTime >= le - 0.05) el.currentTime = loopStartRef.current
      })
      el.addEventListener("ended", () => {
        if (!loopEndRef.current) return
        el.currentTime = loopStartRef.current
        el.play().catch(() => {})
      })
      el.addEventListener("error", () => probe(i + 1), { once: true })
      el.load()
    }
    probe(0)

    return () => {
      if (fileRef.current) { fileRef.current.pause(); fileRef.current = null }
      if (synthRef.current) {
        try { synthRef.current.noise.stop() } catch {}
        try { synthRef.current.swell.stop() } catch {}
        synthRef.current = null
      }
      if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}) }
    }
  }, [enabled, audioSupported])

  // First gesture listener
  useEffect(() => {
    if (!enabled || !audioSupported) return
    const onGesture = () => {
      events.forEach(e => window.removeEventListener(e, onGesture))
      if (!muted) startAudio()
    }
    const events = ["pointerdown", "keydown", "touchstart"]
    events.forEach(e => window.addEventListener(e, onGesture, { passive: true }))
    return () => events.forEach(e => window.removeEventListener(e, onGesture))
  }, [enabled, audioSupported, muted, startAudio])

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    try { localStorage.setItem(MUTED_KEY, next ? "1" : "0") } catch {}
    if (next) {
      // Muting
      if (fileRef.current) {
        fadeFileVolume(fileRef.current, 0)
        setTimeout(() => { if (fileRef.current && !fileRef.current.paused) fileRef.current.pause() }, FADE_MS + 200)
      } else {
        fadeMasterTo(0)
      }
    } else {
      // Unmuting
      startAudio()
      if (fileRef.current) {
        const le = loopEndRef.current
        if (le && fileRef.current.currentTime >= le - 0.05) fileRef.current.currentTime = loopStartRef.current
        if (fileRef.current.paused) fileRef.current.play().catch(() => {})
        fadeFileVolume(fileRef.current, FILE_LEVEL)
      } else {
        fadeMasterTo(SYNTH_LEVEL)
      }
    }
  }

  if (!enabled || !audioSupported) return null

  return (
    <button
      onClick={toggleMute}
      className="rain-sound-toggle"
      type="button"
      aria-pressed={String(muted)}
      aria-label={muted ? "Unmute rain sound" : "Mute rain sound"}
      title={muted ? "Turn rain sound on" : "Turn rain sound off"}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  )
}

export default RainAudio
