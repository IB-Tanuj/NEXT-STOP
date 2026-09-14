import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabase';
import './ProfileTab.css';

const NotificationSettingsModal = ({ profile, onClose, onSave }) => {
    const [preferences, setPreferences] = useState({
        friend_requests: true,
        trip_reminders: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const storageKey = `trip_website_prefs_${profile?.id}`;

    useEffect(() => {
        if (profile?.id) {
            const savedPrefs = localStorage.getItem(storageKey);
            if (savedPrefs) {
                try {
                    const parsed = JSON.parse(savedPrefs);
                    if (parsed.notifications) {
                        setPreferences(parsed.notifications);
                    }
                } catch (e) {
                    console.error("Error parsing preferences from local storage:", e);
                }
            }
        }
    }, [profile, storageKey]);

    const handleToggle = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Get existing preferences to not overwrite permissions
            const existingPrefs = JSON.parse(localStorage.getItem(storageKey) || '{}');
            const updatedPrefs = {
                ...existingPrefs,
                notifications: preferences
            };
            
            localStorage.setItem(storageKey, JSON.stringify(updatedPrefs));
            
            // Just close the modal since we are no longer saving to DB
            onClose();
        } catch (err) {
            console.error("Error updating notifications:", err);
            setError(err.message || "Failed to update notification settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content profile-modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Notifications</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label className="toggle-label">
                            <div className="toggle-text">
                                <strong>Friend Requests</strong>
                                <span>Get notified when someone sends you a friend request.</span>
                            </div>
                            <div className={`toggle-switch ${preferences.friend_requests ? 'active' : ''}`} onClick={() => handleToggle('friend_requests')}>
                                <div className="toggle-knob"></div>
                            </div>
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="toggle-label">
                            <div className="toggle-text">
                                <strong>Trip Reminders</strong>
                                <span>Get notified about your upcoming trips and saved itineraries.</span>
                            </div>
                            <div className={`toggle-switch ${preferences.trip_reminders ? 'active' : ''}`} onClick={() => handleToggle('trip_reminders')}>
                                <div className="toggle-knob"></div>
                            </div>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotificationSettingsModal;
