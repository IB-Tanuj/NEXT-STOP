import test from 'node:test';
import assert from 'node:assert/strict';
import { validateItinerary, validateSummary } from '../services/tripAiValidation.js';

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
