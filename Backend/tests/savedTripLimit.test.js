import test from 'node:test';
import assert from 'node:assert/strict';
import { isSavedTripLimitError, savedTripLimitResponse, SAVED_TRIP_LIMIT } from '../utils/savedTripLimit.js';

test('recognizes the database saved-trip limit error', () => {
    assert.equal(isSavedTripLimitError({ code: 'P0001', message: 'SAVED_TRIP_LIMIT_EXCEEDED' }), true);
    assert.equal(isSavedTripLimitError({ code: 'P0001', message: 'some other database error' }), false);
});

test('builds a stable saved-trip limit response', () => {
    assert.deepEqual(savedTripLimitResponse(), {
        error: 'SAVED_TRIP_LIMIT_EXCEEDED',
        message: `You already have ${SAVED_TRIP_LIMIT} saved trips. Delete one before saving another.`,
        limit: 20,
    });
});
