export default function ResilienceDocs() {
  return (
    <div className="flex flex-col gap-6" style={{ animation: 'heroFadeUp 0.5s ease both' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#5e6ad2', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Feature
      </p>
      <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', color: '#fff', lineHeight: 1.2 }}>
        Zero-Downtime Event Replays
      </h1>
      
      <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.6 }}>
        Sometimes your application goes down, or a bug gets deployed that causes incoming webhooks to fail processing. When you fix the bug, you need a way to recover those dropped events.
      </p>

      <div style={{ marginTop: '16px', padding: '24px', backgroundColor: '#060606', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
          Payload Integrity Preservation
        </h2>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
          HookLens stores the raw JSON payloads and headers in the database exactly as they were received from the payment provider. This guarantees complete fidelity when an event needs to be resent to your application.
        </p>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e0e0e0', marginBottom: '12px' }}>
          Replay Capabilities
        </h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyleType: 'disc', paddingLeft: '20px' }}>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Individual Replays:</strong> Click replay on a single failed event directly from the dashboard.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Original Timestamps:</strong> The replayed event will always contain the original timestamp so your ledger remains perfectly accurate.
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
