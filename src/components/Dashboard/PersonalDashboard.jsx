import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TripDetailsTab from './TripDetailsTab';
import SavingsPlannerTab from './SavingsPlannerTab';
import ProfileTab from './ProfileTab';
import FriendRequestsTab from './FriendRequestsTab';
import './Dashboard.css';

/* ─── Monochrome SVG Icon ─── */
const IconTrash = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
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
    }, [user]);

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
                                    <h2 style={{ margin: 0, background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                        {section === 'savings' ? 'Savings Track' : section === 'requests' ? 'Friend Requests' : 'Saved Trips'}
                                    </h2>
                                </div>
                                
                                {section !== 'requests' && (
                                <div className="trip-selector">
                                    <label style={{ color: '#94a3b8' }}>Select Trip: </label>
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
                                        {trips.map(trip => (
                                            <option key={trip.id} value={trip.id} style={{ background: '#0a0a0a', color: '#fff' }}>
                                                {trip.trip_data?.preferences?.days ? `${trip.trip_data.preferences.days}-days , ` : ''}{trip.destination}
                                            </option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={handleDeleteTrip}
                                        style={{ 
                                            background: 'rgba(239,68,68,0.08)', 
                                            border: '1px solid rgba(239,68,68,0.3)', 
                                            color: '#ef4444', 
                                            padding: '8px 14px', 
                                            borderRadius: '10px', 
                                            cursor: 'pointer', 
                                            marginLeft: '10px',
                                            transition: 'all 0.3s',
                                            fontWeight: '600',
                                        }}
                                        title="Delete Trip"
                                        onMouseEnter={e => { e.target.style.background = 'rgba(239,68,68,0.15)'; e.target.style.borderColor = '#ef4444'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 16px rgba(239,68,68,0.2)'; }}
                                        onMouseLeave={e => { e.target.style.background = 'rgba(239,68,68,0.08)'; e.target.style.borderColor = 'rgba(239,68,68,0.3)'; e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
                                    >
                                        <IconTrash /> Delete
                                    </button>
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
            </div>
        );
    };

    return renderContent();
};

export default PersonalDashboard;
