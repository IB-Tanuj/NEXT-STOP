import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EditProfileModal from './EditProfileModal';
import SearchFriendsModal from './SearchFriendsModal';
import FriendsListModal from './FriendsListModal';
import './ProfileTab.css';

/* ─── Monochrome SVG Icons ─── */
const IconPin = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);

const IconWallet = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/>
    </svg>
);

const IconLogout = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

const IconSettings = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
);

const IconCamera = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
    </svg>
);

const IconBookmark = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
);

const IconGrid = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
    </svg>
);

const SettingsMenuModal = ({ onClose, onEditProfile, onLogout }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="settings-menu-modal" onClick={e => e.stopPropagation()}>
                <div className="settings-menu-header">
                    <h3>Settings</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="settings-menu-list">
                    <button className="settings-list-btn" onClick={() => { onClose(); onEditProfile(); }}>
                        Edit Profile
                    </button>
                    <button className="settings-list-btn" onClick={() => alert("Notification feature coming soon!")}>
                        Notification
                    </button>
                    <button className="settings-list-btn" onClick={() => alert("Privacy feature coming soon!")}>
                        Privacy
                    </button>
                    <button className="settings-list-btn" onClick={() => alert("Website Permissions feature coming soon!")}>
                        Website Permissions
                    </button>
                    <button className="settings-list-btn" onClick={() => alert("Terms and Condition coming soon!")}>
                        Terms and Condition
                    </button>
                    <button className="settings-list-btn logout-list-btn" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfileTab = () => {
    const navigate = useNavigate();
    const { user, profile, session, logout } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isFriendsListModalOpen, setIsFriendsListModalOpen] = useState(false);
    const [localProfile, setLocalProfile] = useState(null);
    const [friendsCount, setFriendsCount] = useState(0);
    const [activeTab, setActiveTab] = useState('wanderlogs');

    // Use local profile if updated, else fallback to context profile
    const currentProfile = localProfile || profile || {};

    useEffect(() => {
        const fetchFriendsCount = async () => {
            if (!session?.access_token) return;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/friends`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFriendsCount(data.length || 0);
                }
            } catch (error) {
                console.error('Error fetching friends count:', error);
            }
        };

        if (user) {
            fetchFriendsCount();
        }
    }, [user, session]);

    const handleSaveProfile = (updatedProfile) => {
        setLocalProfile(updatedProfile);
        setIsEditModalOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Failed to logout');
        }
    };

    return (
        <div className="profile-wrapper">
            {/* Floating Sidebar */}
            <div className="profile-sidebar">
                <button className="sidebar-btn sidebar-btn--trips" onClick={() => navigate('/dashboard/trips')} title="Saved Trips">
                    <IconPin />
                </button>
                <button className="sidebar-btn sidebar-btn--savings" onClick={() => navigate('/dashboard/savings')} title="Savings Tracker">
                    <IconWallet />
                </button>
                <button className="sidebar-btn sidebar-btn--exit" onClick={() => navigate('/app')} title="Exit">
                    <IconLogout />
                </button>
                <button className="sidebar-btn sidebar-btn--settings" onClick={() => setIsSettingsMenuOpen(true)} title="Settings">
                    <IconSettings />
                </button>
            </div>

            <div className="profile-container">
                <div className="profile-header">
                    <h2>{currentProfile.username || currentProfile.full_name || 'set_username'}</h2>
                </div>

                <div className="profile-stats-row">
                    <div className="avatar-container" style={{ overflow: 'hidden', position: 'relative' }}>
                        {currentProfile.avatar_url ? (
                            <img src={currentProfile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            user?.email?.charAt(0).toUpperCase()
                        )}
                    </div>
                    
                    <div className="stats-info">
                        <div className="stat-item">
                            <span className="count">0</span>
                            <span className="label">Wanderlogs</span>
                        </div>
                        <div className="stat-item" onClick={() => setIsFriendsListModalOpen(true)} style={{ cursor: 'pointer' }}>
                            <span className="count">{friendsCount}</span>
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
                        @{currentProfile.username || currentProfile.full_name || 'username'}
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="action-btn" onClick={() => setIsEditModalOpen(true)}>
                        Edit profile
                    </button>
                    <button className="action-btn" onClick={() => setIsSearchModalOpen(true)}>
                        Search friends
                    </button>
                </div>

                <div className="profile-tabs">
                    <button 
                        className={`profile-tab-btn ${activeTab === 'wanderlogs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wanderlogs')}
                    >
                        <IconGrid />
                    </button>
                    <button 
                        className={`profile-tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('saved')}
                    >
                        <IconBookmark />
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'wanderlogs' ? (
                        <div>
                            <IconCamera />
                            <h3>No Wanderlogs Yet</h3>
                            <p>Share your trips and adventures here.</p>
                        </div>
                    ) : (
                        <div>
                            <IconBookmark />
                            <h3>No wanderlogs saved</h3>
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

                {isSearchModalOpen && (
                    <SearchFriendsModal 
                        isOpen={isSearchModalOpen}
                        onClose={() => setIsSearchModalOpen(false)}
                    />
                )}

                {isFriendsListModalOpen && (
                    <FriendsListModal 
                        isOpen={isFriendsListModalOpen}
                        onClose={() => setIsFriendsListModalOpen(false)}
                        onFriendRemoved={() => setFriendsCount(prev => Math.max(0, prev - 1))}
                    />
                )}

                {isSettingsMenuOpen && (
                    <SettingsMenuModal 
                        onClose={() => setIsSettingsMenuOpen(false)}
                        onEditProfile={() => setIsEditModalOpen(true)}
                        onLogout={handleLogout}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfileTab;
