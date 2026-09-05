import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import TripDetailsTab from './TripDetailsTab';
import SavingsPlannerTab from './SavingsPlannerTab';
import './Dashboard.css';

const PersonalDashboard = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [activeTab, setActiveTab] = useState('details'); // 'details' | 'savings'
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
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/saved-trips`, {
                    headers: {
                        'Authorization': `Bearer ${user.session?.access_token || ''}`
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

    if (!user) return <div className="dashboard-container"><h2>Please log in to view your dashboard.</h2></div>;
    if (loading) return <div className="dashboard-container"><div className="loader"></div></div>;
    if (error) return <div className="dashboard-container"><p className="error">{error}</p></div>;
    if (trips.length === 0) return (
        <div className="dashboard-container empty-state">
            <h2>Your Travel Passport</h2>
            <p>You haven't saved any trips yet. Head over to the Budget Calculator to plan your next adventure!</p>
        </div>
    );

    const handleUpdateTrip = (updatedTrip) => {
        setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
        setSelectedTrip(updatedTrip);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Your Travel Passport</h2>
                
                <div className="trip-selector">
                    <label>Select Trip: </label>
                    <select 
                        value={selectedTrip?.id || ''} 
                        onChange={(e) => setSelectedTrip(trips.find(t => t.id === e.target.value))}
                    >
                        {trips.map(trip => (
                            <option key={trip.id} value={trip.id}>
                                {trip.destination} ({new Date(trip.created_at).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="dashboard-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Logistics & Itinerary
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'savings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('savings')}
                    >
                        Savings Planner
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                {activeTab === 'details' && selectedTrip && (
                    <TripDetailsTab trip={selectedTrip} onUpdate={handleUpdateTrip} />
                )}
                {activeTab === 'savings' && selectedTrip && (
                    <SavingsPlannerTab trip={selectedTrip} onUpdate={handleUpdateTrip} />
                )}
            </main>
        </div>
    );
};

export default PersonalDashboard;
