import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TripDetailsTab from './TripDetailsTab';
import SavingsPlannerTab from './SavingsPlannerTab';
import ProfileTab from './ProfileTab';
import './Dashboard.css';

const PersonalDashboard = () => {
    const { section } = useParams();
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

    const renderContent = () => {
        if (section === 'profile') {
            return <ProfileTab />;
        }

        if (trips.length === 0) {
            return (
                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <h2>Your Travel Passport</h2>
                    <p style={{ color: '#aaa', marginTop: '10px' }}>You haven't saved any trips yet. Head over to the Budget Calculator to plan your next adventure!</p>
                </div>
            );
        }

        return (
            <>
                <header className="dashboard-header">
                    <h2>{section === 'savings' ? 'Savings Track' : 'Saved Trips'}</h2>
                    
                    <div className="trip-selector">
                        <label>Select Trip: </label>
                        <select 
                            value={selectedTrip?.id || ''} 
                            onChange={(e) => setSelectedTrip(trips.find(t => t.id === e.target.value))}
                            style={{ 
                                padding: '8px 12px', borderRadius: '8px', border: '1px solid #4ade8033', 
                                background: '#ffffff0a', color: '#eef7f1', cursor: 'pointer', outline: 'none'
                            }}
                        >
                            {trips.map(trip => (
                                <option key={trip.id} value={trip.id} style={{ background: '#0a0a0a', color: '#fff' }}>
                                    {trip.trip_data?.preferences?.days ? `${trip.trip_data.preferences.days}-days , ` : ''}{trip.destination}
                                </option>
                            ))}
                        </select>
                    </div>
                </header>

                <main className="dashboard-content">
                    {section === 'trips' && selectedTrip && (
                        <TripDetailsTab trip={selectedTrip} onUpdate={handleUpdateTrip} />
                    )}
                    {section === 'savings' && selectedTrip && (
                        <SavingsPlannerTab trip={selectedTrip} onUpdate={handleUpdateTrip} />
                    )}
                </main>
            </>
        );
    };

    return (
        <div className="dashboard-container" style={{ paddingTop: '100px' }}>
            {renderContent()}
        </div>
    );
};

export default PersonalDashboard;
