export const TRIP_QUOTA_LIMIT = 5;
export const TRIP_QUOTA_WINDOW_HOURS = 24;

/**
 * Atomically claim one planning slot for a user.
 *
 * The database function owns the counter and locking so this remains correct
 * when multiple backend instances or browser tabs submit at the same time.
 */
export const claimTripGenerationSlot = async ({ supabaseClient, userId }) => {
    const { data, error } = await supabaseClient.rpc('claim_trip_generation_slot', {
        p_user_id: userId,
    });

    if (error) {
        throw error;
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (!result || typeof result.allowed !== 'boolean') {
        throw new Error('Trip quota function returned an invalid response.');
    }

    return {
        allowed: result.allowed,
        remaining: Number(result.remaining) || 0,
        resetAt: result.reset_at || null,
    };
};
