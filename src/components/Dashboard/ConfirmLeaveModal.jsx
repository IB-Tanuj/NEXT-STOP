import React from 'react';

const ConfirmLeaveModal = ({ isOpen, onClose, onConfirm, loading }) => {
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
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </div>
                
                <h3 style={{ marginBottom: '15px', color: '#fff', fontSize: '20px' }}>Leave Trip?</h3>
                
                <p style={{ color: '#cbd5e1', marginBottom: '25px', lineHeight: '1.5', fontSize: '15px' }}>
                    Are you sure you want to leave this trip? You will lose access to its itinerary and all shared wallets.
                </p>
                
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
                        {loading ? 'Leaving...' : 'Yes, Leave Trip'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmLeaveModal;
