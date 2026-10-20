import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const SeasonNavButtons = ({ currentSeason }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isMonsoon = currentSeason === 'monsoon' || location.pathname === '/monsoon' || location.pathname === '/classic'
  const isSharad = currentSeason === 'sharad' || (!isMonsoon && (location.pathname === '/' || location.pathname === '/sharad'))

  const handleMonsoonClick = () => {
    if (isMonsoon) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/monsoon')
      window.scrollTo(0, 0)
    }
  }

  const handleSharadClick = () => {
    if (isSharad) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
      window.scrollTo(0, 0)
    }
  }

  return (
    <div className="season-nav-group" role="group" aria-label="Seasonal page views">
      <button
        type="button"
        id="btn-season-monsoon"
        className={`season-nav-btn season-btn-monsoon ${isMonsoon ? 'active' : ''}`}
        onClick={handleMonsoonClick}
        aria-current={isMonsoon ? 'page' : undefined}
        title={isMonsoon ? 'Currently viewing Varsha page' : 'Shift to Varsha page'}
      >
        <span className="season-btn-icon" aria-hidden="true">🌧️</span>
        <span className="season-btn-label">Varsha</span>
        {isMonsoon && <span className="season-btn-dot" aria-hidden="true" />}
      </button>

      <button
        type="button"
        id="btn-season-sharad"
        className={`season-nav-btn season-btn-sharad ${isSharad ? 'active' : ''}`}
        onClick={handleSharadClick}
        aria-current={isSharad ? 'page' : undefined}
        title={isSharad ? 'Currently viewing Sharad page' : 'Shift to Sharad page'}
      >
        <span className="season-btn-icon" aria-hidden="true">🍁</span>
        <span className="season-btn-label">Sharad</span>
        {isSharad && <span className="season-btn-dot" aria-hidden="true" />}
      </button>
    </div>
  )
}

export default SeasonNavButtons
