import supabase from '../config/supabase.js';

export const saveTrip = async (req, res) => {
    try {
        const { destination, start_date, end_date, total_budget, trip_data } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const groupMembers = trip_data.preferences?.groupMembers || [];
        const memberIds = [];
        
        for (let m of groupMembers) {
            let memberId = m?.id;
            let memberName = typeof m === 'object' ? m?.name : m;

            // If the user typed the 8-character UID directly into the name field
            if (!memberId && memberName && /^[A-Z0-9]{8}$/i.test(memberName.trim())) {
                const { data } = await supabase
                    .from('profiles')
                    .select('id, full_name, username')
                    .eq('unique_id', memberName.trim().toUpperCase())
                    .single();
                
                if (data) {
                    memberId = data.id;
                    if (typeof m === 'object') {
                        m.id = data.id;
                        m.uid = memberName.trim().toUpperCase();
                        m.name = data.full_name || data.username || m.name;
                    }
                }
            }

            if (memberId && memberId !== userId && !memberIds.includes(memberId)) {
                memberIds.push(memberId);
            }
        }

        // 1. Insert the trip
        const { data: trip, error: tripError } = await supabase
            .from('saved_trips')
            .insert([
                {
                    user_id: userId,
                    destination,
                    start_date,
                    end_date,
                    total_budget,
                    trip_data,
                    member_ids: memberIds
                }
            ])
            .select()
            .single();

        if (tripError) throw tripError;

        // 2. Initialize the wallets based on trip_data
        const stayTarget = trip_data.hotel?.price || 0;
        const transportTarget = trip_data.transport?.price || 0;
        const bufferTarget = trip_data.buffer || 0;

        const groupSize = Number(trip_data.preferences?.groupMembers?.length || trip_data.preferences?.groupSize || 1);
        const spotsTotalPerPerson = Array.isArray(trip_data.spots)
            ? trip_data.spots.reduce((sum, spot) => sum + (Number(spot.cost) || 0), 0)
            : 0;
        const foodTarget = spotsTotalPerPerson * groupSize;

        const { error: walletsError } = await supabase
            .from('trip_wallets')
            .insert([
                { trip_id: trip.id, wallet_type: 'stay', target_amount: stayTarget },
                { trip_id: trip.id, wallet_type: 'transport', target_amount: transportTarget },
                { trip_id: trip.id, wallet_type: 'food', target_amount: foodTarget },
                { trip_id: trip.id, wallet_type: 'buffer', target_amount: bufferTarget },
            ]);

        if (walletsError) throw walletsError;

        res.status(201).json({ message: 'Trip saved successfully!', trip });
    } catch (error) {
        console.error('Error saving trip:', error);
        res.status(500).json({ error: 'Failed to save trip' });
    }
};

export const getTrips = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data, error } = await supabase
            .from('saved_trips')
            .select(`
                *,
                trip_wallets (*)
            `)
            .or(`user_id.eq.${userId},member_ids.cs.{${userId}}`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};

export const updateTripData = async (req, res) => {
    try {
        const { id } = req.params;
        const { trip_data, total_budget } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data, error } = await supabase
            .from('saved_trips')
            .update({ trip_data, total_budget })
            .eq('id', id)
            .or(`user_id.eq.${userId},member_ids.cs.{${userId}}`)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json({ message: 'Trip updated', trip: data });
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ error: 'Failed to update trip' });
    }
};

export const addSavings = async (req, res) => {
    try {
        const { trip_id, wallet_type, amount, contributor_name } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Verify this user owns or is a member of the trip before modifying wallets
        const { data: trip, error: tripError } = await supabase
            .from('saved_trips')
            .select('id')
            .eq('id', trip_id)
            .or(`user_id.eq.${userId},member_ids.cs.{${userId}}`)
            .single();

        if (tripError || !trip) {
            return res.status(403).json({ error: 'Forbidden — you do not have access to this trip' });
        }

        // Fetch current saved_amount
        const { data: wallet, error: fetchError } = await supabase
            .from('trip_wallets')
            .select('saved_amount, target_amount')
            .eq('trip_id', trip_id)
            .eq('wallet_type', wallet_type)
            .single();

        if (fetchError) throw fetchError;

        let newSavedAmount = parseFloat(wallet.saved_amount) + parseFloat(amount);
        const targetAmount = parseFloat(wallet.target_amount);

        // Enforce the maximum cap to prevent overfunding
        if (newSavedAmount > targetAmount) {
            newSavedAmount = targetAmount;
        }

        const actualAddedAmount = newSavedAmount - parseFloat(wallet.saved_amount);

        const { data, error: updateError } = await supabase
            .from('trip_wallets')
            .update({ saved_amount: newSavedAmount })
            .eq('trip_id', trip_id)
            .eq('wallet_type', wallet_type)
            .select()
            .single();

        if (updateError) throw updateError;

        // Record the transaction if a contributor name is provided and we actually added funds
        if (contributor_name && actualAddedAmount > 0) {
            const { error: txError } = await supabase
                .from('wallet_transactions')
                .insert({
                    wallet_id: data.id,
                    contributor_name: contributor_name,
                    amount: actualAddedAmount
                });
            if (txError) {
                console.warn('Failed to record wallet transaction:', txError);
            }
        }

        res.status(200).json({ message: 'Savings added', wallet: data });
    } catch (error) {
        console.error('Error adding savings:', error);
        res.status(500).json({ error: 'Failed to add savings' });
    }
};

export const deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { error } = await supabase
            .from('saved_trips')
            .delete()
            .match({ id, user_id: userId });

        if (error) throw error;

        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error("Delete trip error:", error);
        res.status(500).json({ error: "Failed to delete trip" });
    }
};

export const leaveTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data: trip, error: fetchError } = await supabase
            .from('saved_trips')
            .select('id, user_id, member_ids')
            .eq('id', id)
            .single();

        if (fetchError || !trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        if (trip.user_id === userId) {
            return res.status(400).json({ error: 'The creator of a trip cannot leave it. You must delete the trip instead.' });
        }

        if (!trip.member_ids || !trip.member_ids.includes(userId)) {
            return res.status(400).json({ error: 'You are not a member of this trip' });
        }

        const newMembers = trip.member_ids.filter(mId => mId !== userId);

        const { error: updateError } = await supabase
            .from('saved_trips')
            .update({ member_ids: newMembers })
            .eq('id', id);

        if (updateError) throw updateError;

        res.json({ message: 'You have left the trip successfully' });
    } catch (error) {
        console.error("Leave trip error:", error);
        res.status(500).json({ error: "Failed to leave trip" });
    }
};

export const getTripMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data: trip, error: fetchError } = await supabase
            .from('saved_trips')
            .select('user_id, member_ids')
            .eq('id', id)
            .single();

        if (fetchError || !trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Must be part of the trip to view members
        if (trip.user_id !== userId && (!trip.member_ids || !trip.member_ids.includes(userId))) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const allMemberIds = [trip.user_id, ...(trip.member_ids || [])];

        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, unique_id, full_name, username, avatar_url, bio, tags')
            .in('id', allMemberIds);

        if (profileError) throw profileError;

        res.json(profiles);
    } catch (error) {
        console.error("Get trip members error:", error);
        res.status(500).json({ error: "Failed to get trip members" });
    }
};
