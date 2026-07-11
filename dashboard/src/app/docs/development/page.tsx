export default function DevelopmentDocs() {
  return (
    <div className="flex flex-col gap-6" style={{ animation: 'heroFadeUp 0.5s ease both' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#5e6ad2', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Feature
      </p>
      <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', color: '#fff', lineHeight: 1.2 }}>
        Secure Local Development
      </h1>
      
      <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.6 }}>
        Testing webhooks locally has historically involved running third party proxy tools to expose your local machine to the internet. HookLens changes this paradigm entirely.
      </p>

      <div style={{ marginTop: '16px', padding: '24px', backgroundColor: '#060606', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
          Localhost Forwarding
        </h2>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
          HookLens can be configured to securely tunnel webhook events directly to your local development environment without opening any external ports on your local router.
        </p>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e0e0e0', marginBottom: '12px' }}>
          Developer Experience First
        </h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyleType: 'disc', paddingLeft: '20px' }}>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>Zero Configuration:</strong> No need to install CLI tools like Ngrok or configure complex networking rules.
          </li>
          <li style={{ fontSize: '15px', color: '#888', lineHeight: 1.5 }}>
            <strong style={{ color: '#ccc' }}>End to End Testing:</strong> Trigger an event from your Paystack dashboard, and watch it hit your local database in milliseconds while viewing the transaction details right inside the HookLens portal.
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
