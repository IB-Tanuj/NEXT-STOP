import React from 'react';
import './ProfileTab.css';

const ViewProfileModal = ({ userProfile, onClose }) => {
    if (!userProfile) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', padding: '30px' }}>
                <button className="modal-close" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ margin: 0 }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px', fontWeight: 'bold' }}>
                            {userProfile.avatar_url ? (
                                <img src={userProfile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                (userProfile.full_name?.charAt(0) || userProfile.username?.charAt(0) || 'U').toUpperCase()
                            )}
                        </div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                        <h2 style={{ margin: '0 0 5px 0', color: '#eef7f1', fontSize: '20px' }}>
                            {userProfile.username ? `@${userProfile.username}` : (userProfile.full_name || 'User')}
                        </h2>

                        <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '15px' }}>
                            {userProfile.full_name || ''}
                        </div>

                        {userProfile.bio && (
                            <div style={{ fontSize: '14px', marginBottom: '15px', color: '#cbd5e1', lineHeight: '1.5' }}>
                                {userProfile.bio}
                            </div>
                        )}

                        {userProfile.tags && userProfile.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {userProfile.tags.map(tag => (
                                    <span key={tag} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '15px', fontSize: '12px', color: '#e2e8f0' }}>{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfileModal;
