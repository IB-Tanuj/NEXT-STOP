import supabase from '../config/supabase.js';
import { callWalletRpc, isWalletType, parsePositiveWalletAmount } from '../services/walletService.js';

const isUuid = (value) => typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const getWalletTrip = async (tripId) => {
    if (!tripId || !isUuid(tripId)) return { data: null, error: null };

    return supabase
        .from('saved_trips')
        .select('id, user_id, member_ids, trip_data')
        .eq('id', tripId)
        .maybeSingle();
};

const getProfile = async (userId) => {
    if (!isUuid(userId)) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .eq('id', userId)
        .maybeSingle();

    if (error) throw error;
    return data;
};

const getContributor = async (trip, actorId, requestedName) => {
    const fallbackName = typeof requestedName === 'string' ? requestedName.trim() : '';
    const isOwner = trip.user_id === actorId;

    if (!isOwner) {
        const profile = await getProfile(actorId);
        return {
            id: actorId,
            name: profile?.full_name?.trim() || profile?.username?.trim() || fallbackName,
        };
    }

    const memberIds = [trip.user_id, ...(trip.member_ids || [])]
        .filter(isUuid);
    const groupMembers = trip.trip_data?.preferences?.groupMembers || [];
    const groupMemberIds = groupMembers
        .filter(member => member && typeof member === 'object' && isUuid(member.id))
        .map(member => member.id);
    const profileIds = [...new Set([...memberIds, ...groupMemberIds])];

    let profiles = [];
    if (profileIds.length > 0) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, username')
            .in('id', profileIds);

        if (error) throw error;
        profiles = data || [];
    }

    const normalizedName = fallbackName.toLowerCase();
    const profileMatch = profiles.find(profile => [profile.full_name, profile.username]
        .filter(Boolean)
        .some(name => name.trim().toLowerCase() === normalizedName));

    if (profileMatch) {
        return {
            id: profileMatch.id,
            name: profileMatch.full_name?.trim() || profileMatch.username?.trim() || fallbackName,
        };
    }

    const groupMemberMatch = groupMembers.find(member => (
        member
        && typeof member === 'object'
        && isUuid(member.id)
        && typeof member.name === 'string'
        && member.name.trim().toLowerCase() === normalizedName
    ));

    return {
        id: groupMemberMatch?.id || null,
        name: fallbackName,
    };
};

const respondToWalletError = (res, error, fallbackMessage) => {
    console.error(fallbackMessage, error);

    const code = error?.code;
    const status = code === '42501'
        ? 403
        : code === 'P0002'
            ? 404
            : code === '22023'
                ? 400
                : 500;

    res.status(status).json({
        error: status === 500 ? fallbackMessage : (error?.message || fallbackMessage),
    });
};

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
                trip_wallets (
                    *,
                    wallet_transactions (*)
                )
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

        const parsedAmount = parsePositiveWalletAmount(amount);
        if (!parsedAmount) {
            return res.status(400).json({ error: 'Amount must be a finite number greater than zero' });
        }

        if (!isWalletType(wallet_type)) {
            return res.status(400).json({ error: 'Invalid wallet type' });
        }

        const { data: trip, error: tripError } = await getWalletTrip(trip_id);
        if (tripError || !trip) {
            return res.status(403).json({ error: 'Forbidden — you do not have access to this trip' });
        }

        const contributor = await getContributor(trip, userId, contributor_name);
        const data = await callWalletRpc(supabase, 'apply_wallet_transaction', {
            p_trip_id: trip_id,
            p_wallet_type: wallet_type,
            p_amount: parsedAmount,
            p_actor_id: userId,
            p_contributor_name: contributor.name,
            p_contributor_id: contributor.id,
        });

        res.status(200).json({
            message: 'Savings added',
            wallet: data.wallet,
            transaction: data.transaction,
        });
    } catch (error) {
        respondToWalletError(res, error, 'Failed to add savings');
    }
};

export const removeSavings = async (req, res) => {
    try {
        const { trip_id, wallet_type, amount, contributor_name } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const parsedAmount = parsePositiveWalletAmount(amount);
        if (!parsedAmount) {
            return res.status(400).json({ error: 'Amount must be a finite number greater than zero' });
        }

        if (!isWalletType(wallet_type)) {
            return res.status(400).json({ error: 'Invalid wallet type' });
        }

        const { data: trip, error: tripError } = await getWalletTrip(trip_id);
        if (tripError || !trip) {
            return res.status(403).json({ error: 'Forbidden — you do not have access to this trip' });
        }

        const contributor = await getContributor(trip, userId, contributor_name);
        const data = await callWalletRpc(supabase, 'remove_wallet_transaction', {
            p_trip_id: trip_id,
            p_wallet_type: wallet_type,
            p_amount: parsedAmount,
            p_actor_id: userId,
            p_contributor_name: contributor.name,
            p_contributor_id: contributor.id,
        });

        res.status(200).json({
            message: 'Savings removed',
            wallet: data.wallet,
            transaction: data.transaction,
        });
    } catch (error) {
        respondToWalletError(res, error, 'Failed to remove savings');
    }
};

