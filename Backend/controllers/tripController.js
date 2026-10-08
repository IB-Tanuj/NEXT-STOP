import supabase from '../config/supabase.js';
import { generateSummaryData, generateItineraryData } from '../services/tripAiService.js';
import { runPlanGeneration } from '../services/todayPlanService.js';

const handleGeneration = (kind, generate) => async (req, res) => {
    try {
        const result = await runPlanGeneration({
            client: supabase,
            userId: req.user.id,
            reference: req.body,
            kind,
            generate,
        });
        res.setHeader('X-Trip-Quota-Limit', '5');
        res.setHeader('X-Trip-Quota-Remaining', String(result.quota.remaining));
        res.setHeader('X-Trip-Quota-Reset', String(Math.ceil(new Date(result.quota.resetAt).getTime() / 1000)));
        res.setHeader('X-Cache', result.cacheStatus || 'UNKNOWN');
        if (result.status === 202) res.setHeader('Retry-After', '2');
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(`${kind} generation failed:`, error.message);
        const status = error.status || 503;
        return res.status(status).json({
            error: error.code || 'TRIP_QUOTA_UNAVAILABLE',
            message: error.status ? error.message : 'Trip planning is temporarily unavailable. Your plan can be retried shortly.',
            remaining: error.remaining,
            resetAt: error.resetAt,
            plan: error.plan,
            quota: error.quota,
        });
    }
};

export const generateTripPlan = handleGeneration('summary', generateSummaryData);
export const generateItinerary = handleGeneration('itinerary', generateItineraryData);
