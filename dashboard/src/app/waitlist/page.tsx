"use client";

import { useState } from 'react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call to save email
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', paddingTop: '120px', color: '#fff', fontFeatureSettings: '"ss01"' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#060606', border: '1px solid #1a1a1a', marginBottom: '24px' }}>
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#5e6ad2" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="3.5" fill="#5e6ad2" />
          </svg>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '12px' }}>Join the Waitlist</h1>
        <p style={{ fontSize: '15px', color: '#555', marginBottom: '32px', lineHeight: 1.5 }}>
          HookLens is currently in private beta. Enter your email to request early access.
        </p>

        {submitted ? (
          <div style={{ backgroundColor: '#060606', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '24px', animation: 'heroFadeUp 0.5s ease both' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#27a644" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>You're on the list!</h2>
            <p style={{ fontSize: '14px', color: '#888' }}>We'll email you as soon as a spot opens up.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'heroFadeUp 0.5s ease both' }}>
            <input
              type="email"
              required
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#060606',
                border: '1px solid #1a1a1a',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '15px',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#333'}
              onBlur={(e) => e.target.style.borderColor = '#1a1a1a'}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '15px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
        )}
        <div style={{ marginTop: '48px' }}>
          <a href="/" style={{ fontSize: '13px', color: '#555', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color='#888'} onMouseLeave={e=>e.currentTarget.style.color='#555'}>&larr; Back to home</a>
        </div>
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
