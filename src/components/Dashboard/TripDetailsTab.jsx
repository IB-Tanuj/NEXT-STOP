import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateTripPlan, fetchItineraryData, buildItineraryCacheKey } from '../../utils/tripPlanUtils';
import { ItineraryView } from '../TripPlan/ItineraryView';
import './Dashboard.css';

const SpotItem = ({ spot, theme }) => {
    const [open, setOpen] = useState(false);
    return (
        <li style={{ padding: '12px 0', borderBottom: '1px solid #ffffff11' }}>
            <div 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setOpen(!open)}
            >
                <div>
                    <div style={{ fontWeight: '500', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: open ? theme.primary : '#eef7f1' }}>
                        {spot.name} <span style={{ fontSize: '10px' }}>{open ? '▼' : '▶'}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                        {(spot.cost === 0 || spot.total === 0) ? 'Free/Variable' : 'Ticket Required'}
                    </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>₹{spot.cost ?? spot.total ?? 0}</div>
            </div>
            {open && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '13px', color: '#ccc', lineHeight: '1.5' }}>
                    {spot.info?.openingHours && <p style={{ marginBottom: '4px' }}><strong>Hours:</strong> {spot.info.openingHours.open} - {spot.info.openingHours.close} {spot.info.openingHours.closedOn && <span style={{color: '#ff6b6b'}}>(Closed: {spot.info.openingHours.closedOn})</span>}</p>}
                    {(spot.info?.rules?.length > 0 || spot.info?.permit?.required) && (
                        <div style={{ marginBottom: "8px", marginTop: "8px" }}>
                            <strong style={{ color: '#FFE66D' }}>⚠️ Rules & Permits:</strong>
                            {spot.info.permit?.required && (
                                <p style={{ margin: '4px 0', color: '#FFE66D' }}>Permit Required: {spot.info.permit.details} {spot.info.permit.cost ? `(₹${spot.info.permit.cost})` : ""}</p>
                            )}
                            {spot.info.rules?.length > 0 && (
                                <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0' }}>
                                    {spot.info.rules.map((rule, idx) => <li key={idx}>{rule}</li>)}
                                </ul>
                            )}
                        </div>
                    )}
                    {spot.info?.recommendedDuration && <p style={{ marginBottom: '4px' }}><strong>Duration:</strong> {spot.info.recommendedDuration}</p>}
                    {spot.info?.photographyPolicy && (
                        <p style={{ marginBottom: '4px' }}>
                            <strong>Photography:</strong> {spot.info.photographyPolicy.allowed ? "Allowed" : "Not Allowed"} {spot.info.photographyPolicy.fee ? `(Fee: ₹${spot.info.photographyPolicy.fee})` : ""}
                        </p>
                    )}
                    {spot.info?.accessibility && <p style={{ marginBottom: '4px' }}><strong>Accessibility:</strong> {spot.info.accessibility}</p>}
                    {spot.info?.tips?.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                            <strong>Tips:</strong>
                            <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0' }}>
                                {spot.info.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </div>
                    )}
                    {(!spot.info || (!spot.info.openingHours && !spot.info.recommendedDuration && !spot.info.accessibility && !spot.info.rules?.length && !spot.info.permit?.required && !spot.info.photographyPolicy && (!spot.info.tips || spot.info.tips.length === 0))) && (
                        <p style={{ fontStyle: 'italic', margin: 0 }}>No detailed information available for this spot.</p>
                    )}
                </div>
            )}
        </li>
    );
};

