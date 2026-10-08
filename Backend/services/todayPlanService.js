export const isUuid = (value) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export const apiError = (status, code, message, extra = {}) => Object.assign(new Error(message), { status, code, ...extra });

const isMissingTodayDatabaseError = (error) => ['PGRST202', 'PGRST204', 'PGRST205', '42P01', '42703'].includes(error?.code);

export const throwIfTodayDatabaseMissing = (error) => {
    if (isMissingTodayDatabaseError(error)) {
        throw apiError(503, 'TODAY_SETUP_REQUIRED', 'Today planning needs its database update. Run Backend/database/setup_today_trip_plans.sql in Supabase SQL Editor.');
    }
    throw error;
};

export const callPlanRpc = async (client, name, params) => {
    const { data, error } = await client.rpc(name, params);
    if (error) throwIfTodayDatabaseMissing(error);
    if (!data || typeof data !== 'object') throw new Error('Invalid planning database response.');
    return data;
};

export const getOwnedTodayPlan = async (client, userId, planId) => {
    if (!isUuid(planId)) throw apiError(400, 'INVALID_PLAN', 'A valid trip plan is required.');
    const { data, error } = await client.from('today_trip_plans').select('*').eq('id', planId).eq('user_id', userId).maybeSingle();
    if (error) throwIfTodayDatabaseMissing(error);
    if (!data) throw apiError(404, 'PLAN_NOT_FOUND', 'This trip plan could not be found.');
    return data;
};

export const publicPlan = (plan) => {
    const data = { ...plan };
    delete data.summary_token;
    delete data.itinerary_token;
    return data;
};

// Saved group members may complete their trip's AI data, but Today records remain
// private to the owner. The saved-trip RPC verifies membership before returning it.
export const resolveGenerationPlan = async (client, userId, { todayPlanId, savedTripId }) => {
    if (savedTripId) {
        if (!isUuid(savedTripId)) throw apiError(400, 'INVALID_PLAN', 'A valid saved trip is required.');
        const { data, error } = await client.from('saved_trips').select('id, user_id, member_ids').eq('id', savedTripId).maybeSingle();
        if (error) throwIfTodayDatabaseMissing(error);
        if (!data || (data.user_id !== userId && !(data.member_ids || []).includes(userId))) {
            throw apiError(404, 'PLAN_NOT_FOUND', 'This saved trip could not be found.');
        }
        return callPlanRpc(client, 'link_saved_today_trip_plan', { p_user_id: userId, p_saved_trip_id: savedTripId });
    }
    return getOwnedTodayPlan(client, userId, todayPlanId);
};

export const getGenerationInputs = (plan) => {
    const data = plan.trip_data || {};
    return {
        location: plan.destination,
        days: data.preferences?.days || data.hotel?.days || 3,
        budget: data.buffer ?? 0,
        stayType: data.hotel?.name || data.preferences?.stayType || 'budget',
        transport: data.transport?.name || data.preferences?.transport || 'train',
        selectedActivities: plan.ai_data?.activities || data.preferences?.activities || [],
        selectedFestivals: plan.ai_data?.festivals || [],
    };
};

export const runPlanGeneration = async ({ client, userId, reference, kind, generate }) => {
    const ownedPlan = await resolveGenerationPlan(client, userId, reference);
    const claim = await callPlanRpc(client, 'begin_today_trip_generation', {
        p_user_id: ownedPlan.user_id, p_plan_id: ownedPlan.id, p_kind: kind,
    });
    const quota = { limit: 5, remaining: claim.remaining, resetAt: claim.resetAt, charged: claim.charged === true };
    if (claim.action === 'quota_exceeded') {
        throw apiError(429, 'TRIP_QUOTA_EXCEEDED', 'You have used all 5 plans. New plans unlock at 5:30 AM IST; recovering an existing plan is still free.', quota);
    }
    if (claim.action === 'in_progress' || claim.action === 'cached') {
        return { status: claim.action === 'in_progress' ? 202 : 200, plan: claim.plan, quota, cacheStatus: 'HIT' };
    }
    if (claim.action !== 'generate' || !claim.token || !claim.plan) throw new Error('Invalid generation claim.');

    let result;
    try {
        result = await generate(getGenerationInputs(claim.plan));
    } catch (error) {
        // Only a server-recorded failure can unlock a free recovery. A client
        // cannot change the original inputs or mark a successful plan as failed.
        const failed = await callPlanRpc(client, 'finish_today_trip_generation', {
            p_user_id: ownedPlan.user_id, p_plan_id: ownedPlan.id, p_kind: kind,
            p_token: claim.token, p_output: null,
        });
        throw apiError(502, 'TRIP_AI_FAILED', 'We could not finish the AI generation. Your trip is safe in Today; try again for free.', {
            plan: failed.plan, quota, cause: error,
        });
    }
    const completed = await callPlanRpc(client, 'finish_today_trip_generation', {
        p_user_id: ownedPlan.user_id, p_plan_id: ownedPlan.id, p_kind: kind,
        p_token: claim.token, p_output: result.data,
    });
    return { status: 200, ...completed, quota, cacheStatus: result.cacheStatus };
};

export const resolveGroupMembers = async (client, userId, tripData) => {
    const memberIds = [];
    for (const member of tripData.preferences?.groupMembers || []) {
        let id = member?.id;
        const name = typeof member === 'object' ? member?.name : member;
        if (!id && typeof name === 'string' && /^[A-Z0-9]{8}$/i.test(name.trim())) {
            const { data, error } = await client.from('profiles').select('id').eq('unique_id', name.trim().toUpperCase()).maybeSingle();
            if (error) throw error;
            id = data?.id;
        }
        if (isUuid(id) && id !== userId && !memberIds.includes(id)) memberIds.push(id);
    }
    return memberIds;
};
