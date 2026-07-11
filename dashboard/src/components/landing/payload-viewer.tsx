'use client';

import { useState } from 'react';

// ─── PayloadViewer ─────────────────────────────────────────────────────────────
// Interactive tab panel for the Product Preview section.
// Tabs: Payload (JSON body) | Headers (HTTP request headers)
// Both show realistic data for the Monnify failed delivery event.
// Uses useState — must be a Client Component.

type Tab = 'payload' | 'headers';

// ── Payload content ────────────────────────────────────────────────────────────
function PayloadContent() {
  return (
    <div className="p-5 overflow-x-auto" style={{ backgroundColor: '#0f1011', minHeight: '300px' }}>
      <pre
        className="text-[13px] leading-relaxed"
        style={{ fontFamily: 'ui-monospace, JetBrains Mono, monospace', fontFeatureSettings: '"tnum"' }}
      >
        <span style={{ color: '#62666d' }}>{'{'}</span>
        {'\n  '}<span style={{ color: '#8a8f98' }}>"event":</span>{' '}
        <span style={{ color: '#27a644' }}>"charge.success"</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n  '}<span style={{ color: '#8a8f98' }}>"data":</span>{' '}
        <span style={{ color: '#62666d' }}>{'{'}</span>

        {'\n    '}<span style={{ color: '#8a8f98' }}>"id":</span>{' '}
        <span style={{ color: '#5e6ad2' }}>302961</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n    '}<span style={{ color: '#8a8f98' }}>"status":</span>{' '}
        <span style={{ color: '#27a644' }}>"success"</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n    '}<span style={{ color: '#8a8f98' }}>"reference":</span>{' '}
        <span style={{ color: '#27a644' }}>"trx_1v9k0h8z23"</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n    '}<span style={{ color: '#8a8f98' }}>"amount":</span>{' '}
        <span style={{ color: '#5e6ad2' }}>10000</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n    '}<span style={{ color: '#8a8f98' }}>"currency":</span>{' '}
        <span style={{ color: '#27a644' }}>"NGN"</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n    '}<span style={{ color: '#8a8f98' }}>"channel":</span>{' '}
        <span style={{ color: '#27a644' }}>"card"</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n    '}<span style={{ color: '#8a8f98' }}>"gateway_response":</span>{' '}
        <span style={{ color: '#27a644' }}>"Successful"</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n    '}<span style={{ color: '#8a8f98' }}>"paid_at":</span>{' '}
        <span style={{ color: '#27a644' }}>"2023-10-24T14:22:01.000Z"</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n    '}<span style={{ color: '#8a8f98' }}>"customer":</span>{' '}
        <span style={{ color: '#62666d' }}>{'{'}</span>

        {'\n      '}<span style={{ color: '#8a8f98' }}>"id":</span>{' '}
        <span style={{ color: '#5e6ad2' }}>84312</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n      '}<span style={{ color: '#8a8f98' }}>"email":</span>{' '}
        <span style={{ color: '#27a644' }}>"customer@example.com"</span>
        <span style={{ color: '#62666d' }}>,</span>

        {'\n      '}<span style={{ color: '#8a8f98' }}>"customer_code":</span>{' '}
        <span style={{ color: '#27a644' }}>"CUS_x902ks"</span>

        {'\n    '}<span style={{ color: '#62666d' }}>{'}'}</span>
        {'\n  '}<span style={{ color: '#62666d' }}>{'}'}</span>
        {'\n'}<span style={{ color: '#62666d' }}>{'}'}</span>
      </pre>
    </div>
  );
}

// ── Headers content ────────────────────────────────────────────────────────────
const HEADERS: { name: string; value: string; highlight?: boolean }[] = [
  {
    name: 'x-paystack-signature',
    value: 'sha512=0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d…',
    highlight: true,
  },
  { name: 'content-type',     value: 'application/json; charset=utf-8' },
  { name: 'user-agent',       value: 'Paystack-Bot/1.0 (+https://paystack.com)' },
  { name: 'host',             value: 'api.yourdomain.com' },
  { name: 'content-length',   value: '428' },
  { name: 'accept-encoding',  value: 'gzip, deflate' },
  { name: 'x-forwarded-for',  value: '52.31.102.43' },
  { name: 'x-forwarded-proto', value: 'https' },
  { name: 'connection',       value: 'close' },
];