const TripDetailsTab = ({ trip, onUpdate }) => {
    const { session } = useAuth();
    const data = trip.trip_data;
    const aiData = data.aiData || {};
    
    // Accordion state
    const [expandedSections, setExpandedSections] = useState({
        accommodation: false,
        transport: false,
        spots: false,
        itinerary: true,
        activities: false
    });

    const [isGenerating, setIsGenerating] = useState(false);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleGenerateItinerary = async () => {
        if (!data.preferences) {
            alert("No preferences saved for this trip. Cannot generate itinerary.");
            return;
        }
        setIsGenerating(true);
        try {
            // ── Try to fetch from sessionStorage (last page) first ──
            const cacheKey = buildItineraryCacheKey({
                location: trip.destination,
                days: data.preferences.days,
                budget: data.buffer,
                stayType: data.preferences.stayType,
                transport: data.preferences.transport,
                selectedActivities: aiData?.activities || [],
                selectedFestivals: aiData?.festivals || []
            });

            let itineraryResult = null;
            try {
                const sessionCached = sessionStorage.getItem(cacheKey);
                if (sessionCached) {
                    itineraryResult = JSON.parse(sessionCached);
                }
            } catch (e) {
                console.warn("Failed to read sessionStorage for itinerary", e);
            }

            // ── If not in sessionStorage, fetch from backend ──
            if (!itineraryResult) {
                const { data: apiResult } = await fetchItineraryData(
                    trip.destination,
                    data.preferences.days,
                    data.buffer,
                    data.preferences.stayType,
                    data.preferences.transport,
                    aiData?.activities || [],
                    aiData?.festivals || []
                );
                itineraryResult = apiResult;
            }
            
            // Merge all new AI data
            const newAiData = { ...aiData, itinerary: itineraryResult.itinerary || itineraryResult };
            const updatedTripData = { ...data, aiData: newAiData };
            
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/saved-trips/${trip.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || ''}`
                },
                body: JSON.stringify({ trip_data: updatedTripData, total_budget: trip.total_budget })
            });

            if (res.ok) {
                const { trip: updatedTrip } = await res.json();
                onUpdate(updatedTrip);
            }
        } catch (error) {
            console.error("Failed to generate itinerary:", error);
            alert("Failed to generate itinerary. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadHTML = () => {
        const htmlContent = `<!DOCTYPE html><html><head><title>${trip.destination}</title></head><body><h1>Trip to ${trip.destination}</h1></body></html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Trip_${trip.destination}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const hotelCost = data.hotel?.price || 0;
    const transportCost = data.transport?.price || 0;
    const spotsCost = data.spots?.reduce((acc, curr) => acc + (curr.cost ?? curr.total ?? 0), 0) || 0;
    const bufferCost = data.buffer || 0;
    
    const total = trip.total_budget || 1;
    const getPct = (val) => Math.round((val / total) * 100);

    const p1 = getPct(hotelCost);
    const p2 = p1 + getPct(transportCost);
    const p3 = p2 + getPct(spotsCost);

    return (
        <div className="trip-details-tab" style={{ maxWidth: '800px', margin: '0 auto', color: '#eef7f1' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#ffffff0a', padding: '16px 24px', borderRadius: '12px', border: '1px solid #4ade8033', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    Total budget = ₹{trip.total_budget}
                </div>
                <button 
                    onClick={handleDownloadHTML}
                    style={{ background: '#4ade80', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Download offline
                </button>
            </div>

            {/* 1. Accommodation */}
            <div className="accordion-card">
                <div className="accordion-header" onClick={() => toggleSection('accommodation')}>
                    <h3>Accommodation</h3>
                    <span className="arrow">{expandedSections.accommodation ? '▲' : '▼'}</span>
                </div>
                {expandedSections.accommodation && (
                    <div className="accordion-body">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                            <div><span className="label">Days of stay</span><br/> {data.hotel?.days || data.preferences?.days || 1}</div>
                            <div><span className="label">Name of hotel</span><br/> {data.hotel?.name || 'Not selected'}</div>
                            <div><span className="label">Single night price</span><br/> ₹{Math.round(hotelCost / (data.hotel?.days || data.preferences?.days || 1))}</div>
                            <div><span className="label">Total price</span><br/> ₹{hotelCost}</div>
                            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                                <span className="label">Budget Percentage:</span> <strong>{getPct(hotelCost)}%</strong> of total budget
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Transport */}
            <div className="accordion-card">
                <div className="accordion-header" onClick={() => toggleSection('transport')}>
                    <h3>Transport</h3>
                    <span className="arrow">{expandedSections.transport ? '▲' : '▼'}</span>
                </div>
                {expandedSections.transport && (
                    <div className="accordion-body">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                            <div><span className="label">Medium</span><br/> {data.transport?.medium || 'N/A'}</div>
                            <div><span className="label">Class</span><br/> {data.transport?.class || 'Standard'}</div>
                            <div><span className="label">From</span><br/> {data.transport?.from || 'Origin'}</div>
                            <div><span className="label">To</span><br/> {data.transport?.to || trip.destination}</div>
                            <div><span className="label">Distance & Time</span><br/> {data.transport?.distance ? data.transport.distance + ' km' : 'N/A'}</div>
                            <div><span className="label">Round Trip Price</span><br/> ₹{transportCost}</div>
                            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                                <span className="label">Budget Percentage:</span> <strong>{getPct(transportCost)}%</strong> of total budget
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Spots */}
            <div className="accordion-card">
                <div className="accordion-header" onClick={() => toggleSection('spots')}>
                    <h3>Spots</h3>
                    <span className="arrow">{expandedSections.spots ? '▲' : '▼'}</span>
                </div>
                {expandedSections.spots && (
                    <div className="accordion-body">
                        {data.spots && data.spots.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {data.spots.map((spot, idx) => (
                                    <SpotItem key={idx} spot={spot} theme={{ primary: '#4ade80' }} />
                                ))}
                            </ul>
                        ) : (
                            <p>No specific spots tracked in budget.</p>
                        )}
                        <div style={{ marginTop: '16px', fontWeight: 'bold', textAlign: 'right', borderTop: '1px dashed #ffffff33', paddingTop: '12px' }}>
                            Total Spots Cost: <span style={{ color: '#4ade80' }}>₹{spotsCost}</span> ({getPct(spotsCost)}%)
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Itinerary */}
            <div className="accordion-card">
                <div className="accordion-header" onClick={() => toggleSection('itinerary')}>
                    <h3>Itinerary</h3>
                    <span className="arrow">{expandedSections.itinerary ? '▲' : '▼'}</span>
                </div>
                {expandedSections.itinerary && (
                    <div className="accordion-body">
                        {aiData?.itinerary ? (
                            <div className="itinerary-timeline">
                                {aiData.itinerary.map((day, idx) => (
                                    <div key={idx} style={{ marginBottom: '30px', borderLeft: '2px solid #4ade80', paddingLeft: '24px', position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#4ade80' }}></div>
                                        <h4 style={{ color: '#4ade80', margin: '0 0 12px 0', fontSize: '18px' }}>Day {day.day}: {day.title}</h4>
                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{ color: '#aaa', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Morning</div>
                                            <div style={{ marginTop: '4px', lineHeight: '1.5' }}>{day.morning}</div>
                                        </div>
                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{ color: '#aaa', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Afternoon</div>
                                            <div style={{ marginTop: '4px', lineHeight: '1.5' }}>{day.afternoon}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#aaa', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Evening</div>
                                            <div style={{ marginTop: '4px', lineHeight: '1.5' }}>{day.evening}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '30px' }}>
                                <p style={{ marginBottom: '20px', color: '#aaa', fontSize: '15px' }}>The daily itinerary wasn't generated for this trip.</p>
                                <button 
                                    onClick={handleGenerateItinerary} 
                                    disabled={isGenerating}
                                    style={{ 
                                        background: isGenerating ? 'transparent' : '#4ade8022', 
                                        border: '2px solid #4ade80', 
                                        color: '#4ade80', 
                                        padding: '12px 24px', 
                                        borderRadius: '8px', 
                                        cursor: isGenerating ? 'default' : 'pointer', 
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {isGenerating ? 'Generating Itinerary...' : '✨ Generate Itinerary Now'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 5. Activities / Food / Emergency */}
            <div className="accordion-card">
                <div className="accordion-header" onClick={() => toggleSection('activities')}>
                    <h3>Activities / food recommendation and emergency number</h3>
                    <span className="arrow">{expandedSections.activities ? '▲' : '▼'}</span>
                </div>
                {expandedSections.activities && (
                    <div className="accordion-body">
                        <div style={{ background: bufferCost >= 0 ? '#4ade8022' : '#ff6b6b22', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: `1px solid ${bufferCost >= 0 ? '#4ade80' : '#ff6b6b'}` }}>
                            <strong>Remaining Buffer: </strong>
                            <span style={{ color: bufferCost >= 0 ? '#4ade80' : '#ff6b6b', fontSize: '18px', fontWeight: 'bold' }}>₹{bufferCost}</span>
                            <div style={{ fontSize: '13px', color: '#aaa', marginTop: '6px' }}>This covers the cost of food, activities and in travel spot by spot.</div>
                        </div>

                        {aiData?.festivals && aiData.festivals.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: '#fbbf24', marginBottom: '8px' }}>🎉 Festivals & Events</h4>
                                <ul style={{ paddingLeft: '20px', color: '#ddd' }}>
                                    {aiData.festivals.map((f, i) => <li key={i} style={{ marginBottom: '4px' }}>{typeof f === 'string' ? f : f.name || JSON.stringify(f)}</li>)}
                                </ul>
                            </div>
                        )}

                        {aiData?.activities && aiData.activities.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: '#60a5fa', marginBottom: '8px' }}>🎯 Recommended Activities</h4>
                                <ul style={{ paddingLeft: '20px', color: '#ddd', lineHeight: '1.6' }}>
                                    {aiData.activities.map((a, i) => (
                                        <li key={i} style={{ marginBottom: '8px' }}>
                                            <strong>{typeof a === 'string' ? a : a.name}</strong>
                                            {typeof a === 'object' && a.description && <div style={{ fontSize: '13px', color: '#aaa' }}>{a.description}</div>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {aiData?.foodRecommendations && aiData.foodRecommendations.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: '#fb923c', marginBottom: '8px' }}>🍽️ Food Recommendations</h4>
                                <ul style={{ paddingLeft: '20px', color: '#ddd', lineHeight: '1.6' }}>
                                    {aiData.foodRecommendations.map((f, i) => (
                                        <li key={i} style={{ marginBottom: '8px' }}>
                                            <strong>{f.mustTry && "🌟 "}{typeof f === 'string' ? f : f.name}</strong>
                                            {typeof f === 'object' && f.description && <div style={{ fontSize: '13px', color: '#aaa' }}>{f.description}</div>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {aiData?.localEmergency && (
                            <div style={{ background: '#f8717111', padding: '16px', borderRadius: '12px', border: '1px solid #f8717133' }}>
                                <h4 style={{ color: '#f87171', margin: '0 0 12px 0' }}>🚨 Emergency Contacts</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                                    {aiData.localEmergency.map((e, idx) => (
                                        <li key={idx}>
                                            <div style={{ fontSize: '12px', color: '#aaa' }}>{e.label}</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{e.number}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {!aiData?.activities && !aiData?.festivals && !aiData?.localEmergency && !aiData?.foodRecommendations && (
                            <p style={{ color: '#aaa', fontStyle: 'italic' }}>AI data not generated for this trip.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Pie Chart */}
            <div style={{ marginTop: '40px', background: '#ffffff0a', borderRadius: '16px', padding: '40px 20px', border: '1px solid #4ade8033', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '32px', letterSpacing: '1px' }}>Budget Breakdown</h3>
                
                <div style={{
                    width: '220px',
                    height: '220px',
                    borderRadius: '50%',
                    background: `conic-gradient(
                        #f87171 0% ${p1}%, 
                        #60a5fa ${p1}% ${p2}%, 
                        #fbbf24 ${p2}% ${p3}%, 
                        #4ade80 ${p3}% 100%
                    )`,
                    marginBottom: '40px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    border: '4px solid #1a1a1a'
                }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', width: '100%', maxWidth: '500px' }}>
                    <div className="legend-item">
                        <span style={{ background: '#f87171' }}></span> 
                        <div>Accommodation<br/><strong style={{ color: '#f87171' }}>{getPct(hotelCost)}%</strong></div>
                    </div>
                    <div className="legend-item">
                        <span style={{ background: '#60a5fa' }}></span> 
                        <div>Transport<br/><strong style={{ color: '#60a5fa' }}>{getPct(transportCost)}%</strong></div>
                    </div>
                    <div className="legend-item">
                        <span style={{ background: '#fbbf24' }}></span> 
                        <div>Spots<br/><strong style={{ color: '#fbbf24' }}>{getPct(spotsCost)}%</strong></div>
                    </div>
                    <div className="legend-item">
                        <span style={{ background: '#4ade80' }}></span> 
                        <div>Buffer<br/><strong style={{ color: '#4ade80' }}>{Math.max(0, 100 - p3)}%</strong></div>
                    </div>
                </div>
            </div>

            <style>{`
                .accordion-card {
                    background: #ffffff0a;
                    border: 1px solid #4ade8033;
                    border-radius: 12px;
                    margin-bottom: 16px;
                    overflow: hidden;
                    transition: all 0.3s;
                }
                .accordion-card:hover {
                    border-color: #4ade8055;
                }
                .accordion-header {
                    padding: 20px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    background: rgba(255,255,255,0.03);
                    transition: background 0.2s;
                }
                .accordion-header:hover {
                    background: rgba(255,255,255,0.06);
                }
                .accordion-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .arrow {
                    color: #4ade80;
                    font-size: 12px;
                    transition: transform 0.3s;
                }
                .accordion-body {
                    padding: 24px;
                    border-top: 1px solid #4ade8022;
                    background: rgba(0,0,0,0.3);
                }
                .label {
                    color: #888;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 4px;
                    display: inline-block;
                }
                .legend-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    font-size: 14px;
                    color: #ccc;
                }
                .legend-item span {
                    width: 16px;
                    height: 16px;
                    border-radius: 4px;
                    display: inline-block;
                    margin-top: 2px;
                }
            `}</style>
        </div>
    );
};

export default TripDetailsTab;
