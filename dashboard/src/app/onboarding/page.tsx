'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const PROVIDERS = [
  { value: 'paystack', label: 'Paystack', desc: 'HMAC-SHA512 signature' },
  { value: 'flutterwave', label: 'Flutterwave', desc: 'HMAC-SHA256 signature' },
  { value: 'monnify', label: 'Monnify', desc: 'HMAC-SHA512 signature' },
  { value: 'generic', label: 'Generic', desc: 'Raw passthrough' },
];

function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState(1);
  const [workspace, setWorkspace] = useState('');
  const [url, setUrl] = useState('');
  const [provider, setProvider] = useState('paystack');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdEndpointId, setCreatedEndpointId] = useState('');

  const needsSecret = provider !== 'generic';

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace.trim()) {
      setWorkspace(user?.firstName ? `${user.firstName}'s Workspace` : 'My Workspace');
    }
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) return setError('Destination URL is required');
    if (needsSecret && !secret.trim()) return setError('Webhook secret is required for this provider');

    setLoading(true);
    try {
      const ep = await api.createEndpoint({
        url: url.trim(),
        provider_type: provider,
        secret: needsSecret ? secret.trim() : undefined,
      });
      setCreatedEndpointId(ep.id);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create endpoint');
    } finally {
      setLoading(false);
    }
  };

  const finish = () => {
    // In a full production app, you might set Clerk publicMetadata here to skip onboarding in the future.
    router.push('/dashboard');
  };

  if (!isLoaded) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-ink font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-1 border border-hairline rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-hairline bg-surface-1">
          <h1 className="text-ink font-semibold text-[16px] tracking-tight">
            {step === 1 ? 'Welcome to HookLens' : step === 2 ? 'Create Connection' : 'Ready to go'}
          </h1>
          <p className="text-ink-subtle text-[13px] mt-1">
            {step === 1 ? 'Let\'s get your workspace set up.' : step === 2 ? 'Where should we forward webhooks?' : 'Your gateway is live.'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-6 animate-fade-in">
              <div>
                <label className="text-[11px] text-ink-subtle font-semibold uppercase tracking-[0.05em] block mb-3">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                  placeholder={user?.firstName ? `${user.firstName}'s Workspace` : 'My Workspace'}
                  className="w-full bg-background border border-hairline rounded-md px-3.5 py-2.5 text-[13px] text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground text-[13px] font-medium transition-colors cursor-pointer"
              >
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-6 animate-fade-in">
              <div>
                <label className="text-[11px] text-ink-subtle font-semibold uppercase tracking-[0.05em] block mb-3">
                  Provider
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setProvider(p.value)}
                      className={cn(
                        'text-left p-3 rounded-md border transition-all',
                        provider === p.value
                          ? 'border-ring bg-primary/10 text-ink'
                          : 'border-hairline bg-background text-ink-subtle hover:border-hairline-strong hover:text-ink'
                      )}
                    >
                      <div className="font-semibold text-[13px]">{p.label}</div>
                      <div className="text-[11px] mt-0.5 opacity-80 leading-snug">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-ink-subtle font-semibold uppercase tracking-[0.05em] block mb-3">
                  Destination URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-app.com/webhooks/handler"
                  className="w-full bg-background border border-hairline rounded-md px-3.5 py-2.5 text-[13px] text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all font-mono"
                />
              </div>

              {needsSecret && (
                <div>
                  <label className="text-[11px] text-ink-subtle font-semibold uppercase tracking-[0.05em] block mb-3">
                    Webhook Secret
                  </label>
                  <input
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Your provider webhook secret key"
                    className="w-full bg-background border border-hairline rounded-md px-3.5 py-2.5 text-[13px] text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all font-mono"
                  />
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3 text-[13px] font-medium text-destructive">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-md border border-hairline text-[13px] font-medium text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-md bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-[13px] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Creating…' : 'Create Connection'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#27a644]/10 border border-[#27a644]/20 flex items-center justify-center mx-auto mb-2">
                <IconCheck className="w-5 h-5 text-[#27a644]" />
              </div>
              <p className="text-[14px] text-ink font-medium">Connection Created!</p>
              
              <div className="bg-background border border-hairline rounded-md p-4 text-left">
                <p className="text-[11px] text-ink-subtle font-semibold uppercase tracking-[0.05em] block mb-2">Your Ingest URL</p>
                <div className="bg-surface-2 rounded-sm p-2 font-mono text-[12px] text-ink select-all cursor-text break-all">
                  {typeof window !== 'undefined' ? window.location.origin.replace('3001', '3000') : 'http://localhost:3000'}/webhooks/{createdEndpointId}
                </div>
                <p className="text-[12px] text-ink-subtle mt-3 leading-relaxed">
                  Copy this URL and paste it into your {provider.charAt(0).toUpperCase() + provider.slice(1)} dashboard.
                </p>
              </div>

              <button
                onClick={finish}
                className="w-full py-2.5 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground text-[13px] font-medium transition-colors cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <SignOutButton>
          <button className="text-[12px] text-ink-tertiary hover:text-ink transition-colors cursor-pointer">
            Sign out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
