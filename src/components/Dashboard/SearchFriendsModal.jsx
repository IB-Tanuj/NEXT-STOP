import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ViewProfileModal from './ViewProfileModal';
import './ProfileTab.css'; // Reuse existing styles

const IconSearch = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const SearchFriendsModal = ({ onClose }) => {
    const { session, user } = useAuth();
    const [searchUsername, setSearchUsername] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [requestLoadingId, setRequestLoadingId] = useState(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [selectedProfile, setSelectedProfile] = useState(null);
    const LIMIT = 10;

    const performSearch = async (currentOffset, append = false) => {
        if (!searchUsername.trim()) return;
        
        setLoading(true);
        if (!append) {
            setMessage('');
            setError('');
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/user/search/${encodeURIComponent(searchUsername.trim())}?limit=${LIMIT}&offset=${currentOffset}`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token || ''}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                // Filter out the current user just in case
                const filteredData = data.filter(u => u.id !== user.id);
                if (append) {
                    setSearchResults(prev => [...prev, ...filteredData]);
                } else {
                    setSearchResults(filteredData);
                    if (filteredData.length === 0) {
                        setError('No users found.');
                    }
                }
                setHasMore(data.length === LIMIT);
            } else {
                setError(data.error || 'Failed to search users');
            }
        } catch (err) {
            console.error('Error searching users:', err);
            setError('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setOffset(0);
        performSearch(0, false);
    };

    const handleLoadMore = () => {
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
        performSearch(nextOffset, true);
    };

    const handleSendRequest = async (targetUsername, targetId) => {
        setRequestLoadingId(targetId);
        setMessage('');
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || ''}`
                },
                body: JSON.stringify({ targetUsername })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(`Friend request sent to @${targetUsername}!`);
            } else {
                setError(data.error || 'Failed to send request');
            }
        } catch (err) {
            console.error('Error sending friend request:', err);
            setError('Server error');
        } finally {
            setRequestLoadingId(null);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h3 style={{ marginBottom: '20px', color: '#eef7f1' }}>Search Friends</h3>
                
                <form onSubmit={handleSearch} style={{ flexShrink: 0 }}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            value={searchUsername}
                            onChange={(e) => setSearchUsername(e.target.value)}
                            placeholder="Search by username..."
                            style={{ 
                                width: '100%', 
                                padding: '12px 14px', 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                color: '#fff', 
                                borderRadius: '8px',
                            }}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading && offset === 0}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: (loading && offset === 0) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '15px'
                        }}
                    >
                        {(loading && offset === 0) ? 'Searching...' : <><IconSearch /> Search Users</>}
                    </button>
                </form>

                {message && <div style={{ color: '#10b981', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}
                {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
                    {searchResults.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {searchResults.map(userItem => (
                                <div key={userItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div 
                                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1, overflow: 'hidden' }}
                                        onClick={() => setSelectedProfile(userItem)}
                                    >
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px', overflow: 'hidden', flexShrink: 0 }}>
                                            {userItem.avatar_url ? (
                                                <img src={userItem.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                userItem.full_name?.charAt(0) || userItem.username?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {userItem.full_name || userItem.username}
                                            </div>
                                            {userItem.username && (
                                                <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    @{userItem.username}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleSendRequest(userItem.username, userItem.id)}
                                        disabled={requestLoadingId === userItem.id}
                                        style={{
                                            padding: '8px 12px',
                                            background: 'rgba(6, 182, 212, 0.1)',
                                            color: '#06b6d4',
                                            border: '1px solid rgba(6, 182, 212, 0.2)',
                                            borderRadius: '6px',
                                            cursor: requestLoadingId === userItem.id ? 'not-allowed' : 'pointer',
                                            fontWeight: '600',
                                            fontSize: '12px',
                                            whiteSpace: 'nowrap',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        {requestLoadingId === userItem.id ? 'Sending...' : 'Send Request'}
                                    </button>
                                </div>
                            ))}

                            {hasMore && (
                                <button 
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#cbd5e1',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        marginTop: '10px'
                                    }}
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            )}
                        </div>
                    )}
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

export default SearchFriendsModal;
