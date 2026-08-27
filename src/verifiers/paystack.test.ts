import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { PaystackVerifier } from './paystack';

const verifier = new PaystackVerifier();
const secret = 'test-secret';
const payload = JSON.stringify({ event: 'charge.success', data: { id: 1 } });

function sign(body: string, key: string): string {
    return createHmac('sha512', key).update(body).digest('hex');
}

test('PaystackVerifier accepts a correctly signed payload', () => {
    const signature = sign(payload, secret);
    const result = verifier.verify(payload, { 'x-paystack-signature': signature }, secret);
    assert.equal(result, true);
});

test('PaystackVerifier rejects a payload signed with the wrong secret', () => {
    const signature = sign(payload, 'wrong-secret');
    const result = verifier.verify(payload, { 'x-paystack-signature': signature }, secret);
    assert.equal(result, false);
});

test('PaystackVerifier rejects a tampered payload', () => {
    const signature = sign(payload, secret);
    const tampered = JSON.stringify({ event: 'charge.success', data: { id: 2 } });
    const result = verifier.verify(tampered, { 'x-paystack-signature': signature }, secret);
    assert.equal(result, false);
});

test('PaystackVerifier rejects a missing signature header', () => {
    const result = verifier.verify(payload, {}, secret);
    assert.equal(result, false);
});

test('PaystackVerifier rejects a non-hex signature without throwing', () => {
    const result = verifier.verify(payload, { 'x-paystack-signature': 'not-valid-hex!!' }, secret);
    assert.equal(result, false);
});