export const removeOwnerFunds = async (req, res) => {
    try {
        const { id: trip_id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data: trip, error: tripError } = await getWalletTrip(trip_id);
        if (tripError || !trip) {
            return res.status(403).json({ error: 'Forbidden — you do not have access to this trip' });
        }

        const profile = await getProfile(userId);
        const contributorName = profile?.full_name?.trim()
            || profile?.username?.trim()
            || (typeof req.body?.contributor_name === 'string' ? req.body.contributor_name.trim() : '');

        if (!contributorName) {
            return res.status(400).json({ error: 'A contributor is required' });
        }

        await callWalletRpc(supabase, 'remove_owner_attributed_funds', {
            p_trip_id: trip_id,
            p_actor_id: userId,
            p_contributor_name: contributorName,
        });

        // Fetch the fully updated trip after the atomic RPC has committed.
        const { data: updatedTrip, error: fetchError } = await supabase
            .from('saved_trips')
            .select(`
                *,
                trip_wallets (*, wallet_transactions (*))
            `)
            .eq('id', trip_id)
            .single();

        if (fetchError) throw fetchError;

        res.status(200).json({ message: 'Owner funds removed successfully', trip: updatedTrip });
    } catch (error) {
        respondToWalletError(res, error, 'Failed to remove owner funds');
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

const removeMemberAndRecalculate = async (trip, memberIdToRemove) => {
    // 1. Remove from member_ids
    const newMembers = trip.member_ids.filter(mId => mId !== memberIdToRemove);

    // 2. Remove from groupMembers & update groupSize
    let newTripData = trip.trip_data ? JSON.parse(JSON.stringify(trip.trip_data)) : {};
    let oldGroupSize = 1;
    let newGroupSize = 1;
    
    if (newTripData.preferences) {
        // Calculate old size exactly how it was calculated in saveTrip
        oldGroupSize = Number(newTripData.preferences.groupMembers?.length || newTripData.preferences.groupSize || 1);
        
        // Remove the member from groupMembers
        if (newTripData.preferences.groupMembers) {
            newTripData.preferences.groupMembers = newTripData.preferences.groupMembers.filter(m => {
                const mId = typeof m === 'object' ? (m.uid || m.id) : null;
                return mId !== memberIdToRemove;
            });
        }
        
        // Calculate new size
        newGroupSize = Number(newTripData.preferences.groupMembers?.length || Math.max(1, (newTripData.preferences.groupSize || 2) - 1));
        
        // Update groupSize in preferences
        newTripData.preferences.groupSize = newGroupSize;
    }

    // 3. Recalculate target_amounts for wallets if size reduced
    let newTotalBudget = trip.total_budget;

    if (oldGroupSize > 0 && newGroupSize > 0 && newGroupSize !== oldGroupSize) {
        const ratio = newGroupSize / oldGroupSize;
        
        // Fetch wallets
        const { data: wallets, error: wError } = await supabase
            .from('trip_wallets')
            .select('*')
            .eq('trip_id', trip.id);
            
        if (!wError && wallets) {
            newTotalBudget = 0;
            for (const wallet of wallets) {
                const newTarget = Math.round(Number(wallet.target_amount) * ratio);
                newTotalBudget += newTarget;
                
                await supabase
                    .from('trip_wallets')
                    .update({ target_amount: newTarget })
                    .eq('id', wallet.id);
            }
        }
    }

    // 4. Update the trip
    const { data: updatedTrip, error: updateError } = await supabase
        .from('saved_trips')
        .update({ 
            member_ids: newMembers, 
            trip_data: newTripData,
            total_budget: newTotalBudget
        })
        .eq('id', trip.id)
        .select(`
            *,
            trip_wallets (*, wallet_transactions (*))
        `)
        .single();

    if (updateError) throw updateError;
    
    return updatedTrip;
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

        const updatedTrip = await removeMemberAndRecalculate(trip, userId);

        res.json({ message: 'You have left the trip successfully', trip: updatedTrip });
    } catch (error) {
        console.error("Leave trip error:", error);
        res.status(500).json({ error: "Failed to leave trip" });
    }
};

export const kickMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data: trip, error: fetchError } = await supabase
            .from('saved_trips')
            .select('id, user_id, member_ids, trip_data')
            .eq('id', id)
            .single();

        if (fetchError || !trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        if (trip.user_id !== userId) {
            return res.status(403).json({ error: 'Only the trip owner can kick members' });
        }

        if (!trip.member_ids || !trip.member_ids.includes(memberId)) {
            return res.status(400).json({ error: 'User is not a member of this trip' });
        }

        const updatedTrip = await removeMemberAndRecalculate(trip, memberId);

        res.json({ message: 'Member kicked successfully', trip: updatedTrip });
    } catch (error) {
        console.error("Kick member error:", error);
        res.status(500).json({ error: "Failed to kick member" });
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
