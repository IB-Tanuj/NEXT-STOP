import React, { useState } from 'react';
import SeatMapUI from './SeatMapUI';

const BusLoversPage = ({ theme, onClose }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTrips([]);

    try {
      const response = await fetch('http://localhost:5000/api/flixbus/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: origin, to: destination, date })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to find buses');
      
      if (!data.trips || data.trips.length === 0) {
        setError('No direct buses found for this date. Try another date!');
      } else {
        setTrips(data.trips);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: `${theme.bg}FA`,
      backdropFilter: 'blur(20px)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      color: theme.subtext,
      overflowY: 'auto'
    }}>
      <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: theme.primary, margin: 0, fontSize: '28px', letterSpacing: '2px' }}>FLIXBUS INDIA</h2>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: theme.subtext, fontSize: '30px', cursor: 'pointer'
        }}>×</button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', width: '100%' }}>
        {/* Search Form */}
        {!selectedTripId && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '40px',
            borderRadius: '20px',
            border: `1px solid ${theme.primary}33`,
            boxShadow: `0 20px 40px rgba(0,0,0,0.2)`
          }}>
            <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>Where are you heading?</h1>
            
            <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '20px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: theme.subtext }}>Origin (e.g., Delhi)</label>
                <input required value={origin} onChange={e => setOrigin(e.target.value)} style={inputStyle(theme)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: theme.subtext }}>Destination (e.g., Manali)</label>
                <input required value={destination} onChange={e => setDestination(e.target.value)} style={inputStyle(theme)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: theme.subtext }}>Date</label>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} style={inputStyle(theme)} />
              </div>
              <button type="submit" disabled={loading} style={{
                background: theme.primary,
                color: '#fff',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                height: '52px'
              }}>
                {loading ? 'Searching...' : 'Search Buses'}
              </button>
            </form>

            {error && <div style={{ color: '#ff4444', marginTop: '20px', textAlign: 'center' }}>{error}</div>}
          </div>
        )}

        {/* Trip Results */}
        {!selectedTripId && trips.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>Available Buses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {trips.map(trip => (
                <div key={trip.id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '20px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: `1px solid rgba(255,255,255,0.1)`
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '20px' }}>
                      {new Date(trip.departure?.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                      {' -> '} 
                      {new Date(trip.arrival?.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px' }}>{trip.duration?.hours}h {trip.duration?.minutes}m • {trip.availability?.seats} seats left</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: theme.primary, fontSize: '24px' }}>₹{trip.price?.total}</h3>
                    <button 
                      onClick={() => setSelectedTripId(trip.id)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${theme.primary}`,
                        color: theme.primary,
                        padding: '8px 20px',
                        borderRadius: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      View Seats
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seat Map View */}
        {selectedTripId && (
          <div>
             <button 
                onClick={() => setSelectedTripId(null)}
                style={{ background: 'none', border: 'none', color: theme.subtext, cursor: 'pointer', marginBottom: '20px', fontSize: '16px' }}
             >
               ← Back to search results
             </button>
             <SeatMapUI tripId={selectedTripId} theme={theme} />
          </div>
        )}

      </div>
    </div>
  );
};

const inputStyle = (theme) => ({
  width: '100%',
  padding: '14px',
  background: 'rgba(0,0,0,0.2)',
  border: `1px solid rgba(255,255,255,0.1)`,
  borderRadius: '12px',
  color: '#fff',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box'
});

export default BusLoversPage;
