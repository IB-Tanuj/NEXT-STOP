import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TripDetailsTab from './TripDetailsTab';
import SavingsPlannerTab from './SavingsPlannerTab';
import ProfileTab from './ProfileTab';
import FriendRequestsTab from './FriendRequestsTab';
import ConfirmLeaveModal from './ConfirmLeaveModal';
import './Dashboard.css';

/* ─── Monochrome SVG Icon ─── */
const IconTrash = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
);

const IconLeave = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const PersonalDashboard = () => {
    const { section } = useParams();
    const navigate = useNavigate();
    const { user, session } = useAuth();
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [tripType, setTripType] = useState('solo'); // 'solo' or 'group'

    useEffect(() => {
        const fetchTrips = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                // We assume there's an API route /api/saved-trips 
                // Alternatively, we could fetch directly from supabase here
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/saved-trips`, {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token || ''}`
                    }
                });
                
                if (!res.ok) throw new Error('Failed to fetch trips');
                
                const data = await res.json();
                setTrips(data);
                if (data.length > 0) setSelectedTrip(data[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [user, session]);

    const filteredTrips = trips.filter(t => tripType === 'solo' ? (!t.member_ids || t.member_ids.length === 0) : (t.member_ids && t.member_ids.length > 0));

    useEffect(() => {
        if (filteredTrips.length > 0 && !filteredTrips.find(t => t.id === selectedTrip?.id)) {
            setSelectedTrip(filteredTrips[0]);
        } else if (filteredTrips.length === 0) {
            setSelectedTrip(null);
        }
    }, [tripType, trips]);

    if (!user) return <div className="dashboard-container" style={{ paddingTop: '100px' }}><h2>Please log in to view your dashboard.</h2></div>;
    if (loading) return <div className="dashboard-container" style={{ paddingTop: '100px' }}><div className="loader"></div></div>;
    if (error) return <div className="dashboard-container" style={{ paddingTop: '100px' }}><p className="error">{error}</p></div>;

    const handleUpdateTrip = (updatedTrip) => {
        setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
        setSelectedTrip(updatedTrip);
    };

    const handleDeleteTrip = async () => {
        if (!selectedTrip) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete the trip to ${selectedTrip.destination}?`);
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/saved-trips/${selectedTrip.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.access_token || ''}`
                }
            });

            if (!res.ok) throw new Error('Failed to delete trip');

            const updatedTrips = trips.filter(t => t.id !== selectedTrip.id);
            setTrips(updatedTrips);
            if (updatedTrips.length > 0) {
                setSelectedTrip(updatedTrips[0]);
            } else {
                setSelectedTrip(null);
            }
        } catch (err) {
            console.error("Error deleting trip:", err);
            alert("Failed to delete trip");
        }
    };

    const handleLeaveTrip = async () => {
        if (!selectedTrip) return;
        setIsLeaving(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/saved-trips/${selectedTrip.id}/leave`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token || ''}`
                }
            });

            if (!res.ok) throw new Error('Failed to leave trip');

            const updatedTrips = trips.filter(t => t.id !== selectedTrip.id);
            setTrips(updatedTrips);
            if (updatedTrips.length > 0) {
                setSelectedTrip(updatedTrips[0]);
            } else {
                setSelectedTrip(null);
            }
            setIsLeaveModalOpen(false);
        } catch (err) {
            console.error("Error leaving trip:", err);
            alert("Failed to leave trip");
        } finally {
            setIsLeaving(false);
        }
    };

    const renderContent = () => {
        if (section === 'profile') {
            return <ProfileTab />;
        }

        return (
            <div className="dashboard-container" style={{ paddingTop: '100px' }}>
                {(() => {
                    if (trips.length === 0 && section !== 'requests') {
                        return (
                            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <h2>Your Travel Passport</h2>
                                <p style={{ color: '#aaa', marginTop: '10px' }}>You haven't saved any trips yet. Head over to the Budget Calculator to plan your next adventure!</p>
                            </div>
                        );
                    }

                    return (
                        <>
                            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <button 
                                        onClick={() => navigate('/app')}
                                        style={{ 
                                            background: 'transparent', 
                                            border: '1px solid rgba(6,182,212,0.3)', 
                                            color: '#06b6d4', 
                                            padding: '6px 14px', 
                                            borderRadius: '8px', 
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            fontWeight: '600',
                                        }}
                                        onMouseEnter={e => { e.target.style.background = 'rgba(6,182,212,0.1)'; e.target.style.borderColor = '#06b6d4'; e.target.style.transform = 'translateX(-2px)'; }}
                                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(6,182,212,0.3)'; e.target.style.transform = 'none'; }}
                                    >
                                        ← Back
                                    </button>
                                    <h2 style={{ margin: 0, paddingBottom: '0.1em', lineHeight: '1.2', background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                        {section === 'savings' ? 'Savings Track' : section === 'requests' ? 'Friend Requests' : 'Saved Trips'}
                                    </h2>
                                </div>
                                
                                {section !== 'requests' && (
                                <div className="trip-selector" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
                                        <button 
                                            onClick={() => setTripType('solo')}
                                            style={{
                                                padding: '6px 16px',
                                                borderRadius: '20px',
                                                border: '1px solid',
                                                borderColor: tripType === 'solo' ? '#06b6d4' : 'rgba(255,255,255,0.1)',
                                                background: tripType === 'solo' ? 'rgba(6,182,212,0.1)' : 'transparent',
                                                color: tripType === 'solo' ? '#06b6d4' : '#94a3b8',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            SOLO
                                        </button>
                                        <button 
                                            onClick={() => setTripType('group')}
                                            style={{
                                                padding: '6px 16px',
                                                borderRadius: '20px',
                                                border: '1px solid',
                                                borderColor: tripType === 'group' ? '#06b6d4' : 'rgba(255,255,255,0.1)',
                                                background: tripType === 'group' ? 'rgba(6,182,212,0.1)' : 'transparent',
                                                color: tripType === 'group' ? '#06b6d4' : '#94a3b8',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            GROUP
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <label style={{ color: '#94a3b8', marginRight: '8px' }}>Select Trip: </label>
                                        <select 
                                            value={selectedTrip?.id || ''} 
                                            onChange={(e) => setSelectedTrip(trips.find(t => t.id === e.target.value))}
                                            style={{ 
                                                padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(6,182,212,0.2)', 
                                                background: '#0f172a', color: '#eef7f1', cursor: 'pointer', outline: 'none',
                                                transition: 'border-color 0.3s, box-shadow 0.3s',
                                            }}
                                            onFocus={e => { e.target.style.borderColor = '#06b6d4'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(6,182,212,0.2)'; e.target.style.boxShadow = 'none'; }}
                                        >
                                            {filteredTrips.map(trip => (
                                                <option key={trip.id} value={trip.id} style={{ background: '#0a0a0a', color: '#fff' }}>
                                                    {trip.trip_data?.preferences?.days ? `${trip.trip_data.preferences.days}-days , ` : ''}{trip.destination}
                                                </option>
                                            ))}
                                        </select>
                                    
                                    {selectedTrip && selectedTrip.user_id === user.id ? (
                                        <button 
                                            onClick={handleDeleteTrip}
                                            style={{ 
                                                background: 'rgba(239,68,68,0.08)', 
                                                border: '1px solid rgba(239,68,68,0.3)', 
                                                color: '#ef4444', padding: '6px 14px', borderRadius: '8px', 
                                                cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold',
                                                marginLeft: '15px', display: 'flex', alignItems: 'center', gap: '6px'
                                            }}
                                            onMouseEnter={e => { e.target.style.background = 'rgba(239,68,68,0.15)'; e.target.style.boxShadow = '0 0 10px rgba(239,68,68,0.2)'; }}
                                            onMouseLeave={e => { e.target.style.background = 'rgba(239,68,68,0.08)'; e.target.style.boxShadow = 'none'; }}
                                        >
                                            <IconTrash /> Delete Trip
                                        </button>
                                    ) : selectedTrip ? (
                                        <button 
                                            onClick={() => setIsLeaveModalOpen(true)}
                                            style={{ 
                                                background: 'rgba(239,68,68,0.08)', 
                                                border: '1px solid rgba(239,68,68,0.3)', 
                                                color: '#ef4444', padding: '6px 14px', borderRadius: '8px', 
                                                cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold',
                                                marginLeft: '15px', display: 'flex', alignItems: 'center', gap: '6px'
                                            }}
                                            onMouseEnter={e => { e.target.style.background = 'rgba(239,68,68,0.15)'; e.target.style.boxShadow = '0 0 10px rgba(239,68,68,0.2)'; }}
                                            onMouseLeave={e => { e.target.style.background = 'rgba(239,68,68,0.08)'; e.target.style.boxShadow = 'none'; }}
                                        >
                                            <IconLeave /> Leave
                                        </button>
                                    ) : null}
                                    </div>
                                </div>
                                )}
                            </header>

                            <main className="dashboard-content">
                                {section === 'trips' && selectedTrip && (
                                    <TripDetailsTab trip={selectedTrip} onUpdate={handleUpdateTrip} />
                                )}
                                {section === 'savings' && selectedTrip && (
                                    <SavingsPlannerTab trip={selectedTrip} onUpdate={handleUpdateTrip} />
                                )}
                                {section === 'requests' && (
                                    <FriendRequestsTab />
                                )}
                            </main>
                        </>
                    );
                })()}

                {isLeaveModalOpen && selectedTrip && (
                    <ConfirmLeaveModal
                        isOpen={isLeaveModalOpen}
                        trip={selectedTrip}
                        onClose={() => setIsLeaveModalOpen(false)}
                        onConfirm={handleLeaveTrip}
                        loading={isLeaving}
                    />
                )}
            </div>
        );
    };

    return renderContent();
};

export default PersonalDashboard;
