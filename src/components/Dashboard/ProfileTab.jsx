import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const ProfileTab = () => {
    const { user } = useAuth();

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
            <div style={{ marginTop: '40px', padding: '20px', background: '#ffffff0a', borderRadius: '12px', display: 'inline-block', textAlign: 'left', minWidth: '300px' }}>
                <h4 style={{ color: '#ff4757', marginBottom: '10px' }}>Account Information</h4>
                <p><strong>Member since:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
                <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#888' }}>More profile settings coming soon...</p>
            </div>
        </div>
    );
};

export default ProfileTab;
