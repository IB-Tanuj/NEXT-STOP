import supabase from '../config/supabase.js';

// Get current user's profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return res.status(500).json({ error: 'Failed to fetch profile' });
        }

        res.json(data);
    } catch (error) {
        console.error('getProfile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Search profile by Unique ID (for adding friends later)
export const searchByUniqueId = async (req, res) => {
    try {
        const { uid } = req.params;
        if (!uid) {
            return res.status(400).json({ error: 'Unique ID is required' });
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('id, unique_id, full_name, avatar_url')
            .eq('unique_id', uid.toUpperCase())
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'User not found' });
            }
            console.error('Error searching profile:', error);
            return res.status(500).json({ error: 'Failed to search profile' });
        }

        res.json(data);
    } catch (error) {
        console.error('searchByUniqueId error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
