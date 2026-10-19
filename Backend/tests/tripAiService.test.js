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

test('askAi falls back to Gemini when Dahl API fails', async () => {
    const keys = ['DAHL_API_KEY', 'DAHL_API_URL', 'GEMINI_EXTRA', 'GEMINI_KEY', 'GEMINI_KEY_1', 'GEMINI_KEY_2', 'GEMINI_KEY_3'];
    const backup = Object.fromEntries(keys.map(k => [k, process.env[k]]));

    try {
        // Point Dahl to an invalid endpoint that will immediately fail
        process.env.DAHL_API_KEY = 'invalid_key';
        process.env.DAHL_API_URL = 'http://127.0.0.1:1/invalid';
        keys.filter(k => k.startsWith('GEMINI')).forEach(k => delete process.env[k]);

        // When Dahl fails and all Gemini keys are missing, askGemini's 'No Gemini API key configured' is thrown
        await assert.rejects(
            async () => { await askAi('test', 10); },
            /No Gemini API key configured/
        );
    } finally {
        keys.forEach(k => {
            if (backup[k] !== undefined) process.env[k] = backup[k];
            else delete process.env[k];
        });
    }
});
