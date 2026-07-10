import { createHmac, timingSafeEqual } from 'crypto';
import { SignatureVerifier } from './index';

export class MonnifyVerifier implements SignatureVerifier {
    providerName = 'monnify';

    verify(payload: string, headers: Record<string, string>, secret: string): boolean {
        // Monnify sends the signature in this header.
        const signature = headers['monnify-signature'];

        if (!signature) {
            return false;
        }

        // Same HMAC SHA512 scheme as Paystack — compute over the raw payload
        // using the configured secret, compare to the header value.
        //
        // NOTE: Monnify's actual production signature scheme may involve
        // additional steps (e.g., specific field ordering or base64 encoding).
        // This implementation follows the PRD spec. When connecting to live
        // Monnify webhooks, verify against their current API documentation.
        const computed = createHmac('sha512', secret)
            .update(payload)
            .digest('hex');

        try {
            return timingSafeEqual(
                Buffer.from(computed, 'hex'),
                Buffer.from(signature, 'hex')
            );
        } catch {
            return false;
        }
    }
}