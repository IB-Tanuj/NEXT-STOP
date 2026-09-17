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

// Search profile by Username (returns array of matches)
export const searchByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, bio, tags')
            .ilike('username', `%${username}%`)
            .range(offset, offset + limit - 1)
            .order('username', { ascending: true });

        if (error) {
            console.error('Error searching profile:', error);
            return res.status(500).json({ error: 'Failed to search profile' });
        }

        res.json(data);
    } catch (error) {
        console.error('searchByUsername error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
