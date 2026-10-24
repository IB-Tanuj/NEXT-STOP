import test from 'node:test';
import assert from 'node:assert/strict';
import { claimTripGenerationSlot, getCurrentTripQuota } from '../utils/tripQuota.js';
import { createPlanningQuotaMiddleware } from '../middleware/tripQuotaMiddleware.js';

test('claims a slot through the atomic database function', async () => {
    const calls = [];
    const supabaseClient = {
        rpc: async (...args) => {
            calls.push(args);
            return {
                data: [{
                    allowed: true,
                    remaining: 4,
                    reset_at: '2026-10-08T12:00:00.000Z',
                }],
                error: null,
            };
        },
    };

    const result = await claimTripGenerationSlot({
        supabaseClient,
        userId: 'user-123',
    });

    assert.deepEqual(calls, [[
        'claim_trip_generation_slot',
        { p_user_id: 'user-123' },
    ]]);
    assert.deepEqual(result, {
        allowed: true,
        remaining: 4,
        resetAt: '2026-10-08T12:00:00.000Z',
    });
});

test('does not hide a database quota failure', async () => {
    const databaseError = new Error('RPC unavailable');
    const supabaseClient = {
        rpc: async () => ({ data: null, error: databaseError }),
    };

    await assert.rejects(
        claimTripGenerationSlot({ supabaseClient, userId: 'user-123' }),
        databaseError,
    );
});

test('reads the current quota without consuming a slot', async () => {
    const calls = [];
    const supabaseClient = {
        rpc: async (...args) => {
            calls.push(args);
            return {
                data: {
                    limit: 5,
                    remaining: 0,
                    resetAt: '2026-10-09T00:00:00.000Z',
                },
                error: null,
            };
        },
    };

    const result = await getCurrentTripQuota({
        supabaseClient,
        userId: 'user-123',
    });

    assert.deepEqual(calls, [[
        'get_today_trip_state',
        { p_user_id: 'user-123' },
    ]]);
    assert.deepEqual(result, {
        limit: 5,
        remaining: 0,
        resetAt: '2026-10-09T00:00:00.000Z',
    });
});

test('blocks protected feature requests when no planning credits remain', async () => {
    const calls = [];
    const supabaseClient = {
        rpc: async (...args) => {
            calls.push(args);
            return {
                data: {
                    limit: 5,
                    remaining: 0,
                    resetAt: '2026-10-09T00:00:00.000Z',
                },
                error: null,
            };
        },
    };
    const result = { statusCode: null, body: null, headers: {} };
    const res = {
        setHeader(name, value) { result.headers[name] = value; return this; },
        status(code) { result.statusCode = code; return this; },
        json(body) { result.body = body; return this; },
    };
    let nextCalled = false;

    await createPlanningQuotaMiddleware(supabaseClient)(
        { user: { id: 'user-123' } },
        res,
        () => { nextCalled = true; },
    );

    assert.equal(nextCalled, false);
    assert.equal(result.statusCode, 429);
    assert.equal(result.body.error, 'TRIP_QUOTA_EXCEEDED');
    assert.equal(result.headers['X-Trip-Quota-Remaining'], '0');
    assert.deepEqual(calls, [[
        'get_today_trip_state',
        { p_user_id: 'user-123' },
    ]]);
});
