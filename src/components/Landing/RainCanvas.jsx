import { useRef, useEffect } from "react"

const DROP_COUNT = 170

function spawnDrop(vw, vh, fromTop) {
  const depth = Math.random()
  return {
    x: Math.random() * vw,
    y: fromTop ? Math.random() * -vh : Math.random() * vh,
    len: 9 + depth * 24,
    spd: 5.5 + depth * 11,
    alpha: 0.08 + depth * 0.28,
    wgt: 0.8 + depth * 1.4,
  }
}

const RainCanvas = ({ enabled = true }) => {
  const canvasRef = useRef(null)
  const dropsRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5)
    let vw = window.innerWidth
    let vh = window.innerHeight

    const resize = () => {
      vw = window.innerWidth
      vh = window.innerHeight
      canvas.width = Math.round(vw * DPR)
      canvas.height = Math.round(vh * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    resize()

    // Initialize drops
    dropsRef.current = []
    for (let i = 0; i < DROP_COUNT; i++) {
      dropsRef.current.push(spawnDrop(vw, vh, false))
    }

    const step = () => {
      ctx.clearRect(0, 0, vw, vh)
      ctx.lineCap = "round"
      const drops = dropsRef.current
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]
        ctx.beginPath()
        ctx.lineWidth = d.wgt
        ctx.strokeStyle = `rgba(188, 232, 224, ${d.alpha})`
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - d.len * 0.06, d.y + d.len)
        ctx.stroke()
        d.y += d.spd
        if (d.y - d.len > vh) drops[i] = spawnDrop(vw, vh, true)
      }
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    window.addEventListener("resize", resize)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  )
}

export default RainCanvas
