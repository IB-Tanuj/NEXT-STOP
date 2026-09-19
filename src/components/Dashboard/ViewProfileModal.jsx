import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ProfileTab.css';

const IconChevronLeft = () => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const IconGrid = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
    </svg>
);

const IconCamera = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
    </svg>
);

const ViewProfileModal = ({ userProfile, onClose }) => {
    const { session, user } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');
    const [stats, setStats] = useState({ posts: 0, friends: 0, mutuals: 0 });
    
    const [requestStatus, setRequestStatus] = useState('loading'); // 'loading', 'none', 'sending', 'pending_outgoing', 'pending_incoming', 'accepted'

    const handleSendRequest = async () => {
        if (!session?.access_token) return;
        setRequestStatus('sending');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends/request`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ addresseeId: userProfile.id })
            });
            if (res.ok) {
                setRequestStatus('pending_outgoing');
            } else {
                setRequestStatus('none');
                alert('Failed to send request, or request already exists.');
            }
        } catch (err) {
            console.error(err);
            setRequestStatus('none');
            alert('Error sending request.');
        }
    };

    useEffect(() => {
        // Fetch actual friendship status
        const fetchStatus = async () => {
            if (!session?.access_token || !userProfile?.id || user?.id === userProfile.id) return;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends/status/${userProfile.id}`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.status) setRequestStatus(data.status); // 'none', 'accepted', 'pending_incoming', 'pending_outgoing', 'self'
                } else {
                    setRequestStatus('none');
                }
            } catch (err) {
                console.error("Failed to check status", err);
                setRequestStatus('none');
            }
        };

        fetchStatus();
    }, [userProfile.id, session, user]);

    if (!userProfile) return null;

    return (
        <div 
            className="modal-overlay" 
            style={{ zIndex: 1000, background: '#0f172a', alignItems: 'flex-start' }}
            onClick={e => e.stopPropagation()}
        >
            <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#0f172a' }}>
                
                {/* Top Nav Header */}
                <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px', padding: '0 15px' }}>
                    <button onClick={onClose} style={{ position: 'absolute', left: '15px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' }}>
                        <IconChevronLeft />
                    </button>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#fff', textTransform: 'lowercase' }}>
                        {userProfile.username ? userProfile.username : userProfile.full_name}
                    </h3>
                </div>

                <div className="profile-container" style={{ padding: '30px 20px', maxWidth: '600px', margin: '0 auto' }}>
                    <div className="profile-hero">
                        <div className="profile-hero__avatar">
                            <div className="avatar-container" style={{ width: '90px', height: '90px', fontSize: '32px' }}>
                                {userProfile.avatar_url ? (
                                    <img src={userProfile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                ) : (
                                    (userProfile.full_name?.charAt(0) || userProfile.username?.charAt(0) || 'U').toUpperCase()
                                )}
                            </div>
                        </div>

                        <div className="profile-hero__info">
                            <div className="profile-hero__username-row">
                                <h2 className="profile-hero__username">
                                    {userProfile.username ? `@${userProfile.username}` : (userProfile.full_name || 'User')}
                                </h2>
                            </div>

                            <div className="profile-hero__display-name" style={{ marginTop: '4px' }}>
                                {userProfile.full_name || ''}
                            </div>

                            <div className="profile-hero__stats" style={{ margin: '12px 0 8px 0', gap: '25px', display: 'flex', flexWrap: 'wrap' }}>
                                <span className="profile-hero__stat"><strong>{stats.posts}</strong> posts</span>
                                <span className="profile-hero__stat"><strong>{stats.friends}</strong> friends</span>
                                <span className="profile-hero__stat"><strong>{stats.mutuals}</strong> mutuals</span>
                            </div>

                            {userProfile.bio && (
                                <div className="profile-hero__bio" style={{ marginTop: '8px' }}>{userProfile.bio}</div>
                            )}

                            {userProfile.tags && userProfile.tags.length > 0 && (
                                <div className="profile-tags" style={{ marginTop: '12px' }}>
                                    {userProfile.tags.map(tag => (
                                        <span key={tag} className="badge">{tag}</span>
                                    ))}
                                </div>
                            )}

                            {user?.id !== userProfile.id && requestStatus !== 'loading' && requestStatus !== 'self' && (
                                <div style={{ marginTop: '20px' }}>
                                    <button 
                                        onClick={handleSendRequest}
                                        disabled={requestStatus !== 'none'}
                                        style={{
                                            background: requestStatus === 'accepted' ? 'transparent' : requestStatus !== 'none' ? 'rgba(74, 222, 128, 0.1)' : '#06b6d4',
                                            color: requestStatus === 'accepted' ? '#fff' : requestStatus !== 'none' ? '#4ade80' : '#fff',
                                            border: requestStatus === 'accepted' ? '1px solid rgba(255,255,255,0.2)' : requestStatus !== 'none' ? '1px solid rgba(74, 222, 128, 0.3)' : 'none',
                                            padding: '8px 20px',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            cursor: requestStatus !== 'none' ? 'default' : 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {requestStatus === 'none' ? 'Send Friend Request' : 
                                         requestStatus === 'sending' ? 'Sending...' : 
                                         requestStatus === 'accepted' ? 'Friends' :
                                         requestStatus === 'pending_incoming' ? 'Has sent you a request' :
                                         'Request Sent'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-tabs" style={{ marginTop: '20px' }}>
                        <button 
                            className={`profile-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            <IconGrid />
                        </button>
                    </div>

                    <div className="tab-content" style={{ marginTop: '20px', padding: '40px 20px' }}>
                        {activeTab === 'posts' && (
                            <div>
                                <IconCamera />
                                <h3>No Posts Yet</h3>
                                <p style={{ maxWidth: '300px', margin: '10px auto', lineHeight: '1.5' }}>
                                    When {userProfile.full_name || userProfile.username || 'this user'} shares trips, they'll appear here.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewProfileModal;
