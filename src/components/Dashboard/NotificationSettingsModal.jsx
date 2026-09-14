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

    useEffect(() => {
        if (profile?.preferences?.notifications) {
            setPreferences(profile.preferences.notifications);
        }
    }, [profile]);

    const handleToggle = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const updatedPreferences = {
                ...profile.preferences,
                notifications: preferences
            };

            const { data, error: updateError } = await supabase
                .from('profiles')
                .update({ preferences: updatedPreferences })
                .eq('id', profile.id)
                .select()
                .single();

            if (updateError) throw updateError;
            
            onSave(data);
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
