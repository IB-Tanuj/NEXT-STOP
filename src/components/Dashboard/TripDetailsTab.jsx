import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateTripPlan, fetchItineraryData, buildItineraryCacheKey } from '../../utils/tripPlanUtils';
import { ItineraryView } from '../TripPlan/ItineraryView';
import ViewProfileModal from './ViewProfileModal';
import './Dashboard.css';

/* ─── SVG Icons ─── */
const IconChevronDown = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
    </svg>
);

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

const IconDownload = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);

/* ─── Spot Item Component ─── */
const SpotItem = ({ spot, theme, groupSize = 1 }) => {
    const [open, setOpen] = useState(false);
    const cost = (spot.cost ?? spot.total ?? 0) * groupSize;
    return (
        <li className="spot-item">
            <div className="spot-item-header" onClick={() => setOpen(!open)}>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: open ? theme.primary : '#e2e8f0', transition: 'color 0.2s' }}>
                        {spot.name} 
                        <span style={{ 
                            fontSize: '10px', 
                            transition: 'transform 0.3s',
                            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                            display: 'inline-block',
                            color: '#64748b'
                        }}>▶</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                        {(spot.cost === 0 || spot.total === 0) ? 'Free / Variable' : 'Ticket Required'}
                    </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#e2e8f0' }}>₹{cost}</div>
            </div>
            {open && (
                <div className="spot-detail-panel">
                    {spot.info?.openingHours && <p style={{ marginBottom: '4px' }}><strong>Hours:</strong> {spot.info.openingHours.open} - {spot.info.openingHours.close} {spot.info.openingHours.closedOn && <span style={{color: '#fb7185'}}>(Closed: {spot.info.openingHours.closedOn})</span>}</p>}
                    {(spot.info?.rules?.length > 0 || spot.info?.permit?.required) && (
                        <div style={{ marginBottom: "8px", marginTop: "8px" }}>
                            <strong style={{ color: '#fbbf24' }}><IconAlert /> Rules & Permits:</strong>
                            {spot.info.permit?.required && (
                                <p style={{ margin: '4px 0', color: '#fbbf24' }}>Permit Required: {spot.info.permit.details} {spot.info.permit.cost ? `(₹${spot.info.permit.cost})` : ""}</p>
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
                        <p style={{ fontStyle: 'italic', margin: 0, color: '#64748b' }}>No detailed information available for this spot.</p>
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

    const size = 220;
    const strokeWidth = 34;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    let cumulativePercent = 0;

    return (
        <div ref={chartRef} style={{ position: 'relative', display: 'inline-block' }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.3))' }}>
                {/* Background circle */}
                <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
                {/* Segments */}
                {segments.map((seg, idx) => {
                    const pct = seg.percent / 100;
                    const dashLength = circumference * pct;
                    const dashOffset = circumference * cumulativePercent;
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
                                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke-width 0.25s ease',
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
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Total</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#e2e8f0' }}>₹{total?.toLocaleString()}</div>
            </div>
            {/* Hover tooltip */}
            {hoveredIdx !== null && segments[hoveredIdx] && (
                <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${segments[hoveredIdx].color}55`,
                    color: '#e2e8f0',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: `0 4px 20px ${segments[hoveredIdx].color}22`,
                    pointerEvents: 'none',
                    animation: 'fadeScaleIn 0.2s ease-out',
                }}>
                    {segments[hoveredIdx].label}: {segments[hoveredIdx].percent}%
                </div>
            )}
        </div>
    );
};

/* ─── Section Colors ─── */
const SECTION_COLORS = {
    accommodation: '#f97316',
    transport: '#0ea5e9',
    spots: '#10b981',
    itinerary: '#fbbf24',
    activities: '#f43f5e',
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
        { label: 'Accommodation', color: '#f97316', percent: getPct(hotelCost) },
        { label: 'Transport', color: '#0ea5e9', percent: getPct(transportCost) },
        { label: 'Spots', color: '#10b981', percent: getPct(spotsCost) },
        { label: 'Buffer', color: '#fbbf24', percent: Math.max(0, 100 - getPct(hotelCost) - getPct(transportCost) - getPct(spotsCost)) },
    ];

    /* ─── Section Renderer Helper ─── */
    const renderAccordion = (key, title, children, dotColor) => (
        <div className="accordion-card animate-entrance" style={{ 
            borderLeft: expandedSections[key] ? `3px solid ${dotColor}` : '3px solid transparent',
            transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
            ...(expandedSections[key] ? { boxShadow: `inset 3px 0 12px -6px ${dotColor}44` } : {})
        }}>
            <div className="accordion-header" onClick={() => toggleSection(key)}>
                <h3>
                    <span className="section-dot" style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}66` }} />
                    {title}
                </h3>
                <span className={`accordion-chevron ${expandedSections[key] ? 'open' : ''}`}>
                    <IconChevronDown />
                </span>
            </div>
            {expandedSections[key] && (
                <div className="accordion-body">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="trip-details-tab" style={{ maxWidth: '800px', margin: '0 auto', color: '#e2e8f0' }}>
            
            {/* ─── Budget Bar ─── */}
            <div className="budget-bar animate-entrance">
                <div className="budget-amount">
                    <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>Total Budget</span>
                    <span style={{ margin: '0 6px', color: '#334155' }}>·</span>
                    <span><span className="currency">₹</span>{trip.total_budget?.toLocaleString()}</span>
                </div>
                <button 
                    onClick={handleDownloadHTML}
                    className="download-btn-v2 ripple-btn"
                >
                    <IconDownload /> Download
                </button>
            </div>

            {/* ─── Group Members ─── */}
            {trip.member_ids && trip.member_ids.length > 0 && (
                <div className="accordion-card animate-entrance" style={{ marginBottom: '20px' }}>
                    <div className="accordion-header" onClick={() => toggleSection('members')}>
                        <h3>
                            <span className="section-dot" style={{ background: '#0ea5e9' }} />
                            Group Members
                        </h3>
                        <span className={`accordion-chevron ${expandedSections.members ? 'open' : ''}`}>
                            <IconChevronDown />
                        </span>
                    </div>
                    {expandedSections.members && (
                        <div className="accordion-body">
                            {loadingMembers ? (
                                <p style={{ color: '#94a3b8', margin: 0 }}>Loading members...</p>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {members.map(member => (
                                        <div key={member.id} className="member-card">
                                            <div className="member-avatar">
                                                {member.avatar_url ? (
                                                    <img src={member.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    member.full_name?.charAt(0) || member.username?.charAt(0) || 'U'
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', fontWeight: 600 }}>
                                                    {member.full_name || member.username}
                                                    {member.id === trip.user_id && <span className="owner-badge">Owner</span>}
                                                </h4>
                                                {member.username && <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '12px' }}>@{member.username}</p>}
                                            </div>
                                            <button 
                                                className="member-view-btn"
                                                onClick={() => setViewProfile(member)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ─── 1. Accommodation ─── */}
            {renderAccordion('accommodation', 'Accommodation', (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                    <div><span className="label">Days of stay</span><br/> {data.hotel?.days || data.preferences?.days || 1}</div>
                    <div><span className="label">Name of hotel</span><br/> {data.hotel?.name || 'Not selected'}</div>
                    <div><span className="label">Single night price</span><br/> ₹{Math.round(hotelCost / (data.hotel?.days || data.preferences?.days || 1))}</div>
                    <div><span className="label">Total price</span><br/> ₹{hotelCost}</div>
                    <div style={{ gridColumn: '1 / -1', marginTop: '8px', padding: '10px 14px', background: 'rgba(249, 115, 22, 0.06)', borderRadius: '10px', border: '1px solid rgba(249, 115, 22, 0.1)' }}>
                        <span className="label">Budget Percentage</span> <strong style={{ color: '#f97316' }}>{getPct(hotelCost)}%</strong> of total budget
                    </div>
                </div>
            ), SECTION_COLORS.accommodation)}

            {/* ─── 2. Transport ─── */}
            {renderAccordion('transport', 'Transport', (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                    <div><span className="label">Medium</span><br/> {data.transport?.medium || 'N/A'}</div>
                    <div><span className="label">Class</span><br/> {data.transport?.class || 'Standard'}</div>
                    <div><span className="label">From</span><br/> {data.transport?.from || 'Origin'}</div>
                    <div><span className="label">To</span><br/> {data.transport?.to || trip.destination}</div>
                    <div><span className="label">Distance & Time</span><br/> {data.transport?.distance ? data.transport.distance + ' km' : 'N/A'}</div>
                    <div><span className="label">Round Trip Price</span><br/> ₹{transportCost}</div>
                    <div style={{ gridColumn: '1 / -1', marginTop: '8px', padding: '10px 14px', background: 'rgba(14, 165, 233, 0.06)', borderRadius: '10px', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                        <span className="label">Budget Percentage</span> <strong style={{ color: '#0ea5e9' }}>{getPct(transportCost)}%</strong> of total budget
                    </div>
                </div>
            ), SECTION_COLORS.transport)}

            {/* ─── 3. Spots ─── */}
            {renderAccordion('spots', 'Spots', (
                <>
                    {data.spots && data.spots.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {data.spots.map((spot, idx) => (
                                <SpotItem key={idx} spot={spot} theme={{ primary: '#10b981' }} groupSize={groupSize} />
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: '#64748b' }}>No specific spots tracked in budget.</p>
                    )}
                    <div style={{ marginTop: '16px', fontWeight: 700, textAlign: 'right', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '14px', fontSize: '15px' }}>
                        Total Spots Cost: <span style={{ color: '#10b981' }}>₹{spotsCost}</span> <span style={{ color: '#64748b', fontSize: '13px' }}>({getPct(spotsCost)}%)</span>
                    </div>
                </>
            ), SECTION_COLORS.spots)}

            {/* ─── 4. Itinerary ─── */}
            {renderAccordion('itinerary', 'Itinerary', (
                <>
                    {aiData?.itinerary ? (
                        <div className="itinerary-timeline">
                            {aiData.itinerary.map((day, idx) => (
                                <div key={idx} className="timeline-day" style={{ borderLeftColor: `${SECTION_COLORS.itinerary}33` }}>
                                    <div className="timeline-dot" style={{ background: '#fbbf24', color: 'rgba(251, 191, 36, 0.4)' }} />
                                    <h4 style={{ color: '#fbbf24', margin: '0 0 14px 0', fontSize: '17px', fontWeight: 700 }}>Day {day.day}: {day.title}</h4>
                                    
                                    {/* Morning */}
                                    <div className="time-of-day-card" style={{ background: 'rgba(249, 115, 22, 0.04)', borderLeft: '3px solid rgba(249, 115, 22, 0.3)' }}>
                                        <div className="time-label" style={{ color: '#f97316' }}>Morning</div>
                                        <div style={{ lineHeight: '1.6', color: '#cbd5e1' }}>{day.morning}</div>
                                    </div>
                                    
                                    {/* Afternoon */}
                                    <div className="time-of-day-card" style={{ background: 'rgba(14, 165, 233, 0.04)', borderLeft: '3px solid rgba(14, 165, 233, 0.3)' }}>
                                        <div className="time-label" style={{ color: '#0ea5e9' }}>Afternoon</div>
                                        <div style={{ lineHeight: '1.6', color: '#cbd5e1' }}>{day.afternoon}</div>
                                    </div>
                                    
                                    {/* Evening */}
                                    <div className="time-of-day-card" style={{ background: 'rgba(99, 102, 241, 0.04)', borderLeft: '3px solid rgba(99, 102, 241, 0.25)' }}>
                                        <div className="time-label" style={{ color: '#818cf8' }}>Evening</div>
                                        <div style={{ lineHeight: '1.6', color: '#cbd5e1' }}>{day.evening}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px' }}>
                            <p style={{ marginBottom: '20px', color: '#94a3b8', fontSize: '15px' }}>The daily itinerary wasn't generated for this trip.</p>
                            <button 
                                onClick={handleGenerateItinerary} 
                                disabled={isGenerating}
                                className="ripple-btn"
                                style={{ 
                                    background: isGenerating ? 'transparent' : 'rgba(14, 165, 233, 0.08)', 
                                    border: '2px solid #0ea5e9', 
                                    color: '#38bdf8', 
                                    padding: '12px 28px', 
                                    borderRadius: '12px', 
                                    cursor: isGenerating ? 'default' : 'pointer', 
                                    fontWeight: 700,
                                    transition: 'all 0.3s',
                                    boxShadow: isGenerating ? 'none' : '0 0 20px rgba(14,165,233,0.1)',
                                    letterSpacing: '0.3px',
                                }}
                                onMouseEnter={e => { if (!isGenerating) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 24px rgba(14,165,233,0.25)'; }}}
                                onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = isGenerating ? 'none' : '0 0 20px rgba(14,165,233,0.1)'; }}
                            >
                                {isGenerating ? 'Generating Itinerary...' : <><IconSparkle /> Generate Itinerary Now</>}
                            </button>
                        </div>
                    )}
                </>
            ), SECTION_COLORS.itinerary)}

            {/* ─── 5. Activities / Food / Emergency ─── */}
            {renderAccordion('activities', 'Activities / Food & Emergency', (
                <>
                    {/* Buffer Card */}
                    <div className="category-card" style={{ 
                        background: bufferCost >= 0 
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(14, 165, 233, 0.05))' 
                            : 'rgba(248, 113, 113, 0.06)',
                        borderColor: bufferCost >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                    }}>
                        <strong style={{ color: '#94a3b8' }}>Remaining Buffer </strong>
                        <span style={{ color: bufferCost >= 0 ? '#34d399' : '#fb7185', fontSize: '20px', fontWeight: 800, marginLeft: '8px' }}>₹{bufferCost}</span>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Covers food, activities and in-travel spot-by-spot expenses.</div>
                    </div>

                    {/* Festivals */}
                    {aiData?.festivals && aiData.festivals.length > 0 && (
                        <div className="category-card">
                            <div className="category-header" style={{ color: '#fbbf24' }}>
                                <IconParty /> Festivals & Events
                            </div>
                            <ul style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                                {aiData.festivals.map((f, i) => <li key={i} style={{ marginBottom: '4px' }}>{typeof f === 'string' ? f : f.name || JSON.stringify(f)}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* Activities */}
                    {aiData?.activities && aiData.activities.length > 0 && (
                        <div className="category-card">
                            <div className="category-header" style={{ color: '#38bdf8' }}>
                                <IconTarget /> Recommended Activities
                            </div>
                            <ul style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                                {aiData.activities.map((a, i) => (
                                    <li key={i} style={{ marginBottom: '8px' }}>
                                        <strong>{typeof a === 'string' ? a : a.name}</strong>
                                        {typeof a === 'object' && a.description && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{a.description}</div>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Food */}
                    {aiData?.foodRecommendations && aiData.foodRecommendations.length > 0 && (
                        <div className="category-card">
                            <div className="category-header" style={{ color: '#fb923c' }}>
                                <IconUtensils /> Food Recommendations
                            </div>
                            <ul style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                                {aiData.foodRecommendations.map((f, i) => (
                                    <li key={i} style={{ marginBottom: '8px' }}>
                                        <strong>{f.mustTry && <><IconStar /> </>}{typeof f === 'string' ? f : f.name}</strong>
                                        {typeof f === 'object' && f.description && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{f.description}</div>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Emergency */}
                    {aiData?.localEmergency && (
                        <div className="category-card" style={{ background: 'rgba(248, 113, 113, 0.04)', borderColor: 'rgba(248, 113, 113, 0.12)' }}>
                            <div className="category-header" style={{ color: '#fb7185' }}>
                                <IconSiren /> Emergency Contacts
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                                {aiData.localEmergency.map((e, idx) => (
                                    <li key={idx} style={{ padding: '8px 12px', background: 'rgba(248, 113, 113, 0.04)', borderRadius: '10px' }}>
                                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{e.label}</div>
                                        <div style={{ fontWeight: 700, fontSize: '16px', color: '#e2e8f0', marginTop: '2px' }}>{e.number}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {!aiData?.activities && !aiData?.festivals && !aiData?.localEmergency && !aiData?.foodRecommendations && (
                        <p style={{ color: '#64748b', fontStyle: 'italic' }}>AI data not generated for this trip.</p>
                    )}
                </>
            ), SECTION_COLORS.activities)}

            {/* ─── Donut Chart Section ─── */}
            <div className="donut-container animate-entrance">
                <h3 className="donut-title">Budget Breakdown</h3>
                
                <DonutChart segments={pieSegments} total={trip.total_budget} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', width: '100%', maxWidth: '480px', marginTop: '36px' }}>
                    {pieSegments.map((seg, idx) => (
                        <div key={idx} className="legend-item">
                            <span style={{ background: seg.color, boxShadow: `0 0 8px ${seg.color}33` }} /> 
                            <div>{seg.label}<br/><strong style={{ color: seg.color }}>{seg.percent}%</strong></div>
                        </div>
                    ))}
                </div>
            </div>

            {viewProfile && (
                <ViewProfileModal userProfile={viewProfile} onClose={() => setViewProfile(null)} />
            )}
        </div>
    );
};

export default TripDetailsTab;
