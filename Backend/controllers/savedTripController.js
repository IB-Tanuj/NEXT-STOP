import { supabase } from '../config/supabase.js';

export const saveTrip = async (req, res) => {
    try {
        const { destination, start_date, end_date, total_budget, trip_data } = req.body;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
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
                    trip_data
                }
            ])
            .select()
            .single();

        if (tripError) throw tripError;

        // 2. Initialize the wallets based on trip_data
        const stayTarget = trip_data.hotel?.price || 0;
        const transportTarget = (trip_data.flight?.price || 0) + (trip_data.train?.price || 0);
        const bufferTarget = trip_data.buffer || 0;
        const foodTarget = trip_data.food_budget || 0;

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
            .eq('user_id', userId)
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
            .eq('user_id', userId)
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
        const { trip_id, wallet_type, amount } = req.body;
        
        // Fetch current saved_amount
        const { data: wallet, error: fetchError } = await supabase
            .from('trip_wallets')
            .select('saved_amount, target_amount')
            .eq('trip_id', trip_id)
            .eq('wallet_type', wallet_type)
            .single();

        if (fetchError) throw fetchError;

        const newSavedAmount = parseFloat(wallet.saved_amount) + parseFloat(amount);
        
        const { data, error: updateError } = await supabase
            .from('trip_wallets')
            .update({ saved_amount: newSavedAmount })
            .eq('trip_id', trip_id)
            .eq('wallet_type', wallet_type)
            .select()
            .single();

        if (updateError) throw updateError;
        res.status(200).json({ message: 'Savings added', wallet: data });
    } catch (error) {
        console.error('Error adding savings:', error);
        res.status(500).json({ error: 'Failed to add savings' });
    }
};
