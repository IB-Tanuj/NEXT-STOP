import React, { useState } from "react"
import { locationData } from "../data/locationData"
import BudgetResult from "./BudgetResult"
import { useNavigate } from "react-router-dom"

const DevAdminPage = ({ theme, setLocationTheme }) => {
  const navigate = useNavigate()
  const [showResult, setShowResult] = useState(false)
  const [mockApi, setMockApi] = useState(false)

  const [formData, setFormData] = useState({
    locationKey: "goa",
    leavingFrom: "New Delhi",
    budget: 20000,
    budgetType: "solo",
    groupSize: 1,
    days: 3,
    transport: "train",
    stayType: "budget",
    foodPref: "mix"
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "budget" || name === "groupSize" || name === "days" ? Number(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Set global theme to match the tested location
    setLocationTheme(formData.locationKey)

    // Set mock toggle in session storage for components to read
    if (mockApi) {
      sessionStorage.setItem('DEV_MOCK_API', 'true')
    } else {
      sessionStorage.removeItem('DEV_MOCK_API')
    }
    
    setShowResult(true)
  }

  if (showResult) {
    const locObj = locationData[formData.locationKey]
    if (!locObj) {
      return <div style={{color:'red', padding:'20px'}}>Error: Location '{formData.locationKey}' not found in data.</div>
    }

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 3000, background: theme.bg, overflowY: "auto" }}>
        <BudgetResult
          location={locObj}
          theme={theme}
          planData={{
            leavingFrom: formData.leavingFrom,
            originCity: formData.leavingFrom,
            originCoords: { lat: 28.6139, lng: 77.2090 }, // Mock Delhi coords
            budget: formData.budget,
            budgetType: formData.budgetType,
            groupSize: formData.groupSize
          }}
          preferences={{
            stayType: formData.stayType,
            transport: formData.transport,
            days: formData.days,
            foodPref: formData.foodPref
          }}
          onBack={() => setShowResult(false)}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: "40px", color: theme.text, background: theme.bg, minHeight: "100vh" }}>
      <h1 style={{ color: theme.primary, marginBottom: "20px" }}>Admin Dev Mode 🛠️</h1>
      <p style={{ marginBottom: "30px", color: theme.subtext }}>
        Use this page to bypass the 5-step trip wizard and jump straight to the results.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px", maxWidth: "500px" }}>
        
        <label>
          <strong>Destination Key (from locationData):</strong>
          <input 
            type="text" name="locationKey" value={formData.locationKey} onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "8px" }} 
          />
        </label>
        
        <label>
          <strong>Leaving From (Origin):</strong>
          <input 
            type="text" name="leavingFrom" value={formData.leavingFrom} onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "8px" }} 
          />
        </label>

        <div style={{ display: "flex", gap: "20px" }}>
          <label style={{ flex: 1 }}>
            <strong>Budget (₹):</strong>
            <input 
              type="number" name="budget" value={formData.budget} onChange={handleChange}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "8px" }} 
            />
          </label>
          <label style={{ flex: 1 }}>
            <strong>Days:</strong>
            <input 
              type="number" name="days" value={formData.days} onChange={handleChange}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "8px" }} 
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <label style={{ flex: 1 }}>
            <strong>Budget Type:</strong>
            <select name="budgetType" value={formData.budgetType} onChange={handleChange}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "8px" }}>
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="group">Group</option>
            </select>
          </label>
          <label style={{ flex: 1 }}>
            <strong>Group Size:</strong>
            <input 
              type="number" name="groupSize" value={formData.groupSize} onChange={handleChange}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "8px" }} 
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <label style={{ flex: 1 }}>
            <strong>Transport:</strong>
            <select name="transport" value={formData.transport} onChange={handleChange}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "8px" }}>
              <option value="train">Train</option>
              <option value="flight">Flight</option>
              <option value="bus">Bus</option>
              <option value="personal">Personal Vehicle</option>
            </select>
          </label>
          <label style={{ flex: 1 }}>
            <strong>Stay Type:</strong>
            <select name="stayType" value={formData.stayType} onChange={handleChange}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "8px" }}>
              <option value="hostel">Hostel</option>
              <option value="budget">Budget</option>
              <option value="mid">Mid-Range</option>
              <option value="luxury">Luxury</option>
            </select>
          </label>
        </div>

        <div style={{ background: "rgba(255,100,100,0.1)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255,100,100,0.3)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input 
              type="checkbox" 
              checked={mockApi} 
              onChange={(e) => setMockApi(e.target.checked)} 
              style={{ width: "20px", height: "20px" }}
            />
            <strong>Use Mock API Data (Save API Quota)</strong>
          </label>
          <p style={{ margin: "5px 0 0 30px", fontSize: "12px", color: theme.subtext }}>
            When checked, Expensive APIs (Hotels, Trains) will return dummy data instead of making real RapidAPI requests. AI (TinyFish) will still run normally.
          </p>
        </div>

        <button 
          type="submit" 
          style={{
            background: theme.primary, color: "white", padding: "15px", borderRadius: "8px",
            border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginTop: "10px"
          }}>
          SIMULATE RESULTS →
        </button>
        <button 
          type="button" 
          onClick={() => navigate('/')}
          style={{
            background: "transparent", color: theme.text, padding: "15px", borderRadius: "8px",
            border: `2px solid ${theme.primary}55`, fontWeight: "bold", fontSize: "16px", cursor: "pointer"
          }}>
          Back to Home
        </button>
      </form>
    </div>
  )
}

export default DevAdminPage
