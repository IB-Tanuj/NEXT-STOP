import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ProfileTab.css'; // Reuse existing styles

const IconSearch = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const SearchFriendsModal = ({ onClose }) => {
    const { session } = useAuth();
    const [searchUid, setSearchUid] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchUid.trim()) return;
        
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || ''}`
                },
                body: JSON.stringify({ targetUid: searchUid.trim() })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || 'Friend request sent!');
                setSearchUid('');
            } else {
                setError(data.error || 'Failed to send request');
            }
        } catch (err) {
            console.error('Error sending friend request:', err);
            setError('Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h3 style={{ marginBottom: '20px', color: '#eef7f1' }}>Search Friends by UID</h3>
                
                <form onSubmit={handleSearch}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>User's Unique ID</label>
                        <input
                            type="text"
                            value={searchUid}
                            onChange={(e) => setSearchUid(e.target.value)}
                            placeholder="e.g. 605D1DCC"
                            style={{ 
                                width: '100%', 
                                padding: '10px 14px', 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                color: '#fff', 
                                borderRadius: '8px',
                                marginTop: '8px'
                            }}
                            required
                        />
                    </div>
                    
                    {message && <div style={{ color: '#10b981', marginBottom: '15px', fontSize: '0.9rem' }}>{message}</div>}
                    {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {loading ? 'Sending...' : <><IconSearch /> Send Friend Request</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SearchFriendsModal;
