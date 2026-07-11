export default function DocsPage() {
  return (
    <div className="flex flex-col gap-6" style={{ animation: 'heroFadeUp 0.5s ease both' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#5e6ad2', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Introduction
      </p>
      <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', color: '#fff', lineHeight: 1.2 }}>
        Welcome to HookLens
      </h1>
      
      <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.6 }}>
        African fintech providers like Paystack, Flutterwave, and Monnify are critical to regional commerce. However, each implements webhook delivery, signature validation, and retry semantics differently.
      </p>

      <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.6 }}>
        HookLens provides a self-hosted, centralized webhook gateway that normalizes ingestion, guarantees delivery via decoupled queueing, and drastically reduces debugging time through AI-assisted failure diagnostics.
      </p>

      <div style={{ marginTop: '24px', padding: '24px', backgroundColor: '#060606', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
          Opinionated Technical Architecture
        </h2>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
          To ensure high availability and prevent provider timeouts, ingestion must be strictly decoupled from delivery. Our architecture includes:
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyleType: 'disc', paddingLeft: '20px' }}>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Ingestion Layer:</strong> Optimized for speed. It performs synchronous signature verification, writes the raw event to Postgres, pushes it to Redis, and immediately returns a 200 OK.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Queue System:</strong> Acts as the shock absorber. Handles job locking, delayed execution, and exponential backoff without tying up thread pools.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Delivery Worker:</strong> Consumes events, fetches payloads, makes the HTTP POST request to your endpoint, and updates delivery attempt records synchronously.
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
