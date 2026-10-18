import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeIlikePattern, getUsernameValidationError } from '../utils/usernameSearch.js';

test('username validation rejects whitespace while allowing case and symbols', () => {
    assert.equal(getUsernameValidationError('Sky!Walker_2'), null);
    assert.equal(getUsernameValidationError('Sky Walker'), 'Username cannot contain whitespace');
    assert.equal(getUsernameValidationError('Sky\tWalker'), 'Username cannot contain whitespace');
    assert.equal(getUsernameValidationError('', 'Target Username'), 'Target Username is required');
});

test('ILIKE escaping makes wildcard characters literal', () => {
    assert.equal(escapeIlikePattern('50%_off\\ice'), '50\\%\\_off\\\\ice');
});
