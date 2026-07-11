export default function AuthenticationDocs() {
  return (
    <div className="flex flex-col gap-6" style={{ animation: 'heroFadeUp 0.5s ease both' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#5e6ad2', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Feature
      </p>
      <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', color: '#fff', lineHeight: 1.2 }}>
        Signatures Verified Automatically
      </h1>
      
      <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.6 }}>
        Providers use vastly different security models. For example, Paystack uses HMAC SHA512, while Flutterwave uses a custom verification hash header. HookLens abstracts this complexity entirely.
      </p>

      <div style={{ marginTop: '16px', padding: '24px', backgroundColor: '#060606', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
          Pluggable Signature Verification
        </h2>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
          The architecture dictates a strict Strategy Pattern for verification. Every provider plugin implements a standard interface. The ingestion route dynamically invokes the correct strategy based on the endpoint configuration.
        </p>
        <div style={{ backgroundColor: '#000', border: '1px solid #1a1a1a', padding: '16px', borderRadius: '6px', fontFamily: 'ui-monospace, monospace', fontSize: '13px', color: '#aaa', overflowX: 'auto' }}>
          <pre><code>{`interface SignatureVerifier {
  providerName: string;
  verify(payload: string, headers: Record<string, string>, secret: string): boolean;
}`}</code></pre>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e0e0e0', marginBottom: '12px' }}>
          Implementation Targets
        </h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyleType: 'disc', paddingLeft: '20px' }}>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Paystack:</strong> Computes HMAC SHA512 of the raw payload using the secret key and compares it to the x-paystack-signature header.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Flutterwave:</strong> Compares the verif-hash header directly against the developer configured secret hash.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Monnify:</strong> Computes HMAC SHA512 of the payload and compares it to the monnify-signature header.
          </li>
        </ul>
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}
