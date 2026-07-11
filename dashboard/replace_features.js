const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const newFeatures = \
const FEATURES = [
  {
    id: 'sig',
    eyebrow: 'Authentication',
    title: 'Provider signatures verified automatically',
    body: 'Paystack, Flutterwave, and Monnify signatures are verified per-endpoint before entering your queue.',
    code: 'x-paystack-signature: sha512=...'
  },
  {
    id: 'ai',
    eyebrow: 'Observability',
    title: 'AI-assisted failure diagnostics',
    body: 'Instant insights into why a delivery failed, analyzing headers, payloads, and your downstream server response.',
    code: 'Diagnostic: 502 Bad Gateway. Upstream unresponsive.'
  },
  {
    id: 'replay',
    eyebrow: 'Resilience',
    title: 'Zero-downtime event replays',
    body: 'Replay failed events individually or in bulk. HookLens maintains the original timestamp and payload integrity.',
    code: 'POST /api/webhooks/replay'
  },
  {
    id: 'retry',
    eyebrow: 'Reliability',
    title: 'Automatic exponential backoff',
    body: 'Configurable retry policies handle transient network errors and downstream server restarts gracefully.',
    code: 'retry_policy: { max: 5, backoff: "exponential" }'
  },
  {
    id: 'logs',
    eyebrow: 'Visibility',
    title: 'Real-time delivery logs',
    body: 'Filter events by provider, status, or date range. Search payloads and headers with zero indexing delay.',
    code: 'status: "failed" provider: "monnify"'
  },
  {
    id: 'local',
    eyebrow: 'Development',
    title: 'Secure local development tunnels',
    body: 'Receive webhooks on localhost without exposing your machine to the public internet.',
    code: 'hooklens listen 3000'
  }
];

function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="mx-auto max-w-[1280px] px-6 relative"
      style={{ paddingTop: '96px', paddingBottom: '96px' }}
    >
      <ScrollReveal>
        <div className="flex flex-col items-center text-center mb-16 relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none" 
               style={{ background: 'radial-gradient(ellipse, rgba(94,106,210,0.08) 0%, rgba(94,106,210,0) 60%)', zIndex: -1 }} />
          <p
            className="text-[#5e6ad2] uppercase mb-4 tracking-wider"
            style={{ fontSize: '12px', fontWeight: 600 }}
          >
            Capabilities
          </p>
          <h2
            id="features-heading"
            className="text-[#f7f8f8] mb-4 max-w-2xl mx-auto"
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
            }}
          >
            Infrastructure for the full webhook lifecycle
          </h2>
          <p
            className="text-[#8a8f98] max-w-lg mx-auto"
            style={{ fontSize: '18px', fontWeight: 400, lineHeight: 1.6 }}
          >
            From signature verification to AI-assisted diagnostics — every stage
            handled, observable, and replayable.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {FEATURES.map((f, i) => (
          <ScrollReveal key={f.id} delay={i * 100}>
            <div
              className="flex flex-col h-full group transition-all duration-300 hover:-translate-y-1 relative"
              style={{
                backgroundColor: '#0f1011',
                padding: '32px',
                borderRadius: '16px',
                border: '1px solid #23252a',
                boxShadow: '0 4px 24px -8px rgba(0,0,0,0.5)',
              }}
            >
              <div className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{ boxShadow: 'inset 0 0 0 1px rgba(94,106,210,0.3), 0 0 40px -10px rgba(94,106,210,0.1)' }} />
              
              <p
                className="text-[#62666d] uppercase mb-4 tracking-widest relative z-10"
                style={{ fontSize: '11px', fontWeight: 600 }}
              >
                {f.eyebrow}
              </p>
              
              <h3
                className="text-[#f7f8f8] mb-3 group-hover:text-[#5e6ad2] transition-colors relative z-10"
                style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.5px' }}
              >
                {f.title}
              </h3>
              
              <p
                className="text-[#8a8f98] mb-6 flex-grow relative z-10"
                style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.6 }}
              >
                {f.body}
              </p>

              <div 
                className="mt-auto p-3 rounded-lg overflow-hidden relative z-10"
                style={{ backgroundColor: '#0a0a0b', border: '1px solid #1a1b1e' }}
              >
                <code className="text-[#62666d] block truncate" style={{ fontFamily: 'ui-monospace, JetBrains Mono, monospace', fontSize: '12px' }}>
                  {f.code}
                </code>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
\;

const startIndex = content.indexOf('const FEATURES = [');
const endIndex = content.indexOf('function ProductPreviewSection() {');
if (startIndex !== -1 && endIndex !== -1) {
  // We need to keep the ProductPreviewSection comment intact, so we find the end of FeaturesSection
  const textToReplace = content.substring(startIndex, endIndex);
  content = content.replace(textToReplace, newFeatures + '\\n\\n// ─── Product Preview ─────────────────────────────────────────────────────────────\\n// Linear pattern: Full-width surface-1 panel on canvas, showing a real event detail\\n// view with JSON payload on the left and delivery timeline + AI diagnostics on the right.\\n// The panel IS the decoration. No atmospheric backgrounds.\\n');
  fs.writeFileSync('src/app/page.tsx', content, 'utf8');
  console.log('Successfully replaced FeaturesSection');
} else {
  console.log('Could not find boundaries');
}
