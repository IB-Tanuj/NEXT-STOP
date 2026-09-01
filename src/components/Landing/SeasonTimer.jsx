import { useState, useEffect } from "react"

// Indian 6-Season (Ritu) System
const SEASONS = [
  { name: "Shishir", emoji: "☃️", month: 0, day: 15 },
  { name: "Vasant",  emoji: "🌸", month: 2, day: 15 },
  { name: "Grishma", emoji: "☀️", month: 4, day: 15 },
  { name: "Varsha",  emoji: "🌧️", month: 6, day: 15 },
  { name: "Sharad",  emoji: "🍁", month: 8, day: 15 },
  { name: "Hemant",  emoji: "❄️", month: 10, day: 15 },
]

function seasonStart(year, s) {
  return new Date(year, s.month, s.day, 0, 0, 0)
}

function getSeasonInfo(now) {
  const year = now.getFullYear()
  const starts = []
  for (let y = year - 1; y <= year + 1; y++) {
    SEASONS.forEach((s, i) => starts.push({ idx: i, at: seasonStart(y, s), s }))
  }
  starts.sort((a, b) => a.at - b.at)
  let current = null, next = null
  for (let i = 0; i < starts.length; i++) {
    if (starts[i].at <= now) {
      current = starts[i]
      next = starts[i + 1] || null
    }
  }
  if (!current) { current = starts[0]; next = starts[1] || null }
  if (!next) {
    next = { ...current, at: new Date(current.at.getFullYear() + 1, current.at.getMonth(), current.at.getDate()) }
  }
  return { current, next }
}

function pad(n) {
  return String(n).padStart(2, "0")
}

const useSeasonTimer = () => {
  const [time, setTime] = useState({ days: "00", hours: "00", mins: "00", secs: "00" })
  const [seasonInfo, setSeasonInfo] = useState(() => {
    const info = getSeasonInfo(new Date())
    return {
      currentEmoji: info.current.s.emoji,
      currentName: info.current.s.name,
      nextName: info.next.s.name,
      nextEmoji: info.next.s.emoji,
    }
  })

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const { current, next } = getSeasonInfo(now)
      const diff = Math.max(0, next.at - now)

      setTime({
        days: pad(Math.floor(diff / 86400000)),
        hours: pad(Math.floor((diff % 86400000) / 3600000)),
        mins: pad(Math.floor((diff % 3600000) / 60000)),
        secs: pad(Math.floor((diff % 60000) / 1000)),
      })

      setSeasonInfo({
        currentEmoji: current.s.emoji,
        currentName: current.s.name,
        nextName: next.s.name,
        nextEmoji: next.s.emoji,
      })
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return {
    timerCard: (
      <div className="timer-card" role="timer" aria-live="polite">
        <p className="timer-label">
          Season shifts to <span id="nextSeasonName">{seasonInfo.nextName} {seasonInfo.nextEmoji}</span> in
        </p>
        <div className="timer-grid">
          <div className="time-box"><span>00</span><small>days</small></div>
          <span className="colon">:</span>
          <div className="time-box"><span>00</span><small>hours</small></div>
          <span className="colon">:</span>
          <div className="time-box"><span>00</span><small>minutes</small></div>
          <span className="colon">:</span>
          <div className="time-box"><span>00</span><small>seconds</small></div>
        </div>
        <p className="timer-note">Catch the {seasonInfo.currentName.toLowerCase()} vibe before the timer hits zero.</p>
      </div>
    ),
    seasonBadge: `${seasonInfo.currentEmoji} ${seasonInfo.currentName}`,
    seasonEmoji: seasonInfo.currentEmoji,
    seasonName: seasonInfo.currentName,
  }
}

export default useSeasonTimer