function HeadersContent() {
  return (
    <div style={{ backgroundColor: '#0f1011', minHeight: '300px' }}>
      {/* HMAC note */}
      <div
        className="mx-5 mt-5 mb-4 p-3 rounded-lg"
        style={{ backgroundColor: 'rgba(94,106,210,0.08)', border: '1px solid rgba(94,106,210,0.15)' }}
      >
        <p style={{ fontSize: '12px', color: '#8a8f98', lineHeight: 1.5 }}>
          <span style={{ color: '#5e6ad2', fontWeight: 500 }}>x-paystack-signature</span>
          {' '}is verified against the raw request body using HMAC-SHA512
          with your endpoint secret before the event enters the queue.
        </p>
      </div>

      {/* Header rows */}
      <div className="px-5 pb-5">
        {HEADERS.map(({ name, value, highlight }) => (
          <div
            key={name}
            className="flex gap-4 py-2.5 border-b"
            style={{ borderColor: '#1a1b1e' }}
          >
            <span
              className="flex-shrink-0"
              style={{
                fontFamily: 'ui-monospace, JetBrains Mono, monospace',
                fontSize: '12px',
                color: highlight ? '#5e6ad2' : '#8a8f98',
                width: '200px',
                fontFeatureSettings: '"tnum"',
              }}
            >
              {name}
            </span>
            <span
              className="text-[#62666d] truncate"
              style={{
                fontFamily: 'ui-monospace, JetBrains Mono, monospace',
                fontSize: '12px',
                fontFeatureSettings: '"tnum"',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function PayloadViewer() {
  const [active, setActive] = useState<Tab>('payload');
  const [prevActive, setPrevActive] = useState<Tab | null>(null);

  const handleTabChange = (tab: Tab) => {
    if (tab !== active) {
      setPrevActive(active);
      setActive(tab);
    }
  };

  return (
    <div className="lg:col-span-2 flex flex-col relative z-10 overflow-hidden">
      {/* Background glow for the panel (center stage lighting) */}
      <div 
        className="absolute -top-32 -left-32 w-[300px] h-[300px] pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(94,106,210,0.06) 0%, rgba(94,106,210,0) 70%)', zIndex: -1 }}
      />
      
      {/* Tab bar */}
      <div
        className="flex items-center px-4 border-b relative"
        style={{ height: '44px', borderColor: '#23252a', backgroundColor: '#0a0a0b' }}
      >
        <div className="flex bg-[#141516] border border-[#23252a] rounded-md p-0.5 relative">
          {/* Animated sliding indicator */}
          <div 
            className="absolute top-0.5 bottom-0.5 rounded transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ 
              backgroundColor: '#23252a', 
              width: active === 'payload' ? '68px' : '72px',
              transform: active === 'payload' ? 'translateX(0)' : 'translateX(68px)'
            }}
          />
          
          {(['payload', 'headers'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className="capitalize transition-colors relative z-10 flex items-center justify-center"
              style={{
                fontSize: '13px',
                fontWeight: active === tab ? 500 : 400,
                color: active === tab ? '#f7f8f8' : '#8a8f98',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: '4px',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Animated content swap */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Payload Tab */}
        <div
          className={active === 'payload' ? 'animate-tab-enter' : prevActive === 'payload' ? 'animate-tab-exit absolute inset-0 pointer-events-none' : 'hidden'}
          style={{ position: active === 'payload' ? 'relative' : 'absolute', inset: 0 }}
        >
          <PayloadContent />
        </div>
        
        {/* Headers Tab */}
        <div
          className={active === 'headers' ? 'animate-tab-enter' : prevActive === 'headers' ? 'animate-tab-exit absolute inset-0 pointer-events-none' : 'hidden'}
          style={{ position: active === 'headers' ? 'relative' : 'absolute', inset: 0 }}
        >
          <HeadersContent />
        </div>
      </div>
    </div>
  );
}
