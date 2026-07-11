import Link from 'next/link';
import {
  Shield,
  Zap,
  RotateCcw,
  Activity,
  Terminal,
  ArrowRight,
  GitBranch,
  ChevronRight,
  Cpu,
  Network,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/3 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative border-b border-white/5 bg-[#080808]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.4)]">
              <svg viewBox="0 0 20 20" className="w-4 h-4 fill-white">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 3a1 1 0 011 1v2.586l1.707 1.707a1 1 0 01-1.414 1.414L9.586 9.999a1 1 0 01-.293-.707V6a1 1 0 011-1z" />
              </svg>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">HookLens</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#666666] hover:text-white transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              GitHub
            </a>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition-all"
            >
              Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-dot" />
          Built for African Fintech Infrastructure
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
          Never miss a{' '}
          <br className="hidden sm:block" />
          <span className="text-gradient-hero">fintech webhook</span>
        </h1>

        <p className="text-[#888888] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          A self-hosted webhook gateway that normalises ingestion from{' '}
          <span className="text-emerald-400">Paystack</span>,{' '}
          <span className="text-orange-400">Flutterwave</span>, and{' '}
          <span className="text-violet-400">Monnify</span> — with guaranteed delivery,
          exponential retries, and AI-assisted failure diagnostics.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[15px] transition-all shadow-[0_0_24px_rgba(59,130,246,0.3)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)]"
          >
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#222222] text-[#aaaaaa] hover:text-white hover:border-[#333333] font-medium text-[15px] transition-all"
          >
            <GitBranch className="w-4 h-4" />
            View Source
          </a>
        </div>

        {/* Provider flow diagram */}
        <div className="mt-20 relative">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {/* Sources */}
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Paystack', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
                  { name: 'Flutterwave', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
                  { name: 'Monnify', color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' },
                ].map(({ name, color }) => (
                  <div key={name} className={`px-4 py-2 rounded-lg border text-sm font-medium ${color}`}>
                    {name}
                  </div>
                ))}
              </div>

              {/* Arrow lines */}
              <div className="flex flex-col gap-3 items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-1 h-9">
                    <div className="w-12 h-px bg-gradient-to-r from-[#2a2a2a] to-blue-500/40" />
                    <ChevronRight className="w-3 h-3 text-blue-500/60" />
                  </div>
                ))}
              </div>

              {/* Gateway */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <svg viewBox="0 0 20 20" className="w-7 h-7 fill-blue-400">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 3a1 1 0 011 1v2.586l1.707 1.707a1 1 0 01-1.414 1.414L9.586 9.999a1 1 0 01-.293-.707V6a1 1 0 011-1z" />
                  </svg>
                </div>
                <span className="text-blue-400 text-xs font-mono">HookLens</span>
              </div>

              {/* Arrow lines out */}
              <div className="flex flex-col gap-3 items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-1 h-9">
                    <div className="w-12 h-px bg-gradient-to-r from-blue-500/40 to-[#2a2a2a]" />
                    <ChevronRight className="w-3 h-3 text-[#333333]" />
                  </div>
                ))}
              </div>

              {/* Destinations */}
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Your API', icon: '🔧' },
                  { name: 'Microservice', icon: '⚙️' },
                  { name: 'Mock / Dev', icon: '🧪' },
                ].map(({ name, icon }) => (
                  <div key={name} className="px-4 py-2 rounded-lg border border-[#222222] bg-[#111111] text-sm text-[#888888] flex items-center gap-2">
                    <span>{icon}</span>
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 lg:p-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Terminal className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-amber-400 text-xs font-mono uppercase tracking-widest mb-1">The Problem</p>
              <h2 className="text-white text-2xl lg:text-3xl font-bold leading-snug">
                Every project rebuilds<br className="hidden sm:block" /> the same webhook plumbing
              </h2>
            </div>
          </div>
          <p className="text-[#666666] text-base leading-relaxed max-w-2xl">
            African fintech providers like Paystack, Flutterwave, and Monnify each implement webhook
            delivery, signature validation, and retry semantics differently. Developers repeatedly
            waste engineering cycles building custom ingestion endpoints, debugging silent failures,
            and implementing custom retry logic for every new project.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { pain: 'Signature hell', desc: 'Each provider uses different HMAC headers and algorithms' },
              { pain: 'Silent failures', desc: 'Webhooks drop with no visibility into what went wrong' },
              { pain: 'Retry DIY', desc: 'Every team reinvents exponential backoff from scratch' },
            ].map(({ pain, desc }) => (
              <div key={pain} className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-white text-sm font-semibold">{pain}</span>
                </div>
                <p className="text-[#555555] text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">How HookLens solves it</p>
          <h2 className="text-white text-3xl lg:text-4xl font-bold">
            One gateway. Every provider.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Shield,
              color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              title: 'Signature Normalisation',
              desc: 'Automatically verifies HMAC-SHA512 for Paystack, HMAC-SHA256 for Flutterwave, and Monnify\'s custom scheme. One config, every provider.',
              tag: 'Security',
            },
            {
              icon: RotateCcw,
              color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
              title: 'Guaranteed Delivery',
              desc: 'Events are persisted in PostgreSQL and queued via BullMQ with exponential backoff. Up to 5 retry attempts before permanent failure.',
              tag: 'Reliability',
            },
            {
              icon: Cpu,
              color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
              title: 'AI-Assisted Diagnostics',
              desc: 'When an event permanently fails, the platform automatically runs AI analysis to explain the root cause and suggest fixes.',
              tag: 'Intelligence',
            },
            {
              icon: Activity,
              color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
              title: 'Full Observability',
              desc: 'Every delivery attempt is recorded with HTTP status, response body, and duration. Inspect the full audit trail in one click.',
              tag: 'Visibility',
            },
            {
              icon: Zap,
              color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
              title: 'Instant Replay',
              desc: 'Re-queue any failed or stalled event directly from the dashboard with a single click. No CLI, no manual SQL.',
              tag: 'Control',
            },
            {
              icon: Network,
              color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
              title: 'Self-Hosted',
              desc: 'Deploy it your way — no vendor lock-in, no per-event pricing, no data leaving your infrastructure. Run it alongside your existing stack.',
              tag: 'Ownership',
            },
          ].map(({ icon: Icon, color, title, desc, tag }) => (
            <div
              key={title}
              className="group bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#2a2a2a] hover:bg-[#111111] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${color}`}>
                  <Icon className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
                </div>
                <span className="text-[10px] text-[#444444] uppercase tracking-wider bg-[#141414] border border-[#1e1e1e] px-2 py-0.5 rounded-full">{tag}</span>
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
              <p className="text-[#555555] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal demo */}
      <section className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">Developer Experience</p>
            <h2 className="text-white text-3xl font-bold leading-tight mb-5">
              Zero boilerplate.<br />
              <span className="text-gradient-blue">Full observability.</span>
            </h2>
            <p className="text-[#666666] text-base leading-relaxed mb-6">
              HookLens handles the entire webhook lifecycle — ingestion, verification, queueing,
              delivery, retries, and diagnostics — so you can focus on what the webhook triggers,
              not how it gets there.
            </p>
            <div className="space-y-3">
              {[
                'No per-event billing or vendor lock-in',
                'Decoupled queue survives destination downtime',
                'Per-provider HMAC verification built in',
                'AI diagnosis on every permanent failure',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-[#888888]">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Code block */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] bg-[#111111]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[#444444] text-xs font-mono">POST /webhooks/{'{endpointId}'}</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-2">
              <p className="text-[#555555]">{`// 1. Paystack sends a webhook to HookLens`}</p>
              <p>
                <span className="text-blue-400">POST</span>{' '}
                <span className="text-white">http://localhost:3000/webhooks/</span>
                <span className="text-emerald-400">ep_abc123</span>
              </p>
              <br />
              <p className="text-[#555555]">{`// 2. HookLens verifies the signature`}</p>
              <p>
                <span className="text-amber-400">x-paystack-signature</span>
                <span className="text-zinc-500">: </span>
                <span className="text-emerald-400">sha512=a8f3e...</span>
              </p>
              <p>
                <span className="text-zinc-400">→ </span>
                <span className="text-green-400">✓ Signature valid</span>
              </p>
              <br />
              <p className="text-[#555555]">{`// 3. Event queued for delivery`}</p>
              <p className="text-white">
                {'{'} <span className="text-amber-300">received</span>
                <span className="text-zinc-500">: </span>
                <span className="text-green-400">true</span>,{' '}
                <span className="text-amber-300">eventId</span>
                <span className="text-zinc-500">: </span>
                <span className="text-blue-400">"evt_9f2a..."</span> {'}'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported providers */}
      <section className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-[#555555] text-xs font-mono uppercase tracking-widest mb-3">Supported Providers</p>
          <h2 className="text-white text-2xl font-bold">The African fintech stack, unified</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              name: 'Paystack',
              desc: 'Nigeria\'s leading payment gateway. HMAC-SHA512 via x-paystack-signature header.',
              color: 'border-emerald-500/20 bg-emerald-500/5',
              badge: 'text-emerald-400',
              algo: 'HMAC-SHA512',
            },
            {
              name: 'Flutterwave',
              desc: 'Pan-African payments. HMAC-SHA256 via verif-hash header.',
              color: 'border-orange-500/20 bg-orange-500/5',
              badge: 'text-orange-400',
              algo: 'HMAC-SHA256',
            },
            {
              name: 'Monnify',
              desc: 'Bank transfers & collections. HMAC-SHA512 via monnify-signature header.',
              color: 'border-violet-500/20 bg-violet-500/5',
              badge: 'text-violet-400',
              algo: 'HMAC-SHA512',
            },
          ].map(({ name, desc, color, badge, algo }) => (
            <div key={name} className={`border rounded-2xl p-6 ${color}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-lg ${badge}`}>{name}</h3>
                <span className="text-[10px] font-mono text-[#444444] bg-[#111111] border border-[#1e1e1e] px-2 py-1 rounded-md">{algo}</span>
              </div>
              <p className="text-[#666666] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-br from-blue-600/10 via-[#0d0d0d] to-violet-600/10 border border-[#1a1a1a] rounded-3xl p-12 lg:p-16">
          <h2 className="text-white text-4xl lg:text-5xl font-bold mb-5 leading-tight">
            Stop losing webhooks.<br />
            <span className="text-gradient-hero">Start shipping faster.</span>
          </h2>
          <p className="text-[#666666] text-lg max-w-xl mx-auto mb-10">
            Self-hosted, open source, and ready in minutes. No sign-up required.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[16px] transition-all shadow-[0_0_32px_rgba(59,130,246,0.3)] hover:shadow-[0_0_48px_rgba(59,130,246,0.5)]"
            >
              Open Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-[#222222] text-[#aaaaaa] hover:text-white hover:border-[#333333] font-medium text-[16px] transition-all"
            >
            <GitBranch className="w-5 h-5" />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#111111] max-w-6xl mx-auto px-6 py-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <svg viewBox="0 0 20 20" className="w-3 h-3 fill-white">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 3a1 1 0 011 1v2.586l1.707 1.707a1 1 0 01-1.414 1.414L9.586 9.999a1 1 0 01-.293-.707V6a1 1 0 011-1z" />
            </svg>
          </div>
          <span className="text-[#555555] text-sm">HookLens — Open source webhook gateway</span>
        </div>
        <p className="text-[#333333] text-xs">Built for African fintech developers</p>
      </footer>
    </div>
  );
}
