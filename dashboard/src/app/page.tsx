import ScrollReveal from '@/components/landing/scroll-reveal';
import PayloadViewer from '@/components/landing/payload-viewer';

// Global hover styles
function GlobalStyles() {
  return (
    <style>{`
      @keyframes heroFadeUp {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes ticker {
        from { transform:translateX(0); }
        to   { transform:translateX(-33.333%); }
      }
      .ticker-track {
        display:flex; gap:80px; align-items:center;
        width:max-content;
        animation:ticker 28s linear infinite;
      }
      .ticker-track:hover { animation-play-state:paused; }
      .ticker-item { color:#252525; font-size:18px; font-weight:700; letter-spacing:-0.5px; flex-shrink:0; transition:color 0.2s; cursor:default; user-select:none; white-space:nowrap; }
      .ticker-item:hover { color:#666; }
      .nav-link { font-size:14px; font-weight:400; color:#555; transition:color 0.2s; text-decoration:none; }
      .nav-link:hover { color:#e0e0e0; }
      .footer-link { font-size:13px; color:#333; text-decoration:none; transition:color 0.2s; }
      .footer-link:hover { color:#888; }
      .feat-card { background-color:#000; padding:40px 32px; position:relative; min-height:340px; display:flex; flex-direction:column; transition:background-color 0.25s; }
      .feat-card:hover { background-color:#050505; }
      .feat-illus { opacity:0.6; transition:opacity 0.3s; }
      .feat-card:hover .feat-illus { opacity:0.95; }
      .no-scrollbar::-webkit-scrollbar { display:none; }
      .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
    `}</style>
  );
}

