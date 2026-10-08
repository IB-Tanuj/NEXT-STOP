import test from 'node:test';
import assert from 'node:assert/strict';
import { callPlanRpc, getGenerationInputs, publicPlan, resolveGenerationPlan, runPlanGeneration } from '../services/todayPlanService.js';

const planId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const token = '33333333-3333-4333-8333-333333333333';

const makeClient = (rpcResults) => {
    const calls = [];
    const client = {
        calls,
        from: () => ({
            select: () => ({
                eq: () => ({
                    eq: () => ({
                        maybeSingle: async () => ({
                            data: {
                                id: planId,
                                user_id: userId,
                                destination: 'Manali',
                                trip_data: {
                                    buffer: 4000,
                                    preferences: { days: 4, stayType: 'budget', transport: 'train', activities: [] },
                                },
                                ai_data: {},
                            },
                            error: null,
                        }),
                    }),
                }),
            }),
        }),
        rpc: async (name, params) => {
            calls.push({ name, params });
            const result = rpcResults.shift();
            return { data: result, error: null };
        },
    };
    return client;
};

test('a generation failure is recorded without charging a recovery credit', async () => {
    const client = makeClient([
        { action: 'generate', charged: false, token, remaining: 2, resetAt: '2026-10-09T00:00:00.000Z', plan: { id: planId } },
        { plan: { id: planId, summary_status: 'failed', ai_data: {} } },
    ]);

    await assert.rejects(
        runPlanGeneration({
            client,
            userId,
            reference: { todayPlanId: planId },
            kind: 'summary',
            generate: async () => { throw new Error('provider unavailable'); },
        }),
        (error) => error.code === 'TRIP_AI_FAILED' && error.status === 502,
    );

    assert.equal(client.calls[0].name, 'begin_today_trip_generation');
    assert.equal(client.calls[1].name, 'finish_today_trip_generation');
    assert.equal(client.calls[1].params.p_output, null);
});

test('an existing in-progress request is returned without invoking the provider', async () => {
    const client = makeClient([
        { action: 'in_progress', charged: false, remaining: 2, resetAt: '2026-10-09T00:00:00.000Z', plan: { id: planId } },
    ]);
    let providerCalled = false;

    const result = await runPlanGeneration({
        client,
        userId,
        reference: { todayPlanId: planId },
        kind: 'summary',
        generate: async () => {
            providerCalled = true;
            return { data: {} };
        },
    });

    assert.equal(result.status, 202);
    assert.equal(providerCalled, false);
    assert.equal(client.calls.length, 1);
});

test('quota exhaustion prevents a new provider request', async () => {
    const client = makeClient([
        { action: 'quota_exceeded', remaining: 0, resetAt: '2026-10-09T00:00:00.000Z' },
    ]);

    await assert.rejects(
        runPlanGeneration({
            client,
            userId,
            reference: { todayPlanId: planId },
            kind: 'summary',
            generate: async () => ({ data: {} }),
        }),
        (error) => error.code === 'TRIP_QUOTA_EXCEEDED' && error.status === 429,
    );
});

test('generation inputs come from the persisted snapshot', () => {
    const inputs = getGenerationInputs({
        destination: 'Manali',
        trip_data: {
            buffer: 2400,
            hotel: { name: 'Budget stay' },
            transport: { name: 'Train' },
            preferences: { days: 4, activities: ['Trekking'] },
        },
        ai_data: { activities: [{ name: 'Stored activity' }], festivals: [{ name: 'Stored festival' }] },
    });

    assert.deepEqual(inputs, {
        location: 'Manali',
        days: 4,
        budget: 2400,
        stayType: 'Budget stay',
        transport: 'Train',
        selectedActivities: [{ name: 'Stored activity' }],
        selectedFestivals: [{ name: 'Stored festival' }],
    });
});

test('public plans never expose generation leases', () => {
    assert.deepEqual(publicPlan({ id: planId, summary_token: token, itinerary_token: token, summary_status: 'ready' }), {
        id: planId,
        summary_status: 'ready',
    });
});

test('missing Today RPCs return an actionable setup error', async () => {
    await assert.rejects(
        callPlanRpc({ rpc: async () => ({ data: null, error: { code: 'PGRST202' } }) }, 'get_today_trip_state', {}),
        (error) => error.code === 'TODAY_SETUP_REQUIRED' && error.status === 503,
    );
});

test('saved-trip generation is restricted to the owner or an existing member', async () => {
    const savedTripId = '44444444-4444-4444-8444-444444444444';
    const memberId = '55555555-5555-4555-8555-555555555555';
    const client = {
        from: () => ({
            select: () => ({
                eq: () => ({
                    maybeSingle: async () => ({
                        data: { id: savedTripId, user_id: userId, member_ids: [memberId] },
                        error: null,
                    }),
                }),
            }),
        }),
        rpc: async (name, params) => {
            assert.equal(name, 'link_saved_today_trip_plan');
            assert.deepEqual(params, { p_user_id: memberId, p_saved_trip_id: savedTripId });
            return { data: { id: planId, user_id: userId, saved_trip_id: savedTripId }, error: null };
        },
    };

    const plan = await resolveGenerationPlan(client, memberId, { savedTripId });
    assert.equal(plan.user_id, userId);
});
