import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Isolated temporary module/state: no real credentials, providers, or project data.
test('key cooldowns persist fingerprints, migrate legacy state, and still rotate', async (t) => {
    const root = mkdtempSync(path.join(tmpdir(), 'next-stop-keys-'));
    const originalKeys = Object.entries(process.env).filter(([name]) => name.startsWith('RAPIDAPI_KEY'));
    for (const [name] of originalKeys) delete process.env[name];
    t.after(() => {
        for (const name of Object.keys(process.env)) {
            if (name.startsWith('RAPIDAPI_KEY')) delete process.env[name];
        }
        for (const [name, value] of originalKeys) process.env[name] = value;
        rmSync(root, { recursive: true, force: true });
    });

    mkdirSync(path.join(root, 'utils'));
    const modulePath = path.join(root, 'utils', 'manager.mjs');
    copyFileSync(new URL('../utils/rapidApiKeyManager.js', import.meta.url), modulePath);
    const manager = await import(pathToFileURL(modulePath).href);
    const statePath = path.join(root, 'data', 'dead_keys.json');
    const first = 'test-only-provider-key-one';
    const second = 'test-only-provider-key-two';
    const host = 'example.test';
    const fingerprint = (key) => createHash('sha256').update(key).digest('hex');
    const logs = [];
    t.mock.method(console, 'warn', (...args) => logs.push(args.join(' ')));
    t.mock.method(console, 'log', (...args) => logs.push(args.join(' ')));

    assert.equal(manager.getAvailableKey(host), null);
    process.env.RAPIDAPI_KEY = first;
    process.env.RAPIDAPI_KEY_2 = second;
    assert.equal(manager.getAvailableKey(host), first);

    const attempts = [];
    const result = await manager.runWithKeyRotation(host, async (key) => {
        attempts.push(key);
        if (key === first) throw { response: { status: 429 } };
        return 'ok';
    });
    assert.equal(result, 'ok');
    assert.deepEqual(attempts, [first, second]);
    let persisted = readFileSync(statePath, 'utf8');
    assert.ok(JSON.parse(persisted)[fingerprint(first)][host].diedAt);
    assert.equal(persisted.includes(first), false);
    assert.equal(logs.join('\n').includes(first.slice(0, 5)), false);

    // Old installations must not keep rewriting plaintext keys to disk.
    writeFileSync(statePath, JSON.stringify({ [first]: { [host]: { diedAt: Date.now() } } }));
    assert.equal(manager.getAvailableKey(host), second);
    persisted = readFileSync(statePath, 'utf8');
    assert.equal(persisted.includes(first), false);
    assert.ok(JSON.parse(persisted)[fingerprint(first)]);

    // Cooldowns remain host-specific and expire after 30 days.
    assert.equal(manager.getAvailableKey('another.example.test'), first);
    writeFileSync(statePath, JSON.stringify({
        [fingerprint(first)]: { [host]: { diedAt: Date.now() - 31 * 24 * 60 * 60 * 1000 } },
    }));
    assert.equal(manager.getAvailableKey(host), first);
    assert.equal(JSON.parse(readFileSync(statePath, 'utf8'))[fingerprint(first)][host], undefined);
});
