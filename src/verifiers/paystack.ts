import { createHmac, timingSafeEqual } from 'crypto';
import { SignatureVerifier } from './index';

export class PaystackVerifier implements SignatureVerifier {
    providerName = 'paystack';

    verify(payload: string, headers: Record<string, string>, secret: string): boolean {
        // Paystack sends the signature in this header.
        // Express lowercases all header names automatically, so
        // 'X-Paystack-Signature' from the wire becomes 'x-paystack-signature' here.
        const signature = headers['x-paystack-signature'];

        if (!signature) {
            return false;
        }

        // Compute HMAC SHA512 of the raw payload using the endpoint's secret.
        // This must match exactly what Paystack computed on their side.
        const computed = createHmac('sha512', secret)
            .update(payload)
            .digest('hex');

        // Convert both hex strings to binary buffers before comparing.
        // Two benefits:
        // 1. timingSafeEqual requires Buffers, not strings.
        // 2. Decoding to binary makes the comparison case-insensitive —
        //    'AABB' and 'aabb' decode to the same bytes [0xAA, 0xBB].
        try {
            return timingSafeEqual(
                Buffer.from(computed, 'hex'),
                Buffer.from(signature, 'hex')
            );
        } catch {
            // timingSafeEqual throws if the two Buffers have different byte lengths.
            // This happens when the provided signature is not valid hex, or is a
            // different length than the expected 128-character SHA512 hex output.
            // Either way, it's not a valid signature.
            return false;
        }
    }
}