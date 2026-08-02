import React, { useState, useEffect } from 'react';

const SeatMapUI = ({ tripId, theme }) => {
  const [seatData, setSeatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengerGender, setPassengerGender] = useState('MALE'); // Default for booking
  const [bookingMessage, setBookingMessage] = useState(null);

  useEffect(() => {
    // Assuming the frontend doesn't know the exact available seats without passing it, 
    // for this MVP we'll just mock 15 available seats in the query to trigger the block engine.
    fetch(`http://localhost:5000/api/flixbus/seatmap/${encodeURIComponent(tripId)}?availableSeats=15`)
      .then(res => res.json())
      .then(data => {
        setSeatData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [tripId]);

  const handleBook = async () => {
    if (!selectedSeat) return;
    
    try {
      const res = await fetch('http://localhost:5000/api/flixbus/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId,
          seatNumber: selectedSeat,
          passengerGender
        })
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error);
      
      setBookingMessage({ type: 'success', text: result.message });
      // Update local state to show it booked
      setSeatData(prev => ({
        ...prev,
        seatMap: prev.seatMap.map(s => s.seat_number === selectedSeat ? { ...s, isBooked: true, passengerGender } : s)
      }));
      setSelectedSeat(null);
    } catch (err) {
      setBookingMessage({ type: 'error', text: err.message });
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading Live Seat Map...</div>;
  if (!seatData || !seatData.layoutInfo) return <div style={{ color: 'red' }}>Failed to load seat map.</div>;

  // Group seats by row for rendering
  const rows = [];
  const maxRow = Math.max(...seatData.seatMap.map(s => s.row_index));
  for (let i = 1; i <= maxRow; i++) {
    rows.push(seatData.seatMap.filter(s => s.row_index === i).sort((a, b) => a.col_index - b.col_index));
  }

  return (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
      
      {/* The Bus Graphic */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '30px',
        borderRadius: '40px',
        border: `2px solid ${theme.primary}55`,
        minWidth: '300px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#888' }}>Front of Bus</div>
        
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
            {/* We assume a max of 5 columns (0,1, 2(aisle), 3,4) for semi-sleeper, or (0, 2,3) for sleeper */}
            {[0, 1, 2, 3, 4].map(colIdx => {
              const seat = row.find(s => s.col_index === colIdx);
              
              if (colIdx === 2 && !seat) {
                // Aisle space
                return <div key={colIdx} style={{ width: '40px' }} />;
              }
              
              if (!seat) return null;

              const isAvailable = !seat.isBooked;
              const isSelected = selectedSeat === seat.seat_number;
              
              let bgColor = '#333';
              if (isSelected) bgColor = theme.primary;
              else if (!isAvailable) bgColor = seat.passengerGender === 'FEMALE' ? '#ff6b81' : '#57606f'; // Pink for female, grey for male

              return (
                <div 
                  key={colIdx}
                  onClick={() => isAvailable && setSelectedSeat(seat.seat_number)}
                  style={{
                    width: '45px',
                    height: seat.category.includes('Bed') ? '80px' : '45px', // Beds are longer
                    background: bgColor,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    opacity: isAvailable ? 1 : 0.6,
                    border: isSelected ? `2px solid #fff` : `1px solid rgba(255,255,255,0.1)`,
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  title={isAvailable ? `${seat.category} - ${seat.seat_number}` : `Booked (${seat.passengerGender})`}
                >
                  {seat.seat_number}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Checkout Sidebar */}
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '20px' }}>
        <h2 style={{ color: '#fff', marginTop: 0 }}>Seat Selection</h2>
        <p><strong>Layout:</strong> {seatData.layoutInfo.name}</p>
        
        <div style={{ margin: '20px 0', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
          <h3 style={{ color: theme.primary, margin: '0 0 10px 0' }}>Legend & Gender Rules</h3>
          <div style={{ display: 'flex', gap: '15px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '15px', height: '15px', background: '#333', borderRadius: '3px' }}></div> Available
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '15px', height: '15px', background: '#57606f', borderRadius: '3px' }}></div> Taken (Male)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '15px', height: '15px', background: '#ff6b81', borderRadius: '3px' }}></div> Taken (Female)
            </div>
          </div>
        </div>

        {selectedSeat ? (
          <div>
            <h3 style={{ color: '#fff' }}>Selected Seat: {selectedSeat}</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: theme.subtext }}>Passenger Gender (For Rules)</label>
              <select 
                value={passengerGender} 
                onChange={e => setPassengerGender(e.target.value)}
                style={{
                  width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px'
                }}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <button 
              onClick={handleBook}
              style={{
                width: '100%', background: theme.primary, color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              Confirm Booking
            </button>
          </div>
        ) : (
          <p style={{ color: theme.subtext }}>Click an available seat on the map to continue.</p>
        )}

        {bookingMessage && (
          <div style={{
            marginTop: '20px', padding: '15px', borderRadius: '8px',
            background: bookingMessage.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)',
            color: bookingMessage.type === 'error' ? '#ff6b81' : '#7bed9f',
            border: `1px solid ${bookingMessage.type === 'error' ? '#ff6b81' : '#7bed9f'}`
          }}>
            {bookingMessage.text}
          </div>
        )}
      </div>

    </div>
  );
};

export default SeatMapUI;
