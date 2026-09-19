import supabase from '../config/supabase.js';

// Send a friend request by Username
export const sendFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetUsername } = req.body;

        if (!targetUsername) {
            return res.status(400).json({ error: 'Target Username is required' });
        }

        // Find user by Username (case-insensitive)
        const { data: targetUser, error: searchError } = await supabase
            .from('profiles')
            .select('id, username')
            .ilike('username', targetUsername)
            .single();

        if (searchError || !targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (targetUser.id === userId) {
            return res.status(400).json({ error: 'You cannot send a friend request to yourself' });
        }

        // Check if a relationship already exists
        const { data: existing, error: existingError } = await supabase
            .from('friendships')
            .select('*')
            .or(`and(requester_id.eq.${userId},addressee_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},addressee_id.eq.${userId})`)
            .maybeSingle();

        if (existing) {
            if (existing.status === 'pending') {
                return res.status(400).json({ error: 'Friend request is already pending' });
            }
            if (existing.status === 'accepted') {
                return res.status(400).json({ error: 'You are already friends' });
            }
            if (existing.status === 'rejected') {
                // Optionally allow re-sending if rejected, or block it. We will allow re-sending by updating to pending
                const { error: updateError } = await supabase
                    .from('friendships')
                    .update({ status: 'pending', requester_id: userId, addressee_id: targetUser.id })
                    .eq('id', existing.id);
                if (updateError) throw updateError;
                return res.json({ message: 'Friend request sent' });
            }
        }

        // Insert new request
        const { error: insertError } = await supabase
            .from('friendships')
            .insert([{
                requester_id: userId,
                addressee_id: targetUser.id,
                status: 'pending'
            }]);

        if (insertError) throw insertError;

        res.json({ message: 'Friend request sent successfully' });

    } catch (error) {
        console.error('sendFriendRequest error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { requestId } = req.body;

        const { error } = await supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('id', requestId)
            .eq('addressee_id', userId)
            .eq('status', 'pending');

        if (error) throw error;
        res.json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error('acceptFriendRequest error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Reject a friend request
export const rejectFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { requestId } = req.body;

        const { error } = await supabase
            .from('friendships')
            .update({ status: 'rejected' })
            .eq('id', requestId)
            .eq('addressee_id', userId)
            .eq('status', 'pending');

        if (error) throw error;
        res.json({ message: 'Friend request rejected' });
    } catch (error) {
        console.error('rejectFriendRequest error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Remove a friend
export const removeFriend = async (req, res) => {
    try {
        const userId = req.user.id;
        const { friendId } = req.body; // friend's profile ID

        const { error } = await supabase
            .from('friendships')
            .delete()
            .eq('status', 'accepted')
            .or(`and(requester_id.eq.${userId},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${userId})`);

        if (error) throw error;

        // Cleanup: Remove the non-owner from trips where the other is the owner
        // 1. Trips where userId is owner, and friendId is in member_ids
        const { data: userTrips } = await supabase
            .from('saved_trips')
            .select('id, member_ids')
            .eq('user_id', userId)
            .contains('member_ids', [friendId]);
        
        if (userTrips && userTrips.length > 0) {
            for (let trip of userTrips) {
                const newMembers = trip.member_ids.filter(id => id !== friendId);
                await supabase.from('saved_trips').update({ member_ids: newMembers }).eq('id', trip.id);
            }
        }

        // 2. Trips where friendId is owner, and userId is in member_ids
        const { data: friendTrips } = await supabase
            .from('saved_trips')
            .select('id, member_ids')
            .eq('user_id', friendId)
            .contains('member_ids', [userId]);
        
        if (friendTrips && friendTrips.length > 0) {
            for (let trip of friendTrips) {
                const newMembers = trip.member_ids.filter(id => id !== userId);
                await supabase.from('saved_trips').update({ member_ids: newMembers }).eq('id', trip.id);
            }
        }

        res.json({ message: 'Friend removed and shared trips updated' });
    } catch (error) {
        console.error('removeFriend error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get pending incoming (and outgoing) requests
export const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        // Incoming requests (where user is addressee)
        const { data: incoming, error: incomingError } = await supabase
            .from('friendships')
            .select(`
                id, created_at, status,
                requester:profiles!requester_id(id, unique_id, full_name, username, avatar_url, bio, tags)
            `)
            .eq('addressee_id', userId)
            .eq('status', 'pending');

        if (incomingError) throw incomingError;

        // Outgoing requests (where user is requester)
        const { data: outgoing, error: outgoingError } = await supabase
            .from('friendships')
            .select(`
                id, created_at, status,
                addressee:profiles!addressee_id(id, unique_id, full_name, username, avatar_url, bio, tags)
            `)
            .eq('requester_id', userId)
            .eq('status', 'pending');

        if (outgoingError) throw outgoingError;

        res.json({ incoming, outgoing });
    } catch (error) {
        console.error('getPendingRequests error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get accepted friends
export const getAcceptedFriends = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('friendships')
            .select(`
                id, requester_id, addressee_id,
                requester:profiles!requester_id(id, unique_id, full_name, username, avatar_url, bio, tags),
                addressee:profiles!addressee_id(id, unique_id, full_name, username, avatar_url, bio, tags)
            `)
            .eq('status', 'accepted')
            .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

        if (error) throw error;

        // Flatten the data so it's a simple list of friend profiles
        const friends = data.map(rel => {
            if (rel.requester_id === userId) {
                return rel.addressee;
            } else {
                return rel.requester;
            }
        });

        res.json(friends);
    } catch (error) {
        console.error('getAcceptedFriends error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Check if two users have any shared trips
export const getSharedTripsCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: friendId } = req.params;

        if (!friendId) {
            return res.status(400).json({ error: 'Friend ID is required' });
        }

        // We check for trips where:
        // (user_id = userId AND member_ids contains friendId)
        // OR (user_id = friendId AND member_ids contains userId)
        const { data: userOwnedTrips, error: userOwnedError } = await supabase
            .from('saved_trips')
            .select('id')
            .eq('user_id', userId)
            .contains('member_ids', [friendId]);
            
        if (userOwnedError) throw userOwnedError;

        const { data: friendOwnedTrips, error: friendOwnedError } = await supabase
            .from('saved_trips')
            .select('id')
            .eq('user_id', friendId)
            .contains('member_ids', [userId]);

        if (friendOwnedError) throw friendOwnedError;

        const count = (userOwnedTrips?.length || 0) + (friendOwnedTrips?.length || 0);

        res.json({ sharedTripsCount: count });
    } catch (error) {
        console.error('getSharedTripsCount error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
