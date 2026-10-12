import test from 'node:test';
import assert from 'node:assert/strict';
import { callWalletRpc, isWalletType, parsePositiveWalletAmount } from '../services/walletService.js';

test('wallet amount validation accepts numeric strings and rejects unsafe values', () => {
    assert.equal(parsePositiveWalletAmount('1250.50'), 1250.5);
    assert.equal(parsePositiveWalletAmount(1), 1);
    assert.equal(parsePositiveWalletAmount(''), null);
    assert.equal(parsePositiveWalletAmount(0), null);
    assert.equal(parsePositiveWalletAmount(-10), null);
    assert.equal(parsePositiveWalletAmount(Number.NaN), null);
    assert.equal(parsePositiveWalletAmount(Number.POSITIVE_INFINITY), null);
});

test('wallet type validation only permits configured wallets', () => {
    assert.equal(isWalletType('stay'), true);
    assert.equal(isWalletType('transport'), true);
    assert.equal(isWalletType('wallet'), false);
    assert.equal(isWalletType(undefined), false);
});

test('wallet mutations are delegated to the atomic database RPC', async () => {
    const calls = [];
    const client = {
        rpc: async (...args) => {
            calls.push(args);
            return { data: { wallet: { saved_amount: 1250 }, transaction: { amount: 250 } }, error: null };
        },
    };

    const result = await callWalletRpc(client, 'apply_wallet_transaction', {
        p_trip_id: 'trip-id',
        p_wallet_type: 'stay',
        p_amount: 250,
        p_actor_id: 'user-id',
    });

    assert.deepEqual(calls, [[
        'apply_wallet_transaction',
        {
            p_trip_id: 'trip-id',
            p_wallet_type: 'stay',
            p_amount: 250,
            p_actor_id: 'user-id',
        },
    ]]);
    assert.equal(result.wallet.saved_amount, 1250);
});

test('wallet RPC errors are not swallowed', async () => {
    const databaseError = new Error('wallet RPC unavailable');
    await assert.rejects(
        callWalletRpc({ rpc: async () => ({ data: null, error: databaseError }) }, 'remove_wallet_transaction', {}),
        databaseError,
    );
});
