import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_GEMINI_MODEL, getGeminiApiKey, getGeminiModel } from '../services/geminiConfig.js';
import { parseGeminiJson } from '../services/geminiResponse.js';

const envKeys = ['GEMINI_EXTRA', 'GEMINI_KEY', 'GEMINI_KEY_1', 'GEMINI_KEY_2', 'GEMINI_KEY_3', 'GEMINI_MODEL'];

const withoutGeminiEnv = (callback) => {
    const previous = Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
    envKeys.forEach(key => delete process.env[key]);
    try {
        return callback();
    } finally {
        envKeys.forEach(key => {
            if (previous[key] === undefined) delete process.env[key];
            else process.env[key] = previous[key];
        });
    }
};

test('Gemini JSON parsing accepts fenced and explanatory responses', () => {
    assert.deepEqual(parseGeminiJson('```json\n{"activities":[{"name":"Rafting"}]}\n```'), {
        activities: [{ name: 'Rafting' }],
    });
    assert.deepEqual(parseGeminiJson('Here is the result:\n{"ok":true}\nThanks!'), { ok: true });
});

test('Gemini JSON parsing rejects empty or invalid responses', () => {
    assert.throws(() => parseGeminiJson(''), /empty response/);
    assert.throws(() => parseGeminiJson('not JSON'), /invalid JSON/);
});

test('Gemini configuration uses a valid default and shared key aliases', () => {
    withoutGeminiEnv(() => {
        assert.equal(getGeminiModel(), DEFAULT_GEMINI_MODEL);
        assert.throws(() => getGeminiApiKey(), /No Gemini API key configured/);
    });

    const previous = process.env.GEMINI_MODEL;
    process.env.GEMINI_MODEL = 'gemini-test-model';
    assert.equal(getGeminiModel(), 'gemini-test-model');
    if (previous === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = previous;
});
