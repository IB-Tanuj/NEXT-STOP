import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const ProfileTab = () => {
    const { user, profile } = useAuth();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (profile?.unique_id) {
            navigator.clipboard.writeText(profile.unique_id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="profile-tab" style={{ padding: '40px 0', textAlign: 'center' }}>
            <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                backgroundColor: '#ff4757', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '40px', margin: '0 auto 20px'
            }}>
                {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h2>My Profile</h2>
            <p style={{ color: '#aaa', fontSize: '18px', marginTop: '10px' }}>
                {user?.email}
            </p>
            
            {profile?.unique_id && (
                <div style={{
                    marginTop: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#ffffff11',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    border: '1px solid #4ade8033'
                }}>
                    <span style={{ color: '#aaa', fontSize: '14px' }}>Unique ID:</span>
                    <strong style={{ color: '#4ade80', fontSize: '18px', letterSpacing: '2px' }}>
                        {profile.unique_id}
                    </strong>
                    <button
                        onClick={handleCopy}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: copied ? '#4ade80' : '#aaa',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginLeft: '5px',
                            transition: 'all 0.2s'
                        }}
                        title="Copy to clipboard"
                    >
                        {copied ? '✓ Copied' : '📋'}
                    </button>
                </div>
            )}

            <div style={{ marginTop: '40px', padding: '20px', background: '#ffffff0a', borderRadius: '12px', display: 'inline-block', textAlign: 'left', minWidth: '300px' }}>
                <h4 style={{ color: '#ff4757', marginBottom: '10px' }}>Account Information</h4>
                <p><strong>Member since:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
                <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#888' }}>More profile settings coming soon...</p>
            </div>
        </div>
    );
};

export default ProfileTab;
