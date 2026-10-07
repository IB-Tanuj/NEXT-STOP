import supabase from '../config/supabase.js';
import {
    claimTripGenerationSlot,
    TRIP_QUOTA_LIMIT,
    TRIP_QUOTA_WINDOW_HOURS,
} from '../utils/tripQuota.js';

const setQuotaHeaders = (res, quota) => {
    res.setHeader('X-Trip-Quota-Limit', String(TRIP_QUOTA_LIMIT));
    res.setHeader('X-Trip-Quota-Remaining', String(quota.remaining));
    if (quota.resetAt) {
        res.setHeader('X-Trip-Quota-Reset', String(Math.ceil(new Date(quota.resetAt).getTime() / 1000)));
    }
};

/**
 * Reserves a planning slot before any cache lookup or provider call.
 * A cached result therefore cannot be used to bypass the per-user allowance.
 */
export const enforceTripQuota = async (req, res, next) => {
    try {
        const quota = await claimTripGenerationSlot({
            supabaseClient: supabase,
            userId: req.user.id,
        });

        setQuotaHeaders(res, quota);

        if (!quota.allowed) {
            return res.status(429).json({
                error: 'TRIP_QUOTA_EXCEEDED',
                message: `You have used all ${TRIP_QUOTA_LIMIT} trip plans for the last ${TRIP_QUOTA_WINDOW_HOURS} hours.`,
                remaining: quota.remaining,
                resetAt: quota.resetAt,
            });
        }

        req.tripQuota = quota;
        next();
    } catch (error) {
        console.error('Trip quota check failed:', error.message);
        return res.status(503).json({
            error: 'TRIP_QUOTA_UNAVAILABLE',
            message: 'Trip planning is temporarily unavailable. Please try again shortly.',
        });
    }
};
