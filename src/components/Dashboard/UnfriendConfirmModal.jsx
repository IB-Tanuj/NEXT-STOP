import React from 'react';

const UnfriendConfirmModal = ({ isOpen, onClose, onConfirm, loading, sharedTripsCount }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
            <div 
                className="modal-content" 
                onClick={e => e.stopPropagation()} 
                style={{ 
                    maxWidth: '400px', 
                    padding: '30px',
                    textAlign: 'center'
                }}
            >
                <div style={{ marginBottom: '20px', color: '#ef4444' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                </div>
                
                <h3 style={{ marginBottom: '15px', color: '#fff', fontSize: '20px' }}>Unfriend User?</h3>
                
                {sharedTripsCount > 0 ? (
                    <p style={{ color: '#cbd5e1', marginBottom: '25px', lineHeight: '1.5', fontSize: '15px' }}>
                        By unfriending this user, they will lose access to any trips you created, and you will lose access to any trips they created. Are you sure?
                    </p>
                ) : (
                    <p style={{ color: '#cbd5e1', marginBottom: '25px', lineHeight: '1.5', fontSize: '15px' }}>
                        Are you sure you want to unfriend this user?
                    </p>
                )}
                
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button 
                        onClick={onClose} 
                        disabled={loading}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            flex: 1
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={loading}
                        style={{
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            flex: 1
                        }}
                    >
                        {loading ? 'Processing...' : 'Yes, Unfriend'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnfriendConfirmModal;
