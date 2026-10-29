import test from 'node:test';
import assert from 'node:assert/strict';
import { validateItinerary, validateSummary } from '../services/tripAiValidation.js';
import { askAi } from '../services/tripAiService.js';

test('summary validation requires every AI section', () => {
    const valid = {
        activities: [{ name: 'Rafting' }],
        festivals: [{ name: 'Festival' }],
        foodRecommendations: [{ name: 'Thukpa' }],
        localEmergency: [{ label: 'Police', number: '100' }],
    };

    assert.deepEqual(validateSummary({ ...valid, unexpected: true }), valid);
    assert.throws(() => validateSummary({ ...valid, festivals: [] }), /incomplete/);
});

test('itinerary validation rejects incomplete day entries', () => {
    const day = { day: 1, title: 'Arrival', morning: 'Check in', afternoon: 'Explore', evening: 'Dinner' };
    assert.deepEqual(validateItinerary({ itinerary: [day] }), { itinerary: [day] });
    assert.throws(() => validateItinerary({ itinerary: [{ ...day, evening: '' }] }), /incomplete/);
});

test('askAi uses Gemini first and does not call Dahl after Gemini succeeds', async () => {
    const calls = [];
    const result = await askAi('test', 10, {
        gemini: async () => {
            calls.push('gemini');
            return { provider: 'gemini' };
        },
        dahl: async () => {
            calls.push('dahl');
            return { provider: 'dahl' };
        },
    });

    assert.deepEqual(result, { provider: 'gemini' });
    assert.deepEqual(calls, ['gemini']);
});

test('askAi falls back to Dahl only when Gemini fails', async () => {
    const calls = [];
    const result = await askAi('test', 10, {
        gemini: async () => {
            calls.push('gemini');
            throw new Error('Gemini unavailable');
        },
        dahl: async () => {
            calls.push('dahl');
            return { provider: 'dahl' };
        },
    });

    assert.deepEqual(result, { provider: 'dahl' });
    assert.deepEqual(calls, ['gemini', 'dahl']);
});
