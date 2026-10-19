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

test('askAi falls back when Dahl API fails or is invalid', async () => {
    const origKey = process.env.DAHL_API_KEY;
    const origUrl = process.env.DAHL_API_URL;
    const origGeminiExtra = process.env.GEMINI_EXTRA;

    try {
        // Point Dahl to an invalid endpoint that will fail
        process.env.DAHL_API_KEY = 'invalid_key';
        process.env.DAHL_API_URL = 'http://127.0.0.1:1/invalid';
        delete process.env.GEMINI_EXTRA;
        delete process.env.GEMINI_KEY;

        // When both Dahl and Gemini fail (no Gemini key in this test), the error thrown will be Gemini's
        await assert.rejects(
            async () => { await askAi('test', 10); },
            /No Gemini API key configured/
        );
    } finally {
        if (origKey !== undefined) process.env.DAHL_API_KEY = origKey;
        else delete process.env.DAHL_API_KEY;
        if (origUrl !== undefined) process.env.DAHL_API_URL = origUrl;
        else delete process.env.DAHL_API_URL;
        if (origGeminiExtra !== undefined) process.env.GEMINI_EXTRA = origGeminiExtra;
        else delete process.env.GEMINI_EXTRA;
    }
});
