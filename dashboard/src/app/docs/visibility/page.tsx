export default function VisibilityDocs() {
  return (
    <div className="flex flex-col gap-6" style={{ animation: 'heroFadeUp 0.5s ease both' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#5e6ad2', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Feature
      </p>
      <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', color: '#fff', lineHeight: 1.2 }}>
        Real-Time Delivery Logs
      </h1>
      
      <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.6 }}>
        The HookLens dashboard provides absolute transparency into your webhook infrastructure. Track every event from ingestion to final delivery status in real-time.
      </p>

      <div style={{ marginTop: '16px', padding: '24px', backgroundColor: '#060606', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
          Database Analytics
        </h2>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
          Using Postgres, our schema is highly optimized for write-heavy ingestion and read-heavy dashboard analytics. JSONB columns are utilized extensively to store unstructured provider data without sacrificing query performance.
        </p>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e0e0e0', marginBottom: '12px' }}>
          Filtering and Search
        </h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyleType: 'disc', paddingLeft: '20px' }}>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Provider Filtering:</strong> Isolate events to see only Paystack, Flutterwave, or Monnify traffic.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Status Views:</strong> Quickly toggle between Failed, Retrying, and Successful delivery states.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Deep Search:</strong> Search through payloads and headers instantly to find specific transaction references or customer IDs.
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