// Simplified Icons
function IllustrationShield() {
  return <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function IllustrationEye() {
  return <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function IllustrationReplay() {
  return <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>;
}
function IllustrationRetry() {
  return <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>;
}
function IllustrationLogs() {
  return <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
}
function IllustrationTunnel() {
  return <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
const ILLUSTRATIONS = [IllustrationShield, IllustrationEye, IllustrationReplay, IllustrationRetry, IllustrationLogs, IllustrationTunnel];

// Nav
function Nav() {
  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#000000', borderBottom: '1px solid #1a1a1a', height: '56px' }}>
      <div className="mx-auto max-w-[1280px] px-6 h-full flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5" aria-label="HookLens home">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#5e6ad2" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="3.5" fill="#5e6ad2" />
            <path d="M10 3 L10 6.5 M10 13.5 L10 17 M3 10 L6.5 10 M13.5 10 L17 10" stroke="#5e6ad2" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.2px', color: '#fff' }}>HookLens</span>
        </a>
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
          {[{ label: 'Product', href: '#features' }, { label: 'Docs', href: '#' }, { label: 'GitHub', href: 'https://github.com' }].map(({ label, href }) => (
            <a key={label} href={href} className="nav-link">{label}</a>
          ))}
        </nav>
        <a href="/waitlist" style={{ fontSize: '14px', fontWeight: 500, color: '#000', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 16px' }}>Join waitlist</a>
      </div>
    </header>
  );
}

// Trusted-by ticker
function TrustedBy() {
  const companies = ['Paystack', 'Flutterwave', 'Moniepoint', 'Bachs', 'Clerk', 'Resend'];
  const items = [...companies, ...companies, ...companies];
  return (
    <div style={{ backgroundColor: '#000000', borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: '20px 0', overflow: 'hidden' }}>
      <div className="ticker-track">
        {items.map((c, i) => (
          <span key={i} className="ticker-item">{c}</span>
        ))}
      </div>
    </div>
  );
}

// Hero
function Hero() {
  return (
    <section aria-labelledby="hero-headline" className="mx-auto max-w-[1280px] px-6" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
      <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', color: '#444', textTransform: 'uppercase', marginBottom: '20px', animation: 'heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both' }}>
        Open-source &middot; Self-hosted &middot; African Fintech
      </p>
      <h1 id="hero-headline" style={{ fontSize: 'clamp(42px, 6vw, 76px)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-2.5px', maxWidth: '900px', color: '#fff', animation: 'heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '60ms' }}>
        Webhook infrastructure <span style={{ color: '#333' }}>for fintech developers.</span>
      </h1>
      <p style={{ fontSize: '18px', color: '#555', lineHeight: 1.55, maxWidth: '540px', marginTop: '24px', animation: 'heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '120ms' }}>
        A self-hosted gateway for Paystack, Flutterwave, and Monnify webhooks. Normalised ingestion, guaranteed delivery, automatic retries, and AI-powered failure diagnostics.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '32px', flexWrap: 'wrap', animation: 'heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '160ms' }}>
        <a href="/waitlist" style={{ fontSize: '14px', fontWeight: 500, color: '#000', backgroundColor: '#fff', borderRadius: '8px', padding: '10px 20px', display: 'inline-flex', alignItems: 'center' }}>Join waitlist</a>
        <a href="https://github.com/abubakar2906/hooklens" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          View on GitHub
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10 L10 2 M4 2 L10 2 L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
      <ScrollReveal delay={250}>
        <div style={{ marginTop: '80px', overflow: 'hidden', backgroundColor: '#080808', border: '1px solid #1a1a1a', borderRadius: '12px', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '40px', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 1, 2].map(j => <span key={j} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#222', display: 'block' }} />)}
              </div>
              <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '12px', color: '#444', marginLeft: '8px' }}>hooklens &middot; events</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#111', border: '1px solid #1a1a1a' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#27a644', display: 'block' }} />
              <span style={{ fontSize: '11px', color: '#555' }}>Live</span>
            </div>
          </div>
          <div className="overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: '700px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '36px', borderBottom: '1px solid #1a1a1a' }}>
                {['All Events', 'Failed', 'Retrying', 'Queued'].map((tab, i) => (
                  <span key={tab} style={{ fontSize: '13px', fontWeight: i === 0 ? 500 : 400, color: i === 0 ? '#e0e0e0' : '#444', borderBottom: i === 0 ? '1px solid #e0e0e0' : 'none', paddingBottom: '1px' }}>{tab}</span>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 100px 1fr 70px 80px 90px', padding: '8px 16px', borderBottom: '1px solid #1a1a1a', backgroundColor: '#050505' }}>
                {['Status', 'Provider', 'Destination', 'Attempts', 'Latency', 'Received'].map(h => (
                  <span key={h} style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.3px', color: '#333', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>
              <div>
                {[
                  { id: 'evt_9f2a1c3d', status: 'success', provider: 'Paystack', dest: 'api.acme.io/hooks', attempts: 1, latency: '124ms', time: '2s ago' },
                  { id: 'evt_b7e4f091', status: 'success', provider: 'Flutterwave', dest: 'api.acme.io/hooks', attempts: 1, latency: '98ms', time: '14s ago' },
                  { id: 'evt_3d8c2a5e', status: 'failed', provider: 'Monnify', dest: 'staging.acme.io/webhooks', attempts: 5, latency: '&mdash;', time: '2m ago' },
                  { id: 'evt_a1f709bc', status: 'retrying', provider: 'Paystack', dest: 'api.acme.io/hooks', attempts: 3, latency: '412ms', time: '5m ago' },
                ].map((ev, i) => {
                  const st: Record<string, { dot: string; label: string; text: string }> = {
                    success: { dot: '#27a644', label: '#27a644', text: 'Delivered' },
                    failed: { dot: '#e54d2e', label: '#e54d2e', text: 'Failed' },
                    retrying: { dot: '#e5a000', label: '#e5a000', text: 'Retrying' },
                  };
                  const s = st[ev.status];
                  return (
                    <div key={ev.id} style={{ display: 'grid', gridTemplateColumns: '110px 100px 1fr 70px 80px 90px', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #111', backgroundColor: i % 2 === 0 ? 'transparent' : '#050505' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.dot, display: 'block', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: s.label }}>{s.text}</span>
                      </span>
                      <span style={{ fontSize: '13px', color: '#888' }}>{ev.provider}</span>
                      <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '12px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.dest}</span>
                      <span style={{ fontSize: '13px', color: '#333' }}>{ev.attempts}</span>
                      <span style={{ fontSize: '13px', color: '#333' }} dangerouslySetInnerHTML={{ __html: ev.latency }}></span>
                      <span style={{ fontSize: '12px', color: '#333' }}>{ev.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

// Features
const FEATURES = [
  { id: 'sig', fig: 'FIG 0.1', eyebrow: 'Authentication', title: 'Signatures verified automatically', body: 'Paystack, Flutterwave, and Monnify HMAC signatures are verified per-endpoint before entering your queue.' },
  { id: 'ai', fig: 'FIG 0.2', eyebrow: 'Observability', title: 'AI-assisted failure diagnostics', body: 'Instant insights into why a delivery failed &mdash; analyzing headers, payloads, and downstream server responses.' },
  { id: 'replay', fig: 'FIG 0.3', eyebrow: 'Resilience', title: 'Zero-downtime event replays', body: 'Replay failed events individually or in bulk. Original timestamps and payload integrity preserved.' },
  { id: 'retry', fig: 'FIG 0.4', eyebrow: 'Reliability', title: 'Automatic exponential backoff', body: 'Configurable retry policies handle transient network errors and downstream server restarts gracefully.' },
  { id: 'logs', fig: 'FIG 0.5', eyebrow: 'Visibility', title: 'Real-time delivery logs', body: 'Filter events by provider, status, or date range. Search payloads and headers with zero indexing delay.' },
  { id: 'local', fig: 'FIG 0.6', eyebrow: 'Development', title: 'Secure local development tunnels', body: 'Receive webhooks on localhost without exposing your machine to the public internet.' },
];

function FeaturesSection() {
  const C = 20, col = 'rgba(255,255,255,0.11)';
  return (
    <section id="features" className="mx-auto max-w-[1280px] px-6" style={{ paddingTop: '96px', paddingBottom: '96px' }}>
      <ScrollReveal>
        <div style={{ marginBottom: '64px' }}>
          <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Capabilities</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px', maxWidth: '600px', color: '#fff' }}>
            Infrastructure for the full webhook lifecycle
          </h2>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: '#111' }}>
        {FEATURES.map((f, i) => {
          const Illus = ILLUSTRATIONS[i];
          return (
            <div key={f.id} className="h-full bg-black">
              <ScrollReveal delay={i * 70} className="h-full">
                <div className="feat-card h-full">
                  <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: C, height: C, borderTop: '1px solid ' + col, borderLeft: '1px solid ' + col, pointerEvents: 'none' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: C, height: C, borderTop: '1px solid ' + col, borderRight: '1px solid ' + col, pointerEvents: 'none' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, width: C, height: C, borderBottom: '1px solid ' + col, borderLeft: '1px solid ' + col, pointerEvents: 'none' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', bottom: 0, right: 0, width: C, height: C, borderBottom: '1px solid ' + col, borderRight: '1px solid ' + col, pointerEvents: 'none' }} />
                  <p style={{ fontSize: '11px', fontWeight: 500, color: '#2a2a2a', letterSpacing: '0.5px', marginBottom: '20px' }}>{f.fig}</p>
                  <div className="feat-illus" style={{ marginBottom: '24px' }}><Illus /></div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#333', letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '8px' }}>{f.eyebrow}</p>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.3px', color: '#fff', marginBottom: '10px' }}>{f.title}</h3>
                  <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: f.body }}></p>
                </div>
              </ScrollReveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Product Preview
function ProductPreviewSection() {
  const C = 20, col = 'rgba(255,255,255,0.11)';
  return (
    <section aria-labelledby="preview-heading" className="mx-auto max-w-[1280px] px-6" style={{ paddingBottom: '96px' }}>
      <div style={{ borderTop: '1px solid #1a1a1a', marginBottom: '64px' }} />
      <ScrollReveal>
        <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Developer Experience</p>
        <h2 id="preview-heading" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px', maxWidth: '600px', color: '#fff', marginBottom: '16px' }}>Zero configuration. Total visibility.</h2>
        <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.55, maxWidth: '480px', marginBottom: '48px' }}>Inspect headers, drill into JSON payloads, understand exactly why a delivery failed.</p>
        <div style={{ position: 'relative', backgroundColor: '#060606', borderRadius: '4px', overflow: 'hidden' }}>
          <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: C, height: C, borderTop: '1px solid ' + col, borderLeft: '1px solid ' + col, pointerEvents: 'none' }} />
          <span aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: C, height: C, borderTop: '1px solid ' + col, borderRight: '1px solid ' + col, pointerEvents: 'none' }} />
          <span aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, width: C, height: C, borderBottom: '1px solid ' + col, borderLeft: '1px solid ' + col, pointerEvents: 'none' }} />
          <span aria-hidden="true" style={{ position: 'absolute', bottom: 0, right: 0, width: C, height: C, borderBottom: '1px solid ' + col, borderRight: '1px solid ' + col, pointerEvents: 'none' }} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-5 border-b gap-3 sm:gap-0" style={{ borderColor: '#1a1a1a', minHeight: '44px' }}>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex gap-1.5">
                {[0, 1, 2].map(j => <span key={j} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1a1a1a', display: 'block' }} />)}
              </div>
              <div className="flex items-center gap-2 sm:ml-2">
                <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '12px', color: '#444' }}>Events /</span>
                <span className="truncate" style={{ fontFamily: 'ui-monospace,monospace', fontSize: '12px', color: '#aaa', maxWidth: '100px' }}>evt_3d8c2a5e</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: 'rgba(229,77,46,0.1)', border: '1px solid rgba(229,77,46,0.2)', borderRadius: '9999px', fontSize: '11px', color: '#e54d2e', fontWeight: 500 }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#e54d2e', display: 'block' }} />Failed
                </span>
              </div>
            </div>
            <button tabIndex={-1} style={{ fontSize: '13px', fontWeight: 500, color: '#888', backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '5px 12px' }}>Replay</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: '#1a1a1a' }}>
            <div className="col-span-1 lg:col-span-2">
              <PayloadViewer />
            </div>
            <div style={{ padding: '20px', backgroundColor: '#040404', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '16px', backgroundColor: '#080808', border: '1px solid #1c1c1c', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5L7 1Z" fill="#5e6ad2" opacity="0.7" /></svg>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#888' }}>Diagnostic</span>
                </div>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#555' }}>
                  The destination returned <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '12px', color: '#e54d2e' }}>502 Bad Gateway</span>. Your reverse proxy is reachable, but the upstream application appears unresponsive.
                </p>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.3px', color: '#333', textTransform: 'uppercase', marginBottom: '16px' }}>Delivery History</p>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '8px', bottom: '8px', left: '6px', width: '1px', backgroundColor: '#1a1a1a' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[{ n: 5, time: '2h ago', code: '502', delay: 'final' }, { n: 4, time: '3h ago', code: '502', delay: '+8m' }, { n: 1, time: '17h ago', code: '502', delay: 'init' }].map(a => (
                      <div key={a.n} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingLeft: '22px' }}>
                        <div style={{ position: 'absolute', left: '2px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e54d2e', border: '2px solid #040404', marginTop: '3px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 500, color: '#888' }}>Attempt {a.n}</span>
                            <span style={{ fontSize: '11px', color: '#333' }}>{a.time}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '11px', color: '#e54d2e' }}>{a.code}</span>
                            <span style={{ fontSize: '11px', color: '#444' }}>{a.delay === 'init' ? 'Initial delivery' : a.delay === 'final' ? 'Max retries reached' : 'Backoff ' + a.delay}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

// Integrations
const PROVIDERS = [
  { id: 'paystack', name: 'Paystack', region: 'Nigeria &middot; Africa' },
  { id: 'flutterwave', name: 'Flutterwave', region: 'Africa' },
  { id: 'monnify', name: 'Monnify', region: 'Nigeria' },
];
const DESTINATIONS = [
  { id: 'express', name: 'Express', lang: 'Node.js' },
  { id: 'nextjs', name: 'Next.js', lang: 'Node.js' },
  { id: 'nestjs', name: 'NestJS', lang: 'Node.js' },
  { id: 'fastify', name: 'Fastify', lang: 'Node.js' },
  { id: 'hono', name: 'Hono', lang: 'TypeScript' },
  { id: 'fastapi', name: 'FastAPI', lang: 'Python' },
];

function IntegrationsSection() {
  const C = 16, col = 'rgba(255,255,255,0.1)';
  return (
    <section aria-labelledby="integrations-heading" className="mx-auto max-w-[1280px] px-6" style={{ paddingBottom: '120px' }}>
      <div style={{ borderTop: '1px solid #1a1a1a', marginBottom: '64px' }} />
      <ScrollReveal>
        <div style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Integrations</p>
          <h2 id="integrations-heading" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px', maxWidth: '500px', color: '#fff' }}>Works with your entire stack</h2>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8">
          <div className="flex flex-col gap-3 w-full lg:flex-1 lg:max-w-[280px]">
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#333', letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '4px' }}>Sources</p>
            {PROVIDERS.map(p => (
              <div key={p.id} style={{ position: 'relative', backgroundColor: '#060606', padding: '14px 16px', borderRadius: '2px' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: C, height: C, borderTop: '1px solid ' + col, borderLeft: '1px solid ' + col, pointerEvents: 'none' }} />
                <span aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: C, height: C, borderTop: '1px solid ' + col, borderRight: '1px solid ' + col, pointerEvents: 'none' }} />
                <span aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, width: C, height: C, borderBottom: '1px solid ' + col, borderLeft: '1px solid ' + col, pointerEvents: 'none' }} />
                <span aria-hidden="true" style={{ position: 'absolute', bottom: 0, right: 0, width: C, height: C, borderBottom: '1px solid ' + col, borderRight: '1px solid ' + col, pointerEvents: 'none' }} />
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>{p.name}</p>
                <p style={{ fontSize: '12px', color: '#444' }} dangerouslySetInnerHTML={{ __html: p.region }}></p>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center lg:pt-24 lg:flex-1">
            <div className="w-[2px] h-12 lg:w-16 lg:h-[2px]" style={{ background: 'linear-gradient(to bottom, transparent, #2a2a2a)' }} />
            <div className="my-4 lg:my-0 lg:mx-4 shrink-0 flex flex-col items-center gap-2">
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#060606', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="#5e6ad2" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="3.5" fill="#5e6ad2" />
                </svg>
              </div>
              <p className="block lg:hidden" style={{ fontSize: '11px', color: '#333' }}>HookLens Gateway</p>
            </div>
            <div className="w-[2px] h-12 lg:w-16 lg:h-[2px]" style={{ background: 'linear-gradient(to bottom, #2a2a2a, transparent)' }} />
          </div>

          <div className="flex flex-col gap-3 w-full lg:flex-1 lg:max-w-[320px]">
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#333', letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '4px' }}>Destinations</p>
            <div className="grid grid-cols-2 gap-3">
              {DESTINATIONS.map(d => (
                <div key={d.id} style={{ position: 'relative', backgroundColor: '#060606', padding: '12px 14px', borderRadius: '2px' }}>
                  <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: C, height: C, borderTop: '1px solid ' + col, borderLeft: '1px solid ' + col, pointerEvents: 'none' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: C, height: C, borderTop: '1px solid ' + col, borderRight: '1px solid ' + col, pointerEvents: 'none' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, width: C, height: C, borderBottom: '1px solid ' + col, borderLeft: '1px solid ' + col, pointerEvents: 'none' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', bottom: 0, right: 0, width: C, height: C, borderBottom: '1px solid ' + col, borderRight: '1px solid ' + col, pointerEvents: 'none' }} />
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{d.name}</p>
                  <p style={{ fontSize: '11px', color: '#444' }}>{d.lang}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

// Pricing
function PricingSection() {
  const plans = [
    { name: 'Open Source', price: '$0', period: 'forever', features: ['Self-host anywhere', 'Unlimited events', 'Paystack, Flutterwave, Monnify', 'BullMQ async delivery', 'AI diagnostics (BYOK)'], featured: false },
    { name: 'Cloud', price: 'Soon', period: 'managed', features: ['Fully managed', '90-day retention', 'Email support', 'Usage analytics', 'Priority queues'], featured: true },
    { name: 'Enterprise', price: 'Custom', period: 'annually', features: ['Custom retention', 'SLA guarantees', 'Dedicated support', 'Custom integrations', 'Audit logs'], featured: false },
  ];
  return (
    <section className="mx-auto max-w-[1280px] px-6" style={{ paddingBottom: '96px' }}>
      <div style={{ borderTop: '1px solid #1a1a1a', marginBottom: '64px' }} />
      <ScrollReveal>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Pricing</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-1.5px', color: '#fff' }}>Open source and transparent</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px" style={{ backgroundColor: '#1a1a1a' }}>
          {plans.map(p => (
            <div key={p.name} className="h-full bg-black">
              <div style={{ position: 'relative', backgroundColor: p.featured ? '#060606' : '#000', padding: '32px', height: '100%' }}>
                {p.featured && <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#111', border: '1px solid #1a1a1a', color: '#444' }}>Coming soon</span>}
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{p.name}</p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#e0e0e0', letterSpacing: '-1px', marginBottom: '2px' }}>{p.price}</p>
                <p style={{ fontSize: '13px', color: '#444', marginBottom: '24px' }}>/{p.period}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #1a1a1a', paddingTop: '24px', listStyle: 'none', padding: 0 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0"><path d="M10 3L4.5 8.5L2 6" stroke="#27a644" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}

// FAQ
function FAQSection() {
  const faqs = [
    { q: 'Is HookLens really free?', a: 'Yes. The core gateway is open-source under the MIT license, free to self-host forever. You bring your own infrastructure.' },
    { q: 'Which payment providers are supported?', a: 'Currently Paystack, Flutterwave, and Monnify &mdash; the three largest in Nigeria and West Africa. More on the roadmap.' },
    { q: 'What does self-hosted mean exactly?', a: 'You run HookLens on your own servers or any cloud VM. You control the data, the code, and the infrastructure.' },
    { q: 'Do I need Redis and Postgres?', a: 'Yes. HookLens uses BullMQ for the delivery queue (Redis) and Postgres for event storage. Both are supported everywhere.' },
    { q: 'What is AI failure diagnostics?', a: 'When a delivery fails, HookLens sends error context to an LLM to generate a plain-English explanation. You provide your own API key.' },
  ];
  return (
    <section className="mx-auto max-w-[800px] px-6" style={{ paddingBottom: '120px' }}>
      <div style={{ borderTop: '1px solid #1a1a1a', marginBottom: '64px' }} />
      <ScrollReveal>
        <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-1.5px', color: '#fff', marginBottom: '48px' }}>FAQs</h2>
        <div>
          {faqs.map(f => (
            <div key={f.q} style={{ padding: '24px 0', borderBottom: '1px solid #1a1a1a' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{f.q}</h3>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: f.a }}></p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1a1a1a', backgroundColor: '#000' }}>
      <div className="mx-auto max-w-[1280px] px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#5e6ad2" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="3.5" fill="#5e6ad2" />
          </svg>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>HookLens</span>
        </div>
        <p className="text-center md:text-left" style={{ fontSize: '12px', color: '#2a2a2a' }} dangerouslySetInnerHTML={{ __html: '&copy; ' + new Date().getFullYear() + ' HookLens &middot; MIT License &middot; Built for African fintech' }}></p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {[{ label: 'GitHub', href: '#' }, { label: 'Docs', href: '#' }, { label: 'Waitlist', href: '/waitlist' }].map(({ label, href }) => (
            <a key={label} href={href} className="footer-link">{label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// Landing Page
export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', fontFeatureSettings: '"ss01"' }}>
      <GlobalStyles />
      <Nav />
      <Hero />
      <TrustedBy />
      <FeaturesSection />
      <ProductPreviewSection />
      <IntegrationsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
