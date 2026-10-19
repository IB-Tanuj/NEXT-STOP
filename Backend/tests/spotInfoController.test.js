import test from 'node:test';
import assert from 'node:assert/strict';
import { getSpotInfoBatch } from '../controllers/spotInfoController.js';

test('spot info batch rejects missing or invalid inputs', async () => {
    const createMockRes = () => ({
        statusCode: 200,
        headers: {},
        status(code) { this.statusCode = code; return this; },
        setHeader(k, v) { this.headers[k] = v; return this; },
        json(data) { this.data = data; return this; }
    });

    // Empty spots
    const res1 = createMockRes();
    await getSpotInfoBatch({ body: { spots: [], locationName: 'Goa' } }, res1);
    assert.equal(res1.statusCode, 400);
    assert.match(res1.data.error, /spots \(array\) and locationName are required/);

    // Missing locationName
    const res2 = createMockRes();
    await getSpotInfoBatch({ body: { spots: ['Baga Beach'] } }, res2);
    assert.equal(res2.statusCode, 400);
    assert.match(res2.data.error, /spots \(array\) and locationName are required/);
});

test('spot info batch returns 503 when no Gemini keys are configured', async () => {
    const keys = ['GEMINI_EXTRA', 'GEMINI_KEY', 'GEMINI_KEY_1', 'GEMINI_KEY_2', 'GEMINI_KEY_3'];
    const backup = Object.fromEntries(keys.map(k => [k, process.env[k]]));

    keys.forEach(k => delete process.env[k]);

    const res = {
        statusCode: 200,
        headers: {},
        status(code) { this.statusCode = code; return this; },
        setHeader(k, v) { this.headers[k] = v; return this; },
        json(data) { this.data = data; return this; }
    };

    try {
        await getSpotInfoBatch({ body: { spots: ['Uncached Unique Spot ' + Date.now()], locationName: 'Unknown' } }, res);
        assert.equal(res.statusCode, 503);
        assert.match(res.data.error, /No Gemini API keys configured/);
    } finally {
        keys.forEach(k => {
            if (backup[k] !== undefined) process.env[k] = backup[k];
            else delete process.env[k];
        });
    }
});
