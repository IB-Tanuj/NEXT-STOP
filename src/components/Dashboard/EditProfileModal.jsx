import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabase';
import './ProfileTab.css';

const AVAILABLE_TAGS = [
    'Solo', 'Group', 'Beach', 'Mountain', 'Adventure', 
    'Cafe Collector', 'Cuisine Taster', 'Culture Enthusiast', 'Nature Lover'
];

const EditProfileModal = ({ profile, user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        gender: '',
        dob: '',
        tags: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                bio: profile.bio || '',
                gender: profile.gender || '',
                dob: profile.dob || '',
                tags: profile.tags || []
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tag) => {
        setFormData(prev => {
            const tags = prev.tags || [];
            if (tags.includes(tag)) {
                return { ...prev, tags: tags.filter(t => t !== tag) };
            } else {
                return { ...prev, tags: [...tags, tag] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Update profile in Supabase
            const { data, error: updateError } = await supabase
                .from('profiles')
                .update({
                    username: formData.username,
                    bio: formData.bio,
                    gender: formData.gender,
                    dob: formData.dob || null, // Handle empty date
                    tags: formData.tags
                })
                .eq('id', user.id)
                .select()
                .single();

            if (updateError) {
                // If username is taken, Postgres will throw a unique constraint violation error
                if (updateError.code === '23505' && updateError.message.includes('username')) {
                    throw new Error('Username is already taken.');
                }
                throw updateError;
            }

            onSave(data);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Edit Profile</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                {error && <div style={{ color: '#ff4757', marginBottom: '15px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange}
                            placeholder="e.g. tanuj_19_"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleChange}
                            rows="3"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input 
                            type="date" 
                            name="dob" 
                            value={formData.dob} 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Preference Badges</label>
                        <div className="tags-selector">
                            {AVAILABLE_TAGS.map(tag => (
                                <button 
                                    type="button"
                                    key={tag}
                                    className={`tag-select-btn ${(formData.tags || []).includes(tag) ? 'selected' : ''}`}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
