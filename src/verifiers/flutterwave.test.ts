import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FlutterwaveVerifier } from './flutterwave';

const verifier = new FlutterwaveVerifier();
const secret = 'test-secret';
const payload = JSON.stringify({ event: 'charge.completed', data: { id: 1 } });

test('FlutterwaveVerifier accepts a header matching the configured secret', () => {
    const result = verifier.verify(payload, { 'verif-hash': secret }, secret);
    assert.equal(result, true);
});

test('FlutterwaveVerifier rejects a header that does not match the secret', () => {
    const result = verifier.verify(payload, { 'verif-hash': 'wrong-hash' }, secret);
    assert.equal(result, false);
});

test('FlutterwaveVerifier rejects a missing header', () => {
    const result = verifier.verify(payload, {}, secret);
    assert.equal(result, false);
});

test('FlutterwaveVerifier rejects a differently-sized header without throwing', () => {
    const result = verifier.verify(payload, { 'verif-hash': 'x'.repeat(secret.length + 5) }, secret);
    assert.equal(result, false);
});
