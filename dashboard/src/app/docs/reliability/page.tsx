export default function ReliabilityDocs() {
  return (
    <div className="flex flex-col gap-6" style={{ animation: 'heroFadeUp 0.5s ease both' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#5e6ad2', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Feature
      </p>
      <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', color: '#fff', lineHeight: 1.2 }}>
        Automatic Exponential Backoff
      </h1>
      
      <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.6 }}>
        Network blips, rate limits, and server restarts happen. HookLens is built with an integrated queueing system to ensure that transient errors never result in lost webhook events.
      </p>

      <div style={{ marginTop: '16px', padding: '24px', backgroundColor: '#060606', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
          Configurable Retry Policies
        </h2>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
          Deliveries are managed by Redis and BullMQ. When a delivery fails, it is scheduled for a retry using a standard exponential backoff formula. This ensures your downstream servers are not overwhelmed during an outage.
        </p>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e0e0e0', marginBottom: '12px' }}>
          Default Retry Schedule
        </h3>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
          The delay for any given attempt is calculated automatically, doubling the wait time after each failure until the maximum number of attempts is reached.
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyleType: 'disc', paddingLeft: '20px' }}>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Attempt 1:</strong> Immediate delivery.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Attempt 2:</strong> 1 minute delay.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Attempt 3:</strong> 2 minute delay.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Attempt 4:</strong> 4 minute delay.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Attempt 5:</strong> 8 minute delay.
          </li>
        </ul>
        <p style={{ fontSize: '15px', color: '#e54d2e', lineHeight: 1.6, marginTop: '16px' }}>
          If Attempt 5 fails, the event status is marked as terminal, and the AI Diagnostic Worker is triggered.
        </p>
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
