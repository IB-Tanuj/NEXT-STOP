import supabase from '../config/supabase.js';
import { apiError, callPlanRpc, getOwnedTodayPlan, isUuid, publicPlan, resolveGenerationPlan, resolveGroupMembers, throwIfTodayDatabaseMissing } from '../services/todayPlanService.js';

const handle = (callback) => async (req, res) => {
    try { await callback(req, res); }
    catch (error) {
        console.error('Today plans:', error.message);
        res.status(error.status || 503).json({
            error: error.code || 'TODAY_PLANS_UNAVAILABLE',
            message: error.status ? error.message : 'Today plans are temporarily unavailable. Please try again shortly.',
            remaining: error.remaining,
            resetAt: error.resetAt,
            quota: error.quota,
        });
    }
};

export const getTodayPlans = handle(async (req, res) => {
    res.json(await callPlanRpc(supabase, 'get_today_trip_state', { p_user_id: req.user.id }));
});

export const createTodayPlan = handle(async (req, res) => {
    const { id, destination, total_budget, trip_data } = req.body;
    const days = Number(trip_data?.preferences?.days);
    const buffer = Number(trip_data?.buffer);
    if (!isUuid(id) || typeof destination !== 'string' || !destination.trim() || destination.length > 120 ||
        !Number.isFinite(Number(total_budget)) || Number(total_budget) < 0 || !trip_data?.preferences ||
        !Number.isInteger(days) || days < 1 || !Array.isArray(trip_data.spots) || !Number.isFinite(buffer)) {
        throw apiError(400, 'INVALID_PLAN', 'Please complete your trip preferences and budget first.');
    }
    let plan;
    try {
        plan = await callPlanRpc(supabase, 'create_today_trip_plan', {
            p_user_id: req.user.id, p_plan_id: id, p_destination: destination,
            p_total_budget: Number(total_budget), p_trip_data: trip_data,
        });
    } catch (error) {
        if (String(error.message || '').includes('TODAY_QUOTA_EXCEEDED')) {
            const quota = await callPlanRpc(supabase, 'get_today_trip_state', { p_user_id: req.user.id });
            throw apiError(429, 'TRIP_QUOTA_EXCEEDED', 'You have used all 5 Today plans. New plans unlock at 5:30 AM IST.', {
                remaining: quota.remaining, resetAt: quota.resetAt,
                quota: { limit: quota.limit, remaining: quota.remaining, resetAt: quota.resetAt },
            });
        }
        throw error;
    }
    res.status(201).json({ plan });
});

export const getTodayPlan = handle(async (req, res) => {
    res.json({ plan: publicPlan(await getOwnedTodayPlan(supabase, req.user.id, req.params.id)) });
});

// Polling a shared Saved Trip verifies membership without exposing its owner's
// Today list or permitting members to rename/save the private Today record.
export const getSavedPlanGeneration = handle(async (req, res) => {
    res.json({ plan: publicPlan(await resolveGenerationPlan(supabase, req.user.id, { savedTripId: req.params.id })) });
});

export const renameTodayPlan = handle(async (req, res) => {
    await getOwnedTodayPlan(supabase, req.user.id, req.params.id);
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title || title.length > 80) throw apiError(400, 'INVALID_TITLE', 'Choose a trip name between 1 and 80 characters.');
    const { data, error } = await supabase.from('today_trip_plans').update({ title, updated_at: new Date().toISOString() })
        .eq('id', req.params.id).eq('user_id', req.user.id).select('*').single();
    if (error) throwIfTodayDatabaseMissing(error);
    res.json({ plan: publicPlan(data) });
});

export const updateTodayPlan = handle(async (req, res) => {
    const plan = await getOwnedTodayPlan(supabase, req.user.id, req.params.id);
    if (plan.summary_status === 'generating' || plan.itinerary_status === 'generating') {
        throw apiError(409, 'PLAN_GENERATING', 'This trip is being generated. Try updating it again when generation finishes.');
    }
    const { trip_data, total_budget, destination } = req.body;
    if (!trip_data?.preferences || !Number.isFinite(Number(total_budget)) || Number(total_budget) < 0 ||
        (destination !== undefined && (typeof destination !== 'string' || !destination.trim()))) {
        throw apiError(400, 'INVALID_PLAN', 'The current trip details are incomplete.');
    }
    const safeTripData = { ...trip_data };
    delete safeTripData.aiData;
    const { data, error } = await supabase.from('today_trip_plans').update({
        trip_data: safeTripData,
        total_budget: Number(total_budget),
        destination: destination?.trim() || plan.destination,
        updated_at: new Date().toISOString(),
    }).eq('id', plan.id).eq('user_id', req.user.id).select('*').single();
    if (error) throwIfTodayDatabaseMissing(error);
    res.json({ plan: publicPlan(data) });
});

export const saveTodayPlan = handle(async (req, res) => {
    const plan = await getOwnedTodayPlan(supabase, req.user.id, req.params.id);
    const memberIds = await resolveGroupMembers(supabase, req.user.id, plan.trip_data);
    const result = await callPlanRpc(supabase, 'save_today_trip_plan', {
        p_user_id: req.user.id, p_plan_id: plan.id, p_member_ids: memberIds,
    });
    res.json(result);
});
