import test from 'node:test';
import assert from 'node:assert/strict';
import { claimTripGenerationSlot } from '../utils/tripQuota.js';

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
