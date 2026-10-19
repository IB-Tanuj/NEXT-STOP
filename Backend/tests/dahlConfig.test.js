import test from 'node:test';
import assert from 'node:assert/strict';
import {
    DEFAULT_DAHL_MODEL,
    DEFAULT_DAHL_URL,
    getDahlApiKey,
    getDahlApiUrl,
    getDahlModel,
    isDahlConfigured,
} from '../services/dahlConfig.js';

test('dahl configuration returns valid defaults and checks if configured', () => {
    const origKey = process.env.DAHL_API_KEY;
    const origUrl = process.env.DAHL_API_URL;
    const origModel = process.env.DAHL_MODEL;

    try {
        delete process.env.DAHL_API_KEY;
        delete process.env.DAHL_API_URL;
        delete process.env.DAHL_MODEL;

        assert.equal(getDahlApiKey(), '');
        assert.equal(isDahlConfigured(), false);
        assert.equal(getDahlApiUrl(), DEFAULT_DAHL_URL);
        assert.equal(getDahlModel(), DEFAULT_DAHL_MODEL);

        process.env.DAHL_API_KEY = 'dahl_test_key';
        assert.equal(getDahlApiKey(), 'dahl_test_key');
        assert.equal(isDahlConfigured(), true);

        process.env.DAHL_MODEL = 'test-model';
        assert.equal(getDahlModel(), 'test-model');
    } finally {
        if (origKey !== undefined) process.env.DAHL_API_KEY = origKey;
        else delete process.env.DAHL_API_KEY;
        if (origUrl !== undefined) process.env.DAHL_API_URL = origUrl;
        else delete process.env.DAHL_API_URL;
        if (origModel !== undefined) process.env.DAHL_MODEL = origModel;
        else delete process.env.DAHL_MODEL;
    }
});
