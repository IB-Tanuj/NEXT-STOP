import React, { useState, useEffect } from 'react';

const SeatMapUI = ({ tripId, theme }) => {
  const [seatData, setSeatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengerGender, setPassengerGender] = useState('MALE');
  const [bookingMessage, setBookingMessage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/flixbus/seatmap/${encodeURIComponent(tripId)}?availableSeats=15`)
      .then(res => res.json())
      .then(data => { setSeatData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tripId]);

  const handleBook = async () => {
    if (!selectedSeat) return;
    try {
      const res = await fetch('http://localhost:5000/api/flixbus/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, seatNumber: selectedSeat, passengerGender })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setBookingMessage({ type: 'success', text: result.message });
      setSeatData(prev => ({
        ...prev,
        seatMap: prev.seatMap.map(s => s.seat_number === selectedSeat ? { ...s, isBooked: true, passengerGender } : s)
      }));
      setSelectedSeat(null);
    } catch (err) {
      setBookingMessage({ type: 'error', text: err.message });
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{
        width: '40px', height: '40px', margin: '0 auto 16px',
        border: '3px solid rgba(115,214,61,0.2)',
        borderTopColor: '#73D63D',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#888' }}>Loading seat map...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!seatData || !seatData.layoutInfo) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#ff6b6b' }}>Failed to load seat map.</div>
  );

  // Group seats by row
  const rows = [];
  const maxRow = Math.max(...seatData.seatMap.map(s => s.row_index));
  for (let i = 1; i <= maxRow; i++) {
    rows.push(seatData.seatMap.filter(s => s.row_index === i).sort((a, b) => a.col_index - b.col_index));
  }

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      
      {/* ─── The Bus Graphic ─── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        padding: '28px',
        borderRadius: '24px',
        border: '1px solid rgba(115,214,61,0.15)',
        minWidth: '280px',
        flex: '0 0 auto'
      }}>
        {/* Bus front indicator */}
        <div style={{
          textAlign: 'center', marginBottom: '20px',
          padding: '8px 16px', borderRadius: '8px',
          background: 'rgba(115,214,61,0.08)',
          color: '#73D63D', fontSize: '12px', fontWeight: 600,
          letterSpacing: '2px', textTransform: 'uppercase'
        }}>
          🚌 Front of Bus
        </div>
        
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
            {[0, 1, 2, 3, 4].map(colIdx => {
              const seat = row.find(s => s.col_index === colIdx);
              
              if (colIdx === 2 && !seat) {
                return <div key={colIdx} style={{ width: '32px' }} />;
              }
              if (!seat) return null;

              const isAvailable = !seat.isBooked;
              const isSelected = selectedSeat === seat.seat_number;
              const isBed = seat.category?.includes('Bed');
              
              let bgColor = 'rgba(255,255,255,0.08)';
              let borderColor = 'rgba(255,255,255,0.12)';
              
              if (isSelected) {
                bgColor = '#73D63D';
                borderColor = '#fff';
              } else if (!isAvailable) {
                bgColor = seat.passengerGender === 'FEMALE' ? 'rgba(255,107,129,0.5)' : 'rgba(100,100,100,0.5)';
                borderColor = seat.passengerGender === 'FEMALE' ? '#ff6b81' : '#555';
              }

              return (
                <div
                  key={colIdx}
                  onClick={() => isAvailable && setSelectedSeat(seat.seat_number)}
                  style={{
                    width: '42px',
                    height: isBed ? '72px' : '42px',
                    background: bgColor,
                    borderRadius: isBed ? '10px' : '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    opacity: isAvailable ? 1 : 0.7,
                    border: `2px solid ${borderColor}`,
                    color: isSelected ? '#000' : '#ccc',
                    fontSize: '11px', fontWeight: 700,
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  title={isAvailable ? `${seat.category} - ${seat.seat_number}` : `Booked (${seat.passengerGender})`}
                  onMouseEnter={e => {
                    if (isAvailable && !isSelected) {
                      e.currentTarget.style.borderColor = '#73D63D';
                      e.currentTarget.style.background = 'rgba(115,214,61,0.15)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (isAvailable && !isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    }
                  }}
                >
                  {seat.seat_number}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ─── Checkout Sidebar ─── */}
      <div style={{
        flex: 1, minWidth: '280px',
        background: 'rgba(255,255,255,0.03)',
        padding: '28px', borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <h2 style={{ color: '#fff', marginTop: 0, fontSize: '20px' }}>Seat Selection</h2>
        <p style={{ color: '#888', fontSize: '13px' }}>
          <strong>Layout:</strong> {seatData.layoutInfo.name}
        </p>
        
        {/* Legend */}
        <div style={{
          margin: '20px 0', padding: '16px',
          background: 'rgba(0,0,0,0.2)', borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <h4 style={{ color: '#73D63D', margin: '0 0 12px 0', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>Legend</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.12)' }} />
              <span style={{ color: '#ccc' }}>Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', background: '#73D63D', borderRadius: '5px' }} />
              <span style={{ color: '#ccc' }}>Selected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', background: 'rgba(100,100,100,0.5)', borderRadius: '5px', border: '1px solid #555' }} />
              <span style={{ color: '#ccc' }}>Booked (Male)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', background: 'rgba(255,107,129,0.5)', borderRadius: '5px', border: '1px solid #ff6b81' }} />
              <span style={{ color: '#ccc' }}>Booked (Female)</span>
            </div>
          </div>
        </div>

        {selectedSeat ? (
          <div style={{ animation: 'busSlideUp 0.3s ease-out' }}>
            <div style={{
              padding: '16px', borderRadius: '12px',
              background: 'rgba(115,214,61,0.06)',
              border: '1px solid rgba(115,214,61,0.2)',
              marginBottom: '16px'
            }}>
              <h3 style={{ color: '#73D63D', margin: '0 0 4px 0', fontSize: '18px' }}>Seat {selectedSeat}</h3>
              <p style={{ color: '#888', margin: 0, fontSize: '13px' }}>
                {seatData.seatMap.find(s => s.seat_number === selectedSeat)?.category}
              </p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#999', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Passenger Gender
              </label>
              <select
                value={passengerGender}
                onChange={e => setPassengerGender(e.target.value)}
                style={{
                  width: '100%', padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', borderRadius: '10px',
                  fontSize: '14px', outline: 'none'
                }}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <button
              onClick={handleBook}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #73D63D, #4CAF50)',
                color: '#fff', border: 'none',
                padding: '14px', borderRadius: '12px',
                fontSize: '15px', fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(115,214,61,0.25)',
                transition: 'all 0.2s'
              }}
            >
              ✅ Confirm Booking
            </button>
          </div>
        ) : (
          <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>
            Click an available seat to continue
          </p>
        )}

        {bookingMessage && (
          <div style={{
            marginTop: '16px', padding: '14px', borderRadius: '10px',
            background: bookingMessage.type === 'error' ? 'rgba(255,60,60,0.1)' : 'rgba(115,214,61,0.1)',
            color: bookingMessage.type === 'error' ? '#ff6b6b' : '#73D63D',
            border: `1px solid ${bookingMessage.type === 'error' ? 'rgba(255,60,60,0.3)' : 'rgba(115,214,61,0.3)'}`,
            fontSize: '14px'
          }}>
            {bookingMessage.text}
          </div>
        )}
      </div>

      <style>{`
        @keyframes busSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SeatMapUI;
