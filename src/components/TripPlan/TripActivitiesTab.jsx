import { useState } from "react"
import { card, sectionLabel, comingSoon } from "./SharedUI"

export const TripActivitiesTab = ({ theme, locationName, aiLoading, aiData }) => {
  const [liveData, setLiveData] = useState({}) // { "activity_ScubaDiving": { loading, data, error } }

  const fetchLivePrice = async (type, name, extraBody = {}) => {
    const key = `${type}_${name.replace(/\s+/g, '_')}`
    setLiveData(prev => ({ ...prev, [key]: { loading: true, data: null, error: null } }))
    try {
      const endpoints = {
        activity: '/api/live/activity-price',
        restaurant: '/api/live/verify-restaurant',
        stay: '/api/live/stay-price',
      }
      const bodyKeys = {
        activity: { activityName: name, location: locationName },
        restaurant: { restaurantName: name, location: locationName },
        stay: { stayName: name, location: locationName, ...extraBody },
      }
      const response = await fetch(endpoints[type], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyKeys[type]),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setLiveData(prev => ({ ...prev, [key]: { loading: false, data, error: null } }))
    } catch (err) {
      setLiveData(prev => ({ ...prev, [key]: { loading: false, data: null, error: err.message } }))
    }
  }

  const LiveButton = ({ type, name, extraBody = {} }) => {
    const key = `${type}_${name.replace(/\s+/g, '_')}`
    const state = liveData[key]
    const labels = { activity: '🔍 Get Live Price', restaurant: '✅ Verify', stay: '🔍 Check Price' }

    if (state?.loading) {
      return (
        <div style={{ color: theme.subtext, fontSize: '11px', marginTop: '6px', animation: 'pulse 1.5s infinite' }}>
          ⏳ Fetching live data...
        </div>
      )
    }
    if (state?.data) {
      const d = state.data
      return (
        <div style={{
          marginTop: '8px', padding: '8px 12px', borderRadius: '8px',
          background: `${theme.primary}15`, border: `1px solid ${theme.primary}33`,
        }}>
          <div style={{ color: '#A8E6CF', fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>✅ Live Data (verified from web)</div>
          {type === 'activity' && <>
            {d.livePrice && <div style={{ color: theme.text, fontSize: '12px' }}>💰 Price: <strong>{d.livePrice}</strong></div>}
            {d.timing && <div style={{ color: theme.subtext, fontSize: '11px' }}>🕐 {d.timing}</div>}
            {d.duration && <div style={{ color: theme.subtext, fontSize: '11px' }}>⏱️ {d.duration}</div>}
          </>}
          {type === 'restaurant' && <>
            <div style={{ color: theme.text, fontSize: '12px' }}>{d.exists !== false ? '✅ Exists' : '❌ Not found'}{d.status ? ` · ${d.status}` : ''}</div>
            {d.rating && <div style={{ color: theme.subtext, fontSize: '11px' }}>⭐ {d.rating}</div>}
            {d.cuisine && <div style={{ color: theme.subtext, fontSize: '11px' }}>🍽️ {d.cuisine}</div>}
            {d.priceRange && <div style={{ color: theme.subtext, fontSize: '11px' }}>💰 {d.priceRange}</div>}
          </>}
          {type === 'stay' && <>
            {d.currentPrice && <div style={{ color: theme.text, fontSize: '12px' }}>💰 Live: <strong>{d.currentPrice}</strong></div>}
            {d.rating && <div style={{ color: theme.subtext, fontSize: '11px' }}>⭐ {d.rating}</div>}
          </>}
        </div>
      )
    }
    if (state?.error) {
      return (
        <div style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '6px' }}>
          ⚠️ Could not fetch live data
          <span
            onClick={(e) => { e.stopPropagation(); fetchLivePrice(type, name, extraBody) }}
            style={{ color: theme.primary, cursor: 'pointer', marginLeft: '8px' }}
          >Retry</span>
        </div>
      )
    }
    return (
      <div
        onClick={(e) => { e.stopPropagation(); fetchLivePrice(type, name, extraBody) }}
        style={{
          marginTop: '6px', display: 'inline-block',
          padding: '4px 12px', borderRadius: '20px',
          border: `1px solid ${theme.primary}66`,
          color: theme.primary, fontSize: '11px', fontWeight: '700',
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${theme.primary}22` }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        {labels[type]}
      </div>
    )
  }

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {card(theme, <>
        {sectionLabel(theme, `🎯 ACTIVITIES IN ${locationName.toUpperCase()}`)}
        <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "16px" }}>
          Popular activities — tap "Get Live Price" for real pricing
        </div>
        {aiLoading ? (
          <div style={{ color: theme.subtext, textAlign: "center", padding: "20px" }}>
            🤖 AI is finding activities...
          </div>
        ) : aiData?.activities?.length > 0 ? (
          aiData.activities.map((activity, i) => (
            <div
              key={i}
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                marginBottom: "8px",
                border: `1px solid ${theme.primary}33`,
              }}>
              <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>
                {activity.name}
              </div>
              <div style={{ color: theme.subtext, fontSize: "12px" }}>{activity.description}</div>
              {activity.bestTime && (
                <div style={{ color: theme.subtext, fontSize: "11px", marginTop: "4px" }}>
                  Best time: {activity.bestTime}
                </div>
              )}
              <LiveButton type="activity" name={activity.name} />
            </div>
          ))
        ) : comingSoon(theme, `Activities for ${locationName}`)}
      </>)}

      {card(theme, <>
        {sectionLabel(theme, `🎉 FESTIVALS & EVENTS IN ${locationName.toUpperCase()}`)}
        <div style={{ color: theme.subtext, fontSize: "13px", marginBottom: "16px" }}>
          Upcoming festivals — tap "Get Live Data" for details
        </div>
        {aiLoading ? (
          <div style={{ color: theme.subtext, textAlign: "center", padding: "20px" }}>
            🤖 AI is finding festivals...
          </div>
        ) : aiData?.festivals?.length > 0 ? (
          aiData.festivals.map((festival, i) => (
            <div
              key={i}
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                marginBottom: "8px",
                border: `1px solid ${theme.primary}33`,
              }}>
              <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>
                {festival.name}
              </div>
              <div style={{ color: theme.subtext, fontSize: "12px", marginBottom: "2px" }}>{festival.description}</div>
              <div style={{ color: theme.subtext, fontSize: "11px" }}>📅 {festival.date}</div>
              <LiveButton type="activity" name={festival.name} />
            </div>
          ))
        ) : comingSoon(theme, `Festivals for ${locationName}`)}
      </>)}
    </div>
  )
}
