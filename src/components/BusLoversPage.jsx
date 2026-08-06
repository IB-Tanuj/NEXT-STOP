import React, { useState, useEffect, useRef } from 'react';
import SeatMapUI from './SeatMapUI';

const BACKEND = 'http://localhost:5000/api/flixbus';
const EUR_TO_INR = 92; // Approximate conversion

const BusLoversPage = ({ theme, onClose }) => {
  // Data states
  const [allCities, setAllCities] = useState([]);
  const [reachableCities, setReachableCities] = useState([]);
  const [trips, setTrips] = useState([]);

  // Selection states
  const [origin, setOrigin] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDest, setSelectedDest] = useState(null);
  const [date, setDate] = useState('');
  const [selectedTripId, setSelectedTripId] = useState(null);

  // UI states
  const [showDropdown, setShowDropdown] = useState(false);
  const [destSearch, setDestSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [reachableLoading, setReachableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextAvailableDate, setNextAvailableDate] = useState(null);
  const [noTripsIn7Days, setNoTripsIn7Days] = useState(false);
  const [monthSearching, setMonthSearching] = useState(false);
  const [monthDate, setMonthDate] = useState(null);
  const [noTripsThisMonth, setNoTripsThisMonth] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Step tracker for the flow
  const step = selectedTripId ? 'seatmap'
    : trips.length > 0 ? 'results'
    : selectedDest ? 'search'
    : selectedOrigin ? 'destination'
    : 'origin';

  // ─── Fetch all cities on mount ───
  useEffect(() => {
    fetch(`${BACKEND}/cities`)
      .then(r => r.json())
      .then(data => setAllCities(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // ─── Close dropdown on outside click ───
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── Filtered cities for autocomplete ───
  const filteredCities = allCities.filter(c =>
    c.name.toLowerCase().includes(origin.toLowerCase().trim())
  );

  // ─── Filtered reachable cities for search ───
  const filteredReachable = reachableCities.filter(c =>
    c.name.toLowerCase().includes(destSearch.toLowerCase().trim())
  );

  // ─── Select origin ───
  const handleSelectOrigin = async (city) => {
    setOrigin(city.name);
    setSelectedOrigin(city);
    setShowDropdown(false);
    setSelectedDest(null);
    setTrips([]);
    setError(null);
    setNextAvailableDate(null);
    setNoTripsIn7Days(false);
    setMonthDate(null);
    setNoTripsThisMonth(false);

    // Fetch reachable cities
    setReachableLoading(true);
    try {
      const res = await fetch(`${BACKEND}/reachable/${encodeURIComponent(city.name)}`);
      const data = await res.json();
      setReachableCities(Array.isArray(data) ? data : []);
    } catch {
      setReachableCities([]);
    }
    setReachableLoading(false);
  };

  // ─── Select destination ───
  const handleSelectDest = (city) => {
    setSelectedDest(city);
    setTrips([]);
    setError(null);
    setNextAvailableDate(null);
    setNoTripsIn7Days(false);
    setMonthDate(null);
    setNoTripsThisMonth(false);
  };

  // ─── Search buses ───
  const handleSearch = async (searchDate) => {
    if (!selectedOrigin || !selectedDest || !searchDate) return;
    setLoading(true);
    setError(null);
    setTrips([]);
    setNextAvailableDate(null);
    setNoTripsIn7Days(false);
    setMonthDate(null);
    setNoTripsThisMonth(false);

    try {
      const response = await fetch(`${BACKEND}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: selectedOrigin.name, to: selectedDest.name, date: searchDate })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to find buses');

      if (data.trips && data.trips.length > 0) {
        setTrips(data.trips);
      } else if (data.nextAvailableDate) {
        setNextAvailableDate(data.nextAvailableDate);
      } else {
        setNoTripsIn7Days(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Tier 2: Search rest of month ───
  const handleSearchMonth = async () => {
    if (!selectedOrigin || !selectedDest || !date) return;
    setMonthSearching(true);
    setMonthDate(null);
    setNoTripsThisMonth(false);

    try {
      const response = await fetch(`${BACKEND}/search-month`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: selectedOrigin.name, to: selectedDest.name, date })
      });
      const data = await response.json();

      if (data.availableDate) {
        setMonthDate(data.availableDate);
      } else {
        setNoTripsThisMonth(true);
      }
    } catch {
      setNoTripsThisMonth(true);
    } finally {
      setMonthSearching(false);
    }
  };

  // ─── Reset flow ───
  const resetToOrigin = () => {
    setSelectedOrigin(null);
    setSelectedDest(null);
    setOrigin('');
    setTrips([]);
    setError(null);
    setReachableCities([]);
    setNextAvailableDate(null);
    setNoTripsIn7Days(false);
    setMonthDate(null);
    setNoTripsThisMonth(false);
  };

  const resetToDest = () => {
    setSelectedDest(null);
    setTrips([]);
    setError(null);
    setNextAvailableDate(null);
    setNoTripsIn7Days(false);
    setMonthDate(null);
    setNoTripsThisMonth(false);
  };

  // ─── Format date for display ───
  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // ═══════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: `linear-gradient(135deg, #0a0f0d 0%, #0d1a14 40%, #0a0a0a 100%)`,
      zIndex: 200,
      display: 'flex', flexDirection: 'column',
      color: '#e0e0e0',
      overflowY: 'auto',
      animation: 'busPageFadeIn 0.4s ease-out'
    }}>
      {/* ─── Header ─── */}
      <div style={{
        padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(115, 214, 61, 0.15)',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #73D63D, #4CAF50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px'
          }}>🚌</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#73D63D', letterSpacing: '1.5px' }}>
              FLIXBUS INDIA
            </h2>
            <p style={{ margin: 0, fontSize: '11px', color: '#73D63D99', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Book your next journey
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#ccc', fontSize: '14px',
          padding: '8px 20px', borderRadius: '25px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => { e.target.style.background = 'rgba(255,60,60,0.15)'; e.target.style.borderColor = 'rgba(255,60,60,0.4)'; e.target.style.color = '#ff6b6b'; }}
        onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.color = '#ccc'; }}
        >
          ✕ Close
        </button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
        
        {/* ─── Breadcrumb Trail ─── */}
        {step !== 'origin' && !selectedTripId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px' }}>
            <span onClick={resetToOrigin} style={{ color: '#73D63D', cursor: 'pointer', opacity: 0.8 }}>📍 {selectedOrigin?.name}</span>
            {selectedDest && (
              <>
                <span style={{ color: '#555' }}>→</span>
                <span onClick={resetToDest} style={{ color: '#73D63D', cursor: 'pointer', opacity: 0.8 }}>📍 {selectedDest.name}</span>
              </>
            )}
            {date && selectedDest && (
              <>
                <span style={{ color: '#555' }}>•</span>
                <span style={{ color: '#888' }}>📅 {formatDate(date)}</span>
              </>
            )}
          </div>
        )}

        {/* ═════════════════════════════════
             STEP 1: ORIGIN SELECTION
         ═════════════════════════════════ */}
        {step === 'origin' && (
          <div style={{ animation: 'busSlideUp 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{
                fontSize: '42px', fontWeight: 800, margin: '0 0 12px 0',
                background: 'linear-gradient(135deg, #fff 30%, #73D63D)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                Where are you starting from?
              </h1>
              <p style={{ color: '#888', fontSize: '16px' }}>Type your city to begin</p>
            </div>

            <div ref={dropdownRef} style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', opacity: 0.5 }}>🔍</span>
                <input
                  ref={inputRef}
                  autoFocus
                  value={origin}
                  onChange={e => { setOrigin(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search your city..."
                  style={{
                    width: '100%', padding: '18px 18px 18px 48px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '2px solid rgba(115,214,61,0.25)',
                    borderRadius: '16px', color: '#fff', fontSize: '18px',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.3s, box-shadow 0.3s'
                  }}
                  onFocusCapture={e => { e.target.style.borderColor = '#73D63D'; e.target.style.boxShadow = '0 0 20px rgba(115,214,61,0.15)'; }}
                  onBlurCapture={e => { e.target.style.borderColor = 'rgba(115,214,61,0.25)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {showDropdown && origin.length > 0 && filteredCities.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  marginTop: '4px', maxHeight: '260px', overflowY: 'auto',
                  background: 'rgba(18,24,20,0.98)',
                  border: '1px solid rgba(115,214,61,0.2)',
                  borderRadius: '12px', backdropFilter: 'blur(20px)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
                  zIndex: 20
                }}>
                  {filteredCities.map(city => (
                    <div
                      key={city.rapidapi_id}
                      onClick={() => handleSelectOrigin(city)}
                      style={{
                        padding: '14px 18px',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(115,214,61,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: '16px' }}>📍</span>
                      <span style={{ color: '#fff', fontWeight: 500 }}>{city.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {showDropdown && origin.length > 0 && filteredCities.length === 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  marginTop: '4px', padding: '20px',
                  background: 'rgba(18,24,20,0.98)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', textAlign: 'center', color: '#888',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.5)'
                }}>
                  No cities found matching "{origin}"
                </div>
              )}
            </div>

            {/* Popular cities chips */}
            {allCities.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Popular Origins</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {allCities.slice(0, 8).map(city => (
                    <button
                      key={city.rapidapi_id}
                      onClick={() => handleSelectOrigin(city)}
                      style={{
                        background: 'rgba(115,214,61,0.08)',
                        border: '1px solid rgba(115,214,61,0.2)',
                        color: '#73D63D', padding: '8px 16px',
                        borderRadius: '20px', fontSize: '13px',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.target.style.background = 'rgba(115,214,61,0.2)'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(115,214,61,0.08)'; }}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════
             STEP 2: DESTINATION GRID
         ═════════════════════════════════ */}
        {step === 'destination' && (
          <div style={{ animation: 'busSlideUp 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '36px', fontWeight: 800, margin: '0 0 8px 0',
                color: '#fff'
              }}>
                Where to from <span style={{ color: '#73D63D' }}>{selectedOrigin?.name}</span>?
              </h1>
              <p style={{ color: '#888', fontSize: '15px' }}>Select your destination from available routes</p>
            </div>

            {reachableLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{
                    height: '64px', borderRadius: '14px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite'
                  }} />
                ))}
              </div>
            ) : (
              <>
                {/* Destination search */}
                <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5 }}>🔍</span>
                  <input
                    value={destSearch}
                    onChange={e => setDestSearch(e.target.value)}
                    placeholder="Filter destinations..."
                    style={{
                      width: '100%', padding: '12px 12px 12px 40px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px', color: '#fff', fontSize: '14px',
                      outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>

                {filteredReachable.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    {reachableCities.length === 0
                      ? 'No routes available from this city.'
                      : `No destinations matching "${destSearch}"`
                    }
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '12px'
                  }}>
                    {filteredReachable.map((city, i) => (
                      <button
                        key={city.id || i}
                        onClick={() => handleSelectDest(city)}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '14px',
                          padding: '18px 14px',
                          color: '#fff',
                          fontSize: '15px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.25s',
                          display: 'flex', alignItems: 'center', gap: '8px',
                          animation: `busSlideUp 0.4s ease-out ${i * 0.02}s both`
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(115,214,61,0.12)';
                          e.currentTarget.style.borderColor = 'rgba(115,214,61,0.35)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span style={{ opacity: 0.5 }}>📍</span>
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}
                <p style={{ textAlign: 'center', marginTop: '16px', color: '#555', fontSize: '13px' }}>
                  {reachableCities.length} destinations available
                </p>
              </>
            )}
          </div>
        )}

        {/* ═════════════════════════════════
             STEP 3: DATE + SEARCH
         ═════════════════════════════════ */}
        {step === 'search' && (
          <div style={{ animation: 'busSlideUp 0.4s ease-out' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(115,214,61,0.15)',
              borderRadius: '20px',
              padding: '36px',
              maxWidth: '600px',
              margin: '0 auto',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{ color: '#fff', fontSize: '24px', margin: '0 0 8px 0', fontWeight: 700 }}>
                {selectedOrigin?.name} → {selectedDest?.name}
              </h2>
              <p style={{ color: '#888', fontSize: '14px', margin: '0 0 28px 0' }}>Pick your travel date</p>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%', padding: '14px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px', color: '#fff', fontSize: '16px',
                      outline: 'none', boxSizing: 'border-box',
                      colorScheme: 'dark'
                    }}
                  />
                </div>
                <button
                  onClick={() => handleSearch(date)}
                  disabled={loading || !date}
                  style={{
                    background: loading ? '#555' : 'linear-gradient(135deg, #73D63D, #4CAF50)',
                    color: '#fff', border: 'none',
                    padding: '14px 28px', borderRadius: '12px',
                    fontWeight: 700, fontSize: '15px',
                    cursor: loading || !date ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    boxShadow: loading ? 'none' : '0 4px 15px rgba(115,214,61,0.25)'
                  }}
                >
                  {loading ? '⏳ Searching...' : '🔍 Search Buses'}
                </button>
              </div>

              {error && (
                <div style={{
                  marginTop: '20px', padding: '14px 18px', borderRadius: '12px',
                  background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.25)',
                  color: '#ff6b6b', fontSize: '14px'
                }}>
                  ⚠️ {error}
                </div>
              )}

              {/* ─── Tier 1: Next available date found ─── */}
              {nextAvailableDate && (
                <div
                  onClick={() => { setDate(nextAvailableDate); handleSearch(nextAvailableDate); setNextAvailableDate(null); }}
                  style={{
                    marginTop: '20px', padding: '16px 20px', borderRadius: '14px',
                    background: 'rgba(115,214,61,0.08)',
                    border: '1px solid rgba(115,214,61,0.25)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(115,214,61,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(115,214,61,0.08)'}
                >
                  <div>
                    <p style={{ color: '#ccc', fontSize: '14px', margin: '0 0 4px 0' }}>No buses on {formatDate(date)}</p>
                    <p style={{ color: '#73D63D', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                      Next available: {formatDate(nextAvailableDate)}
                    </p>
                  </div>
                  <span style={{ color: '#73D63D', fontSize: '24px' }}>→</span>
                </div>
              )}

              {/* ─── Tier 2: No trips in 7 days ─── */}
              {noTripsIn7Days && !monthDate && !noTripsThisMonth && (
                <div style={{
                  marginTop: '20px', padding: '20px', borderRadius: '14px',
                  background: 'rgba(255,170,0,0.06)',
                  border: '1px solid rgba(255,170,0,0.2)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#ffaa00', fontSize: '15px', fontWeight: 500, margin: '0 0 14px 0' }}>
                    😕 No buses available for the next 7 days
                  </p>
                  <button
                    onClick={handleSearchMonth}
                    disabled={monthSearching}
                    style={{
                      background: monthSearching ? '#555' : 'linear-gradient(135deg, #ffaa00, #ff8800)',
                      color: '#fff', border: 'none',
                      padding: '12px 28px', borderRadius: '25px',
                      fontWeight: 700, fontSize: '14px',
                      cursor: monthSearching ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: monthSearching ? 'none' : '0 4px 15px rgba(255,170,0,0.2)'
                    }}
                  >
                    {monthSearching ? '⏳ Searching this month...' : '📅 Get Available Date'}
                  </button>
                </div>
              )}

              {/* ─── Tier 2 result: Found date in month ─── */}
              {monthDate && (
                <div
                  onClick={() => { setDate(monthDate); handleSearch(monthDate); setMonthDate(null); setNoTripsIn7Days(false); }}
                  style={{
                    marginTop: '20px', padding: '16px 20px', borderRadius: '14px',
                    background: 'rgba(115,214,61,0.08)',
                    border: '1px solid rgba(115,214,61,0.25)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(115,214,61,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(115,214,61,0.08)'}
                >
                  <div>
                    <p style={{ color: '#73D63D', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                      ✅ Buses available on: {formatDate(monthDate)}
                    </p>
                  </div>
                  <span style={{ color: '#73D63D', fontSize: '24px' }}>→</span>
                </div>
              )}

              {/* ─── Tier 3: Nothing this month ─── */}
              {noTripsThisMonth && (
                <div style={{
                  marginTop: '20px', padding: '20px', borderRadius: '14px',
                  background: 'rgba(255,60,60,0.06)',
                  border: '1px solid rgba(255,60,60,0.2)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#ff6b6b', fontSize: '15px', fontWeight: 500, margin: 0 }}>
                    😞 Sorry, no buses are available for this month. Try next month.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════
             STEP 4: TRIP RESULTS
         ═════════════════════════════════ */}
        {step === 'results' && (
          <div style={{ animation: 'busSlideUp 0.4s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '24px' }}>
                  {selectedOrigin?.name} → {selectedDest?.name}
                </h2>
                <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
                  {formatDate(date)} • {trips.length} bus{trips.length !== 1 ? 'es' : ''} found
                </p>
              </div>
              <button
                onClick={() => { setTrips([]); }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ccc', padding: '8px 16px', borderRadius: '10px',
                  cursor: 'pointer', fontSize: '13px'
                }}
              >
                ← Change Date
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {trips.map((trip, i) => {
                const priceEUR = trip.price?.total || 0;
                const priceINR = Math.round(priceEUR * EUR_TO_INR);
                return (
                  <div
                    key={trip.id}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px', padding: '22px 26px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.25s',
                      animation: `busSlideUp 0.4s ease-out ${i * 0.05}s both`
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.borderColor = 'rgba(115,214,61,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>
                          {new Date(trip.departure?.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div style={{
                          flex: 1, maxWidth: '80px', height: '2px',
                          background: 'linear-gradient(90deg, #73D63D, transparent)',
                          borderRadius: '2px'
                        }} />
                        <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>
                          {new Date(trip.arrival?.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#888' }}>
                        <span>⏱ {trip.duration?.hours}h {trip.duration?.minutes}m</span>
                        <span>💺 {trip.availability?.seats} seats left</span>
                        {trip.transferType && <span>🚌 {trip.transferType}</span>}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '24px', fontWeight: 700, color: '#73D63D' }}>
                          ₹{priceINR}
                        </p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>≈ €{priceEUR}</p>
                      </div>
                      <button
                        onClick={() => setSelectedTripId(trip.id)}
                        style={{
                          background: 'linear-gradient(135deg, #73D63D, #4CAF50)',
                          color: '#fff', border: 'none',
                          padding: '10px 22px', borderRadius: '25px',
                          fontWeight: 600, fontSize: '13px',
                          cursor: 'pointer', whiteSpace: 'nowrap',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 15px rgba(115,214,61,0.2)'
                        }}
                      >
                        View Seats →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#555' }}>
              💡 Prices shown in ₹ are approximate (1 EUR ≈ ₹{EUR_TO_INR})
            </p>
          </div>
        )}

        {/* ═════════════════════════════════
             STEP 5: SEAT MAP
         ═════════════════════════════════ */}
        {selectedTripId && (
          <div style={{ animation: 'busSlideUp 0.4s ease-out' }}>
            <button
              onClick={() => setSelectedTripId(null)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ccc', padding: '10px 20px', borderRadius: '10px',
                cursor: 'pointer', fontSize: '14px', marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              ← Back to results
            </button>
            <SeatMapUI tripId={selectedTripId} theme={theme} />
          </div>
        )}
      </div>

      {/* ─── Injected keyframes ─── */}
      <style>{`
        @keyframes busPageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes busSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BusLoversPage;
