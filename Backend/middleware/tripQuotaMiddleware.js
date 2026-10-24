import supabase from '../config/supabase.js';
import {
    getCurrentTripQuota,
    TRIP_QUOTA_LIMIT,
} from '../utils/tripQuota.js';

const setQuotaHeaders = (res, quota) => {
    res.setHeader('X-Trip-Quota-Limit', String(TRIP_QUOTA_LIMIT));
    res.setHeader('X-Trip-Quota-Remaining', String(quota.remaining));
    if (quota.resetAt) {
        res.setHeader('X-Trip-Quota-Reset', String(Math.ceil(new Date(quota.resetAt).getTime() / 1000)));
    }
};

/**
 * Check the current planning quota before a provider/data request.
 *
 * This middleware is intentionally read-only. Creating a Today plan is the
 * operation that consumes one of the five daily credits; hotel, transport,
 * spot, and live-price lookups only verify that the user still has access.
 */
export const createPlanningQuotaMiddleware = (supabaseClient) => async (req, res, next) => {
    try {
        const quota = await getCurrentTripQuota({
            supabaseClient,
            userId: req.user.id,
        });

        setQuotaHeaders(res, quota);

        if (quota.remaining <= 0) {
            return res.status(429).json({
                error: 'TRIP_QUOTA_EXCEEDED',
                message: `You have used all ${TRIP_QUOTA_LIMIT} trip-planning credits for today's planning window. New planning features unlock at 5:30 AM IST.`,
                remaining: quota.remaining,
                resetAt: quota.resetAt,
                quota,
            });
        }

        req.tripQuota = quota;
        return next();
    } catch (error) {
        console.error('Trip quota check failed:', error.message);
        return res.status(503).json({
            error: 'TRIP_QUOTA_UNAVAILABLE',
            message: 'Trip planning is temporarily unavailable. Please try again shortly.',
        });
    }
};

export const enforcePlanningQuota = createPlanningQuotaMiddleware(supabase);

// Keep the old export name available for any external route integrations.
export const enforceTripQuota = enforcePlanningQuota;
