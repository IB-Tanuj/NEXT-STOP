import { useState, useEffect, useRef, useCallback } from "react"

const CARDS = [
  { icon: "💸", title: "Live Budget Split", desc: "Set a number once — we distribute it across stays, rides and food in real time as you choose." },
  { icon: "🛏️", title: "Every Kind of Stay", desc: "Hostel bunk, boutique hotel or luxury suite — live prices for them all, side by side." },
  { icon: "🚆", title: "Trains · Flights · Buses", desc: "Fares that update as they move, so you book at the right second, not the wrong one." },
  { icon: "🧭", title: "Deep Spot Intel", desc: "Entry prices, permits, rules, best time to visit and expert tips — before you commit." },
  { icon: "🗺️", title: "Your Personal Itinerary", desc: "Pick your spots and style; we weave them into a day-by-day plan around your pace." },
  { icon: "🌦️", title: "Season-Aware Picks", desc: "The page changes with India's six seasons — and so do the destinations it recommends." },
]

const COUNT = CARDS.length
const STEP = 360 / COUNT
const SENSITIVITY = 0.42
const AUTOSPIN = 0.045

const FeatureCarousel = () => {
  const stageRef = useRef(null)
  const ringRef = useRef(null)
  const rotRef = useRef(0)
  const velRef = useRef(0)
  const radiusRef = useRef(380)
  const dragRef = useRef({ active: false, moved: 0, lastX: 0, lastT: 0, snapTarget: null })
  const rafRef = useRef(null)
  const [frontIdx, setFrontIdx] = useState(-1)

  const layout = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const w = stage.clientWidth
    radiusRef.current = Math.max(230, Math.min(w * 0.42, 280 * 1.4))
  }, [])

  const render = useCallback(() => {
    const ring = ringRef.current
    if (!ring) return
    const cards = Array.from(ring.children)
    const rotation = rotRef.current
    ring.style.transform = `rotateY(${rotation.toFixed(3)}deg)`

    let front = -1
    cards.forEach((card, i) => {
      const ang = (((i * STEP + rotation) % 360) + 360) % 360
      if (ang < STEP / 2 || ang > 360 - STEP / 2) front = i
      const t = (Math.cos((ang * Math.PI) / 180) + 1) / 2
      const isFront = front === i
      const scale = isFront ? 1.14 : 1
      card.style.opacity = (0.25 + 0.75 * t).toFixed(3)
      card.style.transform = `translate(-50%, -50%) rotateY(${i * STEP}deg) translateZ(${radiusRef.current}px) scale(${scale})`
      card.classList.toggle("is-front", isFront)
    })
    setFrontIdx(front)
  }, [])

  useEffect(() => {
    layout()
    const tick = () => {
      const drag = dragRef.current
      if (!drag.active) {
        if (drag.snapTarget !== null) {
          const diff = drag.snapTarget - rotRef.current
          rotRef.current += diff * 0.14
          if (Math.abs(diff) < 0.05) {
            rotRef.current = drag.snapTarget
            drag.snapTarget = null
            velRef.current = 0
          }
        } else {
          rotRef.current += velRef.current + AUTOSPIN
          velRef.current *= 0.94
          if (Math.abs(velRef.current) < 0.001) velRef.current = 0
        }
      }
      render()
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener("resize", layout)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", layout)
    }
  }, [layout, render])

  const onPointerDown = (e) => {
    const drag = dragRef.current
    drag.active = true
    drag.moved = 0
    drag.lastX = e.clientX
    drag.lastT = performance.now()
    velRef.current = 0
    drag.snapTarget = null
    stageRef.current?.classList.add("dragging")
    stageRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    const drag = dragRef.current
    if (!drag.active) return
    const dx = e.clientX - drag.lastX
    drag.lastX = e.clientX
    drag.moved += Math.abs(dx)
    rotRef.current += dx * SENSITIVITY
    const now = performance.now()
    const dt = Math.max(1, now - drag.lastT)
    velRef.current = Math.max(-18, Math.min(18, ((dx * SENSITIVITY) / dt) * 16))
    drag.lastT = now
  }

  const onPointerUp = (e) => {
    const drag = dragRef.current
    if (!drag.active) return
    drag.active = false
    stageRef.current?.classList.remove("dragging")
    if (drag.moved < 6) {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const card = el?.closest(".feature-card")
      if (card && ringRef.current) {
        const cards = Array.from(ringRef.current.children)
        const idx = cards.indexOf(card)
        if (idx >= 0) {
          let diff = (((idx * STEP - rotRef.current) % 360) + 360) % 360
          if (diff > 180) diff -= 360
          drag.snapTarget = rotRef.current + diff
        }
      }
    }
  }

  return (
    <section className="features" id="features">
      <div className="section-head reveal">
        <p className="eyebrow">Why Next·Stop</p>
        <h2>Built like no other travel site</h2>
        <p className="sub">Grab the wheel and spin — every card up front is what planning here feels like.</p>
      </div>

      <div
        className="carousel"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { dragRef.current.active = false; stageRef.current?.classList.remove("dragging") }}
      >
        <div className="carousel-ring" ref={ringRef}>
          {CARDS.map((card, i) => (
            <article key={i} className={`feature-card${frontIdx === i ? " is-front" : ""}`}>
              <span className="f-icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </article>
          ))}
        </div>
      </div>
      <p className="carousel-hint">Drag to spin · Tap a card to bring it to the front</p>
    </section>
  )
}

export default FeatureCarousel
