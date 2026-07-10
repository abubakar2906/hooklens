import { PaystackVerifier } from './paystack';
import { FlutterwaveVerifier } from './flutterwave';
import { MonnifyVerifier } from './monnify';

// The contract every provider verifier must implement.
// The webhook route depends only on this interface — never on a concrete class.
export interface SignatureVerifier {
    providerName: string;
    verify(payload: string, headers: Record<string, string>, secret: string): boolean;
}

// The registry maps provider type strings (as stored in the database) to
// their verifier instances. A Map gives O(1) lookup by key.
// Verifiers are stateless — they hold no data between calls — so a single
// shared instance per provider is correct and efficient.
const registry = new Map<string, SignatureVerifier>([
    ['paystack', new PaystackVerifier()],
    ['flutterwave', new FlutterwaveVerifier()],
    ['monnify', new MonnifyVerifier()],
]);

// The factory function. Returns the verifier for a given provider type,
// or null if no verifier exists for that type.
// Returning null (instead of throwing) lets the caller decide how to handle
// an unknown provider — the webhook route treats it as a 500.
export function getVerifier(providerType: string): SignatureVerifier | null {
    return registry.get(providerType) ?? null;
}