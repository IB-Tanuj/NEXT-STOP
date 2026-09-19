import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateTripPlan, fetchItineraryData, buildItineraryCacheKey } from '../../utils/tripPlanUtils';
import { ItineraryView } from '../TripPlan/ItineraryView';
import ViewProfileModal from './ViewProfileModal';
import './Dashboard.css';

/* ─── Monochrome SVG Icons ─── */
const IconAlert = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);

const IconParty = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M5.8 11.3L2 22l10.7-3.8"/>
        <path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/>
        <path d="M22 20h.01"/><path d="M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/>
        <path d="M22 13l-1.34-.45a2.9 2.9 0 0 0-3.12 1.96v0c-.25.75-1.12 1.08-1.87.83L15 15"/>
    </svg>
);

const IconTarget = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
);

const IconUtensils = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
    </svg>
);

const IconSiren = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21h14"/><path d="M12 3v1"/>
        <path d="M18.36 7.64l-.71.71"/><path d="M5.64 7.64l.71.71"/>
    </svg>
);

const IconStar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);

const IconSparkle = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/>
    </svg>
);

const SpotItem = ({ spot, theme, groupSize = 1 }) => {
    const [open, setOpen] = useState(false);
    const cost = (spot.cost ?? spot.total ?? 0) * groupSize;
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
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>₹{cost}</div>
            </div>
            {open && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '13px', color: '#ccc', lineHeight: '1.5' }}>
                    {spot.info?.openingHours && <p style={{ marginBottom: '4px' }}><strong>Hours:</strong> {spot.info.openingHours.open} - {spot.info.openingHours.close} {spot.info.openingHours.closedOn && <span style={{color: '#ff6b6b'}}>(Closed: {spot.info.openingHours.closedOn})</span>}</p>}
                    {(spot.info?.rules?.length > 0 || spot.info?.permit?.required) && (
                        <div style={{ marginBottom: "8px", marginTop: "8px" }}>
                            <strong style={{ color: '#FFE66D' }}><IconAlert /> Rules & Permits:</strong>
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

/* ─── Animated SVG Donut Chart ─── */
const DonutChart = ({ segments, total }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.3 }
        );
        if (chartRef.current) observer.observe(chartRef.current);
        return () => observer.disconnect();
    }, []);

    const size = 240;
    const strokeWidth = 36;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    let cumulativePercent = 0;

    return (
        <div ref={chartRef} style={{ position: 'relative', display: 'inline-block' }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}>
                {/* Background circle */}
                <circle cx={center} cy={center} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
                {/* Segments */}
                {segments.map((seg, idx) => {
                    const pct = seg.percent / 100;
                    const dashLength = circumference * pct;
                    const dashOffset = circumference * cumulativePercent;
                    const rotation = 0;
                    cumulativePercent += pct;
                    
                    return (
                        <circle
                            key={idx}
                            className="donut-segment"
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={hoveredIdx === idx ? strokeWidth + 6 : strokeWidth}
                            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                            strokeDashoffset={-dashOffset}
                            style={{
                                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke-width 0.2s ease',
                                strokeDashoffset: isVisible ? -dashOffset : circumference,
                                color: seg.color,
                            }}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                        />
                    );
                })}
            </svg>
            {/* Center text */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Total</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#e2e8f0' }}>₹{total?.toLocaleString()}</div>
            </div>
            {/* Hover tooltip */}
            {hoveredIdx !== null && segments[hoveredIdx] && (
                <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1e293b',
                    border: `1px solid ${segments[hoveredIdx].color}`,
                    color: '#e2e8f0',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: `0 4px 20px ${segments[hoveredIdx].color}33`,
                    pointerEvents: 'none',
                }}>
                    {segments[hoveredIdx].label}: {segments[hoveredIdx].percent}%
                </div>
            )}
        </div>
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
    
    // Group members state
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [viewProfile, setViewProfile] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!trip.member_ids || trip.member_ids.length === 0) return;
            setLoadingMembers(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/saved-trips/${trip.id}/members`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMembers(data);
                }
            } catch (err) {
                console.error("Failed to fetch members:", err);
            } finally {
                setLoadingMembers(false);
            }
        };
        fetchMembers();
    }, [trip.id, trip.member_ids, session]);

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

    const savedGroupSize = parseInt(data.preferences?.groupSize);
    const fallbackSize = data.preferences?.groupMembers?.length > 0 ? data.preferences.groupMembers.length + 1 : 1;
    const groupSize = savedGroupSize || fallbackSize;
    const hotelCost = data.hotel?.price || 0;
    const transportCost = data.transport?.price || 0;
    const spotsCost = (data.spots?.reduce((acc, curr) => acc + (curr.cost ?? curr.total ?? 0), 0) || 0) * groupSize;
    const bufferCost = data.buffer || 0;
    
    const total = trip.total_budget || 1;
    const getPct = (val) => Math.round((val / total) * 100);

    const pieSegments = [
        { label: 'Accommodation', color: '#f87171', percent: getPct(hotelCost) },
        { label: 'Transport', color: '#60a5fa', percent: getPct(transportCost) },
        { label: 'Spots', color: '#fbbf24', percent: getPct(spotsCost) },
        { label: 'Buffer', color: '#4ade80', percent: Math.max(0, 100 - getPct(hotelCost) - getPct(transportCost) - getPct(spotsCost)) },
    ];

    return (
        <div className="trip-details-tab" style={{ maxWidth: '800px', margin: '0 auto', color: '#eef7f1' }}>
            
            <div className="animate-entrance" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.08))', padding: '16px 24px', borderRadius: '14px', border: '1px solid rgba(6, 182, 212, 0.2)', flexWrap: 'wrap', gap: '16px', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    Total budget = ₹{trip.total_budget}
                </div>
                <button 
                    onClick={handleDownloadHTML}
                    className="ripple-btn"
                    style={{ background: 'linear-gradient(135deg, #10b981, #4ade80)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.3s' }}
                    onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(16,185,129,0.3)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
                </button>
            </div>

            {/* Group Members Section */}
            {trip.member_ids && trip.member_ids.length > 0 && (
                <div className="accordion-card animate-entrance" style={{ marginBottom: '24px', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '18px' }}>Group Members</h3>
                    {loadingMembers ? (
                        <p style={{ color: '#aaa', margin: 0 }}>Loading members...</p>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            {members.map(member => (
                                <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '12px', flex: '1 1 250px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px', overflow: 'hidden' }}>
                                        {member.avatar_url ? (
                                            <img src={member.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            member.full_name?.charAt(0) || member.username?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, color: '#fff', fontSize: '14px' }}>
                                            {member.full_name || member.username}
                                            {member.id === trip.user_id && <span style={{ marginLeft: '6px', fontSize: '10px', background: '#3b82f6', padding: '2px 6px', borderRadius: '4px' }}>Owner</span>}
                                        </h4>
                                        {member.username && <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '12px' }}>@{member.username}</p>}
                                    </div>
                                    <button 
                                        onClick={() => setViewProfile(member)}
                                        style={{
                                            background: 'rgba(6, 182, 212, 0.1)',
                                            color: '#06b6d4',
                                            border: '1px solid rgba(6, 182, 212, 0.2)',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'; }}
                                    >
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 1. Accommodation */}
            <div className="accordion-card animate-entrance">
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
            <div className="accordion-card animate-entrance">
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
            <div className="accordion-card animate-entrance">
                <div className="accordion-header" onClick={() => toggleSection('spots')}>
                    <h3>Spots</h3>
                    <span className="arrow">{expandedSections.spots ? '▲' : '▼'}</span>
                </div>
                {expandedSections.spots && (
                    <div className="accordion-body">
                        {data.spots && data.spots.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {data.spots.map((spot, idx) => (
                                    <SpotItem key={idx} spot={spot} theme={{ primary: '#4ade80' }} groupSize={groupSize} />
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
            <div className="accordion-card animate-entrance">
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
                                        <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)' }}></div>
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
                                    className="ripple-btn"
                                    style={{ 
                                        background: isGenerating ? 'transparent' : 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(74, 222, 128, 0.15))', 
                                        border: '2px solid #4ade80', 
                                        color: '#4ade80', 
                                        padding: '12px 24px', 
                                        borderRadius: '10px', 
                                        cursor: isGenerating ? 'default' : 'pointer', 
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s',
                                        boxShadow: isGenerating ? 'none' : '0 0 20px rgba(74,222,128,0.15)',
                                    }}
                                    onMouseEnter={e => { if (!isGenerating) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 24px rgba(74,222,128,0.3)'; }}}
                                    onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = isGenerating ? 'none' : '0 0 20px rgba(74,222,128,0.15)'; }}
                                >
                                    {isGenerating ? 'Generating Itinerary...' : <><IconSparkle /> Generate Itinerary Now</>}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 5. Activities / Food / Emergency */}
            <div className="accordion-card animate-entrance">
                <div className="accordion-header" onClick={() => toggleSection('activities')}>
                    <h3>Activities / food recommendation and emergency number</h3>
                    <span className="arrow">{expandedSections.activities ? '▲' : '▼'}</span>
                </div>
                {expandedSections.activities && (
                    <div className="accordion-body">
                        <div style={{ background: bufferCost >= 0 ? 'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(6,182,212,0.08))' : '#ff6b6b22', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: `1px solid ${bufferCost >= 0 ? '#4ade80' : '#ff6b6b'}` }}>
                            <strong>Remaining Buffer: </strong>
                            <span style={{ color: bufferCost >= 0 ? '#4ade80' : '#ff6b6b', fontSize: '18px', fontWeight: 'bold' }}>₹{bufferCost}</span>
                            <div style={{ fontSize: '13px', color: '#aaa', marginTop: '6px' }}>This covers the cost of food, activities and in travel spot by spot.</div>
                        </div>

                        {aiData?.festivals && aiData.festivals.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: '#fbbf24', marginBottom: '8px' }}><IconParty /> Festivals & Events</h4>
                                <ul style={{ paddingLeft: '20px', color: '#ddd' }}>
                                    {aiData.festivals.map((f, i) => <li key={i} style={{ marginBottom: '4px' }}>{typeof f === 'string' ? f : f.name || JSON.stringify(f)}</li>)}
                                </ul>
                            </div>
                        )}

                        {aiData?.activities && aiData.activities.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: '#60a5fa', marginBottom: '8px' }}><IconTarget /> Recommended Activities</h4>
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
                                <h4 style={{ color: '#fb923c', marginBottom: '8px' }}><IconUtensils /> Food Recommendations</h4>
                                <ul style={{ paddingLeft: '20px', color: '#ddd', lineHeight: '1.6' }}>
                                    {aiData.foodRecommendations.map((f, i) => (
                                        <li key={i} style={{ marginBottom: '8px' }}>
                                            <strong>{f.mustTry && <><IconStar /> </>}{typeof f === 'string' ? f : f.name}</strong>
                                            {typeof f === 'object' && f.description && <div style={{ fontSize: '13px', color: '#aaa' }}>{f.description}</div>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {aiData?.localEmergency && (
                            <div style={{ background: 'linear-gradient(135deg, rgba(248,113,113,0.06), rgba(244,63,94,0.06))', padding: '16px', borderRadius: '12px', border: '1px solid #f8717133' }}>
                                <h4 style={{ color: '#f87171', margin: '0 0 12px 0' }}><IconSiren /> Emergency Contacts</h4>
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

            {/* Animated Donut Pie Chart */}
            <div className="animate-entrance" style={{ marginTop: '40px', background: 'linear-gradient(145deg, rgba(15,23,42,0.8), rgba(30,41,59,0.6))', borderRadius: '20px', padding: '40px 20px', border: '1px solid rgba(6,182,212,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', backdropFilter: 'blur(8px)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <h3 style={{ marginBottom: '32px', letterSpacing: '1px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.3rem' }}>Budget Breakdown</h3>
                
                <DonutChart segments={pieSegments} total={trip.total_budget} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', width: '100%', maxWidth: '500px', marginTop: '40px' }}>
                    {pieSegments.map((seg, idx) => (
                        <div key={idx} className="legend-item" style={{ transition: 'transform 0.2s', cursor: 'default' }} 
                             onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                             onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            <span style={{ background: seg.color, boxShadow: `0 0 10px ${seg.color}44` }}></span> 
                            <div>{seg.label}<br/><strong style={{ color: seg.color }}>{seg.percent}%</strong></div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .accordion-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(6,182,212,0.15);
                    border-radius: 14px;
                    margin-bottom: 16px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .accordion-card:hover {
                    border-color: rgba(6,182,212,0.3);
                    box-shadow: 0 4px 20px rgba(6,182,212,0.08);
                }
                .accordion-header {
                    padding: 20px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    background: rgba(255,255,255,0.02);
                    transition: background 0.2s;
                    position: relative;
                    overflow: hidden;
                }
                .accordion-header:hover {
                    background: rgba(255,255,255,0.05);
                }
                .accordion-header:active::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(6, 182, 212, 0.1);
                    animation: headerPress 0.4s ease-out;
                }
                @keyframes headerPress {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                .accordion-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .arrow {
                    color: #06b6d4;
                    font-size: 12px;
                    transition: transform 0.3s;
                }
                .accordion-body {
                    padding: 24px;
                    border-top: 1px solid rgba(6,182,212,0.1);
                    background: rgba(0,0,0,0.3);
                    animation: accordionSlideIn 0.3s ease-out;
                }
                @keyframes accordionSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
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
                    transition: box-shadow 0.3s;
                }
            `}</style>
        </div>
    );
};

export default TripDetailsTab;
