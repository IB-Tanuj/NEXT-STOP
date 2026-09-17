import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ViewProfileModal from './ViewProfileModal';
import './Dashboard.css';

const IconCheck = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const IconX = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const FriendRequestsTab = () => {
    const { session } = useAuth();
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends/requests`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token || ''}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setIncomingRequests(data.incoming || []);
                setOutgoingRequests(data.outgoing || []);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [session]);

    const handleAction = async (requestId, action) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends/${action}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || ''}`
                },
                body: JSON.stringify({ requestId })
            });
            if (res.ok) {
                fetchRequests();
            } else {
                const data = await res.json();
                alert(data.error || "Action failed");
            }
        } catch (error) {
            console.error("Action error", error);
        }
    };

    if (loading) return <div style={{ padding: '20px', color: '#fff' }}>Loading requests...</div>;

    return (
        <div style={{ padding: '20px', color: '#fff', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Friend Requests
            </h2>

            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
                    Incoming ({incomingRequests.length})
                </h3>
                {incomingRequests.length === 0 ? (
                    <p style={{ color: '#94a3b8' }}>No pending incoming requests.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {incomingRequests.map(req => (
                            <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div 
                                    style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                                    onClick={() => setSelectedProfile(req.requester)}
                                >
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                                        {req.requester.avatar_url ? (
                                            <img src={req.requester.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            req.requester.full_name?.charAt(0) || req.requester.username?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{req.requester.full_name || req.requester.username || 'Unknown User'}</div>
                                        {req.requester.username && <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>@{req.requester.username}</div>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => handleAction(req.id, 'accept')}
                                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: '#06b6d4', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                                    >
                                        <IconCheck /> Accept
                                    </button>
                                    <button 
                                        onClick={() => handleAction(req.id, 'reject')}
                                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                                    >
                                        <IconX /> Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
                    Outgoing ({outgoingRequests.length})
                </h3>
                {outgoingRequests.length === 0 ? (
                    <p style={{ color: '#94a3b8' }}>No pending outgoing requests.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {outgoingRequests.map(req => (
                            <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div 
                                    style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                                    onClick={() => setSelectedProfile(req.addressee)}
                                >
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #64748b, #475569)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                                        {req.addressee.avatar_url ? (
                                            <img src={req.addressee.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            req.addressee.full_name?.charAt(0) || req.addressee.username?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{req.addressee.full_name || req.addressee.username || 'Unknown User'}</div>
                                        {req.addressee.username && <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>@{req.addressee.username}</div>}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: '20px', fontSize: '0.85rem' }}>Pending</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedProfile && (
                <ViewProfileModal 
                    userProfile={selectedProfile} 
                    onClose={() => setSelectedProfile(null)} 
                />
            )}
        </div>
    );
};

export default FriendRequestsTab;
