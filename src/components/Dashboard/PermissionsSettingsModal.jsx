import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabase';
import './ProfileTab.css';

const PermissionsSettingsModal = ({ profile, onClose, onSave }) => {
    const [permissions, setPermissions] = useState({
        location: false,
        camera: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (profile?.preferences?.permissions) {
            setPermissions(profile.preferences.permissions);
        }
    }, [profile]);

    const handleToggle = (key) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const updatedPreferences = {
                ...profile.preferences,
                permissions: permissions
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
            console.error("Error updating permissions:", err);
            setError(err.message || "Failed to update permission settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content profile-modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Website Permissions</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label className="toggle-label">
                            <div className="toggle-text">
                                <strong>Location Access</strong>
                                <span>Allow NEXT STOP to use your location for nearby recommendations. (If denied, this feature will not be used).</span>
                            </div>
                            <div className={`toggle-switch ${permissions.location ? 'active' : ''}`} onClick={() => handleToggle('location')}>
                                <div className="toggle-knob"></div>
                            </div>
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="toggle-label">
                            <div className="toggle-text">
                                <strong>Camera Access</strong>
                                <span>Allow NEXT STOP to use your camera for profile pictures and posts. (If denied, this feature will not be used).</span>
                            </div>
                            <div className={`toggle-switch ${permissions.camera ? 'active' : ''}`} onClick={() => handleToggle('camera')}>
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

export default PermissionsSettingsModal;
