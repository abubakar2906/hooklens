import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { MonnifyVerifier } from './monnify';

const verifier = new MonnifyVerifier();
const secret = 'test-secret';
const payload = JSON.stringify({ eventType: 'SUCCESSFUL_TRANSACTION', eventData: { id: 1 } });

function sign(body: string, key: string): string {
    return createHmac('sha512', key).update(body).digest('hex');
}

test('MonnifyVerifier accepts a correctly signed payload', () => {
    const signature = sign(payload, secret);
    const result = verifier.verify(payload, { 'monnify-signature': signature }, secret);
    assert.equal(result, true);
});

test('MonnifyVerifier rejects a payload signed with the wrong secret', () => {
    const signature = sign(payload, 'wrong-secret');
    const result = verifier.verify(payload, { 'monnify-signature': signature }, secret);
    assert.equal(result, false);
});

test('MonnifyVerifier rejects a missing signature header', () => {
    const result = verifier.verify(payload, {}, secret);
    assert.equal(result, false);
});
