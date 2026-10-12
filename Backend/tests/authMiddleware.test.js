import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequireAuth } from '../middleware/authFactory.js';

const response = () => {
    const result = { statusCode: null, body: null };
    return {
        result,
        status(code) {
            result.statusCode = code;
            return this;
        },
        json(body) {
            result.body = body;
            return this;
        },
    };
};

test('auth middleware rejects requests without a bearer token', async () => {
    const res = response();
    let called = false;
    await createRequireAuth({ auth: { getUser: async () => ({}) } })({ headers: {} }, res, () => { called = true; });

    assert.equal(res.result.statusCode, 401);
    assert.equal(called, false);
});

test('auth middleware attaches the verified user to the request', async () => {
    const res = response();
    const req = { headers: { authorization: 'Bearer test-token' } };
    let called = false;
    const user = { id: 'user-123' };
    await createRequireAuth({ auth: { getUser: async token => ({ data: { user: token === 'test-token' ? user : null }, error: null }) } })(req, res, () => { called = true; });

    assert.equal(called, true);
    assert.deepEqual(req.user, user);
    assert.equal(res.result.statusCode, null);
});
