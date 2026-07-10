import { timingSafeEqual } from 'crypto';
import { SignatureVerifier } from './index';

export class FlutterwaveVerifier implements SignatureVerifier {
    providerName = 'flutterwave';

    verify(payload: string, headers: Record<string, string>, secret: string): boolean {
        // Flutterwave's security model is simpler than HMAC.
        // They send a header 'verif-hash' whose value you set in their dashboard.
        // If the header matches your configured secret, the request is genuine.
        // No cryptographic computation needed — it's a shared secret comparison.
        const hash = headers['verif-hash'];

        if (!hash) {
            return false;
        }

        // Convert both strings to Buffers for constant-time comparison.
        // Buffer.from(str) with no encoding arg defaults to UTF-8.
        // timingSafeEqual throws if the buffers are different lengths,
        // which happens when the provided hash is a different length than the secret.
        try {
            return timingSafeEqual(
                Buffer.from(secret),
                Buffer.from(hash)
            );
        } catch {
            return false;
        }
    }
}