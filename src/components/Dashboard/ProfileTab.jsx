import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EditProfileModal from './EditProfileModal';
import './ProfileTab.css';

const ProfileTab = () => {
    const { user, profile } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [localProfile, setLocalProfile] = useState(profile);
    const [activeTab, setActiveTab] = useState('wanderlogs');

    // Use local profile if updated, else fallback to context profile
    const currentProfile = localProfile || profile || {};

    const handleSaveProfile = (updatedProfile) => {
        setLocalProfile(updatedProfile);
        setIsEditModalOpen(false);
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>{currentProfile.username || 'set_username'}</h2>
                <div className="settings-icon">⚙️</div>
            </div>

            <div className="profile-stats-row">
                <div className="avatar-container">
                    {user?.email?.charAt(0).toUpperCase()}
                    <span className="avatar-note">Note...</span>
                </div>
                
                <div className="stats-info">
                    <div className="stat-item">
                        <span className="count">0</span>
                        <span className="label">Wanderlogs</span>
                    </div>
                    <div className="stat-item">
                        <span className="count">0</span>
                        <span className="label">Friends</span>
                    </div>
                </div>
            </div>

            <div className="profile-bio-section">
                <div className="display-name">
                    {currentProfile.unique_id || 'UID'}
                    {currentProfile.gender && (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            • {currentProfile.gender}
                        </span>
                    )}
                </div>
                
                {currentProfile.tags && currentProfile.tags.length > 0 && (
                    <div className="profile-tags">
                        {currentProfile.tags.map(tag => (
                            <span key={tag} className="badge">{tag}</span>
                        ))}
                    </div>
                )}
                
                {currentProfile.bio && (
                    <div className="bio-text">
                        {currentProfile.bio}
                    </div>
                )}
                
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    @{currentProfile.username || 'username'}
                </div>
            </div>

            <div className="profile-actions">
                <button className="action-btn" onClick={() => setIsEditModalOpen(true)}>
                    Edit profile
                </button>
                <button className="action-btn" onClick={() => alert("Search Friends feature coming soon!")}>
                    Search friends
                </button>
            </div>

            <div className="profile-tabs">
                <button 
                    className={`profile-tab-btn ${activeTab === 'wanderlogs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('wanderlogs')}
                >
                    ⊞
                </button>
                <button 
                    className={`profile-tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    🔖
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'wanderlogs' ? (
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📷</div>
                        <h3>No Wanderlogs Yet</h3>
                        <p>Share your trips and adventures here.</p>
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔖</div>
                        <h3>No Saved Trips</h3>
                        <p>Save trips to view them later.</p>
                    </div>
                )}
            </div>

            {isEditModalOpen && (
                <EditProfileModal 
                    profile={currentProfile} 
                    user={user} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={handleSaveProfile}
                />
            )}
        </div>
    );
};

export default ProfileTab;
