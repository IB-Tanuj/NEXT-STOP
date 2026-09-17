import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ViewProfileModal from './ViewProfileModal';
import './ProfileTab.css';

const FriendsListModal = ({ isOpen, onClose, onFriendRemoved }) => {
    const { session } = useAuth();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        if (isOpen && session?.access_token) {
            fetchFriends();
        }
    }, [isOpen, session]);

    const fetchFriends = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFriends(data);
            } else {
                setError('Failed to fetch friends');
            }
        } catch (err) {
            setError('Error loading friends');
        } finally {
            setLoading(false);
        }
    };

    const handleUnfriend = async (friendId, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to unfriend this user?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends/remove`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friendId })
            });
            if (res.ok) {
                setFriends(friends.filter(f => f.id !== friendId));
                if (onFriendRemoved) onFriendRemoved();
            } else {
                alert('Failed to unfriend');
            }
        } catch (err) {
            alert('Error unfriending user');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content search-friends-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Your Friends</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="friends-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '400px', overflowY: 'auto' }}>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: '#ff4757' }}>{error}</p>}
                    {!loading && !error && friends.length === 0 && (
                        <p style={{ color: '#aaa', textAlign: 'center', margin: '20px 0' }}>You have no friends yet.</p>
                    )}
                    {friends.map(friend => (
                        <div key={friend.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <div 
                                style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                                onClick={() => setSelectedProfile(friend)}
                            >
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '18px', overflow: 'hidden' }}>
                                    {friend.avatar_url ? (
                                        <img src={friend.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        friend.full_name?.charAt(0) || friend.username?.charAt(0) || 'U'
                                    )}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>{friend.full_name || friend.username}</h4>
                                    {friend.username && <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13px' }}>@{friend.username}</p>}
                                </div>
                            </div>
                            <button 
                                onClick={(e) => handleUnfriend(friend.id, e)}
                                style={{
                                    background: 'rgba(255, 71, 87, 0.2)',
                                    color: '#ff4757',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '13px'
                                }}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
                </div>
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

export default FriendsListModal;
