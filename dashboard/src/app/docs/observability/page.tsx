export default function ObservabilityDocs() {
  return (
    <div className="flex flex-col gap-6" style={{ animation: 'heroFadeUp 0.5s ease both' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#5e6ad2', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Feature
      </p>
      <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', color: '#fff', lineHeight: 1.2 }}>
        AI-assisted Failure Diagnostics
      </h1>
      
      <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.6 }}>
        Silent failures are the biggest pain point of webhook integrations. When an event fails to deliver after multiple retries, HookLens does not just log a status code. It provides actionable intelligence.
      </p>

      <div style={{ marginTop: '16px', padding: '24px', backgroundColor: '#060606', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
          How the Diagnostic Worker Operates
        </h2>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
          When a webhook hits its terminal failure limit, the HookLens Diagnostic Worker triggers asynchronously. It packages the raw payload, the response headers, and the downstream error body.
        </p>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6 }}>
          This data is sent securely to the Anthropic API to generate a plain language summary of why the delivery failed, offering direct insight into whether the issue is a 502 Bad Gateway, a validation error from your backend, or a malformed payload.
        </p>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e0e0e0', marginBottom: '12px' }}>
          Benefits
        </h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyleType: 'disc', paddingLeft: '20px' }}>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Zero Guesswork:</strong> Stop digging through raw server logs to figure out why an event dropped.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Rapid Resolution:</strong> Instantly know if you need to fix a bug in your application or if your server was simply offline.
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
